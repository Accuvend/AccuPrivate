// @ts-nocheck
import { AxiosError } from "axios";
import { Status } from "../../../models/Transaction.model";
import Meter from "../../../models/Meter.model";
import Transaction from "../../../models/Transaction.model";
import PowerUnitService from "../../../services/PowerUnit.service";
import TransactionService from "../../../services/Transaction.service";
import TransactionEventService, { AirtimeTransactionEventService } from "../../../services/TransactionEvent.service";
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
} from "../util/Interface";
import MessageProcessor from "../util/MessageProcessor";
import { v4 as uuidv4 } from "uuid";
import EventService from "../../../services/Event.service";
import VendorService, { Prettify, SuccessResponseForBuyPowerRequery, Vendor, VendorAirtimeService } from "../../../services/VendorApi.service";
import { generateRandomToken } from "../../../utils/Helper";
import BuypowerApi from "../../../services/VendorApi.service/Buypower";
import { IRechargeApi } from "../../../services/VendorApi.service/Irecharge";
import ProductService from "../../../services/Product.service";
import { VendorProductSchemaData } from "../../../models/VendorProduct.model";
import BaxiApi from "../../../services/VendorApi.service/Baxi";
import { token } from "morgan";
import { CustomError } from "../../../utils/Errors";

interface EventMessage {
    phone: {
        phoneNumber: string;
        amount: number;
    };
    transactionId: string;
}

interface TriggerRequeryTransactionTokenProps {
    eventService: AirtimeTransactionEventService;
    eventData: EventMessage & {
        error: {
            cause: TransactionErrorCause;
            code: number;
        }
    },
    transactionTimedOutFromBuypower: boolean;
    superAgent: Transaction['superagent'];
    retryCount: number;
}

interface TokenPurchaseData<T = Vendor> {
    transaction: Omit<Transaction, 'superagent'> & { superagent: T },
    phoneNumber: string,
    email: string,
    amount: number,
    accountNumber: string,
    serviceProvider: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE',
}

type ProcessVendRequestReturnData<T extends 'BUYPOWERNG' | 'IRECHARGE' | 'BAXI'> =
    T extends 'BUYPOWERNG' ? Awaited<ReturnType<typeof BuypowerApi.Airtime.purchase>> :
    T extends 'IRECHARGE' ? Awaited<ReturnType<typeof IRechargeApi.Airtime.purchase>> :
    T extends 'BAXI' ? Awaited<ReturnType<typeof BaxiApi.Airtime.purchase>> :
    never

const retry = {
    count: 0,
    // limit: 5,
    retryCountBeforeSwitchingVendor: 2,
}

const TEST_FAILED = NODE_ENV === 'production' ? false : false // TOGGLE - Will simulate failed transaction

const TransactionErrorCodeAndCause = {
    501: TransactionErrorCause.MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED,
    500: TransactionErrorCause.UNEXPECTED_ERROR,
    202: TransactionErrorCause.TRANSACTION_TIMEDOUT
}

export function getCurrentWaitTimeForRequeryEvent(retryCount: number) {
    // Use geometric progression  calculate wait time, where R = 2
    const waitTime = 2 ** (retryCount - 1)
    return waitTime
}

export class TokenHandlerUtil {
    static async triggerEventToRequeryTransactionTokenFromVendor({
        eventService,
        eventData,
        transactionTimedOutFromBuypower,
        retryCount,
        superAgent
    }: TriggerRequeryTransactionTokenProps) {
        const logMeta = {
            meta: {
                transactionId: eventData.transactionId
            }
        }
        // Check if the transaction has hit the requery limit
        // If yes, flag transaction
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
         * 500 - Unexpected CustomError
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
            `Retrying transaction with id ${eventData.transactionId} from vendor`, logMeta
        );

        await eventService.addGetAirtimeFromVendorRetryEvent(_eventMessage.error, retryCount);
        const eventMetaData = {
            transactionId: eventData.transactionId,
            phone: eventData.phone,
            error: eventData.error,
            timeStamp: new Date(),
            retryCount,
            superAgent,
            waitTime: getCurrentWaitTimeForRequeryEvent(retryCount)
        };

