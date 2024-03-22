import { NextFunction, Request, Response } from "express";
import TransactionService from "../../../services/Transaction.service";
import Transaction, {
    ITransaction,
    PaymentType,
    Status,
    TransactionType,
} from "../../../models/Transaction.model";
import { v4 as uuidv4 } from "uuid";
import UserService from "../../../services/User.service";
import MeterService from "../../../services/Meter.service";
import User from "../../../models/User.model";
import Meter, { IMeter } from "../../../models/Meter.model";
import VendorService from "../../../services/VendorApi.service";
import {
    DEFAULT_ELECTRICITY_PROVIDER,
    discoProductMapping,
} from "../../../utils/Constants";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../../../utils/Errors";
import Entity from "../../../models/Entity/Entity.model";
import EventService from "../../../services/Event.service";
import { AuthenticatedRequest } from "../../../utils/Interface";
import Event, { TokenRetryEventPayload } from "../../../models/Event.model";
import { VendorPublisher } from "../../../kafka/modules/publishers/Vendor";
import { CRMPublisher } from "../../../kafka/modules/publishers/Crm";
import { TokenHandlerUtil } from "../../../kafka/modules/consumers/Token";
import { TOPICS } from "../../../kafka/Constants";
import { PublisherEventAndParameters, Registry, TransactionErrorCause } from "../../../kafka/modules/util/Interface";
import { randomUUID } from "crypto";
import ConsumerFactory from "../../../kafka/modules/util/Consumer";
import MessageProcessorFactory from "../../../kafka/modules/util/MessageProcessor";
import logger, { Logger } from "../../../utils/Logger";
import { error } from "console";
import TransactionEventService from "../../../services/TransactionEvent.service";
import WebhookService from "../../../services/Webhook.service";
import { AirtimeVendController } from "./Airtime.controller";
import VendorRates from "../../../models/VendorRates.model";
import ProductService from "../../../services/Product.service";
import VendorProduct, { VendorProductSchemaData } from "../../../models/VendorProduct.model";
import Vendor from "../../../models/Vendor.model";
require('newrelic');
import VendorProductService from "../../../services/VendorProduct.service";
import VendorDocService from '../../../services/Vendor.service'
import { generateRandomString, generateRandonNumbers } from "../../../utils/Helper";
import ResponseTrimmer from "../../../utils/ResponseTrimmer";
import PowerUnit from "../../../models/PowerUnit.model";
import PowerUnitService from "../../../services/PowerUnit.service";
interface valideMeterRequestBody {
    meterNumber: string;
    superagent: "BUYPOWERNG" | "BAXI";
    vendType: "PREPAID" | "POSTPAID";
    disco: string;
    phoneNumber: string;
    partnerName: string;
    email: string;
    channel: ITransaction['channel']
}

interface vendTokenRequestBody {
    meterNumber: string;
    provider: "BUYPOWERNG" | "BAXI";
    disco: string;
    phoneNumber: string;
    partnerName: string;
    email: string;
}

interface RequestTokenValidatorParams {
    bankRefId: string;
    transactionId: string;
    vendorDiscoCode: string
}

interface RequestTokenValidatorResponse {
    user: User;
    meter: Meter;
    transaction: Transaction;
    partnerEntity: Entity;
}

interface UserInfo {
    name: string,
    email: string,
    phoneNumber: string,
    id: string
}

interface ValidateMeterParams extends valideMeterRequestBody {
    transaction: Transaction,
    userInfo: UserInfo
}

interface RequestTokenUtilParams {
    transaction: Transaction,
    meterInfo: {
        meterNumber: string,
        disco: string,
        vendType: 'PREPAID' | 'POSTPAID',
        id: string,
    },
    previousRetryEvent: Event
}


class VendorTokenHandler implements Registry {
    private tokenSent = false
    private transaction: Transaction
    private response: () => Response
    private consumerInstance: ConsumerFactory

