import { AxiosError } from "axios";
import { Status } from "../../../models/Transaction.model";
import Meter from "../../../models/Meter.model";
import Transaction from "../../../models/Transaction.model";
import PowerUnitService from "../../../services/PowerUnit.service";
import TransactionService from "../../../services/Transaction.service";
import TransactionEventService, {
    DataTransactionEventService,
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
    DataPurchaseResponse,
    ElectricityRequeryResponse,
    Prettify,
    SuccessResponseForBuyPowerRequery,
    Vendor,
} from "../../../services/VendorApi.service";
import {
    generateRandomString,
    generateRandomToken,
    generateRandonNumbers,
} from "../../../utils/Helper";
import BuypowerApi from "../../../services/VendorApi.service/Buypower";
import { IRechargeApi } from "../../../services/VendorApi.service/Irecharge";
import ProductService from "../../../services/Product.service";
import { VendorProductSchemaData } from "../../../models/VendorProduct.model";
import { CustomError } from "../../../utils/Errors";
import VendorProductService from "../../../services/VendorProduct.service";
import VendorModelService from "../../../services/Vendor.service";
import BundleService from "../../../services/Bundle.service";
import { token } from "morgan";
import WaitTimeService from "../../../services/Waittime.service";
import {
    ResponseValidationUtil,
    TokenHandlerUtil,
    getCurrentWaitTimeForRequeryEvent,
} from "./Token";
import { parse } from "path";
import { timeStamp } from "console";
import { IBundle } from "../../../models/Bundle.model";

interface EventMessage {
    phone: {
        phoneNumber: string;
        amount: number;
    };
    transactionId: string;
}

interface TriggerRequeryTransactionTokenProps {
    eventService: DataTransactionEventService;
    eventData: EventMessage & {
        error: {
            cause: TransactionErrorCause;
            code: number;
        };
    };
    transactionTimedOutFromBuypower: boolean;
    superAgent: Transaction["superagent"];
    retryCount: number;
    bundle: IBundle;
    vendorRetryRecord: VendorRetryRecord;
}

interface TokenPurchaseData<T = Vendor> {
    transaction: Omit<Transaction, "superagent"> & { superagent: T };
    phoneNumber: string;
    email: string;
    amount: number;
    serviceProvider: "MTN" | "GLO" | "AIRTEL" | "9MOBILE";
    dataCode: string;
    transactionId: string;
}

interface ProcessVendRequestReturnData {
    // 'BUYPOWERNG': Awaited<ReturnType<typeof BuypowerApi.Data.purchase>>,
    IRECHARGE: Awaited<ReturnType<typeof IRechargeApi.Data.purchase>>;
}

const retry = {
    count: 0,
    limit: 5,
    limitToStopRetryingWhenTransactionIsSuccessful: 20,
    retryCountBeforeSwitchingVendor: 4,
    testForSwitchingVendor: true,
};

const TEST_FAILED = NODE_ENV === "production" ? false : false; // TOGGLE - Will simulate failed transaction

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT,
};

export class DataHandlerUtil {
    static async triggerEventToRequeryTransactionTokenFromVendor({
        eventService,
        eventData,
        transactionTimedOutFromBuypower,
        retryCount,
        superAgent,
        vendorRetryRecord,
        bundle,
    }: TriggerRequeryTransactionTokenProps) {
        // Check if the transaction has hit the requery limit
        // If yes, flag transaction
        const logMeta = { meta: { transactionId: eventData.transactionId } };
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
         * 500 - Unexpected Error
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

        await eventService.addGetDataFromVendorRetryEvent(
            _eventMessage.error,
            retryCount,
        );
        const eventMetaData = {
            transactionId: eventData.transactionId,
            phone: eventData.phone,
            bundle: bundle,
            error: eventData.error,
            timeStamp: new Date(),
            retryCount,
            superAgent,
            vendorRetryRecord,
            waitTime: await getCurrentWaitTimeForRequeryEvent(
                retryCount,
                superAgent,
            ),
        };

        await eventService.addScheduleRequeryEvent({
            timeStamp: new Date().toString(),
            waitTime: eventMetaData.waitTime,
        });

        await VendorPublisher.publishEventToScheduleDataRequery({
            scheduledMessagePayload: eventMetaData,
            timeStamp: new Date().toString(),
            delayInSeconds: eventMetaData.waitTime,
        });
    }

