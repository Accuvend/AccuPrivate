import VendorModelService from "../../../services/Vendor.service";
import { AxiosError } from "axios";
import {
    ITransaction,
    IUpdateTransaction,
    Status,
} from "../../../models/Transaction.model";
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
import {
    generateRandomToken,
    generateVendorReference,
} from "../../../utils/Helper";
import BuypowerApi from "../../../services/VendorApi.service/Buypower";
import { IRechargeApi } from "../../../services/VendorApi.service/Irecharge";
import ProductService from "../../../services/Product.service";
import VendorProductService from "../../../services/VendorProduct.service";
import { VendorProductSchemaData } from "../../../models/VendorProduct.model";
import BaxiApi from "../../../services/VendorApi.service/Baxi";
import { token } from "morgan";
import { CustomError } from "../../../utils/Errors";
import {
    getCurrentWaitTimeForRequeryEvent,
    getCurrentWaitTimeForSwitchEvent,
    ResponseValidationUtil,
    TokenHandlerUtil,
} from "./Token";
import { transferableAbortSignal } from "util";
import newrelic from "newrelic";
import { randomUUID } from "crypto";
import EmailService, { EmailTemplate } from "../../../utils/Email";

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
    requeryCount: number;
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
    retryCountBeforeSwitchingVendor: 3,
};

const TEST_FAILED = NODE_ENV === "production" ? false : false; // TOGGLE - Will simulate failed transaction

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT,
};

export class AirtimeHandlerUtil {
    private static async createRetryEntryForTransaction({
        transaction,
    }: {
        transaction: Transaction;
    }) {
        let retryRecord: Transaction["retryRecord"] = JSON.parse(
            JSON.stringify([...transaction.retryRecord]),
        );

        // Make sure to use the same vendor thrice before switching to another vendor
        const lastVendorRetryRecord = retryRecord[retryRecord.length - 1];
        const lastVendorRetryEntryReachedLimit =
            lastVendorRetryRecord.retryCount >=
            retry.retryCountBeforeSwitchingVendor;
        if (!lastVendorRetryEntryReachedLimit) {
            // Update the retry count for the last vendor entry in the transaction
            lastVendorRetryRecord.retryCount =
                lastVendorRetryRecord.retryCount + 1;

            logger.info("Using current vendor", {
                meta: { transactionId: transaction.id },
            });
        } else {
            logger.warn("switching to new vendor", {
                meta: { transactionId: transaction.id },
            });
        }

        const previousVendors = [] as Transaction["superagent"][];
        for (const record of retryRecord) {
            for (const _ of record.reference) {
                previousVendors.push(record.vendor);
            }
        }

        const currentVendor = lastVendorRetryEntryReachedLimit
            ? await this.getNextBestVendorForVendRePurchase(
                  transaction.productCodeId,
                  transaction.superagent,
                  previousVendors,
                  parseFloat(transaction.amount),
              )
            : lastVendorRetryRecord.vendor;

        const newTransactionReference =
            currentVendor === "IRECHARGE"
                ? await generateVendorReference()
                : randomUUID();

        if (
            currentVendor != lastVendorRetryRecord.vendor ||
            lastVendorRetryEntryReachedLimit
            // lastVendorRetryRecord.retryCount > retry.retryCountBeforeSwitchingVendor
        ) {
            // Add new vendor retry entry to the retry record
            const newVendorRetryRecord = {
                vendor: currentVendor,
                retryCount: 1,
                reference: [newTransactionReference],
                attempt: 1,
            };
            retryRecord.push(newVendorRetryRecord);
        } else {
            // Add the new reference to be used for new retry
            lastVendorRetryRecord.reference.push(newTransactionReference);
        }

        // const isFirstRetry = initialRetryRecord[0].reference.length === 2;
        return {
            retryRecord,
            newTransactionReference,
            currentVendor,
            switchVendor: lastVendorRetryEntryReachedLimit,
        };
    }