    private async handleTokenReceived(data: PublisherEventAndParameters[TOPICS.TOKEN_RECIEVED_FROM_VENDOR]) {
        try {
            if (this.consumerInstance) {
                this.consumerInstance.shutdown()
            }

            const product = await ProductService.viewSingleProductByMasterProductCode(this.transaction.disco)
            if (!product) {
                logger.warn('Product not found', { meta: { transactionId: this.transaction.id } })
                throw new InternalServerError('Product not found')
            }

            this.response().status(200).send({
                status: 'success',
                message: 'Token purchase initiated successfully',
                data: {
                    transaction: {
                        disco: product.productName,
                        "amount": this.transaction.amount,
                        "transactionId": this.transaction.id,
                        "id": this.transaction.id,
                        "bankRefId": this.transaction.bankRefId,
                        "bankComment": this.transaction.bankComment,
                        "productType": this.transaction.productType,
                        "transactionTimestamp": this.transaction.transactionTimestamp,
                    },
                    meter: { ...data.meter, disco: product.productName },
                    token: data.meter.token
                }
            })

            this.tokenSent = true
        } catch (error) {
            Logger.kafkaFailure.info('Already sent token to user', { meta: { transactionId: this.transaction.id } })
        }
    }

    constructor(transaction: Transaction, response: Response) {
        this.transaction = transaction
        this.response = () => response
        return this
    }

    public getTokenState() {
        return this.tokenSent
    }

    public setConsumerInstance(consumerInstance: ConsumerFactory) {
        this.consumerInstance = consumerInstance
    }

    public registry = {
        [TOPICS.TOKEN_RECIEVED_FROM_VENDOR]: this.handleTokenReceived.bind(this)
    }
}


class VendorTokenReceivedSubscriber extends ConsumerFactory {
    private tokenHandler: VendorTokenHandler

    constructor(transaction: Transaction, response: Response) {
        const tokenHandler = new VendorTokenHandler(transaction, response)
        const messageProcessor = new MessageProcessorFactory(tokenHandler.registry, transaction.id)
        super(messageProcessor)
        this.tokenHandler = tokenHandler
    }

    public getTokenSentState() {
        return this.tokenHandler.getTokenState()
    }

    public setConsumerInstance(consumerInstance: ConsumerFactory) {
        this.tokenHandler.setConsumerInstance(consumerInstance)
    }
}

// Validate request parameters for each controller
class VendorControllerValdator {
    static async requestToken({
        bankRefId,
        transactionId,
        vendorDiscoCode
    }: RequestTokenValidatorParams): Promise<RequestTokenValidatorResponse> {
        if (!bankRefId)
            throw new BadRequestError("Transaction reference is required");

        const transactionRecord: Transaction | null =
            await TransactionService.viewSingleTransaction(transactionId);
        if (!transactionRecord) {
            throw new BadRequestError("Transaction does not exist");
        }

        // Check if Disco is Up
        const checKDisco: boolean | Error =
            await VendorService.buyPowerCheckDiscoUp(vendorDiscoCode);
        if (!checKDisco && transactionRecord.superagent === 'BUYPOWERNG') throw new BadRequestError("Disco is currently down");

        // Check if bankRefId has been used before
        const existingTransaction: Transaction | null =
            await TransactionService.viewSingleTransactionByBankRefID(bankRefId);
        if (existingTransaction instanceof Transaction) {
            throw new BadRequestError("Bank reference has been used before");
        }

        const transactionHasCompleted =
            transactionRecord.status === Status.COMPLETE;
        if (transactionHasCompleted) {
            throw new BadRequestError("Transaction has been completed before");
        }

        //  Get Meter
        const meter: Meter | null = await transactionRecord.$get("meter");
        if (!meter) {
            throw new InternalServerError(
                `Transaction ${transactionRecord.id} does not have a meter`
            );
        }

        const user = await transactionRecord.$get("user");
        if (!user) {
            throw new InternalServerError(
                `Transaction ${transactionRecord.id} does not have a user`
            );
        }

        const partner = await transactionRecord.$get("partner");
        const entity = await partner?.$get("entity");
        if (!entity) {
            throw new InternalServerError("Entity not found");
        }

        return {
            user,
            meter,
            transaction: transactionRecord,
            partnerEntity: entity,
        };
    }