    static async triggerEventToRetryTransactionWithNewVendor({
        transaction,
        transactionEventService,
        phone,
        vendorRetryRecord,
    }: {
        transaction: Transaction;
        transactionEventService: DataTransactionEventService;
        phone: { phoneNumber: string; amount: number };
        vendorRetryRecord: VendorRetryRecord;
    }) {
        console.log({ vendorRetryRecord });
        let waitTime = await getCurrentWaitTimeForSwitchEvent(
            vendorRetryRecord.retryCount,
        );

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
                retryRecord[retryRecord.length - 1] = lastRecord;

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
                    ? generateRandonNumbers(12)
                    : generateRandomString(12),
            );
        } else {
            logger.warn("Switching to new vendor", meta);
            // Add new record to the retry record
        }

        if (!transaction.bundleId) {
            throw new CustomError("BundleId is required", meta);
        }

        const newVendor = useCurrentVendor
            ? currentVendor.vendor
            : await TokenHandlerUtil.getNextBestVendorForVendRePurchase(
                  transaction.bundleId,
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

        await transactionEventService.addDataPurchaseWithNewVendorEvent({
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

        if (newVendor === "IRECHARGE") {
            const irechargeVendor =
                await VendorModelService.viewSingleVendorByName("IRECHARGE");
            if (!irechargeVendor) {
                throw new CustomError("Irecharge vendor not found");
            }
        }

        async function countDownTimer(time: number): Promise<void> {
            return new Promise<void>((resolve) => {
                for (let i = time; i > 0; i--) {
                    setTimeout(
                        () => {
                            logger.warn(
                                `Reinitating transaction with vendor in ${i} seconds`,
                                {
                                    meta: { transactionId: transaction.id },
                                },
                            );
                            if (i === 1) {
                                resolve(); // Resolve the Promise when countdown is complete
                            }
                        },
                        (time - i) * 1000,
                    );
                }
            });
        }

        await countDownTimer(waitTime);

        await TransactionService.updateSingleTransaction(transaction.id, {
            superagent: newVendor,
            retryRecord,
            vendorReferenceId: newTransactionReference,
            reference: newTransactionReference,
            previousVendors: [...transaction.previousVendors, newVendor],
        });

        return await VendorPublisher.publishEventForDataPurchaseRetryFromVendorWithNewVendor(
            {
                partner: partner,
                transactionId: transaction.id,
                superAgent: newVendor,
                user: {
                    name: user.name as string,
                    email: user.email,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                },
                newVendor,
                phone: phone,
            },
        );
    }

    static async processVendRequest<T extends Vendor>({
        transaction,
        ...data
    }: TokenPurchaseData<T>) {
        const _data = {
            dataCode: data.dataCode,
            phoneNumber: data.phoneNumber,
            serviceType: data.serviceProvider,
            amount: data.amount,
            email: data.email,
            reference:
                transaction.superagent === "IRECHARGE"
                    ? transaction.vendorReferenceId
                    : transaction.reference,
            transactionId: data.transactionId,
        };

        if (transaction.superagent === "BAXI") {
            return await VendorService.purchaseData({
                data: _data,
                vendor: "BAXI",
            }).then((response) => ({ ...response, source: "BAXI" as const }));
        } else if (transaction.superagent === "IRECHARGE") {
            return await VendorService.purchaseData({
                data: _data,
                vendor: "IRECHARGE",
            }).then((response) => ({
                ...response,
                source: "IRECHARGE" as const,
            }));
        } else if (transaction.superagent === "BUYPOWERNG") {
            return await VendorService.purchaseData({
                data: _data,
                vendor: "BUYPOWERNG",
            }).then((response) => ({
                ...response,
                source: "BUYPOWERNG" as const,
            }));
        } else {
            throw new CustomError("Unsupported superagent");
        }
    }

    static async requeryTransactionFromVendor(transaction: Transaction) {
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
                    serviceType: "data",
                    transactionId: transaction.id,
                });
            default:
                throw new CustomError("Unsupported superagent");
        }
    }

    static async getNextBestVendorForVendRePurchase(
        bundleId: string,
        currentVendor: Transaction["superagent"],
        previousVendors: Transaction["previousVendors"] = [],
        amount: number,
    ): Promise<Transaction["superagent"]> {
        const dataBundle = await BundleService.viewSingleBundleById(bundleId);
        if (!dataBundle) throw new CustomError("Bundle not found");

        const vendorProducts = await dataBundle.$get("vendorProducts");

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

    static async getSortedVendorsAccordingToCommissionRate(
        bundleId: string,
        amount: number,
    ): Promise<Transaction["superagent"][]> {
        const dataBundle = await BundleService.viewSingleBundleById(bundleId);
        if (!dataBundle) throw new CustomError("Bundle not found");

        const vendorProducts = await dataBundle.$get("vendorProducts");

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

        return vendorRates.map(
            (vendorRate) => vendorRate.vendorName as Transaction["superagent"],
        );
    }

    static async getBestVendorForPurchase(
        bundleId: string,
        amount: number,
    ): Promise<Transaction["superagent"]> {
        const dataBundle = await BundleService.viewSingleBundleById(bundleId);
        if (!dataBundle) throw new CustomError("Bundle not found");

        const vendorProducts = await dataBundle.$get("vendorProducts");

        // Populate all te vendors
        const vendors = await Promise.all(
            vendorProducts.map(async (vendorProduct) => {
                const vendor = await vendorProduct.$get("vendor");
                if (!vendor) throw new CustomError("Vendor not found");
                vendorProduct.vendor = vendor;
                return vendor;
            }),
        );

        logger.info("Getting best vendor for purchase");
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
                    value:
                        vendorProduct.commission * amount + vendorProduct.bonus,
                };
            },
        );

        console.log({
            vendorRates,
            sortedVendorProductsAccordingToCommissionRate,
            vendorProducts,
        });
        return vendorRates[0].vendorName as Transaction["superagent"];
    }
}

