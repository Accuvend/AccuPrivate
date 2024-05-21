import VendorModelService from "../../../services/Vendor.service";
import { AxiosError } from "axios";
import { Status } from "../../../models/Transaction.model";
import Meter from "../../../models/Meter.model";
import Transaction from "../../../models/Transaction.model";
import PowerUnitService from "../../../services/PowerUnit.service";
import TransactionService from "../../../services/Transaction.service";
import TransactionEventService, {
    AirtimeTransactionEventService,
} from "../../../services/TransactionEvent.service";
import {
    DISCO_LOGO,
    LOGO_URL,
    MAX_REQUERY_PER_VENDOR,
    NODE_ENV,
} from "../../../utils/Constants";
import logger from "../../../utils/Logger";
import { TOPICS } from "../../Constants";
import { VendorPublisher } from "../publishers/Vendor";
import ConsumerFactory from "../util/Consumer";
import {
    MeterInfo,
    PublisherEventAndParameters,
    Registry,
    TransactionErrorCause,
    VendorRetryRecord,
} from "../util/Interface";
import MessageProcessor from "../util/MessageProcessor";
import { v4 as uuidv4 } from "uuid";
import EventService from "../../../services/Event.service";
import VendorService, {
    Prettify,
    SuccessResponseForBuyPowerRequery,
    Vendor,
    VendorAirtimeService,
} from "../../../services/VendorApi.service";
import { generateRandomToken, generateVendorReference } from "../../../utils/Helper";
import BuypowerApi from "../../../services/VendorApi.service/Buypower";
import { IRechargeApi } from "../../../services/VendorApi.service/Irecharge";
import ProductService from "../../../services/Product.service";
import VendorProductService from "../../../services/VendorProduct.service";
import { VendorProductSchemaData } from "../../../models/VendorProduct.model";
import BaxiApi from "../../../services/VendorApi.service/Baxi";
import { token } from "morgan";
import { CustomError } from "../../../utils/Errors";
import { getCurrentWaitTimeForSwitchEvent, ResponseValidationUtil, TokenHandlerUtil } from "./Token";
import { transferableAbortSignal } from "util";
import newrelic from 'newrelic'
import { randomUUID } from "crypto";

interface EventMessage {
    phone: {
        phoneNumber: string;
        amount: number;
    };
    transactionId: string;
}

interface TriggerRequeryTransactionTokenProps {
    eventService: AirtimeTransactionEventService;
    vendorRetryRecord: VendorRetryRecord;
    eventData: EventMessage & {
        error: {
            cause: TransactionErrorCause;
            code: number;
        };
    };
    transactionTimedOutFromBuypower: boolean;
    superAgent: Transaction["superagent"];
    retryCount: number;
}

interface TokenPurchaseData<T = Vendor> {
    transaction: Omit<Transaction, "superagent"> & { superagent: T };
    phoneNumber: string;
    email: string;
    amount: number;
    accountNumber: string;
    serviceProvider: "MTN" | "GLO" | "AIRTEL" | "9MOBILE";
}

type ProcessVendRequestReturnData<
    T extends "BUYPOWERNG" | "IRECHARGE" | "BAXI",
> = T extends "BUYPOWERNG"
    ? Awaited<ReturnType<typeof BuypowerApi.Airtime.purchase>>
    : T extends "IRECHARGE"
    ? Awaited<ReturnType<typeof IRechargeApi.Airtime.purchase>>
    : T extends "BAXI"
    ? Awaited<ReturnType<typeof BaxiApi.Airtime.purchase>>
    : never;

const retry = {
    count: 0,
    // limit: 5,
    retryCountBeforeSwitchingVendor: 2,
};

const TEST_FAILED = NODE_ENV === "production" ? false : false; // TOGGLE - Will simulate failed transaction

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT,
};

export function getCurrentWaitTimeForRequeryEvent(retryCount: number) {
    // Use geometric progression  calculate wait time, where R = 2
    const waitTime = 2 ** (retryCount - 1);
    return waitTime;
}