    static async triggerEventToRequeryTransactionTokenFromVendor({
        eventService,
        eventData,
        transactionTimedOutFromBuypower,
        retryCount,
        requeryCount,
        superAgent,
    }: TriggerRequeryTransactionTokenProps) {
        const logMeta = {
            meta: {
                transactionId: eventData.transactionId,
            },
        };
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
                    : TransactionErrorCause.UNKNOWN,
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
        const transaction = await TransactionService.viewSingleTransaction(
            eventData.transactionId,
        );
        if (!transaction)
            throw new CustomError("Transaction not found", {
                transactionId: eventData.transactionId,
            });

        const eventMetaData = {
            transactionId: eventData.transactionId,
            phone: eventData.phone,
            error: eventData.error,
            timeStamp: new Date(),
            retryCount,
            requeryCount: requeryCount + 1,
            superAgent,
            waitTime: await getCurrentWaitTimeForRequeryEvent(
                retryCount,
                superAgent,
            ),
            vendorRetryRecord:
                transaction.retryRecord[transaction.retryRecord.length - 1],
        };

        const partner = await transaction.$get("partner");
        if (!partner)
            throw new CustomError("Partner not found", {
                transactionId: eventData.transactionId,
            });

        if (requeryCount === 2) {
            const user = await transaction.$get("user");
            if (!user) {
                throw new CustomError("User not found", {
                    transactionId: eventData.transactionId,
                });
            }
            logger.info("Sending email to user after 2 requery attempts", {
                meta: { email: user.email, transactionId: transaction.id },
            });

            await EmailService.sendEmail({
                to: user.email,
                subject: `Order with reference ${transaction.reference} is being processed`,
                html: await new EmailTemplate().processing_airtime_order_confirmation(
                    {
                        transaction,
                        phone: eventData.phone.phoneNumber,
                        name: user.name as string,
                    },
                ),
            });
        }

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
    }

    static async triggerEventToRetryTransactionWithNewVendor({
        transaction,
        phone,
        vendorRetryRecord,
        manual,
    }: {
        eventData: EventMessage & {
            error: {
                cause: TransactionErrorCause;
                code: number;
            };
        };
        manual?: boolean;
        transaction: Transaction;
        transactionEventService: AirtimeTransactionEventService;
        phone: { phoneNumber: string; amount: number };
        vendorRetryRecord: VendorRetryRecord;
    }) {
        logger.warn("Retrying transaction with new vendor", {
            meta: { transactionId: transaction.id },
        });
        const meta = {
            transactionId: transaction.id,
        };

        // Attempt purchase from new vendor
        if (!transaction.bankRefId)
            throw new CustomError("BankRefId not found", meta);

        const retryRecord = transaction.retryRecord;
        const { retryRecord: newRetryRecord, switchVendor } =
            await this.createRetryEntryForTransaction({ transaction });

        const newVendorEntry = newRetryRecord[newRetryRecord.length - 1];
        const newVendor = newVendorEntry.vendor;

        const waitTime = switchVendor
            ? await getCurrentWaitTimeForSwitchEvent(newVendorEntry.retryCount)
            : await getCurrentWaitTimeForSwitchEvent(
                  vendorRetryRecord.retryCount,
              );

        const { user, partner } = await TransactionService.populateRelations({
            transaction,
            strict: true,
            fields: ["user", "partner"],
        });

        const transactionEventService = new AirtimeTransactionEventService(
            transaction,
            transaction.superagent,
            partner.email,
            phone.phoneNumber,
        );

        await transactionEventService.addAirtimePurchaseWithNewVendorEvent({
            currentVendor: transaction.superagent,
            newVendor,
        });

        if (manual) {
            await transactionEventService.addGetAirtimeFromVendorRetryEvent(
                {
                    cause: TransactionErrorCause.MANUAL_RETRY_TRIGGERED,
                    code: 200,
                },
                1,
            );

            return await VendorPublisher.publshEventForAirtimePurchaseInitiate({
                transactionId: transaction.id,
                phone: {
                    phoneNumber: phone.phoneNumber,
                    amount: phone.amount,
                },
                partner: {
                    email: partner.email,
                },
                user: {
                    email: user.email,
                    name: user.name as string,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                },
                superAgent: transaction.retryRecord[0]?.vendor,
                vendorRetryRecord: {
                    retryCount: 1,
                },
            });
        }

        await transactionEventService.addScheduleRetryEvent({
            timeStamp: new Date().toString(),
            waitTime,
            retryRecord: newVendorEntry,
        });

        logger.info("Scheduled retry event", meta);

        return await VendorPublisher.publishEventToScheduleAirtimeRetry({
            scheduledMessagePayload: {
                partner: partner,
                transactionId: transaction.id,
                phone: phone,
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
                previousVendors:
                    transaction.previousVendors as Transaction["superagent"][],
            },
            timeStamp: new Date().toString(),
            delayInSeconds: waitTime,
        });
    }