    static async validateMeter({ meterNumber, disco, vendType, transaction }: {
        meterNumber: string, disco: string, vendType: 'PREPAID' | 'POSTPAID', transaction: Transaction
    }) {
        async function validateWithBuypower() {
            Logger.apiRequest.info('Validating meter with buypower', { meta: { transactionId: transaction.id } })
            const buypowerVendor = await VendorDocService.viewSingleVendorByName('BUYPOWERNG')
            if (!buypowerVendor) {
                throw new InternalServerError('Buypower vendor not found')
            }

            const buypowerVendorProduct = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(buypowerVendor.id, transaction.productCodeId)
            if (!buypowerVendorProduct) {
                throw new InternalServerError('Buypower vendor product not found')
            }

            return VendorService.buyPowerValidateMeter({
                transactionId: transaction.id,
                meterNumber,
                disco: buypowerVendorProduct.schemaData.code,
                vendType,
            })
        }

        async function validateWithBaxi() {
            Logger.apiRequest.info('Validating meter with baxi', { meta: { transactionId: transaction.id } })
            const baxiVendor = await VendorDocService.viewSingleVendorByName('BAXI')
            if (!baxiVendor) {
                throw new InternalServerError('Baxi vendor not found')
            }

            const baxiVendorProduct = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(baxiVendor.id, transaction.productCodeId)
            if (!baxiVendorProduct) {
                throw new InternalServerError('Baxi vendor product not found')
            }

            const res = await VendorService.baxiValidateMeter(baxiVendorProduct.schemaData.code, meterNumber, vendType, transaction.id).then(r => r.data)
            return res
        }

        async function validateWithIrecharge() {
            Logger.apiRequest.info('Validating meter with irecharge', { meta: { transactionId: transaction.id } })
            const irechargeVendor = await VendorDocService.viewSingleVendorByName('IRECHARGE')
            if (!irechargeVendor) {
                throw new InternalServerError('Irecharge vendor not found')
            }

            const irechargeVendorProduct = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(irechargeVendor.id, transaction.productCodeId)
            if (!irechargeVendorProduct) {
                throw new InternalServerError('Irecharge vendor product not found')
            }

            console.log({
                transactionId: transaction.id,
                meterNumber,
                disco: irechargeVendorProduct.schemaData.code,
                vendType,
            })
            return VendorService.irechargeValidateMeter(irechargeVendorProduct.schemaData.code, meterNumber, transaction.vendorReferenceId, transaction.id).then((res) => ({ ...res, ...res.customer, }))
        }

        // Try with the first super agetn, if it fails try with the next, then update the transaction superagent
        let superAgents = await TokenHandlerUtil.getSortedVendorsAccordingToCommissionRate(transaction.productCodeId, parseFloat(transaction.amount))
        //  Put irecharge first 

        interface IResponses {
            BUYPOWERNG: Awaited<ReturnType<typeof validateWithBuypower>>,
            BAXI: Awaited<ReturnType<typeof validateWithBaxi>>,
            IRECHARGE: Awaited<ReturnType<typeof validateWithIrecharge>>,
        }

        let response: IResponses[keyof IResponses]

        // Set first super agent to be the one in the transaction
        const previousSuperAgent = transaction.superagent
        superAgents.splice(superAgents.indexOf(previousSuperAgent), 1)
        superAgents.unshift(previousSuperAgent)

        const transactionEventService = new EventService.transactionEventService(transaction, { meterNumber, disco, vendType }, superAgents[0], transaction.partner.email)
        let selectedVendor = superAgents[0]
        let returnedResponse: IResponses[keyof IResponses] | Error = new Error('No response')
        let continueValidation = true
        const startTime = new Date()

        while (continueValidation) {
            const currentTime = new Date()

            const timeDifference = currentTime.getTime() - startTime.getTime()
            const timeDifferenceIsMoreThanOneMinute = timeDifference > 60000
            if (timeDifferenceIsMoreThanOneMinute) {
                await TransactionService.updateSingleTransaction(transaction.id, { status: Status.FAILED })
                Logger.apiRequest.info(`Meter could not be validated`, { meta: { transactionId: transaction.id } })
                throw new BadRequestError('Meter could not be validated')
            }

            for (const superAgent of superAgents) {
                try {
                    console.log({ superAgent })
                    response = superAgent === "BUYPOWERNG" ? await validateWithBuypower() :
                        superAgent === "BAXI" ? await validateWithBaxi() : await validateWithIrecharge()
                    if (response instanceof Error) {
                        throw response
                    }
                    console.log({ superAgent })
                    const token = superAgent === 'IRECHARGE' ? (response as IResponses['IRECHARGE']).access_token : undefined
                    await transaction.update({ superagent: superAgent as any, irechargeAccessToken: token })

                    selectedVendor = superAgent
                    returnedResponse = response
                    continueValidation = false
                    break
                } catch (error) {
                    console.log(error)
                    logger.error(`Error validating meter with ${superAgent}`, { meta: { transactionId: transaction.id } })

                    await transactionEventService.addMeterValidationFailedEvent(superAgent, {
                        meterNumber: meterNumber,
                        disco: disco,
                        vendType: vendType
                    })

                    console.log(superAgents.indexOf(superAgent))
                    const isLastSuperAgent = superAgents.indexOf(superAgent) === superAgents.length - 1
                    if (isLastSuperAgent) {
                        continue
                    } else {
                        Logger.apiRequest.info(`Trying to validate meter with next super agent - ${superAgents[superAgents.indexOf(superAgent) + 1]}`, { meta: { transactionId: transaction.id } })
                    }
                }
            }
        }

        // Try validating with IRECHARGE 
        try {
            Logger.apiRequest.info(`Backup validation with IRECHARGE`, { meta: { transactionId: transaction.id } })
            if (selectedVendor != 'IRECHARGE') {
                Logger.apiRequest.info(`Trying to backup validation with IRECHARGE`, { meta: { transactionId: transaction.id } })
                const response = await validateWithIrecharge()
                const token = response.access_token

                await transaction.update({ irechargeAccessToken: token })
            }
        } catch (error) {
            logger.error(`Error validating meter with IRECHARGE`, { meta: { transactionId: transaction.id } })
        }

        return returnedResponse
    }
}