export class AirtimeHandlerUtil {
    static async triggerEventToRequeryTransactionTokenFromVendor({
        eventService,
        eventData,
        transactionTimedOutFromBuypower,
        retryCount,
        superAgent,
    }: TriggerRequeryTransactionTokenProps) {
        const logMeta = {
            meta: {
                transactionId: eventData.transactionId,
            },
        };
        // Check if the transaction has hit the requery limit
        // If yes, flag transaction
        if (retryCount >= MAX_REQUERY_PER_VENDOR) {
            logger.info(
                `Flagged transaction with id ${eventData.transactionId} after hitting requery limit`,
                logMeta,
            );
            return await TransactionService.updateSingleTransaction(
                eventData.transactionId,
                { status: Status.FLAGGED },
            );
        }

        /**
         * Not all transactions that are requeried are due to timeout
         * Some transactions are requeried because the transaction is still processing
         * or an error occured while processing the transaction
         *
         * These errors include:
         * 202 - Timeout / Transaction is processing
         * 501 - Maintenance error
         * 500 - Unexpected CustomError
         */
        transactionTimedOutFromBuypower &&
            (await eventService.addRequestTimedOutEvent());

        const _eventMessage = {
            ...eventData,
            error: {
                code: 202,
                cause: transactionTimedOutFromBuypower
                    ? TransactionErrorCause.TRANSACTION_TIMEDOUT
                    : TransactionErrorCause.NO_TOKEN_IN_RESPONSE,
            },
        };

        logger.info(
            `Retrying transaction with id ${eventData.transactionId} from vendor`,
            logMeta,
        );

        await eventService.addGetAirtimeFromVendorRetryEvent(
            _eventMessage.error,
            retryCount,
        );
        const eventMetaData = {
            transactionId: eventData.transactionId,
            phone: eventData.phone,
            error: eventData.error,
            timeStamp: new Date(),
            retryCount,
            superAgent,
            waitTime: getCurrentWaitTimeForRequeryEvent(retryCount),
        };

        const transaction = await TransactionService.viewSingleTransaction(
            eventData.transactionId,
        );
        if (!transaction)
            throw new CustomError("Transaction not found", {
                transactionId: eventData.transactionId,
            });

        const partner = await transaction.$get("partner");
        if (!partner)
            throw new CustomError("Partner not found", {
                transactionId: eventData.transactionId,
            });

        await new AirtimeTransactionEventService(
            transaction,
            transaction.superagent,
            partner.email,
            eventData.phone.phoneNumber,
        ).addScheduleRequeryEvent({
            timeStamp: new Date().toString(),
            waitTime: eventMetaData.waitTime,
        });
        logger.info("Scheduled requery event", {
            transactionId: transaction.id,
        });

        await VendorPublisher.publishEventToScheduleAirtimeRequery({
            scheduledMessagePayload: eventMetaData,
            timeStamp: new Date().toString(),
            delayInSeconds: eventMetaData.waitTime,
        });


        // Publish event in increasing intervals of seconds i.e 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
        // TODO: Use an external service to schedule this task
        setTimeout(async () => {
            logger.info("Retrying transaction from vendor", logMeta);
            await VendorPublisher.publishEventForGetAirtimeFromVendorRetry(
                eventMetaData,
            );
        }, eventMetaData.waitTime * 1000);
    }

    static async triggerEventToRetryTransactionWithNewVendor({
        transaction,
        transactionEventService,
        phone,
        vendorRetryRecord
    }: {
        eventData: EventMessage & {
            error: {
                cause: TransactionErrorCause;
                code: number;
            };
        };
        transaction: Transaction;
        transactionEventService: AirtimeTransactionEventService;
        phone: { phoneNumber: string; amount: number };
        vendorRetryRecord: VendorRetryRecord;
    }) {
        let waitTime = await getCurrentWaitTimeForSwitchEvent(
            vendorRetryRecord.retryCount,
        );

        logger.warn("Retrying transaction with new vendor", {
            meta: { transactionId: transaction.id },
        });
        const meta = {
            transactionId: transaction.id,
        };
        // Attempt purchase from new vendor
        if (!transaction.bankRefId)
            throw new CustomError("BankRefId not found", meta);

        let retryRecord = transaction.retryRecord;

        retryRecord =
            retryRecord.length === 0
                ? [
                    {
                        vendor: transaction.superagent,
                        retryCount: 1,
                        reference: [transaction.reference],
                        attempt: 1,
                    },
                ]
                : retryRecord;

        // Make sure to use the same vendor thrice before switching to another vendor
        let currentVendor = retryRecord[retryRecord.length - 1];
        console.log({ currentVendor, retryRecord });
        let useCurrentVendor = false;
        if (currentVendor.vendor === transaction.superagent) {
            if (
                currentVendor.retryCount < retry.retryCountBeforeSwitchingVendor
            ) {
                // Update the retry record in the transaction
                // Get the last record where this vendor was used
                const lastRecord = retryRecord[retryRecord.length - 1];
                lastRecord.retryCount = lastRecord.retryCount + 1;

                // Update the transaction
                await TransactionService.updateSingleTransaction(
                    transaction.id,
                    { retryRecord },
                );

                useCurrentVendor = true;
                logger.info("Using current vendor", meta);
            }

            // Check for the reference used in the last retry record
            retryRecord[retryRecord.length - 1].reference.push(
                currentVendor.vendor === "IRECHARGE"
                    ? await generateVendorReference()
                    : randomUUID(),
            );
        } else {
            logger.warn("Switching to new vendor", meta);
            // Add new record to the retry record
        }

        const newVendor = useCurrentVendor
            ? currentVendor.vendor
            : await TokenHandlerUtil.getNextBestVendorForVendRePurchase(
                transaction.productCodeId,
                transaction.superagent,
                transaction.previousVendors,
                parseFloat(transaction.amount),
            );
        if (
            newVendor != currentVendor.vendor ||
            currentVendor.retryCount > retry.retryCountBeforeSwitchingVendor
        ) {
            // Add new record to the retry record
            currentVendor = {
                vendor: newVendor,
                retryCount: 1,
                reference: [
                    currentVendor.reference[currentVendor.reference.length - 1],
                ],
                attempt: 1,
            };
            retryRecord.push(currentVendor);
            waitTime = await getCurrentWaitTimeForSwitchEvent(
                currentVendor.retryCount,
            );
        }

        await transactionEventService.addAirtimePurchaseWithNewVendorEvent({
            currentVendor: transaction.superagent,
            newVendor,
        });

        const user = await transaction.$get("user");
        if (!user)
            throw new CustomError("User not found for transaction", meta);

        const partner = await transaction.$get("partner");
        if (!partner)
            throw new CustomError("Partner not found for transaction", meta);

        retry.count = 0;

        const newTransactionReference =
            retryRecord[retryRecord.length - 1].reference[
            retryRecord[retryRecord.length - 1].reference.length - 1
            ];
        let accesToken = transaction.irechargeAccessToken;

        await new AirtimeTransactionEventService(
            transaction,
            transaction.superagent,
            partner.email,
            phone.phoneNumber,
        ).addScheduleRetryEvent({
            timeStamp: new Date().toString(),
            waitTime,
            retryRecord: currentVendor,
        });

        logger.info("Scheduled retry event", meta);

        await TransactionService.updateSingleTransaction(transaction.id, {
            retryRecord,
            reference: newTransactionReference,
        });

        return await VendorPublisher.publishEventToScheduleAirtimeRetry({
            scheduledMessagePayload: {
                partner: partner,
                transactionId: transaction.id,
                superAgent: newVendor,
                user: {
                    name: user.name as string,
                    email: user.email,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                },
                vendorRetryRecord: retryRecord[retryRecord.length - 1],
                retryRecord,
                newVendor,
                newTransactionReference,
                irechargeAccessToken: accesToken,
                previousVendors: [
                    ...transaction.previousVendors,
                    newVendor,
                ] as Transaction["superagent"][],
            },
            timeStamp: new Date().toString(),
            delayInSeconds: waitTime,
        });
    }