    static async processVendRequest<T extends Vendor>({
        transaction,
        ...data
    }: TokenPurchaseData<T>) {
        let superAgent = transaction.superagent as ITransaction["superagent"];
        try {

            const {
                retryRecord,
                newTransactionReference,
                currentVendor,
                switchVendor,
            } = await this.createRetryEntryForTransaction({ transaction });

            const oldRetryRecord = transaction.retryRecord;
            let updateData = {} as IUpdateTransaction;
            if (
                oldRetryRecord[0].attempt === 0 &&
                oldRetryRecord.length === 1
            ) {
                // The  existing record in this case has not been used, no need to add  a new record
                const updatedRetryRecord = [
                    {
                        ...oldRetryRecord[0],
                        attempt: 1,
                    },
                ];
                updateData = { retryRecord: updatedRetryRecord };
            } else {
                updateData = {
                    retryRecord,
                    reference: newTransactionReference,
                    superagent: currentVendor,
                };
            }
            const timeStamps = transaction.vendTimeStamps ?? [];
            console.log({ timeStamps, transaction });
            timeStamps.push(new Date().toString());
            let updatedTraansaction =
                await TransactionService.updateSingleTransaction(
                    transaction.id,
                    {
                        ...updateData,
                        previousVendors: [
                            ...transaction.previousVendors,
                            retryRecord[retryRecord.length - 1].vendor,
                        ],
                        vendTimeStamps: timeStamps,
                    },
                );

            superAgent = updatedTraansaction.superagent;

            const _data = {
                accountNumber: data.accountNumber,
                phoneNumber: data.phoneNumber,
                serviceType: data.serviceProvider,
                amount: data.amount,
                email: data.email,
                transactionId: transaction.id,
                reference: updatedTraansaction.reference
            };
            const vendResponse = await VendorService.purchaseAirtime({
                data: _data,
                vendor: updatedTraansaction.superagent,
            });

            if (vendResponse.source === "IRECHARGE") {
                const accessToken = vendResponse.ref;
                const lastVendorRetryEntry =
                    updatedTraansaction.retryRecord[
                        updatedTraansaction.retryRecord.length - 1
                    ];
                lastVendorRetryEntry.accessToken = accessToken;

                updatedTraansaction =
                    await TransactionService.updateSingleTransaction(
                        transaction.id,
                        { irechargeAccessToken: accessToken },
                    );
            }

            return vendResponse;
        } catch (error) {
            logger.error("An error occured while vending from " + superAgent, {
                meta: {
                    transactionId: transaction.id,
                    error: error,
                    errorResponse: (error as AxiosError).response?.data,
                },
            });

            throw error;
        }
    }