export default class VendorController {

    static async validateMeterMock(req: Request, res: Response, next: NextFunction) {
        const {
            meterNumber,
            disco,
            phoneNumber,
            email,
            vendType,
        }: valideMeterRequestBody = req.body;
        const partnerId = (req as any).key;

        res.status(200).json({
            status: "success",
            data: {
                "transaction": {
                    "transactionId": "3f8d14d9-9933-44a5-ac46-1840beed2500",
                    "status": "PENDING"
                },
                "meter": {
                    "disco": "ECEKEPE",
                    "number": "12345678910",
                    "address": "012 Fake Cresent, Fake City, Fake State",
                    "phone": "0801234567",
                    "vendType": "PREPAID",
                    "name": "Ciroma Chukwuma Adekunle"
                }
            },
        });


    }

    static async validateMeter(req: Request, res: Response, next: NextFunction) {
        const {
            meterNumber,
            phoneNumber,
            email,
            vendType,
            channel
        }: valideMeterRequestBody = req.body;
        let { disco } = req.body;
        const partnerId = (req as any).key;

        const transactionId = uuidv4()
        const errorMeta = { transactionId: transactionId }
        const existingProductCodeForDisco = await ProductService.viewSingleProductByProductNameAndVendType(disco, vendType)
        if (!existingProductCodeForDisco) {
            throw new NotFoundError('Product code not found for disco', errorMeta)
        }

        disco = existingProductCodeForDisco.masterProductCode

        if (existingProductCodeForDisco.category !== 'ELECTRICITY') {
            throw new BadRequestError('Invalid product code for electricity', errorMeta)
        }

        const superagent = await TokenHandlerUtil.getBestVendorForPurchase(existingProductCodeForDisco.id, 1000);
        const transactionTypes = {
            'ELECTRICITY': TransactionType.ELECTRICITY,
            'AIRTIME': TransactionType.AIRTIME,
            'DATA': TransactionType.DATA,
            'CABLE': TransactionType.CABLE,
        }
        const transactionReference = generateRandomString(10)
        const transaction: Transaction =
            await TransactionService.addTransactionWithoutValidatingUserRelationship({
                id: transactionId,
                amount: "",
                status: Status.PENDING,
                superagent: superagent,
                paymentType: PaymentType.PAYMENT,
                transactionTimestamp: new Date(),
                disco: disco,
                partnerId: partnerId,
                reference: transactionReference,
                transactionType: transactionTypes[existingProductCodeForDisco.category],
                productCodeId: existingProductCodeForDisco.id,
                retryRecord: [],
                previousVendors: [superagent],
                vendorReferenceId: generateRandonNumbers(12),
                productType: transactionTypes[existingProductCodeForDisco.category],
                channel
            });

        Logger.apiRequest.info("Validate meter requested", { meta: { transactionId: transaction.id, ...req.body } })
        const transactionEventService = new EventService.transactionEventService(
            transaction, { meterNumber, disco, vendType }, superagent, transaction.partner.email
        );

        await transactionEventService.addMeterValidationRequestedEvent();
        await VendorPublisher.publishEventForMeterValidationRequested({
            meter: { meterNumber, disco, vendType },
            transactionId: transaction.id,
            superAgent: superagent
        });

        const vendor = await Vendor.findOne({ where: { name: superagent } })
        if (!vendor) throw new InternalServerError('Vendor not found', errorMeta)

        const vendorProduct = await VendorProduct.findOne({
            where: {
                productId: existingProductCodeForDisco.id,
                vendorId: vendor?.id
            }
        })
        if (!vendorProduct) {
            throw new NotFoundError('Vendor product not found', errorMeta)
        }

        const vendorDiscoCode = (vendorProduct.schemaData as VendorProductSchemaData.BUYPOWERNG).code
        // We Check for Meter User *
        const response = await VendorControllerValdator.validateMeter({ meterNumber, disco: vendorDiscoCode, vendType, transaction })
        const userInfo = {
            name: (response as any).name,
            email: email,
            address: (response as any).address,
            phoneNumber: phoneNumber,
            id: uuidv4(),
        };

        await transactionEventService.addMeterValidationReceivedEvent({ user: userInfo });
        await VendorPublisher.publishEventForMeterValidationReceived({
            meter: { meterNumber, disco, vendType },
            transactionId: transaction.id,
            user: userInfo,
        });

        await transactionEventService.addCRMUserInitiatedEvent({ user: userInfo });
        await CRMPublisher.publishEventForInitiatedUser({
            user: userInfo,
            transactionId: transaction.id,
        })

        // // Add User if no record of user in db
        const user = await UserService.addUserIfNotExists({
            id: userInfo.id,
            address: (response as any).address,
            email: email,
            name: (response as any).name,
            phoneNumber: phoneNumber,
        });

        if (!user)
            throw new InternalServerError("An error occured while validating meter", errorMeta);

        await TransactionService.updateSingleTransaction(transaction.id, { userId: user?.id, irechargeAccessToken: (response as any).access_token, });
        await transactionEventService.addCRMUserConfirmedEvent({ user: userInfo });
        await CRMPublisher.publishEventForConfirmedUser({
            user: userInfo,
            transactionId: transaction.id,
        })

        // Check if disco is up
        const discoUp =
            superagent === "BUYPOWERNG"
                ? await VendorService.buyPowerCheckDiscoUp(vendorDiscoCode).catch((e) => e)
                : await VendorService.baxiCheckDiscoUp(vendorDiscoCode).catch((e) => e);

        const discoUpEvent = discoUp instanceof Boolean ? await transactionEventService.addDiscoUpEvent() : false
        discoUpEvent && await VendorPublisher.publishEventForDiscoUpCheckConfirmedFromVendor({
            transactionId: transaction.id,
            meter: { meterNumber, disco, vendType },
        })

        const retryRecord = {
            retryCount: 1,
            attempt: 1,
            reference: [transactionReference],
            vendor: superagent,
        } as ITransaction['retryRecord'][number]

        await transaction.update({
            retryRecord: [retryRecord]
        })

        // // TODO: Publish event for disco up to kafka
        const meter: Meter = await MeterService.addMeter({
            id: uuidv4(),
            address: (response as any).address,
            meterNumber: meterNumber,
            userId: user.id,
            disco: disco,
            vendType,
        });

        const update = await TransactionService.updateSingleTransaction(transaction.id, { meterId: meter.id })
        console.log({ update: update?.superagent })
        const successful =
            transaction instanceof Transaction &&
            user instanceof User &&
            meter instanceof Meter;
        if (!successful)
            throw new InternalServerError("An error occured while validating meter", errorMeta);

        // const responseData = { status: 'success', message: 'Meter validated successfully', data: { transaction: transaction, meter: meter } }
        // updated to allow proper mapping
        const responseData = {
            status: 'success',
            message: 'Meter validated successfully',
            data: {
                transaction: {
                    "id": transaction?.id
                },
                meter: {
                    "address": meter?.address,
                    "meterNumber": meter?.meterNumber,
                    "vendType": meter?.vendType,
                }
            }
        }
        res.status(200).json(responseData);

        Logger.apiRequest.info("Meter validated successfully", { meta: { transactionId: transaction.id, ...responseData } })
        await transactionEventService.addMeterValidationSentEvent(meter.id);
        await VendorPublisher.publishEventForMeterValidationSentToPartner({
            transactionId: transaction.id,
            meter: { meterNumber, disco, vendType, id: meter.id },
        })
    }