    static async processVendRequest<T extends Vendor>({
        transaction,
        ...data
    }: TokenPurchaseData<T>) {
        try {
            const _data = {
                accountNumber: data.accountNumber,
                phoneNumber: data.phoneNumber,
                serviceType: data.serviceProvider,
                amount: data.amount,
                email: data.email,
                reference:
                    transaction.superagent === "IRECHARGE"
                        ? transaction.vendorReferenceId
                        : transaction.reference,
            };

            switch (transaction.superagent) {
                case "BAXI":
                    return await VendorService.purchaseAirtime({
                        data: _data,
                        vendor: "BAXI",
                    });
                case "BUYPOWERNG":
                    return await VendorService.purchaseAirtime({
                        data: _data,
                        vendor: "BUYPOWERNG",
                    });
                case "IRECHARGE":
                    return await VendorService.purchaseAirtime({
                        data: _data,
                        vendor: "IRECHARGE",
                    });
                default:
                    throw new CustomError("Unsupported superagent", {
                        transactionId: transaction.id,
                    });
            }
        } catch (error) {
            logger.error(
                "An error occured while vending from " + transaction.superagent,
                {
                    meta: {
                        transactionId: transaction.id,
                        error: error,
                    },
                },
            );

            throw error;
        }
    }

    static async requeryTransactionFromVendor(transaction: Transaction) {
        try {
            switch (transaction.superagent) {
                case "BAXI":
                    return await VendorService.baxiRequeryTransaction({
                        reference: transaction.reference,
                        transactionId: transaction.id,
                    });
                case "BUYPOWERNG":
                    return await VendorService.buyPowerRequeryTransaction({
                        reference: transaction.reference,
                        transactionId: transaction.id,
                    });
                case "IRECHARGE":
                    return await VendorService.irechargeRequeryTransaction({
                        accessToken: transaction.irechargeAccessToken,
                        serviceType: "airtime",
                        transactionId: transaction.id,
                    });
                default:
                    throw new CustomError("Unsupported superagent", {
                        transactionId: transaction.id,
                    });
            }
        } catch (error) {
            logger.error(
                "An error occured while requerying from " +
                transaction.superagent,
                {
                    meta: {
                        transactionId: transaction.id,
                        error: error,
                    },
                },
            );

            throw error;
        }
    }