class TokenHandler extends Registry {
    private static async handleDataRequest(
        data: PublisherEventAndParameters[TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        try {
            console.log({
                log: "New Data request",
                currentVendor: data.superAgent,
            });
            const logMeta = {
                meta: {
                    transactionId: data.transactionId,
                    bundle: data.bundle.id,
                },
            };
            logger.info("New Data request", logMeta);
            const transaction = await TransactionService.viewSingleTransaction(
                data.transactionId,
            );
            if (!transaction) {
                logger.error(
                    `Error fetching transaction with id ${data.transactionId}`,
                    logMeta,
                );
                return;
            }

            const { user, partner } = transaction;

            if (!transaction.bundleId) {
                throw new CustomError("BundleId is required");
            }

            const dataBundle = await BundleService.viewSingleBundleById(
                transaction.bundleId,
            );
            if (!dataBundle) throw new CustomError("Bundle not found");

            const product = await dataBundle.$get("product");
            if (!product) throw new CustomError("Product not found");

            const vendorProducts = await dataBundle.$get("vendorProducts");
            const vendorAndDiscos = await Promise.all(
                vendorProducts.map(async (vendorProduct) => {
                    const vendor = await vendorProduct.$get("vendor");
                    if (!vendor) throw new CustomError("Vendor not found");
                    return {
                        vendorName: vendor.name,
                        discoCode: (
                            vendorProduct.schemaData as VendorProductSchemaData.BUYPOWERNG
                        ).code,
                        dataCode: vendorProduct.schemaData.datacode,
                    };
                }),
            );

            console.log({ vendorAndDiscos });
            const vendorProduct = vendorAndDiscos.find(
                (data) => data.vendorName === transaction.superagent,
            );
            const vendorProductCode = vendorProduct?.dataCode;
            if (!vendorProductCode)
                throw new CustomError("Vendor product code not found");

            const disco = vendorProduct.discoCode;

            // find MTN, GLO, AIRTEL, 9MOBILE In the product code using regex
            const validMasterProductCode = product.masterProductCode.match(
                /MTN|GLO|AIRTEL|9MOBILE/g,
            );
            if (!validMasterProductCode)
                throw new CustomError("Product code not found");

            const network = transaction.networkProvider;
            if (!network) throw new CustomError("Network not found");

            // Purchase token from vendor
            logger.info("Processing vend request", logMeta);
            const tokenInfo = await DataHandlerUtil.processVendRequest({
                transaction: transaction as TokenPurchaseData["transaction"],
                phoneNumber: data.phone.phoneNumber,
                transactionId: transaction.id,
                email: user.email,
                amount: parseFloat(transaction.amount.toString()),
                dataCode: vendorProductCode as TokenPurchaseData["dataCode"],
                serviceProvider:
                    network as TokenPurchaseData["serviceProvider"],
            }).catch((e) => e);

            logger.info("Vend request processed", logMeta);
            const transactionEventService = new DataTransactionEventService(
                transaction,
                data.superAgent,
                partner.email,
                data.phone.phoneNumber,
            );

            // For irecharge airtime access token is gotten after vend, this token will be required to requery transaction later
            if (
                !(tokenInfo instanceof AxiosError) &&
                tokenInfo.source === "IRECHARGE"
            ) {
                // Update the access token in the retry record
                const vendorRetryRecord = transaction.retryRecord.slice().pop();

                let updatedRetryRecord = transaction.retryRecord;

                if (vendorRetryRecord) {
                    vendorRetryRecord.accessToken = tokenInfo.ref;
                    vendorRetryRecord.data = {
                        ...vendorRetryRecord.data,
                        accessToken: tokenInfo.ref,
                    };

                    updatedRetryRecord = transaction.retryRecord.map(
                        (record) => {
                            if (record.vendor === vendorRetryRecord.vendor) {
                                return vendorRetryRecord;
                            }

                            return record;
                        },
                    );
                } else {
                    logger.warn("Vendor retry record not found", logMeta);
                }

                await TransactionService.updateSingleTransaction(
                    transaction.id,
                    {
                        irechargeAccessToken: tokenInfo.ref,
                        retryRecord: updatedRetryRecord,
                    },
                );
            }

            await transactionEventService.addVendDataRequestedFromVendorEvent();
            const error = { code: 202, cause: TransactionErrorCause.UNKNOWN };
            const eventMessage = {
                phone: data.phone,
                disco: disco,
                transactionId: transaction.id,
                error: error,
            };

            console.log({ tokenInfo });
            const validationResponse =
                await ResponseValidationUtil.validateTransactionCondition({
                    requestType: "VENDREQUEST",
                    vendor: vendorProduct.vendorName,
                    httpCode:
                        tokenInfo instanceof AxiosError
                            ? (tokenInfo.response?.status.toString() as string)
                            : tokenInfo?.httpStatusCode.toString(),
                    responseObject:
                        tokenInfo instanceof AxiosError
                            ? tokenInfo.response?.data
                            : tokenInfo,
                    vendType: "PREPAID", // This isn't required for airtime, it won't be used when validating requests
                    // transactionType: transaction.transactionType,
                    disco: disco,
                    transactionId: transaction.id,
                    isError: tokenInfo instanceof AxiosError,
                });

            switch (validationResponse.action) {
                case -1:
                    logger.info(
                        "Transaction condition pending - Requery",
                        logMeta,
                    );
                    await DataHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                        {
                            eventData: {
                                ...eventMessage,
                                error: {
                                    ...eventMessage.error,
                                    cause: TransactionErrorCause.UNEXPECTED_ERROR,
                                },
                            },
                            bundle: data.bundle,
                            eventService: transactionEventService,
                            retryCount: 1,
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
                    await DataHandlerUtil.triggerEventToRetryTransactionWithNewVendor(
                        {
                            transaction,
                            transactionEventService,
                            phone: data.phone,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                case 1:
                    logger.info(
                        "Transaction condition passed - Complete",
                        logMeta,
                    );
                    await transactionEventService.addDataReceivedFromVendorEvent();
                    await DataHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
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
                            bundle: data.bundle,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord,
                        },
                    );
                    break;
                default:
                    logger.error("Transaction condition were not met", logMeta);
                    await DataHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
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
                            bundle: data.bundle,
                            superAgent: data.superAgent,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: { retryCount: 1 },
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
        data: PublisherEventAndParameters[TOPICS.GET_DATA_FROM_VENDOR_RETRY],
    ) {
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

        // Calculate the difference between the current timestamp and the previous timestamp in milliseconds
        const differenceInMilliseconds = now - previousTimestamp;

        // Convert milliseconds to hours
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

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

        const { user, partner } = transaction;

        if (!transaction.bundleId) {
            throw new CustomError("BundleId is required");
        }

        const dataBundle = await transaction.$get("bundle");
        if (!dataBundle) throw new CustomError("Bundle not found");

        const product = await dataBundle.$get("product");
        if (!product) throw new CustomError("Product not found");

        const vendorProducts = await dataBundle.$get("vendorProducts");
        const vendorAndDiscos = await Promise.all(
            vendorProducts.map(async (vendorProduct) => {
                const vendor = await vendorProduct.$get("vendor");
                if (!vendor) throw new CustomError("Vendor not found");
                return {
                    vendorName: vendor.name,
                    discoCode: (
                        vendorProduct.schemaData as VendorProductSchemaData.BUYPOWERNG
                    ).code,
                    dataCode: vendorProduct.schemaData.datacode,
                };
            }),
        );

        console.log({ vendorAndDiscos });
        const vendorProduct = vendorAndDiscos.find(
            (data) => data.vendorName === transaction.superagent,
        );
        const vendorProductCode = vendorProduct?.dataCode;
        if (!vendorProductCode)
            throw new CustomError("Vendor product code not found");

        const disco = vendorProduct.discoCode;

        // find MTN, GLO, AIRTEL, 9MOBILE In the product code using regex
        const validMasterProductCode = product.masterProductCode.match(
            /MTN|GLO|AIRTEL|9MOBILE/g,
        );
        if (!validMasterProductCode)
            throw new CustomError("Product code not found");

        const network = transaction.networkProvider;
        if (!network) throw new CustomError("Network not found");

        const transactionEventService = new DataTransactionEventService(
            transaction,
            data.superAgent,
            partner.email,
            data.phone.phoneNumber,
        );
        await transactionEventService.addDataTranasctionRequeryInitiated();

        // Requery transaction from provider and update transaction status
        /**
         * When requerying a transaction, it is important to note that,
         * the response code for 'Processing transaction' is 201,
         * this is different for the 'Processing transaction' when we initiate the purchase at the first instance.
         *
         * When initiating a purchase at the first instance and the transaction is being processed
         * or timedout, the response code is 202.
         *
         * When requerying a transaction, the response code is 201.
         */
        const requeryResult =
            await DataHandlerUtil.requeryTransactionFromVendor(
                transaction,
            ).catch((e) => e);
        const validationResponse =
            await ResponseValidationUtil.validateTransactionCondition({
                requestType: "REQUERY",
                vendor: vendorProduct.vendorName,
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
                disco,
                transactionId: transaction.id,
                isError: requeryResult instanceof AxiosError,
            });

        await transactionEventService.addDataTransactionRequery();
        const error = { code: 202, cause: TransactionErrorCause.UNKNOWN };
        const eventMessage = {
            phone: data.phone,
            disco: disco,
            transactionId: transaction.id,
            error: error,
        };

        switch (validationResponse.action) {
            case -1:
                logger.info("Transaction condition pending - Requery", logMeta);
                await DataHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                    {
                        eventData: {
                            ...eventMessage,
                            error: {
                                ...eventMessage.error,
                                cause: TransactionErrorCause.UNEXPECTED_ERROR,
                            },
                        },
                        bundle: data.bundle,
                        eventService: transactionEventService,
                        retryCount: 1,
                        superAgent: data.superAgent,
                        transactionTimedOutFromBuypower: false,
                        vendorRetryRecord: data.vendorRetryRecord,
                    },
                );
                break;
            case 0:
                logger.error("Transaction condition failed - Retry", logMeta);
                await DataHandlerUtil.triggerEventToRetryTransactionWithNewVendor(
                    {
                        transaction,
                        transactionEventService,
                        phone: data.phone,
                        vendorRetryRecord: data.vendorRetryRecord,
                    },
                );
                break;
            case 1:
                logger.info("Transaction condition passed - Complete", logMeta);
                await transactionEventService.addDataReceivedFromVendorRequeryEvent();
                await VendorPublisher.publishEventForDataReceivedFromVendor({
                    phone: data.phone,
                    transactionId: transaction.id,
                    user: {
                        name: transaction.user.name as string,
                        email: transaction.user.email,
                        address: transaction.user.address,
                        phoneNumber: transaction.user.phoneNumber,
                    },
                    partner: {
                        email: transaction.partner.email,
                    },
                    bundle: data.bundle,
                });

                break;
            default:
                logger.error("Transaction condition were not met", logMeta);
                await DataHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
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
                        bundle: data.bundle,
                        superAgent: data.superAgent,
                        transactionTimedOutFromBuypower: false,
                        vendorRetryRecord: { retryCount: 1 },
                    },
                );
                break;
        }
    }

    private static async scheduleRequeryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_REQUERY_FOR_DATA_TRANSACTION],
    ) {
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

            const transactionEventService = new DataTransactionEventService(
                existingTransaction,
                existingTransaction.superagent,
                data.scheduledMessagePayload.phone.phoneNumber,
                data.scheduledMessagePayload.superAgent,
            );
            await transactionEventService.addGetDataTokenRequestedFromVendorRequeryEvent(
                {
                    cause: TransactionErrorCause.RESCHEDULED_BEFORE_WAIT_TIME,
                    code: 202,
                },
                data.scheduledMessagePayload.retryCount + 1,
            );

            return await VendorPublisher.publishEventForGetDataRequestedFromVendorRequery(
                data.scheduledMessagePayload,
            );
        }

        // Change error cause to RESCHEDULED_BEFORE_WAIT_TIME
        data.scheduledMessagePayload.error.cause =
            TransactionErrorCause.RESCHEDULED_BEFORE_WAIT_TIME;

        // logger.info("Rescheduling requery for transaction", { meta: { transactionId: data.scheduledMessagePayload.transactionId } })
        // Else, schedule a new event to requery transaction from vendor
        return await VendorPublisher.publishEventToScheduleDataRequery({
            scheduledMessagePayload: data.scheduledMessagePayload,
            timeStamp: data.timeStamp,
            delayInSeconds: data.delayInSeconds,
            log: 0,
        });
    }

    private static async scheduleRetryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_DATA_TRANSACTION],
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

            const transactionEventService = new DataTransactionEventService(
                existingTransaction,
                existingTransaction.superagent,
                data.scheduledMessagePayload.partner.email,
                data.scheduledMessagePayload.phone.phoneNumber,
            );
            await transactionEventService.addGetDataFromVendorRetryEvent(
                {
                    cause: TransactionErrorCause.RESCHEDULED_BEFORE_WAIT_TIME,
                    code: 202,
                },
                data.scheduledMessagePayload.retryCount + 1,
            );

            await TransactionService.updateSingleTransaction(
                data.scheduledMessagePayload.transactionId,
                {
                    superagent: data.scheduledMessagePayload.newVendor,
                    retryRecord: data.scheduledMessagePayload.retryRecord,
                    vendorReferenceId:
                        data.scheduledMessagePayload.newTransactionReference,
                    reference:
                        data.scheduledMessagePayload.newTransactionReference,
                    irechargeAccessToken:
                        data.scheduledMessagePayload.irechargeAccessToken,
                    previousVendors:
                        data.scheduledMessagePayload.previousVendors,
                },
            );

            return await VendorPublisher.publishEventForDataPurchaseRetryFromVendorWithNewVendor(
                data.scheduledMessagePayload,
            );
        }

        // logger.info("Rescheduling retry for transaction", { meta: { transactionId: data.scheduledMessagePayload.transactionId } })
        // Else, schedule a new event to requery transaction from vendor
        return await VendorPublisher.publishEventToScheduleDataRetry({
            scheduledMessagePayload: data.scheduledMessagePayload,
            timeStamp: data.timeStamp,
            delayInSeconds: data.delayInSeconds,
            log: 0,
        });
    }

    static registry = {
        [TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER]: this.handleDataRequest,
        [TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR]: this.handleDataRequest,
        [TOPICS.GET_DATA_FROM_VENDOR_REQUERY]: this.requeryTransaction,
        [TOPICS.SCHEDULE_REQUERY_FOR_DATA_TRANSACTION]:
            this.scheduleRequeryTransaction,
        [TOPICS.SCHEDULE_RETRY_FOR_DATA_TRANSACTION]:
            this.scheduleRetryTransaction,
    };
}

export default class DataConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor(
            TokenHandler.registry,
            "DATA_CONSUMER",
        );
        super(messageProcessor);
    }
}