        // Start timer to requery transaction at intervals
        async function countDownTimer(time: number) {
            for (let i = time; i > 0; i--) {
                setTimeout(() => {
                    logger.info(`Retrying transaction ${i} seconds`)
                }, (time - i) * 1000)
            }
        }
        countDownTimer(eventMetaData.waitTime);

        // Publish event in increasing intervals of seconds i.e 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
        // TODO: Use an external service to schedule this task
        setTimeout(async () => {
            logger.info('Retrying transaction from vendor', logMeta)
            await VendorPublisher.publishEventForGetAirtimeFromVendorRetry(
                eventMetaData,
            );
        }, eventMetaData.waitTime * 1000);
    }

    static async triggerEventToRetryTransactionWithNewVendor(
        {
            transaction, transactionEventService, phone,
        }: {
            transaction: Transaction,
            transactionEventService: AirtimeTransactionEventService,
            phone: { phoneNumber: string, amount: number },
        }
    ) {
        // Attempt purchase from new vendor
        if (!transaction.bankRefId) throw new CustomError('BankRefId not found')


        const product = await ProductService.viewSingleProduct(transaction.productCodeId)
        if (!product) throw new CustomError('Product code not found')

        const newVendor = await TokenHandlerUtil.getNextBestVendorForVendRePurchase(
            product.id,
            transaction.superagent,
            transaction.previousVendors,
            parseFloat(transaction.amount)
        )
        await transactionEventService.addAirtimePurchaseWithNewVendorEvent({ currentVendor: transaction.superagent, newVendor })

        const user = await transaction.$get('user')
        if (!user) throw new CustomError('User not found for transaction')

        const partner = await transaction.$get('partner')
        if (!partner) throw new CustomError('Partner not found for transaction')

        retry.count = 0
        await transaction.update({ previousVendors: [...transaction.previousVendors, newVendor] })

        return await VendorPublisher.publishEventForAirtimePurchaseRetryFromVendorWithNewVendor({
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
            accountNumber: data.accountNumber,
            phoneNumber: data.phoneNumber,
            serviceType: data.serviceProvider,
            amount: data.amount,
            email: data.email,
            reference: transaction.reference,
        }

        if (transaction.superagent === 'BAXI') {
            return await VendorService.purchaseAirtime({ data: _data, vendor: 'BAXI' }).then(res => ({ ...res, source: 'BAXI' as const }))
        } else if (transaction.superagent === 'BUYPOWERNG') {
            return await VendorService.purchaseAirtime({ data: _data, vendor: 'BUYPOWERNG' }).then(res => ({ ...res, source: 'BUYPOWERNG' as const }))
        } else if (transaction.superagent === 'IRECHARGE') {
            return await VendorService.purchaseAirtime({ data: _data, vendor: 'IRECHARGE' }).then(res => ({ ...res, source: 'IRECHARGE' as const }))
        } else {
            throw new CustomError("Invalid superagent");
        }
    }

    static async requeryTransactionFromVendor(transaction: Transaction) {
        switch (transaction.superagent) {
            case 'BAXI':
                return await VendorService.baxiRequeryTransaction({ reference: transaction.reference, transactionId: transaction.id })
            case 'BUYPOWERNG':
                return await VendorService.buyPowerRequeryTransaction({ reference: transaction.reference, transactionId: transaction.id })
            case 'IRECHARGE':
                return await VendorService.irechargeRequeryTransaction({ accessToken: transaction.irechargeAccessToken, serviceType: 'airtime', transactionId: transaction.id })
            default:
                throw new CustomError('Unsupported superagent')
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
            if (!previousVendors.includes(vendorRate.vendorName)) return vendorRate.vendorName as Transaction['superagent']
        }

        if (previousVendors.length === vendors.length) {
            // If all vendors have been used before, switch to the vendor with the highest commission rate
            return vendorRates.sort((a, b) => ((b.commission * amount) + b.bonus) - ((a.commission * amount) + a.bonus))[0].vendorName as Transaction['superagent']
        }

        // If the current vendor is the vendor with the highest commission rate, then switch to the vendor with the next highest commission rate
        return sortedOtherVendors[0].vendorName as Transaction['superagent']
    }
}