    static async getNextBestVendorForVendRePurchase(
        productCodeId: NonNullable<Transaction["productCodeId"]>,
        currentVendor: Transaction["superagent"],
        previousVendors: Transaction["previousVendors"] = [],
        amount: number,
    ): Promise<Transaction["superagent"]> {
        const product = await ProductService.viewSingleProduct(productCodeId);
        if (!product) throw new CustomError("Product code not found");

        const vendorProducts = await product.$get("vendorProducts");
        // Populate all te vendors
        const vendors = await Promise.all(
            vendorProducts.map(async (vendorProduct) => {
                const vendor = await vendorProduct.$get("vendor");
                if (!vendor) throw new CustomError("Vendor not found");
                vendorProduct.vendor = vendor;
                return vendor;
            }),
        );

        // Check other vendors, sort them according to their commission rates
        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate
        // If the next vendor has been used before, switch to the next vendor with the next highest commission rate
        // If all the vendors have been used before, switch to the vendor with the highest commission rate

        const sortedVendorProductsAccordingToCommissionRate =
            vendorProducts.sort(
                (a, b) =>
                    b.commission * amount +
                    b.bonus -
                    (a.commission * amount + a.bonus),
            );
        const vendorRates = sortedVendorProductsAccordingToCommissionRate.map(
            (vendorProduct) => {
                const vendor = vendorProduct.vendor;
                if (!vendor) throw new CustomError("Vendor not found");
                return {
                    vendorName: vendor.name,
                    commission: vendorProduct.commission,
                    bonus: vendorProduct.bonus,
                };
            },
        );

        const sortedOtherVendors = vendorRates.filter(
            (vendorRate) => vendorRate.vendorName !== currentVendor,
        );

        nextBestVendor: for (const vendorRate of sortedOtherVendors) {
            if (!previousVendors.includes(vendorRate.vendorName))
                return vendorRate.vendorName as Transaction["superagent"];
        }

        if (previousVendors.length === vendors.length) {
            // If all vendors have been used before, switch to the vendor with the highest commission rate
            return vendorRates.sort(
                (a, b) =>
                    b.commission * amount +
                    b.bonus -
                    (a.commission * amount + a.bonus),
            )[0].vendorName as Transaction["superagent"];
        }

        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate
        return sortedOtherVendors[0].vendorName as Transaction["superagent"];
    }
}

class AirtimeHandler extends Registry {

