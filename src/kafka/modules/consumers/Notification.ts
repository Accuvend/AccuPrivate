import { AxiosError } from "axios";
import Transaction from "../../../models/Transaction.model";
import EntityService from "../../../services/Entity/Entity.service";
import EventService from "../../../services/Event.service";
import NotificationService from "../../../services/Notification.service";
import TransactionService from "../../../services/Transaction.service";
import TransactionEventService, { AirtimeTransactionEventService } from "../../../services/TransactionEvent.service";
import WebhookService from "../../../services/Webhook.service";
import EmailService, { EmailTemplate } from "../../../utils/Email";
import logger from "../../../utils/Logger";
import NotificationUtil from "../../../utils/Notification";
import { TOPICS } from "../../Constants";
import ConsumerFactory from "../util/Consumer";
import { PublisherEventAndParameters, Registry, Topic } from "../util/Interface";
import MessageProcessor from "../util/MessageProcessor";
import { v4 as uuidv4 } from 'uuid';
import ProductService from "../../../services/Product.service";
import { SmsService } from "../../../utils/Sms";

class NotificationHandler extends Registry {
    private static async handleReceivedToken(data: PublisherEventAndParameters[TOPICS.TOKEN_RECIEVED_FROM_VENDOR]) {
        logger.info('Inside notification handler')
        const transaction = await TransactionService.viewSingleTransaction(data.transactionId)
        if (!transaction) {
            throw new Error(`Error fetching transaction with id ${data.transactionId}`)
        }

        const partnerEntity = await EntityService.viewSingleEntityByEmail(transaction.partner.email)
        if (!partnerEntity) {
            throw new Error(`Error fetching partner with email ${transaction.partner.email}`)
        }

        // Add notification successfull transaction
        const notification = await NotificationService.addNotification({
            id: uuidv4(),
            title: "Successful transaction",
            heading: "Successful ransaction",
            message: `
                Successtul transaction for ${data.meter.meterNumber} with amount ${transaction.amount}

                Bank Ref: ${transaction.bankRefId}
                Bank Comment: ${transaction.bankComment}
                Transaction Id: ${transaction.id},
                Token: ${data.meter.token}                    
                `,
            entityId: partnerEntity.id,
            read: false,
        });

        // Check if notifiecations have been sent to partner and user
        const notifyPartnerEvent = await EventService.viewSingleEventByTransactionIdAndType(transaction.id, TOPICS.TOKEN_SENT_TO_PARTNER)
        const notifyUserEvent = await EventService.viewSingleEventByTransactionIdAndType(transaction.id, TOPICS.TOKEN_SENT_TO_EMAIL)

        const transactionEventService = new TransactionEventService(transaction, {
            meterNumber: data.meter.meterNumber,
            vendType: transaction.meter.vendType,
            disco: data.meter.disco,
        }, transaction.superagent, transaction.partner.email)

        // If you've not notified the partner before, notify them
        if (!notifyPartnerEvent) {
            await NotificationUtil.sendNotificationToUser(
                partnerEntity.id,
                notification
            );
            await transactionEventService.addTokenSentToPartnerEvent()
        }

        const handlers = {
            PREPAID: new EmailTemplate().receipt,
            POSTPAID: new EmailTemplate().postpaid_receipt
        }

        const product = await ProductService.viewSingleProduct(transaction.productCodeId)
        if (!product) {
            throw new Error(`Error fetching product with id ${transaction.productCodeId}`)
        }

        transaction.disco = product.productName
        console.log({ productName: transaction.disco })

        // If you've not notified the user before, notify them
        if (!notifyUserEvent) {
            const meter = await transaction.$get('meter')
            const user = await transaction.$get('user')
            await EmailService.sendEmail({
                to: transaction.user.email,
                subject: "Token Purchase",
                html: await handlers[transaction.meter.vendType]({
                    transaction: transaction,
                    meterNumber: data.meter.meterNumber,
                    token: data.meter.token,
                    address: meter?.address ?? '',
                    name: user?.dataValues.name ?? ''
                }),
            })

            const msgTemplate = data.meter.vendType === 'POSTPAID' ? await SmsService.postpaidElectricityTemplate(transaction) : await SmsService.prepaidElectricityTemplate(transaction)
            await SmsService.sendSms(data.user.phoneNumber, msgTemplate)
                .then(async () => {
                    await transactionEventService.addSmsTokenSentToUserEvent()
                })
                .catch((error: AxiosError) => {
                    console.log(error.response?.data)
                    logger.error('Error sending sms', error)
                })
            await transactionEventService.addTokenSentToUserEmailEvent()
        }
        return
    }

