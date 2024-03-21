import { AxiosError } from "axios";
import { Status } from "../../../models/Transaction.model";
import Meter from "../../../models/Meter.model";
import Transaction from "../../../models/Transaction.model";
import PowerUnitService from "../../../services/PowerUnit.service";
import TransactionService from "../../../services/Transaction.service";
import TransactionEventService, { DataTransactionEventService } from "../../../services/TransactionEvent.service";
import { DISCO_LOGO, LOGO_URL, MAX_REQUERY_PER_VENDOR, NODE_ENV } from "../../../utils/Constants";
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
import VendorService, { DataPurchaseResponse, ElectricityRequeryResponse, Prettify, SuccessResponseForBuyPowerRequery, Vendor } from "../../../services/VendorApi.service";
import { generateRandomString, generateRandomToken, generateRandonNumbers } from "../../../utils/Helper";
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
        }
    },
    transactionTimedOutFromBuypower: boolean;
    superAgent: Transaction['superagent'];
    retryCount: number;
    vendorRetryRecord: VendorRetryRecord;
}

interface TokenPurchaseData<T = Vendor> {
    transaction: Omit<Transaction, 'superagent'> & { superagent: T },
    phoneNumber: string,
    email: string,
    amount: number,
    serviceProvider: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE',
    dataCode: string
}

interface ProcessVendRequestReturnData {
    // 'BUYPOWERNG': Awaited<ReturnType<typeof BuypowerApi.Data.purchase>>,
    'IRECHARGE': Awaited<ReturnType<typeof IRechargeApi.Data.purchase>>,
}

const retry = {
    count: 0,
    limit: 5,
    limitToStopRetryingWhenTransactionIsSuccessful: 20,
    retryCountBeforeSwitchingVendor: 4,
    testForSwitchingVendor: true,
}

const TEST_FAILED = NODE_ENV === 'production' ? false : false // TOGGLE - Will simulate failed transaction

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT
}

export async function getCurrentWaitTimeForRequeryEvent(retryCount: number) {
    // Use geometric progression  calculate wait time, where R = 2
    const defaultValues = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480, 40960, 81920, 163840, 327680, 655360, 1310720, 2621440, 5242880]
    const timesToRetry = await WaitTimeService.getWaitTime() ?? defaultValues

    if (retryCount > timesToRetry.length) {
        return timesToRetry[timesToRetry.length - 1]
    }

    return timesToRetry[retryCount]
}


export async function getCurrentWaitTimeForSwitchEvent(retryCount: number) {
    // Use geometric progression  calculate wait time, where R = 2
    const defaultValues = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480, 40960, 81920, 163840, 327680, 655360, 1310720, 2621440, 5242880]
    const timesToRetry = await WaitTimeService.getWaitTime() ?? defaultValues

    if (retryCount >= timesToRetry.length) {
        return timesToRetry[timesToRetry.length - 1]
    }

    return timesToRetry[retryCount - 1]
}

export class TokenHandlerUtil {
    static async triggerEventToRequeryTransactionTokenFromVendor({
        eventService,
        eventData,
        transactionTimedOutFromBuypower,
        retryCount,
        superAgent,
        vendorRetryRecord
    }: TriggerRequeryTransactionTokenProps) {
        // Check if the transaction has hit the requery limit
        // If yes, flag transaction
        const logMeta = { meta: { transactionId: eventData.transactionId } }
        if (retryCount >= MAX_REQUERY_PER_VENDOR) {
            logger.info(`Flagged transaction with id ${eventData.transactionId} after hitting requery limit`, logMeta)
            return await TransactionService.updateSingleTransaction(eventData.transactionId, { status: Status.FLAGGED })
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
        transactionTimedOutFromBuypower && (await eventService.addRequestTimedOutEvent());

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
            logMeta
        );

        await eventService.addGetDataFromVendorRetryEvent(_eventMessage.error, retryCount);
        const eventMetaData = {
            transactionId: eventData.transactionId,
            phone: eventData.phone,
            error: eventData.error,
            timeStamp: new Date(),
            retryCount,
            superAgent,
            vendorRetryRecord,
            waitTime: await getCurrentWaitTimeForRequeryEvent(retryCount)
        };

        // Start timer to requery transaction at intervals
        async function countDownTimer(time: number): Promise<void> {
            return new Promise<void>((resolve) => {
                for (let i = time; i > 0; i--) {
                    setTimeout(() => {
                        logger.warn(`Reinitating transaction with vendor in ${i} seconds`, {
                            meta: { transactionId: eventMetaData.transactionId }
                        });
                        if (i === 1) {
                            resolve(); // Resolve the Promise when countdown is complete
                        }
                    }, (time - i) * 1000);
                }
            });
        }
        await countDownTimer(eventMetaData.waitTime);

        // Publish event in increasing intervals of seconds i.e 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
        // TODO: Use an external service to schedule this task
        await VendorPublisher.publishEventForGetDataFromVendorRetry(
            eventMetaData,
        );
    }

