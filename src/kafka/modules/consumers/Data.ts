import { Axios, AxiosError } from "axios";
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
    generateVendorReference,
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
    getCurrentWaitTimeForSwitchEvent,
} from "./Token";
import { parse } from "path";
import { timeStamp } from "console";
import { IBundle } from "../../../models/Bundle.model";
import { randomUUID } from "crypto";
import EmailService, { EmailTemplate } from "../../../utils/Email";
import { string } from "zod";

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
    requeryCount: number;
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
    retryCountBeforeSwitchingVendor: 3,
    testForSwitchingVendor: true,
};

const TEST_FAILED = NODE_ENV === "production" ? false : false; // TOGGLE - Will simulate failed transaction

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT,
};

export class DataHandlerUtil {
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
                  transaction.bundleId as string,
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

        // const isFirstRetry = initialRetryRecord[0].reference.lVending request with BAXIength === 2;
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
        vendorRetryRecord,
        bundle,
    }: TriggerRequeryTransactionTokenProps) {
        // Check if the transaction has hit the requery limit
        // If yes, flag transaction
        const logMeta = { meta: { transactionId: eventData.transactionId } };
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

        const transaction = await TransactionService.viewSingleTransaction(
            eventData.transactionId,
        );
        if (!transaction)
            throw new CustomError("Transaction not found", {
                transactionId: eventData.transactionId,
            });

        logger.info(
            `Retrying transaction with id ${eventData.transactionId} from vendor`,
            logMeta,
        );
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
        manual,
        transactionEventService,
        phone,
        bundle,
        vendorRetryRecord,
    }: {
        transaction: Transaction;
        manual?: boolean,
        transactionEventService: DataTransactionEventService;
        phone: { phoneNumber: string; amount: number };
        bundle: IBundle;
        vendorRetryRecord: VendorRetryRecord;
    }) {
        console.log({ vendorRetryRecord });
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

        if (!transaction.bundleId) {
            throw new CustomError("BundleId is required", meta);
        }

        await transactionEventService.addDataPurchaseWithNewVendorEvent({
            currentVendor: transaction.superagent,
            newVendor,
        });

        if (manual) {
            await transactionEventService.addGetDataFromVendorRetryEvent(
                {
                    cause: TransactionErrorCause.MANUAL_RETRY_TRIGGERED,
                    code: 200,
                },
                1,
            );

            return await VendorPublisher.publshEventForDataPurchaseInitiate({
                transactionId: transaction.id,
                phone: {
                    phoneNumber: phone.phoneNumber,
                    amount: phone.amount,
                },
                bundle: bundle,
                user: {
                    name: user.name as string,
                    email: user.email,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                },
                partner: {
                    email: partner.email,
                },
                superAgent: transaction.retryRecord[0]?.vendor,
                vendorRetryRecord: {
                    retryCount: 1,
                },
            });
        }

        await transactionEventService.addScheduleRetryEvent({
            waitTime,
            timeStamp: new Date().toString(),
            retryRecord: newVendorEntry
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
                bundle,
                vendorRetryRecord:retryRecord[retryRecord.length - 1], 
                newVendor,
                phone: phone,
            },
        );
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
                dataCode: data.dataCode,
                phoneNumber: data.phoneNumber,
                serviceType: data.serviceProvider,
                amount: data.amount,
                email: data.email,
                reference: updatedTraansaction.reference,
                transactionId: data.transactionId,
            };

            const vendResponse = await VendorService.purchaseData({
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
        } catch (error: any) {
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
            }).catch((e) => ({
                response: e as AxiosError | Error
            }));

            logger.info("Vend request processed", logMeta);
            const transactionEventService = new DataTransactionEventService(
                transaction,
                data.superAgent,
                partner.email,
                data.phone.phoneNumber,
            );

            // For irecharge airtime access token is gotten after vend, this token will be required to requery transaction later
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

            const updatedTraansaction =
                await TransactionService.viewSingleTransaction(
                    data.transactionId,
                );
            if (!updatedTraansaction) {
                throw new CustomError("Transaction not found");
            }

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
                            requeryCount: 1,
                            retryCount: 1,
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
                    await DataHandlerUtil.triggerEventToRetryTransactionWithNewVendor(
                        {
                            transaction: updatedTraansaction,
                            transactionEventService,
                            phone: data.phone,
                            bundle: data.bundle,
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
                            requeryCount: 1,
                            superAgent: updatedTraansaction.superagent,
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
                            requeryCount: 1,
                            bundle: data.bundle,
                            superAgent: updatedTraansaction.superagent,
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

        const requeryResult = await DataHandlerUtil.processRequeryRequest(
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
                        retryCount: data.retryCount,
                        requeryCount: data.requeryCount,
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
                        bundle: data.bundle,
                        transactionEventService,
                        phone: data.phone,
                        vendorRetryRecord: data.vendorRetryRecord,
                    },
                );
                break;
            case 1:
                logger.info("Transaction condition passed - Complete", logMeta);
            await TransactionService.updateSingleTransaction(
                        transaction.id,
                        { status: Status.COMPLETE },
                    );
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
                        retryCount: data.retryCount,
                        requeryCount: data.requeryCount,
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
                    TOPICS.DATA_RECEIVED_FROM_VENDOR_REQUERY,
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

            return await VendorPublisher.publishEventForDataPurchaseRetryFromVendorWithNewVendor(
                data.scheduledMessagePayload,
            );
        }

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