    static async requestToken(req: Request, res: Response, next: NextFunction) {
        const { transactionId, bankComment, amount, vendType } =
            req.query as Record<string, any>;
        console.log({ transactionId, bankComment, amount, vendType })

        const errorMeta = { transactionId: transactionId };
        // REMOVED !!!! BECAUSE WE SHOULD NEVER AUTOGENERATE THIS IN THE CODE
        const bankRefId = req.query.bankRefId as string;
        if (parseInt(amount.toString()) < 1000) {
            logger.error('Amount must be greater than 1000', { meta: { transactionId } })
            throw new BadRequestError("Amount must be greater than 100");
        }

        const transaction: Transaction | null =
            await TransactionService.viewSingleTransaction(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaction not found", errorMeta);
        }

        if (transaction.status === Status.COMPLETE as any) {
            throw new BadRequestError("Transaction already completed");
        }

        if (transaction.status !== Status.PENDING) {
            throw new BadRequestError("Transaction not in pending state");
        }

        Logger.apiRequest.info('Requesting token for transaction', { meta: { transactionId: transaction.id, ...req.query } })

        const meter = await transaction.$get("meter");
        if (!meter) {
            throw new InternalServerError("Transaction does not have a meter", errorMeta);
        }

        const vendor = await Vendor.findOne({ where: { name: transaction.superagent } })
        if (!vendor) throw new InternalServerError('Vendor not found', errorMeta)

        const vendorProduct = await VendorProduct.findOne({
            where: {
                productId: transaction.productCodeId,
                vendorId: vendor.id
            }
        })
        if (!vendorProduct) {
            throw new NotFoundError('Vendor product not found', errorMeta)
        }

        const vendorDiscoCode = (vendorProduct.schemaData as VendorProductSchemaData.BUYPOWERNG).code

        const meterInfo = {
            meterNumber: meter.meterNumber,
            disco: vendorDiscoCode,
            vendType: meter.vendType,
            id: meter.id,
        }
        const updatedTransaction = await TransactionService.viewSingleTransaction(transactionId)
        if (!updatedTransaction) { throw new NotFoundError('Transaction not found') }

        const transactionEventService = new EventService.transactionEventService(updatedTransaction, meterInfo, transaction.superagent, transaction.partner.email);
        await transactionEventService.addPowerPurchaseInitiatedEvent(bankRefId, amount);

        const { user, partnerEntity } = await VendorControllerValdator.requestToken({ bankRefId, transactionId, vendorDiscoCode });
        await transaction.update({
            bankRefId: bankRefId,
            bankComment,
            amount,
            status: Status.PENDING,
        });

        const vendorTokenConsumer = new VendorTokenReceivedSubscriber(transaction, res)
        await vendorTokenConsumer.start()
        vendorTokenConsumer.setConsumerInstance(vendorTokenConsumer)
        try {
            console.log({ transaction: transaction.superagent })
            const response = await VendorPublisher.publishEventForInitiatedPowerPurchase({
                transactionId: transaction.id,
                user: {
                    name: user.name as string,
                    email: user.email,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                },
                partner: {
                    email: partnerEntity.email,
                },
                meter: meterInfo,
                superAgent: transaction.superagent,
                vendorRetryRecord: {
                    retryCount: 1,
                }
            })

            await TransactionService.updateSingleTransaction(transaction.id, { status: Status.INPROGRESS })

            if (response instanceof Error) {
                throw error
            }

            const updatedTransaction = await TransactionService.viewSingleTransaction(transactionId)
            if (!updatedTransaction) { throw new NotFoundError('Transaction not found') }

            const _transaction = updatedTransaction.dataValues as Partial<Transaction>
            delete _transaction.meter
            delete _transaction.powerUnit
            delete _transaction.events

            const tokenHasBeenSentFromVendorConsumer = vendorTokenConsumer.getTokenSentState()
            if (!tokenHasBeenSentFromVendorConsumer && _transaction) {
                // removed to update endpoint reponse mapping
                // const responseData = { status: 'success', message: 'Token purchase initiated successfully', data: { transaction: ResponseTrimmer.trimTransactionResponse(_transaction)}}
                const _product = await ProductService.viewSingleProduct(_transaction.productCodeId || "")
                const responseData = {
                    status: 'success',
                    message: 'Token purchase initiated successfully',
                    data: {
                        transaction: {
                            disco: _product?.productName,
                            "amount": _transaction?.amount,
                            "transactionId": _transaction?.id,
                            "id": _transaction?.id,
                            "productType": _transaction?.productType,
                            "transactionTimestamp": _transaction?.transactionTimestamp,
                        }
                    }
                }

                // Delay in background  for 30 seconds to check if token has been gotten from vendor
                // IF not gotten, send response
                // IF gotten, send response

                setTimeout(async () => {
                    const tokenHasBeenSentFromVendorConsumer = vendorTokenConsumer.getTokenSentState()
                    if (!tokenHasBeenSentFromVendorConsumer) {
                        responseData.message = 'Transaction is being processed'
                        await vendorTokenConsumer.shutdown()
                        res.status(200).json(responseData);
                        Logger.apiRequest.info('Token purchase initiated successfully', { meta: { transactionId: transaction.id, ...responseData } })
                        return
                    }

                    await transactionEventService.addTokenSentToPartnerEvent();
                    return
                }, 60000)

                return
            } else {
                const powerUnit = await transaction.$get('powerUnit')
                if (!powerUnit) {
                    throw new InternalServerError('Power unit not found')
                }

                // Send response if token has been gotten from vendor
                res.status(200).json({
                    status: 'success',
                    message: 'Token purchase initiated successfully',
                    data: {
                        transaction: {
                            disco: transaction.disco,
                            "amount": transaction.amount,
                            "transactionId": transaction.id,
                            "id": transaction.id,
                            "bankRefId": transaction.bankRefId,
                            "bankComment": transaction.bankComment,
                            "productType": transaction.productType,
                            "transactionTimestamp": transaction.transactionTimestamp,
                        },
                        meter: { ...meterInfo, token: powerUnit.token }
                    }
                })
                
                // TODO: Add Code to send response if token has been gotten from vendor
                await transactionEventService.addTokenSentToPartnerEvent();
                return
            }
            


            return
        } catch (error) {
            logger.error('SuttingDown vendor token consumer of id')
            await vendorTokenConsumer.shutdown()
        }
    }