    static async processRequeryRequest(transaction: Transaction) {
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
                        errorResponse: (error as AxiosError).response?.data,
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
            if (!previousVendors.includes(vendorRate.vendorName)) {
                console.log({
                    currentVendor,
                    newVendor: vendorRate.vendorName,
                });

                return vendorRate.vendorName as Transaction["superagent"];
            }
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

        console.log({
            currentVendor,
            newVendor: sortedOtherVendors[0].vendorName,
        });

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
            }).catch((e) => ({
                response: e as AxiosError | Error,
            }));
            console.log({ tokenInfo });

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
            const validationResponse =
                await ResponseValidationUtil.validateTransactionCondition({
                    requestType: "VENDREQUEST",
                    vendor: vendor.name,
                    httpCode:
                        tokenInfo instanceof Error ||
                        tokenInfo instanceof AxiosError
                            ? (tokenInfo as unknown as AxiosError).response
                                  ?.status
                            : (tokenInfo as any).httpStatusCode,
                    responseObject:
                        tokenInfo instanceof Error ||
                        tokenInfo instanceof AxiosError
                            ? ((tokenInfo as unknown as AxiosError).response
                                  ?.data as Record<string, any>)
                            : tokenInfo,
                    vendType: "PREPAID", // This isn't required for airtime, it won't be used when validating requests
                    // transactionType: transaction.transactionType,
                    disco: disco,
                    transactionId: transaction.id,
                    isError: tokenInfo instanceof AxiosError,
                });
            console.log({ validationResponse });
            const updatedTraansaction =
                await TransactionService.viewSingleTransaction(
                    data.transactionId,
                );
            if (!updatedTraansaction)
                throw new CustomError("Transaction not found", logMeta);

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
                            requeryCount: 1,
                            superAgent: updatedTraansaction.superagent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                case 0:
                    logger.error(
                        "Transaction condition failed - Retry",
                        logMeta,
                    );
                    await AirtimeHandlerUtil.triggerEventToRetryTransactionWithNewVendor(
                        {
                            eventData: eventMessage,
                            transaction: updatedTraansaction,
                            transactionEventService,
                            phone: data.phone,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                case 1:
                    logger.error(
                        "Transaction condition passed - Complete",
                        logMeta,
                    );
                    // await TransactionService.updateSingleTransaction(
                    //     transaction.id,
                    //     { status: Status.COMPLETE },
                    // );
                    await transactionEventService.addAirtimeReceivedFromVendorEvent();
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
                            requeryCount: 1,
                            superAgent: updatedTraansaction.superagent,
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
                            requeryCount: 1,
                            superAgent: updatedTraansaction.superagent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: {
                                retryCount: 1,
                            },
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
                data: data,
                retyrCount: data.retryCount,
            });

            // Check if token has been found
            const transaction = await TransactionService.viewSingleTransaction(
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
            const lastVendTime = transaction.vendTimeStamps?.slice(-1)[0];
            let differenceInHoursFromLastVend = 0;
            if (lastVendTime) {
                const lastVendTimeStamp = new Date(lastVendTime).getTime();
                differenceInHoursFromLastVend =
                    (now - lastVendTimeStamp) / (1000 * 60 * 60);
            }

            // Calculate the difference between the current timestamp and the previous timestamp in milliseconds
            const differenceInMilliseconds = now - previousTimestamp;

            // Convert milliseconds to hours
            const differenceInHours =
                differenceInMilliseconds / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

            // Check if the difference is greater than two hours
            const flaggTransaction =
                differenceInHoursFromLastVend > 2 || differenceInHours > 2;
            //check if transaction is greater than 2hrs then stop
            if (flaggTransaction) {
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
            const partner = await transaction.$get("partner");
            if (!user || !partner) {
                throw new CustomError(
                    "Transaction  required relations not found",
                );
            }

            // Check if disco is up
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

            const discoCode = vendorProduct.schemaData.code;
            const transactionEventService = new AirtimeTransactionEventService(
                transaction,
                data.superAgent,
                transaction.partner.email,
                data.phone.phoneNumber,
            );
            await transactionEventService.addGetAirtimeFromVendorRequeryInitiatedEvent(
                data.retryCount,
            );

            const requeryResult =
                await AirtimeHandlerUtil.processRequeryRequest(
                    transaction,
                ).catch((e) => e ?? {});
            const validationResponse =
                await ResponseValidationUtil.validateTransactionCondition({
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
                    // transactionType: transaction.transactionType,
                    disco: discoCode,
                    transactionId: transaction.id,
                    isError: requeryResult instanceof AxiosError,
                });

            const eventMessage = {
                phone: data.phone,
                disco: discoCode,
                transactionId: transaction.id,
                error: {
                    code: 202,
                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                },
            };

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
                            retryCount: data.retryCount + 1,
                            requeryCount: data.requeryCount,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                case 0:
                    logger.error(
                        "Transaction condition failed - Retry",
                        logMeta,
                    );
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
                    await transactionEventService.addAirtimeReceivedFromVendorRequeryEvent();
                    await VendorPublisher.publishEventForAirtimeReceivedFromVendor(
                        {
                            transactionId: transaction.id,
                            phone: data.phone,
                            partner: partner,
                            user: user,
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
                            retryCount: data.retryCount + 1,
                            requeryCount: data.requeryCount,
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
        const { timeStamp, delayInSeconds } = data;

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const timeStampInSeconds = Math.floor(
            new Date(timeStamp).getTime() / 1000,
        );
        const timeInSecondsSinceInit =
            currentTimeInSeconds - timeStampInSeconds;
        const timeDifference = delayInSeconds - timeInSecondsSinceInit;

        if (timeDifference < 0) {
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
                    TOPICS.AIRTIME_RECEIVED_FROM_VENDOR_REQUERY,
                );
            if (tokenReceivedFromRequery) {
                logger.warn(
                    "Transaction has been requeried successfully before",
                    {
                        meta: {
                            transactionId:
                                data.scheduledMessagePayload.transactionId,
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
    }

    private static async scheduleRetryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_AIRTIME_TRANSACTION],
    ) {
        // Check the timeStamp, and the delayInSeconds

        const { timeStamp, delayInSeconds } = data;

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const timeStampInSeconds = Math.floor(
            new Date(timeStamp).getTime() / 1000,
        );
        const timeInSecondsSinceInit =
            currentTimeInSeconds - timeStampInSeconds;
        const timeDifference = delayInSeconds - timeInSecondsSinceInit;

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

            return await VendorPublisher.publishEventForAirtimePurchaseRetryFromVendorWithNewVendor(
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
    }

    static registry = {
        [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]:
            this.handleAirtimeRequest,
        [TOPICS.SCHEDULE_REQUERY_FOR_AIRTIME_TRANSACTION]:
            this.scheduleRequeryTransaction,
        [TOPICS.SCHEDULE_RETRY_FOR_AIRTIME_TRANSACTION]:
            this.scheduleRetryTransaction,
        [TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY]: this.requeryTransaction,
        [TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR]:
            this.handleAirtimeRequest,
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
