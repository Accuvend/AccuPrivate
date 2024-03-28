import { NextFunction, Response } from "express"
import { VendorPublisher } from "../../kafka/modules/publishers/Vendor"
import PowerUnitService from "../../services/PowerUnit.service"
import ProductService from "../../services/Product.service"
import TransactionService from "../../services/Transaction.service"
import TransactionEventService from "../../services/TransactionEvent.service"
import { DISCO_LOGO, LOGO_URL } from "../../utils/Constants"
import { BadRequestError, NotFoundError, InternalServerError } from "../../utils/Errors"
import { AuthenticatedRequest } from "../../utils/Interface"
import logger from "../../utils/Logger"
import { Status } from "../../models/Transaction.model"
import { randomUUID } from "crypto"

export default class VendorAdminController {

    static async initManualIntervention(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const { transactionId, token } = req.body

        if (!transactionId) {
            throw new BadRequestError('Transaction ID is required')
        }

        if (!token) throw new BadRequestError('Token is required')

        const transaction = await TransactionService.viewSingleTransaction(transactionId)
        if (!transaction) {
            throw new NotFoundError('Transaction not found')
        }

        if (transaction.status != Status.FLAGGED) {
            throw new BadRequestError('Transaction condition not met')
        }
        
        const logMeta = { meta: { transactionId } }

        logger.info('Transaction condition met - Successful', logMeta)
        const _product = await ProductService.viewSingleProduct(transaction.productCodeId)
        if (!_product) throw new InternalServerError('Product not found')

        const discoLogo = DISCO_LOGO[_product.productName as keyof typeof DISCO_LOGO] ?? LOGO_URL
        let powerUnit =
            await PowerUnitService.viewSinglePowerUnitByTransactionId(
                transactionId,
            );

        let tokenInResponse: string | null = null
        const meter = await transaction.$get('meter')
        if (!meter) {
            throw new InternalServerError('Meter not found')
        }

        const user = await transaction.$get('user')
        if (!user) {
            throw new InternalServerError('User not found')
        }

        const partner = await transaction.$get('partner')
        if (!partner) {
            throw new InternalServerError('Partner not found')
        }
        

        if (meter.vendType === 'PREPAID') {            
            logger.info('Token from manual intervention ', { meta: { ...logMeta, requeryToken: token } });
            await TransactionService.updateSingleTransaction(transaction.id, { tokenFromRequery: token })
            powerUnit = powerUnit
                ? await PowerUnitService.updateSinglePowerUnit(powerUnit.id, {
                    token: token,
                    transactionId: transactionId,
                })
                : await PowerUnitService.addPowerUnit({
                    id: randomUUID(),
                    transactionId: transactionId,
                    disco: meter.disco,
                    discoLogo,
                    amount: transaction.amount,
                    meterId: meter.id,
                    superagent: "BUYPOWERNG",
                    token: token,
                    tokenNumber: 0,
                    tokenUnits: "0",
                    address: transaction.meter.address,
                });
        }

        await TransactionService.updateSingleTransaction(transactionId, {
            status: Status.COMPLETE,
            powerUnitId: powerUnit?.id,
        });

        const transactionEventService = new TransactionEventService(
            transaction,
            meter,
            transaction.superagent,
            partner.email
        );
        await transactionEventService.addTokenReceivedEvent(tokenInResponse ?? '');
        logger.info('Initiated manual intervention', {
            meta: {
                transactionId,
                admin: req.user.user,
            }
        })
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
                token: tokenInResponse ?? '',
            },
        });

        res.status(200).json({
            status: "success",
            message: "Manual intervention initiated successfully",
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