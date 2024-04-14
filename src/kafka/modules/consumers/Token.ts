import { Axios, AxiosError, AxiosResponse } from "axios";
import { ITransaction, Status } from "../../../models/Transaction.model";
import Meter from "../../../models/Meter.model";
import Transaction from "../../../models/Transaction.model";
import PowerUnitService from "../../../services/PowerUnit.service";
import TransactionService from "../../../services/Transaction.service";
import TransactionEventService from "../../../services/TransactionEvent.service";
import { DISCO_LOGO, LOGO_URL, MAX_REQUERY_PER_VENDOR, NODE_ENV } from "../../../utils/Constants";
import logger, { Logger } from "../../../utils/Logger";
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
import VendorService, { ElectricityPurchaseResponse, ElectricityRequeryResponse, IRechargeVendorService, SuccessResponseForBuyPowerRequery, Vendor } from "../../../services/VendorApi.service";
import { generateRandomString, generateRandomToken, generateRandonNumbers, generateVendorReference } from "../../../utils/Helper";
import ProductService from "../../../services/Product.service";
import { CustomError } from "../../../utils/Errors";
import VendorProductService from "../../../services/VendorProduct.service";
import VendorModelService from "../../../services/Vendor.service"
import { BaxiRequeryResultForPurchase, BaxiSuccessfulPuchaseResponse } from "../../../services/VendorApi.service/Baxi/Config";
import { error } from "console";
import test from "node:test";
import WaitTimeService from "../../../services/Waittime.service";
import ResponsePathService from "../../../services/ResponsePath.service";
import ErrorCodeService from "../../../services/ErrorCodes.service";
import ErrorCode from "../../../models/ErrorCodes.model";
import newrelic from 'newrelic'
import { TokenUtil } from "../../../utils/Auth/Token";
import { randomUUID } from "crypto";

interface EventMessage {
    meter: {
        meterNumber: string;
        disco: Transaction["disco"];
        vendType: Meter["vendType"];
        id: string;
    };
    transactionId: string;
}

interface TriggerRequeryTransactionTokenProps {
    eventService: TransactionEventService;
    eventData: EventMessage & {
        error: {
            cause: TransactionErrorCause;
            code: number;
        }
    };
    tokenInResponse: string | null;
    transactionTimedOutFromBuypower: boolean;
    superAgent: Transaction['superagent'];
    retryCount: number;
    vendorRetryRecord: VendorRetryRecord
}

interface TokenPurchaseData {
    transaction: Transaction;
    meterNumber: string,
    disco: string,
    vendType: 'PREPAID' | 'POSTPAID',
    phone: string,
    accessToken: string
}

interface ProcessVendRequestReturnData extends Record<Transaction['superagent'], Record<string, any>> {
    'BAXI': Awaited<ReturnType<typeof VendorService.baxiVendToken>>
    'BUYPOWERNG': Awaited<ReturnType<typeof VendorService.buyPowerVendToken>>,
    'IRECHARGE': Awaited<ReturnType<typeof VendorService.irechargeVendToken>>
}

const retry = {
    count: 0,
    limit: 5,
    limitToStopRetryingWhenTransactionIsSuccessful: 20,
    retryCountBeforeSwitchingVendor: 4,
    testForSwitchingVendor: true,
}

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT
}


export async function getCurrentWaitTimeForRequeryEvent(retryCount: number, superAgent?: Transaction['superagent']) {
    // Time in seconds
    // const defaultValues = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480, 40960, 81920, 163840, 327680, 655360, 1310720, 2621440, 5242880]
    const defaultValues = [10, 10] // Default to 2mins because of buypowerng minimum wait time for requery
    const timesToRetry = defaultValues
    timesToRetry.unshift(1)

    if (superAgent === 'BUYPOWERNG') {
        return 30
    }

    if (retryCount >= timesToRetry.length) {
        return timesToRetry[timesToRetry.length - 1]
    }

    return timesToRetry[retryCount]
}


export async function getCurrentWaitTimeForSwitchEvent(retryCount: number) {
    // Time in seconds
    const defaultValues = [5, 10]
    const timesToRetry = defaultValues

    if (retryCount >= timesToRetry.length) {
        return timesToRetry[timesToRetry.length - 1]
    }

    return timesToRetry[retryCount]
}

type TransactionWithProductId = Exclude<Transaction, 'productCodeId'> & { productCodeId: NonNullable<Transaction['productCodeId']> }
export class TokenHandlerUtil {
    static async flaggTransaction(transactionId: string) {
        logger.warn(
            'Flagging transaction after hitting requery limit',
            {
                meta: { transactionId }
            }
        )
        return await TransactionService.updateSingleTransaction(transactionId, { status: Status.FLAGGED })
    }

    static async triggerEventToRequeryTransactionTokenFromVendor({
        eventService,
        eventData,
        transactionTimedOutFromBuypower,
        tokenInResponse,
        retryCount,
        vendorRetryRecord,
        superAgent
    }: TriggerRequeryTransactionTokenProps) {
        // Check if the transaction has hit the requery limit
        // If yes, flag transaction
        // if (retryCount >= MAX_REQUERY_PER_VENDOR) {
        //     logger.info(`Flagged transaction with id ${eventData.transactionId} after hitting requery limit`, {
        //         meta: { transactionId: eventData.transactionId }
        //     })
        //     return await TransactionService.updateSingleTransaction(eventData.transactionId, { status: Status.FLAGGED })
        // }

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
        // transactionTimedOutFromBuypower && (await eventService.addTokenRequestTimedOutEvent());
        // !tokenInResponse && (await eventService.addTokenRequestFailedNotificationToPartnerEvent());

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
            `Requerying transaction with id ${eventData.transactionId} from vendor`,
            {
                meta: { transactionId: eventData.transactionId }
            });