class TokenHandler extends Registry {
    private static async retryPowerPurchaseWithNewVendor(data: PublisherEventAndParameters[TOPICS.RETRY_AIRTIME_PURCHASE_FROM_NEW_VENDOR]) {
        const transaction = await TransactionService.viewSingleTransaction(data.transactionId);
        if (!transaction) {
            throw new CustomError(`CustomError fetching transaction with id ${data.transactionId}`);
        }
        if (!transaction.bankRefId) {
            throw new CustomError('BankRefId not found')
        }

        await TransactionService.updateSingleTransaction(transaction.id, { superagent: data.newVendor })
        const transactionEventService = new AirtimeTransactionEventService(transaction, data.newVendor, data.partner.email, data.phone.phoneNumber);
        await transactionEventService.addAirtimePurchaseInitiatedEvent({ amount: transaction.amount });
        await VendorPublisher.publshEventForAirtimePurchaseInitiate({
            phone: data.phone,
            user: data.user,
            partner: data.partner,
            transactionId: transaction.id,
            superAgent: data.newVendor,
        })
    }

    private static async handleAirtimeRequest(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        try {
            console.log({
                log: 'New token request',
                currentVendor: data.superAgent
            })

            const logMeta = { meta: { transactionId: data.transactionId } }
            logger.info('New token request', logMeta)

            const transaction = await TransactionService.viewSingleTransaction(
                data.transactionId,
            );
            if (!transaction) {
                logger.error(
                    `CustomError fetching transaction with id ${data.transactionId}`,
                );
                return;
            }

            const { user, partner } = transaction;

            const product = await ProductService.viewSingleProduct(transaction.productCodeId)
            if (!product) throw new CustomError('Product code not found')

            logger.info('Fetching vendor products', logMeta)
            const vendorProducts = await product.$get('vendorProducts')
            const vendorAndDiscos = await Promise.all(vendorProducts.map(async vendorProduct => {
                const vendor = await vendorProduct.$get('vendor')
                if (!vendor) throw new CustomError('Vendor not found')
                return {
                    vendorName: vendor.name,
                    discoCode: (vendorProduct.schemaData as VendorProductSchemaData.BUYPOWERNG).code
                }
            }))

            console.log({ vendorAndDiscos, superagent: transaction.superagent })

            const vendorProductCode = vendorAndDiscos.find(vendorAndDisco => vendorAndDisco.vendorName === transaction.superagent)?.discoCode
            if (!vendorProductCode) throw new CustomError('Vendor product code not found')

            // Purchase token from vendor
            logger.info('Processing vend request', logMeta)
            const tokenInfo = await TokenHandlerUtil.processVendRequest({
                transaction: transaction as TokenPurchaseData['transaction'],
                phoneNumber: data.phone.phoneNumber,
                email: user.email,
                amount: parseFloat(transaction.amount),
                accountNumber: data.phone.phoneNumber,
                serviceProvider: vendorProductCode as TokenPurchaseData['serviceProvider'],
            });

            logger.info('Vend request processed', logMeta)
            const error = { code: 202, cause: TransactionErrorCause.UNKNOWN }
            const transactionEventService = new AirtimeTransactionEventService(
                transaction,
                data.superAgent,
                partner.email,
                data.phone.phoneNumber,
            );
            await transactionEventService.addVendAirtimeRequestedFromVendorEvent();

            let requeryFromNewVendor = false
            let requeryFromSameVendor = false
            let transactionFailed = !['00', '15', '43'].includes(tokenInfo.status)

            const transactionSuccessFromBuypower = tokenInfo.source === 'BUYPOWERNG' ? tokenInfo.responseCode === 200 : false
            const transactionSuccessFromIrecharge = tokenInfo.source === 'IRECHARGE' ? tokenInfo.status === '00' : false
            const transactionSuccessFromBaxi = tokenInfo.source === 'BAXI' ? tokenInfo.code === 200 : false

            const transactionSuccessFul = transactionSuccessFromBaxi || transactionSuccessFromBuypower || transactionSuccessFromIrecharge

            transactionFailed = TEST_FAILED ? retry.count > retry.retryCountBeforeSwitchingVendor : transactionFailed // TOGGLE - Will simulate failed irecharge transaction
            if (transactionFailed) requeryFromNewVendor = true
            else {
                requeryFromSameVendor = true
                error.code = tokenInfo.status === '00' ? 200 : 202
                error.cause = tokenInfo.status === '00' ? TransactionErrorCause.TRANSACTION_TIMEDOUT : TransactionErrorCause.TRANSACTION_FAILED
            }

            const eventMessage = { phone: data.phone, transactionId: transaction.id, error: error, };

            if (!transactionSuccessFul) {
                logger.error('Transaction unsuccessful', logMeta)
                if (requeryFromNewVendor) {
                    return await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({ phone: data.phone, transaction, transactionEventService })
                }

                return await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor(
                    {
                        eventService: transactionEventService,
                        eventData: eventMessage,
                        retryCount: 1,
                        superAgent: data.superAgent,
                        transactionTimedOutFromBuypower: true,
                    },
                );
            }

            await transaction.update({ irechargeAccessToken: tokenInfo.source === 'IRECHARGE' ? tokenInfo.ref : undefined })

            await transactionEventService.addAirtimeReceivedFromVendorEvent();
            return await VendorPublisher.publishEventForAirtimeReceivedFromVendor({
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
        } catch (error) {
            if (error instanceof CustomError) {
                error.meta = error.meta ?? {
                    transactionId: data.transactionId
                }
            }

            throw error
        }
    }

    private static async handleAirtimeRecievd(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_RECEIVED_FROM_VENDOR],
    ) {
        try {
            const logMeta = { meta: { transactionId: data.transactionId } }

            logger.info('Airtime received from vendor', logMeta)
            const transaction = await TransactionService.viewSingleTransaction(
                data.transactionId,
            );
            if (!transaction) {
                throw new CustomError(
                    `CustomError fetching transaction with id ${data.transactionId}`,
                );
            }

            // Check if transaction is already complete
            if (transaction.status === Status.COMPLETE) {
                throw new CustomError(
                    `Transaction with id ${data.transactionId} is already complete`,
                );
            }

            logger.info('Processing airtime received from vendor', logMeta)
            // Requery transaction from provider and update transaction status
            const requeryResult = await TokenHandlerUtil.requeryTransactionFromVendor(transaction);
            const requeryResultFromBuypower = requeryResult as Awaited<ReturnType<typeof VendorService.buyPowerRequeryTransaction>>
            const requeryResultFromIrecharge = requeryResult as Awaited<ReturnType<typeof VendorService.irechargeRequeryTransaction>>
            const requeryResultFromBaxi = requeryResult as Awaited<ReturnType<typeof VendorService.baxiRequeryTransaction>>

            const transactionSuccessFromBuypower = requeryResultFromBuypower.source === 'BUYPOWERNG' ? requeryResultFromBuypower.responseCode === 200 : false
            const transactionSuccessFromIrecharge = requeryResultFromIrecharge.source === 'IRECHARGE' ? requeryResultFromIrecharge.status === '00' && requeryResultFromIrecharge.vend_status === 'successful' : false
            const transactionSuccessFromBaxi = requeryResultFromBaxi.source === 'BAXI' ? requeryResultFromBaxi.responseCode === 200 : false

            const transactionEventService = new AirtimeTransactionEventService(
                transaction,
                transaction.superagent,
                transaction.partner.email,
                data.phone.phoneNumber,
            );
            const transactionSuccess = transactionSuccessFromBuypower || transactionSuccessFromIrecharge || transactionSuccessFromBaxi

            if (!transactionSuccess) {
                await transactionEventService.addAirtimeTransactionRequery()
                await TokenHandlerUtil.triggerEventToRequeryTransactionTokenFromVendor({
                    eventService: transactionEventService,
                    eventData: {
                        phone: data.phone,
                        transactionId: data.transactionId,
                        error: {
                            code: requeryResultFromBuypower.responseCode,
                            cause: TransactionErrorCause.TRANSACTION_FAILED
                        }
                    },
                    retryCount: 1,
                    superAgent: transaction.superagent,
                    transactionTimedOutFromBuypower: false,
                })
            }

            logger.info('Airtime received from vendor', logMeta)
            return await TransactionService.updateSingleTransaction(data.transactionId, {
                status: Status.COMPLETE,
            });
        } catch (error) {
            if (error instanceof CustomError) {
                error.meta = error.meta ?? {
                    transactionId: data.transactionId
                }
            }

            throw error
        }
    }

    private static async requeryTransaction(
        data: PublisherEventAndParameters[TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY],
    ) {
        try {
            retry.count = data.retryCount;
            console.log({
                retryCount: data.retryCount
            })

            const logMeta = { meta: { transactionId: data.transactionId } }

            logger.info('Retrying transaction from vendor', logMeta)
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

            const transactionEventService = new AirtimeTransactionEventService(
                transaction,
                data.superAgent,
                partner.email,
                data.phone.phoneNumber
            );
            await transactionEventService.addAirtimeTranasctionRequeryInitiated();

            // Requery transaction from provider and update transaction status
            logger.info('Requerying transaction from vendor', logMeta)
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
            const requeryResult = await TokenHandlerUtil.requeryTransactionFromVendor(transaction)
            logger.info('Transaction requeried successfully result', logMeta)
            const requeryResultFromBuypower = requeryResult as Awaited<ReturnType<typeof VendorService.buyPowerRequeryTransaction>>
            // const requeryResultFromBaxi = requeryResult as Awaited<ReturnType<typeof VendorService.baxiRequeryTransaction>>
            const requeryResultFromIrecharge = requeryResult as Awaited<ReturnType<typeof VendorService.irechargeRequeryTransaction>>

            const transactionSuccessFromBuypower = requeryResultFromBuypower.source === 'BUYPOWERNG' ? requeryResultFromBuypower.responseCode === 200 : false
            // const transactionSuccessFromBaxi = requeryResultFromBaxi.source === 'BAXI' ? requeryResultFromBaxi.responseCode === 200 : false
            const transactionSuccessFromIrecharge = requeryResultFromIrecharge.source === 'IRECHARGE' ? requeryResultFromIrecharge.status === '00' : false

            const transactionSuccess = TEST_FAILED ? false : transactionSuccessFromBuypower
            // console.log({ transactionSuccess, transactionSuccessFromBuypower, transactionSuccessFromBaxi, transactionSuccessFromIrecharge })
            // console.log({
            //     requeryResultFromIrecharge
            // })
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

                logger.error(`CustomError requerying transaction with id ${data.transactionId}`, logMeta);

                if (requeryFromNewVendor) {
                    return await TokenHandlerUtil.triggerEventToRetryTransactionWithNewVendor({ phone: data.phone, transaction, transactionEventService })
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
                        },
                    );
                }
            }

            await transactionEventService.addAirtimeTransactionRequery()
            await VendorPublisher.publishEventForAirtimeReceivedFromVendor({
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
        } catch (error) {
            if (error instanceof CustomError) {
                error.meta = error.meta ?? {
                    transactionId: data.transactionId
                }
            }

            throw error
        }
    }

    static registry = {
        [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]: this.handleAirtimeRequest,
        [TOPICS.AIRTIME_RECEIVED_FROM_VENDOR]: this.handleAirtimeRecievd,
        [TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY]: this.requeryTransaction,
        [TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR]: this.retryPowerPurchaseWithNewVendor,
    };
}

export default class AirtimeConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor(
            TokenHandler.registry,
            "AIRTIME_CONSUMER",
        );
        super(messageProcessor);
    }
}