    private static async handleAirtimeRequest(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        try {
            console.log({
                log: "New token request",
                currentVendor: data.superAgent,
            });

            const logMeta = { meta: { transactionId: data.transactionId } };
            logger.info("New token request", logMeta);

            const transaction = await TransactionService.viewSingleTransaction(
                data.transactionId,
            );
            if (!transaction) {
                logger.error(
                    `CustomError fetching transaction with id ${data.transactionId}`,
                );
                return;
            }

            const transactionEventService = new AirtimeTransactionEventService(
                transaction,
                data.superAgent,
                transaction.partner.email,
                data.phone.phoneNumber,
            );
            await transactionEventService.addVendAirtimeRequestedFromVendorEvent();
            console.log({
                // vendorRecord: data.vendorRetryRecord,
                transaction: transaction.retryRecord,
            });
            const { user, partner } = transaction;
            const vendor = await VendorModelService.viewSingleVendorByName(
                data.superAgent,
            );
            if (!vendor) throw new CustomError("Vendor not found");

            const product =
                await ProductService.viewSingleProductByMasterProductCode(
                    transaction.disco,
                );
            if (!product) throw new CustomError("Product not found");

            const vendorProduct =
                await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(
                    vendor.id,
                    product.id,
                );
            if (!vendorProduct)
                throw new CustomError("Vendor product not found");

            const disco = vendorProduct.schemaData.code;
            logger.info("Processing airtime vend request", logMeta);

            // Purchase token from vendor
            logger.info("Processing vend request", logMeta);
            const tokenInfo = await AirtimeHandlerUtil.processVendRequest({
                transaction: transaction as TokenPurchaseData["transaction"],
                phoneNumber: data.phone.phoneNumber,
                email: user.email,
                amount: parseFloat(transaction.amount),
                accountNumber: data.phone.phoneNumber,
                serviceProvider:
                    transaction.networkProvider as TokenPurchaseData["serviceProvider"],
            });

            console.log({
                point: "Airtime purchase initiated",
                response: tokenInfo,
            });
            logger.info("Vend request processed", logMeta);
            const error = { code: 202, cause: TransactionErrorCause.UNKNOWN };

            const eventMessage = {
                phone: data.phone,
                disco: disco,
                transactionId: transaction.id,
                error: error,
            };
            await transactionEventService.addAirtimeReceivedFromVendorEvent();
            const validationResponse =
                await ResponseValidationUtil.validateTransactionCondition({
                    requestType: "VENDREQUEST",
                    vendor: vendor.name,
                    httpCode:
                        tokenInfo instanceof AxiosError
                            ? (tokenInfo.response?.status.toString() as string)
                            : tokenInfo?.httpStatusCode.toString(),
                    responseObject:
                        tokenInfo instanceof AxiosError
                            ? tokenInfo.response?.data
                            : tokenInfo,
                    vendType: "PREPAID", // This isn't required for airtime, it won't be used when validating requests
                    transactionType: transaction.transactionType,
                    disco: disco,
                    transactionId: transaction.id,
                    isError: tokenInfo instanceof AxiosError,
                });
            console.log({ validationResponse });

            switch (validationResponse.action) {
                case -1:
                    logger.error(
                        "Transaction condition pending - Requery",
                        logMeta,
                    );
                    await AirtimeHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                        {
                            eventData: {
                                ...eventMessage,
                                error: {
                                    ...eventMessage.error,
                                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                                },
                            },
                            eventService: transactionEventService,
                            retryCount: 1,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break
                case 0:
                    logger.error("Transaction condition failed - Retry", logMeta);
                    await AirtimeHandlerUtil.triggerEventToRetryTransactionWithNewVendor(
                        {
                            eventData: eventMessage,
                            transaction,
                            transactionEventService,
                            phone: data.phone,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                case 1:
                    logger.error("Transaction condition passed - Complete", logMeta);
                    // await TransactionService.updateSingleTransaction(
                    //     transaction.id,
                    //     { status: Status.COMPLETE },
                    // );
                    await transactionEventService.addAirtimeReceivedFromVendorEvent()
                    await AirtimeHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                        {
                            eventData: {
                                ...eventMessage,
                                error: {
                                    ...eventMessage.error,
                                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                                },
                            },
                            eventService: transactionEventService,
                            retryCount: 1,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                default:
                    logger.error("Transaction condition were not met", logMeta);
                    await AirtimeHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                        {
                            eventData: {
                                ...eventMessage,
                                error: {
                                    ...eventMessage.error,
                                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                                },
                            },
                            eventService: transactionEventService,
                            retryCount: 1,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord:
                                transaction.retryRecord[
                                transaction.retryRecord.length - 1
                                ],
                        },
                    );
                    break;
            }

            return;
        } catch (error) {
            if (error instanceof CustomError) {
                error.meta = error.meta ?? {
                    transactionId: data.transactionId,
                };
            }

            throw error;
        }
    }

    private static async handleAirtimeRecievd(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_RECEIVED_FROM_VENDOR],
    ) {
        try {
            const logMeta = {
                meta: { transactionId: data.transactionId },
            };
            logger.warn("Requerying transaction from vendor", logMeta);
            retry.count = data.retryCount;
            console.log({
                data: data.vendorRetryRecord,
                retyrCount: data.retryCount,
            });

            // Check if token has been found
            const transaction =
                await TransactionService.viewSingleTransaction(
                    data.transactionId,
                );
            if (!transaction) {
                logger.error("Transaction not found", logMeta);
                return;
            }
            // Get the current timestamp in milliseconds
            const now = Date.now();

            // Assuming you have another timestamp stored in a variable called 'previousTimestamp'
            // For example:
            const previousTimestamp = new Date(
                transaction.transactionTimestamp,
            ).getTime(); // This represents a timestamp for April 1, 2022

            // Calculate the difference between the current timestamp and the previous timestamp in milliseconds
            const differenceInMilliseconds = now - previousTimestamp;

            // Convert milliseconds to hours
            const differenceInHours =
                differenceInMilliseconds / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

            // Check if the difference is greater than two hours
            // if (differenceInHours > 2) {

            //check if transaction is greater than 2hrs then stop
            if (differenceInHours > 2) {
                logger.info(
                    `Flagged transaction with id ${transaction.id} after hitting requery limit`,
                    {
                        meta: { transactionId: transaction.id },
                    },
                );
                return await TransactionService.updateSingleTransaction(
                    transaction.id,
                    { status: Status.FLAGGED },
                );
            }

            const user = await transaction.$get("user");
            const meter = await transaction.$get("meter");
            const partner = await transaction.$get("partner");
            if (!user || !meter || !partner) {
                throw new CustomError(
                    "Transaction  required relations not found",
                );
            }

            // Check if disco is up
            const vendor =
                await VendorModelService.viewSingleVendorByName(
                    data.superAgent,
                );
            if (!vendor) throw new CustomError("Vendor not found");

            const product =
                await ProductService.viewSingleProductByMasterProductCode(
                    transaction.disco,
                );
            if (!product) throw new CustomError("Product not found");

            const vendorProduct =
                await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(
                    vendor.id,
                    product.id,
                );
            if (!vendorProduct)
                throw new CustomError("Vendor product not found");

            const discoCode = vendorProduct.schemaData.code;
            //     const logMeta = { meta: { transactionId: data.transactionId } };
            //
            //     logger.info("Airtime received from vendor", logMeta);
            //     const transaction = await TransactionService.viewSingleTransaction(
            //         data.transactionId,
            //     );
            //     if (!transaction) {
            //         throw new CustomError(
            //             `CustomError fetching transaction with id ${data.transactionId}`,
            //         );
            //     }
            //
            //     // Check if transaction is already complete
            //     if (transaction.status === Status.COMPLETE) {
            //         throw new CustomError(
            //             `Transaction with id ${data.transactionId} is already complete`,
            //         );
            //     }
            //
            //     logger.info("Processing airtime received from vendor", logMeta);
            //     // Requery transaction from provider and update transaction status
            //     const requeryResult =
            //         await AirtimeHandlerUtil.requeryTransactionFromVendor(
            //             transaction,
            //         );
            //     const requeryResultFromBuypower = requeryResult as Awaited<
            //         ReturnType<typeof VendorService.buyPowerRequeryTransaction>
            //     >;
            //     const requeryResultFromIrecharge = requeryResult as Awaited<
            //         ReturnType<typeof VendorService.irechargeRequeryTransaction>
            //     >;
            //     const requeryResultFromBaxi = requeryResult as Awaited<
            //         ReturnType<typeof VendorService.baxiRequeryTransaction>
            //     >;
            //
            //     const transactionSuccessFromBuypower =
            //         requeryResultFromBuypower.source === "BUYPOWERNG"
            //             ? requeryResultFromBuypower.responseCode === 200
            //             : false;
            //     const transactionSuccessFromIrecharge =
            //         requeryResultFromIrecharge.source === "IRECHARGE"
            //             ? requeryResultFromIrecharge.status === "00" &&
            //               requeryResultFromIrecharge.vend_status === "successful"
            //             : false;
            //     const transactionSuccessFromBaxi =
            //         requeryResultFromBaxi.source === "BAXI"
            //             ? requeryResultFromBaxi.responseCode === 200
            //             : false;
            //
            //     const transactionEventService = new AirtimeTransactionEventService(
            //         transaction,
            //         transaction.superagent,
            //         transaction.partner.email,
            //         data.phone.phoneNumber,
            //     );
            //     const transactionSuccess =
            //         transactionSuccessFromBuypower ||
            //         transactionSuccessFromIrecharge ||
            //         transactionSuccessFromBaxi;
            //
            //     if (!transactionSuccess) {
            //         await transactionEventService.addAirtimeTransactionRequery();
            //         await AirtimeHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
            //             {
            //                 eventService: transactionEventService,
            //                 eventData: {
            //                     phone: data.phone,
            //                     transactionId: data.transactionId,
            //                     error: {
            //                         code: requeryResultFromBuypower.responseCode,
            //                         cause: TransactionErrorCause.TRANSACTION_FAILED,
            //                     },
            //                 },
            //                 retryCount: 1,
            //                 superAgent: transaction.superagent,
            //                 transactionTimedOutFromBuypower: false,
            //             },
            //         );
            //     }
            //
            //     logger.info("Airtime received from vendor", logMeta);
            //     return await TransactionService.updateSingleTransaction(
            //         data.transactionId,
            //         {
            //             status: Status.COMPLETE,
            //         },
            //     );
        } catch (error) {
            if (error instanceof CustomError) {
                error.meta = error.meta ?? {
                    transactionId: data.transactionId,
                };
            }

            throw error;
        }
    }

    private static async requeryTransaction(
        data: PublisherEventAndParameters[TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY],
    ) {
        try {
            const logMeta = {
                meta: { transactionId: data.transactionId },
            };
            logger.warn("Requerying transaction from vendor", logMeta);
            retry.count = data.retryCount;
            console.log({
                data: data.vendorRetryRecord,
                retyrCount: data.retryCount,
            });

            // Check if token has been found
            const transaction =
                await TransactionService.viewSingleTransaction(
                    data.transactionId,
                );
            if (!transaction) {
                logger.error("Transaction not found", logMeta);
                return;
            }
            // Get the current timestamp in milliseconds
            const now = Date.now();

            // Assuming you have another timestamp stored in a variable called 'previousTimestamp'
            // For example:
            const previousTimestamp = new Date(
                transaction.transactionTimestamp,
            ).getTime(); // This represents a timestamp for April 1, 2022

            // Calculate the difference between the current timestamp and the previous timestamp in milliseconds
            const differenceInMilliseconds = now - previousTimestamp;

            // Convert milliseconds to hours
            const differenceInHours =
                differenceInMilliseconds / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

            // Check if transaction is greater than 2hrs then stop
            if (differenceInHours > 2) {
                logger.info(
                    `Flagged transaction with id ${transaction.id} after hitting requery limit`,
                    {
                        meta: { transactionId: transaction.id },
                    },
                );
                return await TransactionService.updateSingleTransaction(
                    transaction.id,
                    { status: Status.FLAGGED },
                );
            }

            const user = await transaction.$get("user");
            const meter = await transaction.$get("meter");
            const partner = await transaction.$get("partner");
            if (!user || !meter || !partner) {
                throw new CustomError(
                    "Transaction  required relations not found",
                );
            }

            // Check if disco is up
            const vendor =
                await VendorModelService.viewSingleVendorByName(
                    data.superAgent,
                );
            if (!vendor) throw new CustomError("Vendor not found");
            const product =
                await ProductService.viewSingleProductByMasterProductCode(
                    transaction.disco,
                );
            if (!product) throw new CustomError("Product not found");
            const vendorProduct =
                await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(
                    vendor.id,
                    product.id,
                );
            if (!vendorProduct)
                throw new CustomError("Vendor product not found");

            const discoCode = vendorProduct.schemaData.code;
            const transactionEventService = new AirtimeTransactionEventService(
                transaction,
                data.superAgent,
                transaction.partner.email,
                data.phone.phoneNumber,
            )
            await transactionEventService.addGetAirtimeFromVendorRequeryInitiatedEvent(data.retryCount)

            const requeryResult = await AirtimeHandlerUtil.requeryTransactionFromVendor(transaction).catch(e => e ?? {})
            const validationResponse = await ResponseValidationUtil.validateTransactionCondition({
                requestType: "REQUERY",
                vendor: vendor.name,
                httpCode:
                    requeryResult instanceof AxiosError
                        ? requeryResult.status
                        : requeryResult.httpStatusCode,
                responseObject:
                    requeryResult instanceof AxiosError
                        ? requeryResult.response?.data
                        : requeryResult,
                vendType: "PREPAID",
                transactionType: transaction.transactionType,
                disco: discoCode,
                transactionId: transaction.id,
                isError: requeryResult instanceof AxiosError
            })

            const eventMessage = {
                phone: data.phone,
                disco: discoCode,
                transactionId: transaction.id,
                error: {
                    code: 202,
                    cause: TransactionErrorCause.UNEXPECTED_ERROR
                }
            }

            switch (validationResponse.action) {
                case -1:
                    logger.error(
                        "Transaction condition pending - Requery",
                        logMeta,
                    );
                    await AirtimeHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                        {
                            eventData: {
                                ...eventMessage,
                                error: {
                                    ...eventMessage.error,
                                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                                },
                            },
                            eventService: transactionEventService,
                            retryCount: data.retryCount + 1,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break
                case 0:
                    logger.error("Transaction condition failed - Retry", logMeta);
                    await AirtimeHandlerUtil.triggerEventToRetryTransactionWithNewVendor(
                        {
                            eventData: eventMessage,
                            transaction,
                            transactionEventService,
                            phone: data.phone,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                case 1:
                    logger.info(
                        "Transaction condition met - Successful",
                        logMeta,
                    );
                    await TransactionService.updateSingleTransaction(
                        transaction.id,
                        { status: Status.COMPLETE },
                    );
                    await transactionEventService.addAirtimeReceivedFromVendorRequeryEvent()
                    await VendorPublisher.publishEventForAirtimeReceivedFromVendor({
                        transactionId: transaction.id,
                        phone: data.phone,
                        partner: partner,
                        user: user,
                    });

                    break;
                default:
                    logger.error("Transaction condition were not met", logMeta);
                    await AirtimeHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                        {
                            eventData: {
                                ...eventMessage,
                                error: {
                                    ...eventMessage.error,
                                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                                },
                            },
                            eventService: transactionEventService,
                            retryCount: data.retryCount + 1,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord:
                                transaction.retryRecord[
                                transaction.retryRecord.length - 1
                                ],
                        },
                    );
                    break;
            }


        } catch (error) {
            if (error instanceof CustomError) {
                error.meta = error.meta ?? {
                    transactionId: data.transactionId,
                };
            }

            throw error;
        }
    }

    private static async scheduleRequeryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_REQUERY_FOR_AIRTIME_TRANSACTION],
    ) {
        // Check the timeStamp, and the delayInSeconds

        return newrelic.startBackgroundTransaction(
            "ConsumerFunction:ScheduleRequeryTransaction",
            async function () {
                const { timeStamp, delayInSeconds } = data;

                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const timeStampInSeconds = Math.floor(
                    new Date(timeStamp).getTime() / 1000,
                );
                const timeInSecondsSinceInit =
                    currentTimeInSeconds - timeStampInSeconds;
                const timeDifference = delayInSeconds - timeInSecondsSinceInit;

                console.log({
                    timeDifference,
                    timeStamp,
                    currentTime: new Date(),
                    delayInSeconds,
                    timeInSecondsSinceInit,
                });

                if (timeDifference <= 0) {
                    const existingTransaction =
                        await TransactionService.viewSingleTransaction(
                            data.scheduledMessagePayload.transactionId,
                        );
                    if (!existingTransaction) {
                        throw new CustomError("Transaction not found");
                    }

                    // Check if transaction has been requeried successfuly before
                    const tokenReceivedFromRequery =
                        await EventService.viewSingleEventByTransactionIdAndType(
                            data.scheduledMessagePayload.transactionId,
                            TOPICS.TOKEN_RECIEVED_FROM_REQUERY,
                        );
                    if (tokenReceivedFromRequery) {
                        logger.warn(
                            "Transaction has been requeried successfully before",
                            {
                                meta: {
                                    transactionId:
                                        data.scheduledMessagePayload
                                            .transactionId,
                                    currentMessagePayload: data,
                                },
                            },
                        );
                        return;
                    }

                    const transactionEventService = new AirtimeTransactionEventService(
                        existingTransaction,
                        existingTransaction.superagent,
                        data.scheduledMessagePayload.phone.phoneNumber,
                        data.scheduledMessagePayload.superAgent,
                    );
                    await transactionEventService.addGetAirtimeTokenRequestedFromVendorRequeryEvent(
                        {
                            cause: TransactionErrorCause.RESCHEDULED_BEFORE_WAIT_TIME,
                            code: 202,
                        },
                        data.scheduledMessagePayload.retryCount + 1,
                    );
                    return await VendorPublisher.publishEventForGetAirtimeRequestedFromVendorRequery(
                        data.scheduledMessagePayload,
                    );
                }

                // Change error cause to RESCHEDULED_BEFORE_WAIT_TIME
                data.scheduledMessagePayload.error.cause =
                    TransactionErrorCause.RESCHEDULED_BEFORE_WAIT_TIME;

                // logger.info("Rescheduling requery for transaction", { meta: { transactionId: data.scheduledMessagePayload.transactionId } })
                // Else, schedule a new event to requery transaction from vendor
                return await VendorPublisher.publishEventToScheduleAirtimeRequery({
                    scheduledMessagePayload: data.scheduledMessagePayload,
                    timeStamp: data.timeStamp,
                    delayInSeconds: data.delayInSeconds,
                    log: 0,
                });
            },
        );
    }

    private static async scheduleRetryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_AIRTIME_TRANSACTION],
    ) {
        // Check the timeStamp, and the delayInSeconds

        return newrelic.startBackgroundTransaction(
            "ConsumerFunction:ScheduleRetryForTransaction",
            async function () {
                const { timeStamp, delayInSeconds } = data;

                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const timeStampInSeconds = Math.floor(
                    new Date(timeStamp).getTime() / 1000,
                );
                const timeInSecondsSinceInit =
                    currentTimeInSeconds - timeStampInSeconds;
                const timeDifference = delayInSeconds - timeInSecondsSinceInit;

                console.log({
                    timeDifference,
                    timeStamp,
                    currentTime: new Date(),
                    delayInSeconds,
                    timeInSecondsSinceInit,
                });

                // Check if current time is greater than the timeStamp + delayInSeconds
                if (timeDifference <= 0) {
                    const existingTransaction =
                        await TransactionService.viewSingleTransaction(
                            data.scheduledMessagePayload.transactionId,
                        );
                    if (!existingTransaction) {
                        throw new CustomError("Transaction not found");
                    }

                    const transactionEventService = new AirtimeTransactionEventService(
                        existingTransaction,
                        existingTransaction.superagent,
                        data.scheduledMessagePayload.partner.email,
                        data.scheduledMessagePayload.phone.phoneNumber,
                    );

                    await TransactionService.updateSingleTransaction(
                        data.scheduledMessagePayload.transactionId,
                        {
                            superagent: data.scheduledMessagePayload.newVendor,
                            retryRecord:
                                data.scheduledMessagePayload.retryRecord,
                            vendorReferenceId:
                                data.scheduledMessagePayload
                                    .newTransactionReference,
                            reference:
                                data.scheduledMessagePayload
                                    .newTransactionReference,
                            irechargeAccessToken:
                                data.scheduledMessagePayload
                                    .irechargeAccessToken,
                            previousVendors:
                                data.scheduledMessagePayload.previousVendors,
                        },
                    );

                    await VendorPublisher.publishEventForAirtimePurchaseRetryFromVendorWithNewVendor(
                        data.scheduledMessagePayload
                    );
                    await transactionEventService.addAirtimePurchaseInitiatedEvent({ amount: existingTransaction.amount });
                    return await VendorPublisher.publshEventForAirtimePurchaseInitiate(
                        data.scheduledMessagePayload,
                    );
                }

                // logger.info("Rescheduling retry for transaction", { meta: { transactionId: data.scheduledMessagePayload.transactionId } })
                // Else, schedule a new event to requery transaction from vendor
                return await VendorPublisher.publishEventToScheduleAirtimeRetry({
                    scheduledMessagePayload: data.scheduledMessagePayload,
                    timeStamp: data.timeStamp,
                    delayInSeconds: data.delayInSeconds,
                    log: 0,
                });
            },
        );
    }

    static registry = {
        [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]:
            this.handleAirtimeRequest,
        [TOPICS.AIRTIME_RECEIVED_FROM_VENDOR]: this.handleAirtimeRecievd,
        [TOPICS.SCHEDULE_REQUERY_FOR_AIRTIME_TRANSACTION]: this.scheduleRequeryTransaction,
        [TOPICS.SCHEDULE_RETRY_FOR_AIRTIME_TRANSACTION]: this.scheduleRetryTransaction,
        [TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY]: this.requeryTransaction,
        [TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR]: this.handleAirtimeRequest,
    };
}

export default class AirtimeConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor(
            AirtimeHandler.registry,
            "AIRTIME_CONSUMER",
        );
        super(messageProcessor);
    }
}