        await eventService.addGetTransactionTokenRequestedFromVendorRetryEvent(_eventMessage.error, retryCount);
        const eventMetaData = {
            transactionId: eventData.transactionId,
            meter: eventData.meter,
            error: eventData.error,
            timeStamp: new Date(),
            retryCount,
            superAgent,
            vendorRetryRecord,
            waitTime: await getCurrentWaitTimeForRequeryEvent(retryCount, superAgent)
        };

        // Publish event in increasing intervals of seconds i.e 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
        //  Use an external service to schedule this task
        const transaction = await TransactionService.viewSingleTransaction(eventData.transactionId)
        if (!transaction) throw new CustomError('Transaction not found', { transactionId: eventData.transactionId })

        const partner = await transaction.$get('partner')
        if (!partner) throw new CustomError('Partner not found', { transactionId: eventData.transactionId })

        await new TransactionEventService(
            transaction,
            eventData.meter,
            superAgent,
            partner.email
        ).addScheduleRequeryEvent({
            timeStamp: new Date().toString(), waitTime: eventMetaData.waitTime
        })

        logger.info('Scheduled requery event', {
            transactionId: transaction.id
        })
        await VendorPublisher.publishEventToScheduleRequery(
            {
                scheduledMessagePayload: eventMetaData,
                timeStamp: new Date().toString(),
                delayInSeconds: eventMetaData.waitTime
            }
        )
    }

    static async triggerEventToRetryTransactionWithNewVendor(
        {
            transaction, transactionEventService, meter, vendorRetryRecord
        }: {
            transaction: TransactionWithProductId,
            transactionEventService: TransactionEventService,
            meter: MeterInfo & { id: string },
            vendorRetryRecord: VendorRetryRecord
        }
    ) {

        let waitTime = await getCurrentWaitTimeForSwitchEvent(vendorRetryRecord.retryCount)

        logger.warn('Retrying transaction with new vendor', { meta: { transactionId: transaction.id } })
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

                // Update the transaction
                await TransactionService.updateSingleTransaction(transaction.id, { retryRecord })

                useCurrentVendor = true
                logger.info('Using current vendor', meta)
            }

            // Check for the reference used in the last retry record
            retryRecord[retryRecord.length - 1].reference.push(currentVendor.vendor === 'IRECHARGE' ? await generateVendorReference() : randomUUID())
        } else {
            logger.warn('Switching to new vendor', meta)
            // Add new record to the retry record
        }

        const newVendor = useCurrentVendor ? currentVendor.vendor : await TokenHandlerUtil.getNextBestVendorForVendRePurchase(transaction.productCodeId, transaction.superagent, transaction.previousVendors, parseFloat(transaction.amount))
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

        await transactionEventService.addPowerPurchaseRetryWithNewVendor({ bankRefId: transaction.bankRefId, currentVendor: transaction.superagent, newVendor })

        const user = await transaction.$get('user')
        if (!user) throw new CustomError('User not found for transaction', meta)

        const partner = await transaction.$get('partner')
        if (!partner) throw new CustomError('Partner not found for transaction', meta)

        retry.count = 0

        const newTransactionReference = retryRecord[retryRecord.length - 1].reference[retryRecord[retryRecord.length - 1].reference.length - 1]
        let accesToken = transaction.irechargeAccessToken

        if (newVendor === 'IRECHARGE') {
            const irechargeVendor = await VendorModelService.viewSingleVendorByName('IRECHARGE')
            if (!irechargeVendor) {
                throw new CustomError('Irecharge vendor not found')
            }

            const irechargeVendorProduct = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(irechargeVendor.id, transaction.productCodeId)
            if (!irechargeVendorProduct) {
                throw new CustomError('Irecharge vendor product not found')
            }

            const meterValidationResult = await VendorService.irechargeValidateMeter(irechargeVendorProduct.schemaData.code, meter.meterNumber, newTransactionReference, transaction.id).then((res) => ({ ...res, ...res.customer, }))
            console.log({ meterValidationResult, info: 'New meter validation result' })
            accesToken = meterValidationResult.access_token
        }

        await new TransactionEventService(
            transaction, meter, newVendor, partner.email
        ).addScheduleRetryEvent({
            timeStamp: new Date().toString(), waitTime
        })

        logger.info('Scheduled retry event', meta)

        await TransactionService.updateSingleTransaction(transaction.id, { retryRecord, reference: newTransactionReference })
        await VendorPublisher.publishEventToScheduleRetry({
            scheduledMessagePayload: {
                meter: meter,
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
                previousVendors: [...transaction.previousVendors, newVendor] as Transaction['superagent'][]
            },
            timeStamp: new Date().toString(),
            delayInSeconds: waitTime
        })
    }

    static async processVendRequest<T extends Vendor>(data: TokenPurchaseData) {
        try {
            const user = await data.transaction.$get('user')
            if (!user) throw new CustomError('User not found for transaction', {
                transactionId: data.transaction.id
            })

            const _data = {
                reference: data.transaction.superagent === 'IRECHARGE' ? data.transaction.vendorReferenceId : data.transaction.reference,
                meterNumber: data.meterNumber,
                disco: data.disco,
                vendType: data.vendType,
                amount: data.transaction.amount,
                phone: data.phone,
                email: user.email,
                accessToken: data.transaction.irechargeAccessToken,
                transactionId: data.transaction.id
            }

            if (!_data.accessToken && data.transaction.superagent === 'IRECHARGE') {
                logger.warn('No access token found for irecharge meter validation', {
                    transactionId: data.transaction.id
                })

                logger.info('Validating meter', { transactionId: data.transaction.id })
                const meterValidationResult = await VendorService.irechargeValidateMeter(_data.disco, _data.meterNumber, data.transaction.vendorReferenceId, _data.transactionId).catch((error) => {
                    throw new CustomError('Error validating meter', {
                        transactionId: data.transaction.id,
                    })
                })

                if (!meterValidationResult) throw new CustomError('Error validating meter', {
                    transactionId: data.transaction.id,
                })

                _data.accessToken = meterValidationResult.access_token
                console.log({ meterValidationResult, info: 'New meter validation result' })
                await TransactionService.updateSingleTransaction(data.transaction.id, { irechargeAccessToken: meterValidationResult.access_token })
                logger.info('Generated access token for irecharge meter validation', { transactionId: data.transaction.id })
            }

            logger.info('Processing vend request', {
                vendor: data.transaction.superagent,
                transactionId: data.transaction.id,
                preTransformedPayload: _data,
            })
            switch (data.transaction.superagent) {
                case "BAXI":
                    return await VendorService.purchaseElectricity({ data: _data, vendor: 'BAXI' })
                case "BUYPOWERNG":
                    return await VendorService.purchaseElectricity({ data: _data, vendor: 'BUYPOWERNG' }).catch((e) => {
                        logger.error(
                            'An error occured while vending from ' + data.transaction.superagent,
                            {
                                meta: {
                                    transactionId: data.transaction.id,
                                    error: error
                                }
                            }
                        )
                        return e
                    })
                case "IRECHARGE":
                    return await VendorService.purchaseElectricity({ data: _data, vendor: 'IRECHARGE' })
                default:
                    throw new CustomError("Invalid superagent", {
                        transactionId: data.transaction.id
                    });
            }
        } catch (error) {
            logger.error(
                'An error occured while vending from ' + data.transaction.superagent,
                {
                    meta: {
                        transactionId: data.transaction.id,
                        error: error
                    }
                }
            )

            throw error
        }
    }

    static async requeryTransactionFromVendor(transaction: Transaction) {
        try {
            switch (transaction.superagent) {
                case 'BAXI':
                    return await VendorService.baxiRequeryTransaction({ reference: transaction.reference, transactionId: transaction.id })
                case 'BUYPOWERNG':
                    return await VendorService.buyPowerRequeryTransaction({ reference: transaction.reference, transactionId: transaction.id })
                case 'IRECHARGE':
                    return await VendorService.irechargeRequeryTransaction({ accessToken: transaction.irechargeAccessToken, serviceType: 'power', transactionId: transaction.id })
                default:
                    throw new CustomError('Unsupported superagent', {
                        transactionId: transaction.id
                    })
            }
        } catch (error) {
            logger.error(
                'An error occured while requerying from ' + transaction.superagent,
                {
                    meta: {
                        transactionId: transaction.id,
                        error: error
                    }
                }
            )

            throw error
        }
    }

    static async getNextBestVendorForVendRePurchase(productCodeId: NonNullable<Transaction['productCodeId']>, currentVendor: Transaction['superagent'], previousVendors: Transaction['previousVendors'] = [], amount: number): Promise<Transaction['superagent']> {
        const product = await ProductService.viewSingleProduct(productCodeId)
        if (!product) throw new CustomError('Product code not found')

        const vendorProducts = await product.$get('vendorProducts')
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

    static async getSortedVendorsAccordingToCommissionRate(productCodeId: NonNullable<Transaction['productCodeId']>, amount: number): Promise<Transaction['superagent'][]> {
        const product = await ProductService.viewSingleProduct(productCodeId)
        if (!product) throw new CustomError('Product code not found')

        const vendorProducts = await product.$get('vendorProducts')
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

    static async getBestVendorForPurchase(productCodeId: NonNullable<Transaction['productCodeId']>, amount: number): Promise<Transaction['superagent']> {
        return (await this.getSortedVendorsAccordingToCommissionRate(productCodeId, amount))[0]
    }

}

type IAction = -1 | 0 | 1
type IVendType = 'PREPAID' | 'POSTPAID'
type TxnValidationResponse = ({ action: 1, tokenUnits: string } & ({ token: string, vendType: 'PREPAID' } | { vendType: 'POSTPAID' }) | { action: -1 | 0, vendType: IVendType })

class ResponseValidationUtil {

    static async validateTransactionCondition({
        requestType, vendor, responseObject,
        httpCode, vendType,
        transactionId,
        disco,
        isError,
    }: {
        isError: boolean,
        disco: string;
        transactionId: string,
        vendType: 'PREPAID' | 'POSTPAID'
        httpCode: string | number,
        requestType: 'VENDREQUEST' | 'REQUERY'
        vendor: Transaction['superagent'] | string,
        responseObject: Record<string, any>
    }): Promise<TxnValidationResponse> {
        vendor = vendor === 'BUYPOWERNG' ? 'BUYPOWER' : vendor

        return newrelic.startBackgroundTransaction('UtilityFunction:ValidateTransactionCondition', async function () {

            console.log({
                requestType, vendor, responseObject, httpCode
            })


            // Get response path and refCode for current request and vendor
            const responsePath = await ResponsePathService.viewResponsePathForValidation({
                requestType, vendor, forErrorResponses: isError
            })
            if (!responsePath) {
                logger.error('ERROR_CODE_VALIDATION: Response path not found', {
                    meta: { requestType, vendor, transactionId }
                })
                return { action: -1, vendType: vendType }
            }

            const responsePathToCheck = responsePath.map(res => res.dataValues)

            logger.info(
                'ERROR_CODE_VALIDATION: Response paths to validate from request object',
                {
                    meta: {
                        transactionId,
                        responsePathToCheck
                    }
                }
            )
            // Create map of refCode and values of responseObject[path]  -- (path will be gotten from responsePath.path values)
            const dbQueryParams = { request: requestType, vendor } as Record<string, string | number>

            const propertiesToConsider: [string, string][] = [] // [[path, refCode]]

            // Get the values to consider
            Array.from(responsePath).forEach(path => {
                propertiesToConsider.push([path.path, path.accuvendRefCode])
            })

            function getFieldValueFromResponseObject(prop: string) {
                let _prop: Record<string, any> | undefined = responseObject
                const path = prop.split('.')
                for (const p of path) {
                    if (_prop && _prop[p] != undefined) {
                        _prop = _prop[p]
                    } else {
                        _prop = undefined
                    }
                }

                return _prop as any
            }

            const missingPropertiesInResponse: string[] = []
            const propValue = {} as Record<string, any>

            // Check if they exist in the response
            Array.from(propertiesToConsider).forEach(property => {
                const value = getFieldValueFromResponseObject(property[0])
                if (!value) {
                    logger.error(`ERROR_CODE_VALIDATION:RESPONSE_PATH:  Property ${property} not found in response object`, {
                        meta: { property, transactionId }
                    })
                    missingPropertiesInResponse.push(property[0])
                }

                propValue[property[0]] = value
                dbQueryParams[property[1]] = value
            })

            logger.info(
                'ERROR_CODE_VALIDATION: Properties to consider in request object',
                {
                    meta: {
                        transactionId,
                        propertiesToConsider
                    }
                }
            )
            console.log({ missingPropertiesInResponse, propertiesToConsider, propValue, dbQueryParams })

            // Requery transaction if some required properties are missing in the response object
            if (missingPropertiesInResponse.length > 0) {
                logger.error('ERROR_CODE_VALIDATION: Missing properties in response object', {
                    meta: { missingPropertiesInResponse, responseObject, expectedProperties: propertiesToConsider, transactionId }
                })
            }

            // Convert CODE (httpStatusCode) to string if it is a number, because the db stores it as a string
            if (dbQueryParams.CODE) {
                dbQueryParams.CODE = dbQueryParams.CODE.toString()
            }

            logger.info('ERROR_CODE_VALIDATION: Properties from response object', {
                meta: {
                    transactionId: transactionId,
                    properties: propValue
                }
            })

            // Search for error code with match and return the accuvendMasterResponseCode
            const errorCode = await ErrorCodeService.getErrorCodesForValidation(dbQueryParams, isError)

            console.log({ errorCode: errorCode?.dataValues })
            logger.info('ERROR_CODE_VALIDATION: Error code for transaction validation', {
                meta: {
                    transactionId: transactionId,
                    errorCodeData: errorCode?.dataValues
                }
            })

            // Requery transaction if no error code was found
            if (!errorCode) {
                logger.error('Error code not found', {
                    meta: { requestType, vendor, httpCode, transactionId }
                })
                return { action: -1, vendType }
            }

            // Requery transaction if no token was found and vendType is PREPAID
            if (!dbQueryParams['TK'] && vendType === 'PREPAID') {
                // Check if disco is down
                const discoUp = await VendorService.buyPowerCheckDiscoUp(disco)
                if (!discoUp) {
                    logger.error(`ERROR_CODE_VALIDATION: Disco ${disco} is down`, {
                        meta: { transactionId: transactionId, disco: disco, }
                    })
                }
            }

            // If no masterResponseCode was set requery transaction
            return { action: (errorCode.accuvendMasterResponseCode as -1 | 0 | 1) ?? -1, token: dbQueryParams['TK'] as string, tokenUnits: dbQueryParams['UNITS'], vendType: vendType } as TxnValidationResponse
        })
    }
}

class TokenHandler extends Registry {
    private static async handleTokenRequest(
        data: PublisherEventAndParameters[TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {

        return newrelic.startBackgroundTransaction('ConsumerFunction:PowerPurchaseIntiated', async function () {

            try {
                console.log({ log: 'New token request', currentVendor: data.superAgent, retry: data.vendorRetryRecord })

                const transaction = await TransactionService.viewSingleTransaction(
                    data.transactionId,
                );
                if (!transaction) {
                    logger.error(
                        `CustomError fetching transaction with id ${data.transactionId}`,
                        {
                            meta: {
                                transactionId: data.transactionId
                            }
                        }
                    );
                    return;
                }

                const _transactionEventService = new TransactionEventService(
                    transaction, data.meter, data.superAgent, data.partner.email
                )
                await _transactionEventService.addVendElectricityRequestedFromVendorEvent()
                await VendorPublisher.publishEvnetForVendElectricityRequestedFromVendor({
                    meter: data.meter,
                    transactionId: data.transactionId,
                    superAgent: data.superAgent
                })
                console.log({ vendorRecord: data.vendorRetryRecord, transaction: transaction.retryRecord })
                const { user, meter, partner } = transaction;

                const vendor = await VendorModelService.viewSingleVendorByName(data.superAgent)
                if (!vendor) throw new CustomError('Vendor not found')

                const product = await ProductService.viewSingleProductByMasterProductCode(transaction.disco)
                if (!product) throw new CustomError('Product not found')

                const vendorProduct = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(vendor.id, product.id)
                if (!vendorProduct) throw new CustomError('Vendor product not found')

                const disco = vendorProduct.schemaData.code
                const logMeta = { meta: { transactionId: data.transactionId } }
                logger.info('Processing token request', logMeta);

                // Purchase token from vendor
                const tokenInfo = await TokenHandlerUtil.processVendRequest({
                    transaction: transaction as TokenPurchaseData['transaction'],
                    meterNumber: meter.meterNumber,
                    disco: disco,
                    vendType: meter.vendType,
                    phone: user.phoneNumber,
                    accessToken: transaction.irechargeAccessToken
                }).catch(e => e);

                console.log({
                    point: 'power purchase initiated',
                    tokenInfo: tokenInfo
                })
                logger.info('Token request processed', logMeta);
                const updatedTransaction = await TransactionService.viewSingleTransaction(data.transactionId);
                if (!updatedTransaction) {
                    throw new CustomError(
                        `CustomError fetching transaction with id ${data.transactionId}`,
                        {
                            transactionId: data.transactionId
                        }
                    );
                }

                const eventMessage = {
                    meter: {
                        meterNumber: meter.meterNumber,
                        disco: disco,
                        vendType: meter.vendType,
                        id: meter.id,
                    },
                    transactionId: transaction.id,
                    error: {
                        code: (tokenInfo instanceof AxiosError
                            ? tokenInfo.response?.data?.responseCode
                            : undefined) as number | 0,
                        cause: TransactionErrorCause.UNKNOWN,
                    },
                };

                const transactionEventService = new TransactionEventService(
                    transaction,
                    eventMessage.meter,
                    data.superAgent,
                    partner.email
                );

                const response = await ResponseValidationUtil.validateTransactionCondition({
                    requestType: 'VENDREQUEST',
                    vendor: vendor.name,
                    httpCode: tokenInfo instanceof AxiosError ? tokenInfo.response?.status : tokenInfo?.httpStatusCode,
                    responseObject: tokenInfo instanceof AxiosError ? tokenInfo.response?.data : tokenInfo,
                    vendType: meter.vendType,
                    disco: disco,
                    transactionId: transaction.id,
                    isError: tokenInfo instanceof AxiosError
                })

                console.log({ response })

                switch (response.action) {
                    case -1:
                        logger.error('Transaction condition pending - Requery', logMeta)
                        await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor({
                            eventData: { ...eventMessage, error: { ...eventMessage.error, cause: TransactionErrorCause.UNEXPECTED_ERROR } },
                            eventService: transactionEventService,
                            retryCount: 1,
                            superAgent: data.superAgent,
                            tokenInResponse: null,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord
                        })
                        break;
                    case 0:
                        logger.error('Transaction condition not met - Retry', logMeta)
                        await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({
                            transaction: updatedTransaction,
                            transactionEventService: transactionEventService,
                            meter: eventMessage.meter,
                            vendorRetryRecord: data.vendorRetryRecord
                        })
                        break;
                    case 1:
                        logger.info('Transaction condition met - Successful', logMeta)

                        logger.info('Token from vend', {
                            meta: {
                                transactionId: transaction.id,
                                tokenFromVend: response.vendType === 'PREPAID' ? response.token : undefined
                            }
                        })

                        logger.info('Transaction condition met - Successful', logMeta)
                        const _product = await ProductService.viewSingleProduct(transaction.productCodeId)
                        if (!_product) throw new CustomError('Product not found')

                        const token = response.vendType == 'PREPAID' ? response.token : undefined
                        const discoLogo = DISCO_LOGO[_product.productName as keyof typeof DISCO_LOGO] ?? LOGO_URL
                        let powerUnit =
                            await PowerUnitService.viewSinglePowerUnitByTransactionId(
                                data.transactionId,
                            );

                        powerUnit = powerUnit
                            ? await PowerUnitService.updateSinglePowerUnit(powerUnit.id, {
                                tokenFromVend: token,
                                tokenUnits: response.tokenUnits,
                                transactionId: data.transactionId,
                            })
                            : await PowerUnitService.addPowerUnit({
                                id: uuidv4(),
                                transactionId: data.transactionId,
                                disco: data.meter.disco,
                                discoLogo,
                                amount: transaction.amount,
                                meterId: data.meter.id,
                                superagent: data.superAgent as ITransaction['superagent'],
                                tokenFromVend: token,
                                tokenNumber: 0,
                                tokenUnits: response.tokenUnits,
                                address: transaction.meter.address,
                            });
                        token && await TransactionService.updateSingleTransaction(data.transactionId, {
                            powerUnitId: powerUnit?.id, tokenFromVend: token, tokenInfo
                        });


                        await transactionEventService.addTokenReceivedEvent(token ?? '');
                        await VendorPublisher.publishEventForTokenReceivedFromVendor({
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
                            meter: {
                                id: meter.id,
                                meterNumber: meter.meterNumber,
                                disco: transaction!.disco,
                                vendType: meter.vendType,
                                token: token ?? '',
                            },
                            tokenUnits: response.tokenUnits
                        });
                        logger.info('Saving token to cache')
                        const twoMinsExpiry = 2 * 60 * 1000
                        token && await TokenUtil.saveTokenToCache({ key: 'transaction_token:' + transaction.id, token: (response as any).token ?? '', expiry: twoMinsExpiry })

                        await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor({
                            eventData: { ...eventMessage, error: { ...eventMessage.error, cause: TransactionErrorCause.UNEXPECTED_ERROR } },
                            eventService: transactionEventService,
                            retryCount: 1,
                            superAgent: data.superAgent,
                            tokenInResponse: null,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord
                        })
                        break;
                    default:
                        return await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                            {
                                eventData: {
                                    meter: data.meter,
                                    transactionId: data.transactionId,
                                    error: { code: 202, cause: TransactionErrorCause.NO_TOKEN_IN_RESPONSE },
                                },
                                eventService: transactionEventService,
                                retryCount: 1,
                                superAgent: data.superAgent,
                                tokenInResponse: null,
                                transactionTimedOutFromBuypower: false,
                                vendorRetryRecord: transaction.retryRecord[transaction.retryRecord.length - 1]
                            })
                }
            } catch (error) {
                if (error instanceof CustomError) {
                    error.meta = error.meta ?? {
                        transactionId: data.transactionId
                    }
                }

                throw error
            }
        })
    }

    private static async requeryTransactionForToken(
        data: PublisherEventAndParameters[TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_REQUERY],
    ) {

        return newrelic.startBackgroundTransaction('ConsumerFunction:GetTransactionTokenRequery', async function () {
            try {
                const logMeta = { meta: { transactionId: data.transactionId } }
                logger.warn("Requerying transaction from vendor", logMeta)
                retry.count = data.retryCount;
                console.log({ data: data.vendorRetryRecord, retyrCount: data.retryCount })

                // Check if token has been found
                const transaction = await TransactionService.viewSingleTransaction(data.transactionId);
                if (!transaction) {
                    logger.error("Transaction not found", logMeta);
                    return;
                }
                // Get the current timestamp in milliseconds
                const now = Date.now();

                // Assuming you have another timestamp stored in a variable called 'previousTimestamp'
                // For example:
                const previousTimestamp = new Date(transaction.transactionTimestamp).getTime(); // This represents a timestamp for April 1, 2022

                // Calculate the difference between the current timestamp and the previous timestamp in milliseconds
                const differenceInMilliseconds = now - previousTimestamp;

                // Convert milliseconds to hours
                const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

                // Check if the difference is greater than two hours
                // if (differenceInHours > 2) {

                //check if transaction is greater than 2hrs then stop
                if (differenceInHours > 2) {
                    logger.info(`Flagged transaction with id ${transaction.id} after hitting requery limit`, {
                        meta: { transactionId: transaction.id }
                    })
                    return await TransactionService.updateSingleTransaction(transaction.id, { status: Status.FLAGGED })

                }

                const user = await transaction.$get('user')
                const meter = await transaction.$get('meter')
                const partner = await transaction.$get('partner')
                if (!user || !meter || !partner) {
                    throw new CustomError("Transaction  required relations not found");
                }

                // Check if disco is up
                const vendor = await VendorModelService.viewSingleVendorByName(data.superAgent)
                if (!vendor) throw new CustomError('Vendor not found')

                const product = await ProductService.viewSingleProductByMasterProductCode(transaction.disco)
                if (!product) throw new CustomError('Product not found')

                const vendorProduct = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(vendor.id, product.id)
                if (!vendorProduct) throw new CustomError('Vendor product not found')

                const discoCode = vendorProduct.schemaData.code

                const transactionEventService = new TransactionEventService(
                    transaction,
                    data.meter,
                    data.superAgent,
                    partner.email
                );
                await transactionEventService.addGetTransactionTokenFromVendorInitiatedEvent();
                await VendorPublisher.publishEventForGetTransactionTokenFromVendorInitiated(
                    {
                        transactionId: transaction.id,
                        meter: data.meter,
                        timeStamp: new Date(),
                        superAgent: data.superAgent
                    },
                );

                const requeryResult = await TokenHandlerUtil.requeryTransactionFromVendor(transaction).catch(e => e ?? {});

                console.log({ requeryResult: requeryResult })
                const response = await ResponseValidationUtil.validateTransactionCondition({
                    requestType: 'REQUERY',
                    vendor: vendor.name,
                    httpCode: requeryResult instanceof AxiosError ? requeryResult.status : requeryResult.httpStatusCode,
                    responseObject: requeryResult instanceof AxiosError ? requeryResult.response?.data : requeryResult,
                    vendType: meter.vendType,
                    disco: discoCode,
                    transactionId: transaction.id,
                    isError: requeryResult instanceof AxiosError
                })

                let eventMessage = {
                    meter: {
                        meterNumber: meter.meterNumber,
                        disco: meter.disco,
                        vendType: meter.vendType,
                        id: meter.id,
                    },
                    transactionId: transaction.id,
                    error: {
                        code: (requeryResult instanceof AxiosError
                            ? requeryResult.response?.data?.responseCode
                            : undefined) as number | 0,
                        cause: TransactionErrorCause.UNKNOWN,
                    },
                }

                console.log({ response })
                switch (response.action) {
                    case -1:
                        logger.error('Transaction condition pending - Requery', logMeta)
                        await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor({
                            eventData: { ...eventMessage, error: { ...eventMessage.error, cause: TransactionErrorCause.UNEXPECTED_ERROR } },
                            eventService: transactionEventService,
                            retryCount: data.retryCount + 1,
                            superAgent: data.superAgent,
                            tokenInResponse: null,
                            transactionTimedOutFromBuypower: false,
                            vendorRetryRecord: data.vendorRetryRecord
                        })
                        break;
                    case 0:
                        logger.error('Transaction condition not met - Retry', logMeta)
                        await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({
                            transaction: transaction,
                            transactionEventService: transactionEventService,
                            meter: eventMessage.meter,
                            vendorRetryRecord: data.vendorRetryRecord
                        })
                        break;
                    case 1:
                        logger.info('Transaction condition met - Successful', logMeta)
                        const _product = await ProductService.viewSingleProduct(transaction.productCodeId)
                        if (!_product) throw new CustomError('Product not found')

                        const discoLogo = DISCO_LOGO[_product.productName as keyof typeof DISCO_LOGO] ?? LOGO_URL
                        let powerUnit =
                            await PowerUnitService.viewSinglePowerUnitByTransactionId(
                                data.transactionId,
                            );

                        let tokenInResponse: string | undefined = undefined
                        tokenInResponse = response.vendType === 'PREPAID' ? response.token : undefined
                        logger.info('Token from requery ', { meta: { ...logMeta, requeryToken: tokenInResponse } });
                        await TransactionService.updateSingleTransaction(transaction.id, { tokenFromRequery: tokenInResponse })
                        powerUnit = powerUnit
                            ? await PowerUnitService.updateSinglePowerUnit(powerUnit.id, {
                                token: tokenInResponse,
                                transactionId: data.transactionId,
                                tokenUnits: response.tokenUnits
                            })
                            : await PowerUnitService.addPowerUnit({
                                id: uuidv4(),
                                transactionId: data.transactionId,
                                disco: data.meter.disco,
                                discoLogo,
                                amount: transaction.amount,
                                meterId: data.meter.id,
                                superagent: data.superAgent as ITransaction['superagent'],
                                token: tokenInResponse,
                                tokenNumber: 0,
                                tokenUnits: response.tokenUnits,
                                address: transaction.meter.address,
                            });

                        await TransactionService.updateSingleTransaction(data.transactionId, {
                            powerUnitId: powerUnit?.id,
                        });
                        await transactionEventService.addTokenReceivedFromRequery(tokenInResponse ?? '');
                        return await VendorPublisher.publishEventForTokenReceivedFromRequery({
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
                            meter: {
                                id: meter.id,
                                meterNumber: meter.meterNumber,
                                disco: transaction!.disco,
                                vendType: meter.vendType,
                                token: tokenInResponse ?? '',
                            },
                            tokenUnits: response.tokenUnits
                        });
                    default:
                        logger.error('Transaction condition were not met', { meta: { transactionId: data.transactionId, response } })
                        return await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                            {
                                eventData: {
                                    meter: data.meter,
                                    transactionId: data.transactionId,
                                    error: { code: 202, cause: TransactionErrorCause.NO_TOKEN_IN_RESPONSE },
                                },
                                eventService: transactionEventService,
                                retryCount: data.retryCount + 1,
                                superAgent: data.superAgent,
                                tokenInResponse: null,
                                transactionTimedOutFromBuypower: false,
                                vendorRetryRecord: transaction.retryRecord[transaction.retryRecord.length - 1]
                            })
                }

                return
            } catch (error) {
                if (error instanceof CustomError) {
                    error.meta = error.meta ?? {
                        transactionId: data.transactionId
                    }
                }

                throw error
            }
        })
    }

    private static async scheduleRequeryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION],
    ) {
        // Check the timeStamp, and the delayInSeconds

        return newrelic.startBackgroundTransaction('ConsumerFunction:ScheduleRequeryTransaction', async function () {
            const { timeStamp, delayInSeconds } = data;

            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const timeStampInSeconds = Math.floor(new Date(timeStamp).getTime() / 1000);
            const timeInSecondsSinceInit = currentTimeInSeconds - timeStampInSeconds;
            const timeDifference = delayInSeconds - timeInSecondsSinceInit

            console.log({ timeDifference, timeStamp, currentTime: new Date(), delayInSeconds, timeInSecondsSinceInit })

            if (timeDifference <= 0) {
                const existingTransaction = await TransactionService.viewSingleTransaction(data.scheduledMessagePayload.transactionId)
                if (!existingTransaction) {
                    throw new CustomError('Transaction not found')
                }

                // Check if transaction has been requeried successfuly before
                const tokenReceivedFromRequery = await EventService.viewSingleEventByTransactionIdAndType(data.scheduledMessagePayload.transactionId, TOPICS.TOKEN_RECIEVED_FROM_REQUERY)
                if (tokenReceivedFromRequery) {
                    logger.warn('Transaction has been requeried successfully before', {
                        meta: { transactionId: data.scheduledMessagePayload.transactionId, currentMessagePayload: data }
                    })
                    return
                }

                const transactionEventService = new TransactionEventService(
                    existingTransaction,
                    data.scheduledMessagePayload.meter,
                    existingTransaction.superagent,
                    data.scheduledMessagePayload.superAgent,
                )
                await transactionEventService.addScheduleRequeryEvent({
                    timeStamp: new Date().toString(),
                    waitTime: delayInSeconds
                })
                return await VendorPublisher.publishEventForGetTransactionTokenRequestedFromVendorRetry(data.scheduledMessagePayload)
            }

            // Change error cause to RESCHEDULED_BEFORE_WAIT_TIME
            data.scheduledMessagePayload.error.cause = TransactionErrorCause.RESCHEDULED_BEFORE_WAIT_TIME

            // logger.info("Rescheduling requery for transaction", { meta: { transactionId: data.scheduledMessagePayload.transactionId } })
            // Else, schedule a new event to requery transaction from vendor
            return await VendorPublisher.publishEventToScheduleRequery({
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
                log: 0
            })

        })
    }

    private static async scheduleRetryTransaction(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION],
    ) {
        // Check the timeStamp, and the delayInSeconds

        return newrelic.startBackgroundTransaction('ConsumerFunction:ScheduleRetryForTransaction', async function () {
            const { timeStamp, delayInSeconds } = data;

            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const timeStampInSeconds = Math.floor(new Date(timeStamp).getTime() / 1000);
            const timeInSecondsSinceInit = currentTimeInSeconds - timeStampInSeconds;
            const timeDifference = delayInSeconds - timeInSecondsSinceInit

            console.log({ timeDifference, timeStamp, currentTime: new Date(), delayInSeconds, timeInSecondsSinceInit })

            // Check if current time is greater than the timeStamp + delayInSeconds
            if (timeDifference <= 0) {
                const existingTransaction = await TransactionService.viewSingleTransaction(data.scheduledMessagePayload.transactionId)
                if (!existingTransaction) {
                    throw new CustomError('Transaction not found')
                }

                const transactionEventService = new TransactionEventService(
                    existingTransaction,
                    data.scheduledMessagePayload.meter,
                    existingTransaction.superagent,
                    data.scheduledMessagePayload.superAgent,
                )

                await TransactionService.updateSingleTransaction(data.scheduledMessagePayload.transactionId, {
                    superagent: data.scheduledMessagePayload.newVendor,
                    retryRecord: data.scheduledMessagePayload.retryRecord,
                    vendorReferenceId: data.scheduledMessagePayload.newTransactionReference,
                    reference: data.scheduledMessagePayload.newTransactionReference,
                    irechargeAccessToken: data.scheduledMessagePayload.irechargeAccessToken,
                    previousVendors: data.scheduledMessagePayload.previousVendors,
                })

                await VendorPublisher.publishEventForRetryPowerPurchaseWithNewVendor({
                    meter: data.scheduledMessagePayload.meter,
                    partner: data.scheduledMessagePayload.partner,
                    transactionId: data.scheduledMessagePayload.transactionId,
                    superAgent: data.scheduledMessagePayload.superAgent,
                    user: data.scheduledMessagePayload.user,
                    newVendor: data.scheduledMessagePayload.newVendor,
                })

                await transactionEventService.addPowerPurchaseInitiatedEvent(data.scheduledMessagePayload.newTransactionReference, existingTransaction.amount);
                return await VendorPublisher.publishEventForInitiatedPowerPurchase(data.scheduledMessagePayload)
            }

            // logger.info("Rescheduling retry for transaction", { meta: { transactionId: data.scheduledMessagePayload.transactionId } })
            // Else, schedule a new event to requery transaction from vendor
            return await VendorPublisher.publishEventToScheduleRetry({
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
                log: 0
            })
        })
    }

    static registry = {
        [TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER]: this.handleTokenRequest,
        [TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_REQUERY]:
            this.requeryTransactionForToken,
        [TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY]:
            this.requeryTransactionForToken,
        [TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION]: this.scheduleRequeryTransaction,
        [TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION]: this.scheduleRetryTransaction,
    };
}


export default class TokenConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor(
            TokenHandler.registry,
            "TOKEN_CONSUMER",
        );
        super(messageProcessor);
    }
}