    static async checkDisco(req: Request, res: Response) {
        const { disco } = req.query;

        let result = false;
        switch (DEFAULT_ELECTRICITY_PROVIDER) {
            case "BAXI":
                result = await VendorService.baxiCheckDiscoUp(disco as string);
                break;
            case "BUYPOWERNG":
                result = await VendorService.buyPowerCheckDiscoUp(disco as string);
                break;
            default:
                throw new InternalServerError("An error occured");
        }

        res.status(200).json({
            status: "success",
            message: "Disco check successful",
            data: {
                discAvailable: result,
            },
        });
    }

    static async confirmPayment(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const { bankRefId } = req.body;

        const transaction =
            await TransactionService.viewSingleTransactionByBankRefID(bankRefId);
        if (!transaction) throw new NotFoundError("Transaction not found");

        if (transaction.transactionType === TransactionType.AIRTIME) {
            return await AirtimeVendController.confirmPayment(req, res, next)
        }

        const meter = await transaction.$get("meter");
        if (!meter)
            throw new InternalServerError("Transaction does not have a meter");

        const partner = await transaction.$get("partner");
        const entity = await partner?.$get("entity");
        if (!entity) throw new InternalServerError("Entity not found");

        // Check event for request token
        const requestTokenEvent = await Event.findOne({
            where: { transactionId: transaction.id, eventType: "POWER_PURCHASE_INITIATED_BY_CUSTOMER" },
        });

        if (!requestTokenEvent) {
            throw new BadRequestError("Request token event not found");
        }

        new EventService.transactionEventService(transaction, {
            meterNumber: meter.meterNumber,
            disco: transaction.disco,
            vendType: meter.vendType as IMeter["vendType"],
        }, transaction.superagent, transaction.partner.email).addPartnerTransactionCompleteEvent();

        res.status(200).json({
            status: "success",
            message: "Payment confirmed successfully",
            data: {
                transaction: {
                    transactionId: transaction.id,
                    status: transaction.status,
                },
                meter: {
                    disco: meter.disco,
                    number: meter.meterNumber,
                    address: meter.address,
                    phone: meter.userId,
                    vendType: meter.vendType,
                    name: meter.userId,
                },
            },
        });
    }
}