    private static async handleReceivedAirtime(data: PublisherEventAndParameters[TOPICS.AIRTIME_RECEIVED_FROM_VENDOR]) {
        logger.info('Inside notification handler')
        const transaction = await TransactionService.viewSingleTransaction(data.transactionId)
        if (!transaction) {
            throw new Error(`Error fetching transaction with id ${data.transactionId}`)
        }

        const partnerEntity = await EntityService.viewSingleEntityByEmail(transaction.partner.email)
        if (!partnerEntity) {
            throw new Error(`Error fetching partner with email ${transaction.partner.email}`)
        }

        // Add notification successfull transaction
        const notification = await NotificationService.addNotification({
            id: uuidv4(),
            title: "Successful transaction",
            heading: "Successful ransaction",
            message: `
                Successtul transaction for ${data.phone.phoneNumber} with amount ${transaction.amount}

                Bank Ref: ${transaction.bankRefId}
                Bank Comment: ${transaction.bankComment}
                Transaction Id: ${transaction.id},
                Phone number: ${data.phone.phoneNumber}                    
                `,
            entityId: partnerEntity.id,
            read: false,
        });

        // Check if notifiecations have been sent to partner and user
        const notifyPartnerEvent = await EventService.viewSingleEventByTransactionIdAndType(transaction.id, TOPICS.TOKEN_SENT_TO_PARTNER)
        const notifyUserEvent = await EventService.viewSingleEventByTransactionIdAndType(transaction.id, TOPICS.TOKEN_SENT_TO_EMAIL)

        const transactionEventService = new AirtimeTransactionEventService(transaction, transaction.superagent, transaction.partner.email, data.phone.phoneNumber)

        // If you've not notified the partner before, notify them
        if (!notifyPartnerEvent) {
            await NotificationUtil.sendNotificationToUser(
                partnerEntity.id,
                notification
            );
            await transactionEventService.addAirtimeSentToPartner()
        }

        const product = await ProductService.viewSingleProduct(transaction.productCodeId)
        if (!product) {
            throw new Error(`Error fetching product with id ${transaction.productCodeId}`)
        }

        transaction.disco = product.productName

        // If you've not notified the user before, notify them
        if (!notifyUserEvent) {
            await EmailService.sendEmail({
                to: transaction.user.email,
                subject: "Token Purchase",
                html: await new EmailTemplate().airTimeReceipt({
                    transaction: transaction,
                    phoneNumber: data.phone.phoneNumber,
                }),
            })

            const msgTemplate = await SmsService.airtimeTemplate(transaction)
            await SmsService.sendSms(data.phone.phoneNumber, msgTemplate).catch((error: AxiosError) => {
                console.log(error.response?.data)
                logger.error('Error sending sms', error)
            })
            await transactionEventService.addAirtimeSentToUserEmail()
        }
        return
    }

    private static async failedTokenRequest(data: PublisherEventAndParameters[TOPICS.TOKEN_REQUEST_FAILED]) {
        logger.info('Inside notification handler')
        const transaction = await TransactionService.viewSingleTransaction(data.transactionId)
        if (!transaction) {
            throw new Error(`Error fetching transaction with id ${data.transactionId}`)
        }

        const partnerEntity = await EntityService.viewSingleEntityByEmail(transaction.partner.email)
        if (!partnerEntity) {
            throw new Error(`Error fetching partner with email ${transaction.partner.email}`)
        }

        // Add notification successfull transaction
        const notification = await NotificationService.addNotification({
            id: uuidv4(),
            title: "Failed transaction",
            heading: "Failed ransaction",
            message: `
                Failed transaction for ${data.meter.meterNumber} with amount ${transaction.amount}

                Bank Ref: ${transaction.bankRefId}
                Bank Comment: ${transaction.bankComment}
                Transaction Id: ${transaction.id},
                `,
            entityId: partnerEntity.id,
            read: false,
        });

        // Check if notifiecations have been sent to partner and user
        const notifyPartnerEvent = await EventService.viewSingleEventByTransactionIdAndType(transaction.id, TOPICS.TOKEN_REQUEST_FAILED)
        const notifyUserEvent = await EventService.viewSingleEventByTransactionIdAndType(transaction.id, TOPICS.TOKEN_REQUEST_FAILED)

        const transactionEventService = new TransactionEventService(transaction, {
            meterNumber: data.meter.meterNumber,
            vendType: transaction.meter.vendType,
            disco: data.meter.disco,
        }, transaction.superagent, transaction.partner.email)

        // If you've not notified the partner before, notify them
        if (!notifyPartnerEvent) {
            await NotificationUtil.sendNotificationToUser(
                partnerEntity.id,
                notification
            );
            await transactionEventService.addTokenRequestFailedNotificationToPartnerEvent()
        }

        // If you've not notified the user before, notify them
        if (!notifyUserEvent) {
            await EmailService.sendEmail({
                to: transaction.user.email,
                subject: "Token Purchase",
                html: await new EmailTemplate().failedTransaction({
                    transaction: transaction,
                }),
            })
            await transactionEventService.addTokenRequestFailedNotificationToPartnerEvent()
        }
        return
    }

    static registry = {
        [TOPICS.TOKEN_SENT_TO_PARTNER_RETRY]: this.handleReceivedToken,
        [TOPICS.TOKEN_RECIEVED_FROM_VENDOR]: this.handleReceivedToken,
        [TOPICS.TOKEN_REQUEST_FAILED]: this.failedTokenRequest,
        [TOPICS.AIRTIME_RECEIVED_FROM_VENDOR]: this.handleReceivedAirtime,
    }
}

export default class NotificationConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor(NotificationHandler.registry, 'NOTIFICATION_CONSUMER')
        super(messageProcessor)
    }
}