    static async triggerEventToRetryTransactionWithNewVendor(
        {
            transaction, transactionEventService, phone,
            vendorRetryRecord
        }: {
            transaction: Transaction,
            transactionEventService: DataTransactionEventService,
            phone: { phoneNumber: string, amount: number },
            vendorRetryRecord: VendorRetryRecord
        }
    ) {
        console.log({ vendorRetryRecord })
        let waitTime = await getCurrentWaitTimeForSwitchEvent(vendorRetryRecord.retryCount)

        const meta = {
            transactionId: transaction.id,
        }

        // Attempt purchase from new vendor
        if (!transaction.bankRefId) throw new CustomError('BankRefId not found', meta)

        let retryRecord = transaction.retryRecord

        retryRecord = retryRecord.length === 0
            ? [{ vendor: transaction.superagent, retryCount: 1, reference: [transaction.reference], attempt: 1 }]
            : retryRecord
        // Make sure to use the same vendor thrice before switching to another vendor
        let currentVendor = retryRecord[retryRecord.length - 1]

        console.log({ currentVendor, retryRecord })
        let useCurrentVendor = false
        if (currentVendor.vendor === transaction.superagent) {
            if (currentVendor.retryCount < retry.retryCountBeforeSwitchingVendor) {
                // Update the retry record in the transaction
                // Get the last record where this vendor was used
                const lastRecord = retryRecord[retryRecord.length - 1]
                lastRecord.retryCount = lastRecord.retryCount + 1
                retryRecord[retryRecord.length - 1] = lastRecord

                // Update the transaction
                await TransactionService.updateSingleTransaction(transaction.id, { retryRecord })

                useCurrentVendor = true
                logger.info('Using current vendor', meta)
            }

            // Check for the reference used in the last retry record
            retryRecord[retryRecord.length - 1].reference.push(currentVendor.vendor === 'IRECHARGE' ? generateRandonNumbers(12) : generateRandomString(12))
        } else {
            logger.warn('Switching to new vendor', meta)
            // Add new record to the retry record
        }

        if (!transaction.bundleId) {
            throw new CustomError('BundleId is required', meta)
        }

        const newVendor = useCurrentVendor ? currentVendor.vendor : await TokenHandlerUtil.getNextBestVendorForVendRePurchase(transaction.bundleId, transaction.superagent, transaction.previousVendors, parseFloat(transaction.amount))
        if (newVendor != currentVendor.vendor || currentVendor.retryCount > retry.retryCountBeforeSwitchingVendor) {
            // Add new record to the retry record
            currentVendor = {
                vendor: newVendor,
                retryCount: 1,
                reference: [currentVendor.reference[currentVendor.reference.length - 1]],
                attempt: 1
            }
            retryRecord.push(currentVendor)
            waitTime = await getCurrentWaitTimeForSwitchEvent(currentVendor.retryCount)
        }

        await transactionEventService.addDataPurchaseWithNewVendorEvent({ currentVendor: transaction.superagent, newVendor })

        const user = await transaction.$get('user')
        if (!user) throw new CustomError('User not found for transaction', meta)

        const partner = await transaction.$get('partner')
        if (!partner) throw new CustomError('Partner not found for transaction', meta)

        retry.count = 0

        const newTransactionReference = retryRecord[retryRecord.length - 1].reference[retryRecord[retryRecord.length - 1].reference.length - 1]

        if (newVendor === 'IRECHARGE') {
            const irechargeVendor = await VendorModelService.viewSingleVendorByName('IRECHARGE')
            if (!irechargeVendor) {
                throw new CustomError('Irecharge vendor not found')
            }
        }

        async function countDownTimer(time: number): Promise<void> {
            return new Promise<void>((resolve) => {
                for (let i = time; i > 0; i--) {
                    setTimeout(() => {
                        logger.warn(`Reinitating transaction with vendor in ${i} seconds`, {
                            meta: { transactionId: transaction.id }
                        });
                        if (i === 1) {
                            resolve(); // Resolve the Promise when countdown is complete
                        }
                    }, (time - i) * 1000);
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
        })


        return await VendorPublisher.publishEventForDataPurchaseRetryFromVendorWithNewVendor({
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
        })
    }

    static async processVendRequest<T extends Vendor>({ transaction, ...data }: TokenPurchaseData<T>) {
        const _data = {
            dataCode: data.dataCode,
            phoneNumber: data.phoneNumber,
            serviceType: data.serviceProvider,
            amount: data.amount,
            email: data.email,
            reference: transaction.reference,
        }

        if (transaction.superagent === "BAXI") {
            return await VendorService.purchaseData({ data: _data, vendor: 'BAXI' }).then(response => ({ ...response, source: 'BAXI' as const }))
        } else if (transaction.superagent === "IRECHARGE") {
            return await VendorService.purchaseData({ data: _data, vendor: 'IRECHARGE' }).then(response => ({ ...response, source: 'IRECHARGE' as const }))
        } else if (transaction.superagent === "BUYPOWERNG") {
            return await VendorService.purchaseData({ data: _data, vendor: 'BUYPOWERNG' }).then(response => ({ ...response, source: 'BUYPOWERNG' as const }))
        } else {
            throw new CustomError('Unsupported superagent')
        }
    }

    static async requeryTransactionFromVendor(transaction: Transaction) {
        switch (transaction.superagent) {
            case 'BAXI':
                return await VendorService.baxiRequeryTransaction({ reference: transaction.reference, transactionId: transaction.id })
            case 'BUYPOWERNG':
                return await VendorService.buyPowerRequeryTransaction({ reference: transaction.reference, transactionId: transaction.id })
            case 'IRECHARGE':
                return await VendorService.irechargeRequeryTransaction({ accessToken: transaction.irechargeAccessToken, serviceType: 'data', transactionId: transaction.id })
            default:
                throw new CustomError('Unsupported superagent')
        }
    }

    static async getNextBestVendorForVendRePurchase(bundleId: string, currentVendor: Transaction['superagent'], previousVendors: Transaction['previousVendors'] = [], amount: number): Promise<Transaction['superagent']> {
        const dataBundle = await BundleService.viewSingleBundleById(bundleId)
        if (!dataBundle) throw new CustomError('Bundle not found')

        const vendorProducts = await dataBundle.$get('vendorProducts')

        // Populate all te vendors
        const vendors = await Promise.all(vendorProducts.map(async vendorProduct => {
            const vendor = await vendorProduct.$get('vendor')
            if (!vendor) throw new CustomError('Vendor not found')
            vendorProduct.vendor = vendor
            return vendor
        }))

        // Check other vendors, sort them according to their commission rates
        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate
        // If the next vendor has been used before, switch to the next vendor with the next highest commission rate
        // If all the vendors have been used before, switch to the vendor with the highest commission rate

        const sortedVendorProductsAccordingToCommissionRate = vendorProducts.sort((a, b) => ((b.commission * amount) + b.bonus) - ((a.commission * amount) + a.bonus))
        const vendorRates = sortedVendorProductsAccordingToCommissionRate.map(vendorProduct => {
            const vendor = vendorProduct.vendor
            if (!vendor) throw new CustomError('Vendor not found')

            return {
                vendorName: vendor.name,
                commission: vendorProduct.commission,
                bonus: vendorProduct.bonus
            }
        })

        const sortedOtherVendors = vendorRates.filter(vendorRate => vendorRate.vendorName !== currentVendor)

        nextBestVendor: for (const vendorRate of sortedOtherVendors) {
            if (!previousVendors.includes(vendorRate.vendorName)) {
                console.log({ currentVendor, newVendor: vendorRate.vendorName })

                return vendorRate.vendorName as Transaction['superagent']
            }
        }

        if (previousVendors.length === vendors.length) {
            // If all vendors have been used before, switch to the vendor with the highest commission rate
            return vendorRates.sort((a, b) => ((b.commission * amount) + b.bonus) - ((a.commission * amount) + a.bonus))[0].vendorName as Transaction['superagent']
        }

        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate

        console.log({ currentVendor, newVendor: sortedOtherVendors[0].vendorName })

        return sortedOtherVendors[0].vendorName as Transaction['superagent']
    }

    static async getSortedVendorsAccordingToCommissionRate(bundleId: string, amount: number): Promise<Transaction['superagent'][]> {
        const dataBundle = await BundleService.viewSingleBundleById(bundleId)
        if (!dataBundle) throw new CustomError('Bundle not found')

        const vendorProducts = await dataBundle.$get('vendorProducts')

        // Populate all te vendors
        const vendors = await Promise.all(vendorProducts.map(async vendorProduct => {
            const vendor = await vendorProduct.$get('vendor')
            if (!vendor) throw new CustomError('Vendor not found')
            vendorProduct.vendor = vendor
            return vendor
        }))

        // Check other vendors, sort them according to their commission rates
        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate
        // If the next vendor has been used before, switch to the next vendor with the next highest commission rate
        // If all the vendors have been used before, switch to the vendor with the highest commission rate

        const sortedVendorProductsAccordingToCommissionRate = vendorProducts.sort((a, b) => ((b.commission * amount) + b.bonus) - ((a.commission * amount) + a.bonus))
        const vendorRates = sortedVendorProductsAccordingToCommissionRate.map(vendorProduct => {
            const vendor = vendorProduct.vendor
            if (!vendor) throw new CustomError('Vendor not found')
            return {
                vendorName: vendor.name,
                commission: vendorProduct.commission,
                bonus: vendorProduct.bonus
            }
        })

        return vendorRates.map(vendorRate => vendorRate.vendorName as Transaction['superagent'])
    }

    static async getBestVendorForPurchase(bundleId: string, amount: number): Promise<Transaction['superagent']> {
        const dataBundle = await BundleService.viewSingleBundleById(bundleId)
        if (!dataBundle) throw new CustomError('Bundle not found')

        const vendorProducts = await dataBundle.$get('vendorProducts')

        // Populate all te vendors
        const vendors = await Promise.all(vendorProducts.map(async vendorProduct => {
            const vendor = await vendorProduct.$get('vendor')
            if (!vendor) throw new CustomError('Vendor not found')
            vendorProduct.vendor = vendor
            return vendor
        }))

        logger.info('Getting best vendor for purchase')
        // Check other vendors, sort them according to their commission rates
        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate
        // If the next vendor has been used before, switch to the next vendor with the next highest commission rate
        // If all the vendors have been used before, switch to the vendor with the highest commission rate

        const sortedVendorProductsAccordingToCommissionRate = vendorProducts.sort((a, b) => ((b.commission * amount) + b.bonus) - ((a.commission * amount) + a.bonus))

        const vendorRates = sortedVendorProductsAccordingToCommissionRate.map(vendorProduct => {
            const vendor = vendorProduct.vendor
            if (!vendor) throw new CustomError('Vendor not found')
            return {
                vendorName: vendor.name,
                commission: vendorProduct.commission,
                bonus: vendorProduct.bonus,
                value: (vendorProduct.commission * amount) + vendorProduct.bonus
            }
        })

        console.log({ vendorRates, sortedVendorProductsAccordingToCommissionRate, vendorProducts })
        return vendorRates[0].vendorName as Transaction['superagent']
    }
}

class TokenHandler extends Registry {
    private static async retryDataPurchaseWithNewVendor(data: PublisherEventAndParameters[TOPICS.RETRY_DATA_PURCHASE_FROM_NEW_VENDOR]) {
        const transaction = await TransactionService.viewSingleTransaction(data.transactionId);
        if (!transaction) {
            throw new CustomError(`Error fetching transaction with id ${data.transactionId}`);
        }
        if (!transaction.bankRefId) {
            throw new CustomError('BankRefId not found')
        }

        await TransactionService.updateSingleTransaction(transaction.id, { superagent: data.newVendor })
        const transactionEventService = new DataTransactionEventService(transaction, data.newVendor, data.partner.email, data.phone.phoneNumber);
        await transactionEventService.addDataPurchaseInitiatedEvent({ amount: transaction.amount });
        await VendorPublisher.publshEventForDataPurchaseInitiate({
            phone: data.phone,
            user: data.user,
            partner: data.partner,
            transactionId: transaction.id,
            superAgent: data.newVendor,
            vendorRetryRecord: transaction.retryRecord[transaction.retryRecord.length - 1]
        })
    }

    private static async handleDataRequest(
        data: PublisherEventAndParameters[TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        console.log({
            log: 'New Data request',
            currentVendor: data.superAgent
        })
        const logMeta = { meta: { transactionId: data.transactionId } }
        logger.info('New Data request', logMeta)
        const transaction = await TransactionService.viewSingleTransaction(
            data.transactionId,
        );
        if (!transaction) {
            logger.error(
                `Error fetching transaction with id ${data.transactionId}`, logMeta
            );
            return;
        }

        const { user, partner } = transaction;

        if (!transaction.bundleId) {
            throw new CustomError('BundleId is required')
        }

        const dataBundle = await BundleService.viewSingleBundleById(transaction.bundleId)
        if (!dataBundle) throw new CustomError('Bundle not found')

        const product = await dataBundle.$get('product')
        if (!product) throw new CustomError('Product not found')

        const vendorProducts = await dataBundle.$get('vendorProducts')
        const vendorAndDiscos = await Promise.all(vendorProducts.map(async vendorProduct => {
            const vendor = await vendorProduct.$get('vendor')
            if (!vendor) throw new CustomError('Vendor not found')
            return {
                vendorName: vendor.name,
                discoCode: (vendorProduct.schemaData as VendorProductSchemaData.BUYPOWERNG).code,
                dataCode: vendorProduct.schemaData.datacode
            }
        }))

        const vendorProductCode = vendorAndDiscos.find(vendorAndDisco => vendorAndDisco.vendorName === transaction.superagent)?.dataCode
        if (!vendorProductCode) throw new CustomError('Vendor product code not found')

        // find MTN, GLO, AIRTEL, 9MOBILE In the product code using regex
        const validMasterProductCode = product.masterProductCode.match(/MTN|GLO|AIRTEL|9MOBILE/g)
        if (!validMasterProductCode) throw new CustomError('Product code not found')

        const mtn = product.masterProductCode.includes('MTN')
        const glo = product.masterProductCode.includes('GLO')
        const airtel = product.masterProductCode.includes('ATEL')
        const nineMobile = product.masterProductCode.includes('9MB')

        const network = mtn ? 'MTN' : glo ? 'GLO' : airtel ? 'AIRTEL' : nineMobile ? '9MOBILE' : null
        if (!network) throw new CustomError('Network not found')

        // Purchase token from vendor
        logger.info('Processing vend request', logMeta)
        const tokenInfo = await TokenHandlerUtil.processVendRequest({
            transaction: transaction as TokenPurchaseData['transaction'],
            phoneNumber: data.phone.phoneNumber,
            email: user.email,
            amount: parseFloat(transaction.amount),
            dataCode: vendorProductCode as TokenPurchaseData['dataCode'],
            serviceProvider: network as TokenPurchaseData['serviceProvider'],
        }).catch(e => e)


        logger.info('Vend request processed', logMeta)
        const vendResult = await TokenHandlerUtil.requeryTransactionFromVendor(transaction).catch(e => e)
        const vendResultFromBuypower = vendResult as ElectricityRequeryResponse['BUYPOWERNG']
        const vendResultFromIrecharge = vendResult as ElectricityRequeryResponse['IRECHARGE']
        const vendResultFromBaxi = vendResult as ElectricityRequeryResponse['BAXI']

        const error = { code: 202, cause: TransactionErrorCause.UNKNOWN }
        const transactionEventService = new DataTransactionEventService(
            transaction,
            data.superAgent,
            partner.email,
            data.phone.phoneNumber,
        );
        await transactionEventService.addVendDataRequestedFromVendorEvent();

        let requeryFromNewVendor = false
        let requeryFromSameVendor = false
        let transactionFailed = !['00', '15', '43'].includes(tokenInfo.status)

        const transactionTimedOutFromIrecharge = vendResultFromIrecharge.source === 'IRECHARGE' ? ['15', '43'].includes(vendResultFromIrecharge.status) : false
        let transactionTimedOutFromBuypower = vendResultFromBuypower.source === 'BUYPOWERNG' ? vendResultFromBuypower.status === true && vendResultFromBuypower.data.responseCode == 202 : false // TODO: Add check for when transaction timeout from baxi
        const transactionTimedOutFromBaxi = vendResultFromBaxi.source === 'BAXI' ? vendResultFromBaxi.status === true && vendResultFromBaxi.data.statusCode === '0' : false
        const transactionTimedOut = transactionTimedOutFromBuypower || transactionTimedOutFromIrecharge || transactionTimedOutFromBaxi


        requeryFromSameVendor = transactionTimedOut
        if (TEST_FAILED) {
            const totalRetries = (retry.retryCountBeforeSwitchingVendor * transaction.previousVendors.length - 1) + retry.count + 1

            // If we are in test mode, and the transaction is successful, after a number of retries, we should assume the transaction is successful
            const shouldAssumeToBeSuccessful = (totalRetries > retry.limitToStopRetryingWhenTransactionIsSuccessful) && TEST_FAILED
            requeryFromSameVendor = !shouldAssumeToBeSuccessful
        }

        if (requeryFromNewVendor) {
            return await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({ phone: data.phone, transaction: transaction, transactionEventService, vendorRetryRecord: data.vendorRetryRecord })
        }

        const eventMessage = {
            phone: {
                amount: parseFloat(transaction.amount),
                phoneNumber: data.phone.phoneNumber,
            },
            transactionId: transaction.id,
            error: {
                code: (tokenInfo instanceof AxiosError
                    ? tokenInfo.response?.data?.responseCode
                    : undefined) as number | 0,
                cause: TransactionErrorCause.UNKNOWN,
            },
        }

        if (requeryFromSameVendor) {
            return await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                {
                    eventService: transactionEventService,
                    eventData: eventMessage,
                    transactionTimedOutFromBuypower,
                    superAgent: transaction.superagent,
                    retryCount: 1,
                    vendorRetryRecord: transaction.retryRecord[transaction.retryRecord.length - 1]
                },
            );
        }

        const transactionSuccessfulForBuyPower = tokenInfo.source === 'BUYPOWERNG' ? vendResultFromBuypower.responseCode === 200 : false
        const transactionSuccessfulForIrecharge = tokenInfo.source === 'IRECHARGE' ? tokenInfo.status === '00' : false
        const transactionSuccessfulForBaxi = tokenInfo.source === 'BAXI' ? tokenInfo.code === 200 : false
        const transactionSuccessFul = transactionSuccessfulForBuyPower || transactionSuccessfulForIrecharge || transactionSuccessfulForBaxi


        transactionFailed = TEST_FAILED ? retry.count > retry.retryCountBeforeSwitchingVendor : transactionFailed // TOGGLE - Will simulate failed irecharge transaction
        if (transactionFailed) requeryFromNewVendor = true
        else {
            requeryFromSameVendor = true
            eventMessage.error.code = tokenInfo.status === '00' ? 200 : 202
            eventMessage.error.cause = tokenInfo.status === '00' ? TransactionErrorCause.TRANSACTION_TIMEDOUT : TransactionErrorCause.TRANSACTION_FAILED
        }

        if (!transactionSuccessFul) {
            logger.error('Transaction unsuccessful', logMeta)
            if (requeryFromNewVendor) {
                return await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({ phone: data.phone, transaction, transactionEventService, vendorRetryRecord: data.vendorRetryRecord })
            }

            return await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                {
                    eventService: transactionEventService,
                    eventData: eventMessage,
                    vendorRetryRecord: transaction.retryRecord[transaction.retryRecord.length - 1],
                    retryCount: 1,
                    superAgent: data.superAgent,
                    transactionTimedOutFromBuypower: true,
                },
            );
        }

        await transaction.update({ irechargeAccessToken: tokenInfo.source === 'IRECHARGE' ? tokenInfo.ref : undefined })

        await transactionEventService.addDataReceivedFromVendorEvent();
        return await VendorPublisher.publishEventForDataReceivedFromVendor({
            transactionId: transaction!.id,
            user: {
                name: user.name as string,
                email: user.email,
                address: user.address,
                phoneNumber: user.phoneNumber,
            },
            partner: {
                email: partner.email,
            },
            phone: data.phone
        });
    }

    private static async handleDataRecievd(
        data: PublisherEventAndParameters[TOPICS.DATA_RECEIVED_FROM_VENDOR],
    ) {
        const transaction = await TransactionService.viewSingleTransaction(
            data.transactionId,
        );
        if (!transaction) {
            throw new CustomError(
                `Error fetching transaction with id ${data.transactionId}`,
            );
        }

        // Check if transaction is already complete
        if (transaction.status === Status.COMPLETE) {
            throw new CustomError(
                `Transaction with id ${data.transactionId} is already complete`,
            );
        }

        // // Requery transaction from provider and update transaction status
        // const requeryResult = await TokenHandlerUtil.requeryTransactionFromVendor(transaction);
        // const requeryResultFromBuypower = requeryResult as Awaited<ReturnType<typeof VendorService.buyPowerRequeryTransaction>>
        // const requeryResultFromIrecharge = requeryResult as Awaited<ReturnType<typeof VendorService.irechargeRequeryTransaction>>
        // const requeryResultFromBaxi = requeryResult as Awaited<ReturnType<typeof VendorService.baxiRequeryTransaction>>

        // const transactionSuccessFromBuypower = requeryResultFromBuypower.source === 'BUYPOWERNG' ? requeryResultFromBuypower.responseCode === 200 : false
        // const transactionSuccessFromIrecharge = requeryResultFromIrecharge.source === 'IRECHARGE' ? requeryResultFromIrecharge.status === '00' && requeryResultFromIrecharge.vend_status === 'successful' && requeryResultFromIrecharge.vend_status === 'successful' : false
        // const transactionSuccessFromBaxi = requeryResultFromBaxi.source === 'BAXI' ? requeryResultFromBaxi.responseCode === 200 : false

        // const transactionEventService = new DataTransactionEventService(
        //     transaction,
        //     transaction.superagent,
        //     transaction.partner.email,
        //     data.phone.phoneNumber,
        // );
        // const transactionSuccess = transactionSuccessFromBuypower || transactionSuccessFromIrecharge || transactionSuccessFromBaxi

        // if (!transactionSuccess) {
        //     await transactionEventService.addDataTransactionRequery()
        //     await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor({
        //         eventService: transactionEventService,
        //         eventData: {
        //             phone: data.phone,
        //             transactionId: data.transactionId,
        //             error: {
        //                 code: requeryResultFromBuypower.responseCode,
        //                 cause: TransactionErrorCause.TRANSACTION_FAILED
        //             }
        //         },
        //         retryCount: 1,
        //         superAgent: transaction.superagent,
        //         transactionTimedOutFromBuypower: false,
        //         vendorRetryRecord: transaction.retryRecord[transaction.retryRecord.length - 1]
        //     })
        // }

        return await TransactionService.updateSingleTransaction(data.transactionId, {
            status: Status.COMPLETE,
        });
    }

    private static async requeryTransaction(
        data: PublisherEventAndParameters[TOPICS.GET_DATA_FROM_VENDOR_RETRY],
    ) {
        retry.count = data.retryCount;
        console.log({
            retryCount: data.retryCount
        })

        // Check if token has been found
        const transaction = await TransactionService.viewSingleTransaction(data.transactionId);
        if (!transaction) {
            logger.error("Transaction not found");
            return;
        }

        const user = await transaction.$get('user')
        const partner = await transaction.$get('partner')
        if (!user || !partner) {
            throw new CustomError("Transaction  required relations not found");
        }

        const transactionEventService = new DataTransactionEventService(
            transaction,
            data.superAgent,
            partner.email,
            data.phone.phoneNumber
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
        const requeryResult = await TokenHandlerUtil.requeryTransactionFromVendor(transaction).catch(e => e)
        const requeryResultFromBuypower = requeryResult as Awaited<ReturnType<typeof VendorService.buyPowerRequeryTransaction>>
        const requeryResultFromBaxi = requeryResult as Awaited<ReturnType<typeof VendorService.baxiRequeryTransaction>>
        const requeryResultFromIrecharge = requeryResult as Awaited<ReturnType<typeof VendorService.irechargeRequeryTransaction>>

        const transactionSuccessFromBuypower = requeryResultFromBuypower.source === 'BUYPOWERNG' ? requeryResultFromBuypower.responseCode === 200 : false
        const transactionSuccessFromBaxi = requeryResultFromBaxi.source === 'BAXI' ? requeryResultFromBaxi.responseCode === 200 : false
        const transactionSuccessFromIrecharge = requeryResultFromIrecharge.source === 'IRECHARGE' ? requeryResultFromIrecharge.status === '00' && requeryResultFromIrecharge.vend_status === 'successful' : false

        const transactionSuccess = TEST_FAILED ? false : transactionSuccessFromBuypower || transactionSuccessFromBaxi || transactionSuccessFromIrecharge
        console.log({ transactionSuccess, transactionSuccessFromBuypower, transactionSuccessFromBaxi, transactionSuccessFromIrecharge })
        console.log({
            requeryResultFromIrecharge
        })
        if (!transactionSuccess) {
            /**
             * Transaction may be unsuccessful but it doesn't mean it has failed
             * The transaction can still be pending
             * If transaction failed, switch to a new vendor
             */
            let requeryFromNewVendor = false
            let requeryFromSameVendor = false
            let error: {
                code: number,
                cause: TransactionErrorCause
            } = { code: 202, cause: TransactionErrorCause.UNKNOWN }
            if (requeryResult.source === 'BUYPOWERNG') {
                let transactionFailed = requeryResultFromBuypower.responseCode === 202
                transactionFailed = TEST_FAILED ? retry.count > retry.retryCountBeforeSwitchingVendor : transactionFailed // TOGGLE - Will simulate failed buypower transaction
                if (transactionFailed) requeryFromNewVendor = true
                else {
                    requeryFromSameVendor = true
                    error.code = requeryResultFromBuypower.responseCode
                    error.cause = requeryResultFromBuypower.responseCode === 201 ? TransactionErrorCause.TRANSACTION_TIMEDOUT : TransactionErrorCause.TRANSACTION_FAILED
                }
            } else if (requeryResult.source === 'BAXI') {
                // TODO: Add logic to handle baxi requery
            } else if (requeryResult.source === 'IRECHARGE') {
                let transactionFailed = !['00', '15', '43'].includes(requeryResultFromIrecharge.status)
                transactionFailed = TEST_FAILED ? retry.count > retry.retryCountBeforeSwitchingVendor : transactionFailed // TOGGLE - Will simulate failed irecharge transaction
                if (transactionFailed) requeryFromNewVendor = true
                else {
                    if (requeryResultFromIrecharge.status !== '00') {
                        requeryFromSameVendor = true
                        error.code = 202
                        error.cause = TransactionErrorCause.TRANSACTION_FAILED
                    }
                }
            }

            if (TEST_FAILED) {
                requeryFromNewVendor = retry.testForSwitchingVendor && (data.retryCount >= retry.retryCountBeforeSwitchingVendor)
            }

            logger.error(
                `Error requerying transaction with id ${data.transactionId} 1213 `,
            );

            if (requeryFromNewVendor) {
                return await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({ phone: data.phone, transaction, transactionEventService, vendorRetryRecord: data.vendorRetryRecord })
            }

            if (requeryFromSameVendor) {
                return await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                    {
                        eventService: transactionEventService,
                        eventData: {
                            phone: data.phone,
                            transactionId: data.transactionId,
                            error: error
                        },
                        retryCount: data.retryCount + 1,
                        superAgent: data.superAgent,
                        transactionTimedOutFromBuypower: false,
                        vendorRetryRecord: data.vendorRetryRecord,
                    },
                );
            }
        }

        await transactionEventService.addDataTransactionRequery()
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
        });
    }

    static registry = {
        [TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER]: this.handleDataRequest,
        [TOPICS.DATA_RECEIVED_FROM_VENDOR]: this.handleDataRecievd,
        [TOPICS.GET_DATA_FROM_VENDOR_RETRY]: this.requeryTransaction,
        [TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR]: this.retryDataPurchaseWithNewVendor,
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

