import { TOPICS } from "../kafka/Constants";
import { VendorPublisher } from "../kafka/modules/publishers/Vendor";
import { TransactionErrorCause } from "../kafka/modules/util/Interface";
import ProducerFactory from "../kafka/modules/util/Producer";
import Event, { ICreateEvent, Status } from "../models/Event.model";
import Transaction from "../models/Transaction.model";
import EventService from "./Event.service";
import { v4 as uuidv4 } from 'uuid';

interface IMeterValidationReceivedEventParams {
    user: { name: string, email: string, address: string, phoneNumber: string };
}

interface ICRMUserInitiatedEventParams {
    user: { id: string, name: string, email: string, address: string, phoneNumber: string };
}

interface EventMeterInfo {
    meterNumber: string,
    disco: string,
    vendType: 'PREPAID' | 'POSTPAID'
}

const EventAndPublishers = {
    [TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER]: VendorPublisher.publishEventForInitiatedPowerPurchase,
    [TOPICS.TOKEN_RECIEVED_FROM_VENDOR]: VendorPublisher.publishEventForTokenReceivedFromVendor,
    [TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR]: VendorPublisher.publishEventForMeterValidationRequested,
    [TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR]: VendorPublisher.publishEventForMeterValidationReceived,
} as Record<TOPICS, (...args: any[]) => Promise<void>>;

class EventPublisher {
    private event: Event;
    private publisher: (...args: any[]) => Promise<void>;
    private args: any[];

    constructor({ event, params }: {
        event: Event, params: any[]
    }) {
        this.event = event;
        event.eventType
        this.publisher = EventAndPublishers[event.eventType];
        this.args = params;
    }

    public async publish() {
        await this.publisher(...this.args)
    }

    public async getEvent() {
        return this.event;
    }
}

export class AirtimeTransactionEventService {
    private transaction: Transaction;
    private superAgent: Transaction['superagent']
    private partner: Transaction['partner']['email']
    private phoneNumber: string

    constructor(transaction: Transaction, superAgent: Transaction['superagent'], partner: string, phoneNumber: string) {
        this.transaction = transaction;
        this.superAgent = superAgent;
        this.partner = partner
        this.phoneNumber = phoneNumber
    }

    public async addPhoneNumberValidationRequestedEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.PHONENUMBER_VALIDATION_REQUESTED_FROM_PARTNER,
            eventText: TOPICS.PHONENUMBER_VALIDATION_REQUESTED_FROM_PARTNER,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addPhoneNumberValidationSuccessEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.PHONENUMBER_VALIDATION_SUCCESS,
            eventText: TOPICS.PHONENUMBER_VALIDATION_SUCCESS,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addCRMUserInitiatedEvent(info: {
        user: { id: string, name?: string, email: string, phoneNumber: string }
    }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CREATE_USER_INITIATED,
            eventText: TOPICS.CREATE_USER_INITIATED,
            payload: JSON.stringify({
                user: {
                    id: info.user.id,
                    name: info.user.name,
                    email: info.user.email,
                    phoneNumber: info.user.phoneNumber,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addCRMUserConfirmedEvent(info: ICRMUserInitiatedEventParams): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CREATE_USER_CONFIRMED,
            eventText: TOPICS.CREATE_USER_CONFIRMED,
            payload: JSON.stringify({
                user: {
                    id: info.user.id,
                    name: info.user.name,
                    email: info.user.email,
                    address: info.user.address,
                    phoneNumber: info.user.phoneNumber,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addAirtimePurchaseInitiatedEvent({ amount }: { amount: string }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER,
            eventText: TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                amount: amount
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addAirtimePurchaseConfirmedEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_RECEIVED_FROM_VENDOR,
            eventText: TOPICS.AIRTIME_TRANSACTION_COMPLETE,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addVendAirtimeRequestedFromVendorEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.VEND_AIRTIME_REQUESTED_FROM_VENDOR,
            eventText: TOPICS.VEND_AIRTIME_REQUESTED_FROM_VENDOR,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addRequestTimedOutEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.REQUEST_TIMEDOUT,
            eventText: TOPICS.REQUEST_TIMEDOUT,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addGetAirtimeFromVendorRetryEvent(error: { cause: TransactionErrorCause, code: number, }, retryCount: number): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            eventText: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                error,
                retryCount
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimePurchaseWithNewVendorEvent({ currentVendor, newVendor }: {
        currentVendor: Transaction['superagent'], newVendor: Transaction['superagent']
    }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.RETRY_AIRTIME_PURCHASE_FROM_NEW_VENDOR,
            eventText: TOPICS.RETRY_AIRTIME_PURCHASE_FROM_NEW_VENDOR,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                currentSuperAgent: currentVendor,
                newSuperAgent: newVendor,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimeReceivedFromVendorEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_RECEIVED_FROM_VENDOR,
            eventText: TOPICS.AIRTIME_RECEIVED_FROM_VENDOR,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimeTransactionRequery(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_TRANSACTION_REQUERY,
            eventText: TOPICS.AIRTIME_TRANSACTION_REQUERY,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimeTranasctionRequeryInitiated(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_TRANSACTION_REQUERY_INITIATED,
            eventText: TOPICS.AIRTIME_TRANSACTION_REQUERY_INITIATED,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimeWebhookNotificationSent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimeWebhookNotificationConfirmed(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_CONFIRMED_FROM_PARTNER,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_CONFIRMED_FROM_PARTNER,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addAirtimeSentToPartner(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_SENT_TO_PARTNER,
            eventText: TOPICS.AIRTIME_SENT_TO_PARTNER,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addAirtimeSentToUserEmail(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.AIRTIME_SENT_TO_USER_EMAIL,
            eventText: TOPICS.AIRTIME_SENT_TO_USER_EMAIL,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

}
export class DataTransactionEventService {
    private transaction: Transaction;
    private superAgent: Transaction['superagent']
    private partner: Transaction['partner']['email']
    private phoneNumber: string

    constructor(transaction: Transaction, superAgent: Transaction['superagent'], partner: string, phoneNumber: string) {
        this.transaction = transaction;
        this.superAgent = superAgent;
        this.partner = partner
        this.phoneNumber = phoneNumber
    }

    public async addPhoneNumberValidationRequestedEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.PHONENUMBER_VALIDATION_REQUESTED_FROM_PARTNER,
            eventText: TOPICS.PHONENUMBER_VALIDATION_REQUESTED_FROM_PARTNER,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addPhoneNumberValidationSuccessEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.PHONENUMBER_VALIDATION_SUCCESS,
            eventText: TOPICS.PHONENUMBER_VALIDATION_SUCCESS,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addCRMUserInitiatedEvent(info: {
        user: { id: string, name?: string, email: string, phoneNumber: string }
    }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CREATE_USER_INITIATED,
            eventText: TOPICS.CREATE_USER_INITIATED,
            payload: JSON.stringify({
                user: {
                    id: info.user.id,
                    name: info.user.name,
                    email: info.user.email,
                    phoneNumber: info.user.phoneNumber,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addCRMUserConfirmedEvent(info: ICRMUserInitiatedEventParams): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CREATE_USER_CONFIRMED,
            eventText: TOPICS.CREATE_USER_CONFIRMED,
            payload: JSON.stringify({
                user: {
                    id: info.user.id,
                    name: info.user.name,
                    email: info.user.email,
                    address: info.user.address,
                    phoneNumber: info.user.phoneNumber,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addDataPurchaseInitiatedEvent({ amount }: { amount: string }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER,
            eventText: TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                amount: amount
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addDataPurchaseConfirmedEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_RECEIVED_FROM_VENDOR,
            eventText: TOPICS.DATA_TRANSACTION_COMPLETE,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addVendDataRequestedFromVendorEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.VEND_DATA_REQUESTED_FROM_VENDOR,
            eventText: TOPICS.VEND_DATA_REQUESTED_FROM_VENDOR,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addRequestTimedOutEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.REQUEST_TIMEDOUT,
            eventText: TOPICS.REQUEST_TIMEDOUT,
            payload: JSON.stringify({
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }
        return await EventService.addEvent(event);
    }

    public async addGetDataFromVendorRetryEvent(error: { cause: TransactionErrorCause, code: number, }, retryCount: number): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            eventText: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                error,
                retryCount
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addDataPurchaseWithNewVendorEvent({ currentVendor, newVendor }: {
        currentVendor: Transaction['superagent'], newVendor: Transaction['superagent']
    }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.RETRY_DATA_PURCHASE_FROM_NEW_VENDOR,
            eventText: TOPICS.RETRY_DATA_PURCHASE_FROM_NEW_VENDOR,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                currentSuperAgent: currentVendor,
                newSuperAgent: newVendor,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addDataReceivedFromVendorEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_RECEIVED_FROM_VENDOR,
            eventText: TOPICS.DATA_RECEIVED_FROM_VENDOR,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addDataTransactionRequery(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_TRANSACTION_REQUERY,
            eventText: TOPICS.DATA_TRANSACTION_REQUERY,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                phoneNumber: this.phoneNumber,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addDataTranasctionRequeryInitiated(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_TRANSACTION_REQUERY_INITIATED,
            eventText: TOPICS.DATA_TRANSACTION_REQUERY_INITIATED,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addDataWebhookNotificationSent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addDataWebhookNotificationConfirmed(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_CONFIRMED_FROM_PARTNER,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_CONFIRMED_FROM_PARTNER,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addDataSentToPartner(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_SENT_TO_PARTNER,
            eventText: TOPICS.DATA_SENT_TO_PARTNER,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addDataSentToUserEmail(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.DATA_SENT_TO_USER_EMAIL,
            eventText: TOPICS.DATA_SENT_TO_USER_EMAIL,
            payload: JSON.stringify({
                phone: {
                    phoneNumber: this.phoneNumber,
                    amount: this.transaction.amount,
                },
                transactionId: this.transaction.id,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

}

export default class TransactionEventService {
    private transaction: Transaction;
    private meterInfo: EventMeterInfo;
    private superAgent: Transaction['superagent']
    private partner: Transaction['partner']['email']

    constructor(transaction: Transaction, meterInfo: EventMeterInfo, superAgent: Transaction['superagent'], partner: string) {
        this.transaction = transaction;
        this.meterInfo = meterInfo;
        this.superAgent = superAgent;
        this.partner = partner
    }

    public getMeterInfo(): EventMeterInfo {
        return this.meterInfo
    }

    public getTransactionInfo(): Transaction {
        return this.transaction
    }

    public async addScheduleRetryEvent({ timeStamp, waitTime}: { timeStamp: string, waitTime: number}): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION,
            eventText: TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION,
            payload: JSON.stringify({
                timeStamp,
                waitTime,
                meterNumber: this.meterInfo.meterNumber,
                disco: this.meterInfo.disco,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addScheduleRequeryEvent({ timeStamp, waitTime}: { timeStamp: string, waitTime: number}): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION,
            eventText: TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION,
            payload: JSON.stringify({
                timeStamp,
                waitTime,
                meterNumber: this.meterInfo.meterNumber,
                disco: this.meterInfo.disco,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.PENDING,
        }

        return await EventService.addEvent(event);
    }

    public async addMeterValidationFailedEvent(superAgent: string, meterInfo: {
        meterNumber: string, disco: string, vendType: string
    }) {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.METER_VALIDATION_FAILED,
            eventText: TOPICS.METER_VALIDATION_FAILED,
            payload: JSON.stringify({
                meterInfo: meterInfo,
                disco: this.transaction.disco,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addMeterValidationRequestedEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR,
            eventText: TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR,
            payload: JSON.stringify({
                meterNumber: this.meterInfo.meterNumber,
                disco: this.meterInfo.disco,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addMeterValidationReceivedEvent(userInfo: IMeterValidationReceivedEventParams): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR,
            eventText: TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR,
            payload: JSON.stringify({
                user: {
                    name: userInfo.user.name,
                    email: userInfo.user.email,
                    address: userInfo.user.address,
                    phoneNumber: userInfo.user.phoneNumber,
                },
                meterNumber: this.meterInfo.meterNumber,
                disco: this.meterInfo.disco,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addMeterValidationSentEvent(meterId: string): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.METER_VALIDATION_SENT_PARTNER,
            eventText: TOPICS.METER_VALIDATION_SENT_PARTNER,
            payload: JSON.stringify({
                merterId: meterId,
                meterNumber: this.meterInfo.meterNumber,
                disco: this.meterInfo.disco,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addCRMUserInitiatedEvent(info: ICRMUserInitiatedEventParams): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CREATE_USER_INITIATED,
            eventText: TOPICS.CREATE_USER_INITIATED,
            payload: JSON.stringify({
                user: {
                    id: info.user.id,
                    name: info.user.name,
                    email: info.user.email,
                    address: info.user.address,
                    phoneNumber: info.user.phoneNumber,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addCRMUserConfirmedEvent(info: ICRMUserInitiatedEventParams): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CREATE_USER_CONFIRMED,
            eventText: TOPICS.CREATE_USER_CONFIRMED,
            payload: JSON.stringify({
                user: {
                    id: info.user.id,
                    name: info.user.name,
                    email: info.user.email,
                    address: info.user.address,
                    phoneNumber: info.user.phoneNumber,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addDiscoUpEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR,
            eventText: TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR,
            payload: JSON.stringify({
                disco: this.meterInfo.disco,
                superagent: this.superAgent,
                patner: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }
        return await EventService.addEvent(event);
    }

    public async addPowerPurchaseInitiatedEvent(bankRefId: string, amount: string): Promise<Event> {
        const user = await this.transaction.$get('user');
        if (!user) {
            throw new Error('Transaction does not have a user');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER,
            eventText: TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER,
            payload: JSON.stringify({
                bankRefId,
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                phoneNumber: user.phoneNumber,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addPowerPurchaseRetryWithNewVendor({ bankRefId, currentVendor, newVendor }: {
        bankRefId: string, currentVendor: Transaction['superagent'], newVendor: Transaction['superagent']
    }): Promise<Event> {
        const user = await this.transaction.$get('user');
        if (!user) {
            throw new Error('Transaction does not have a user');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR,
            eventText: TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR,
            payload: JSON.stringify({
                bankRefId,
                transactionId: this.transaction.id,
                currentSuperAgent: currentVendor,
                newSuperAgent: newVendor,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                phoneNumber: user.phoneNumber,
                vendType: this.meterInfo.vendType,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addVendElectricityRequestedFromVendorEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR,
            eventText: TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: 'API',
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addTokenRequestTimedOutEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_REQUEST_TIMEDOUT,
            eventText: TOPICS.TOKEN_REQUEST_TIMEDOUT,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addGetTransactionTokenRequestedFromVendorEvent(error: { code: number, cause: string }): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.GET_TRANSACTION_TOKEN_REQUESTED_FROM_VENDOR,
            eventText: TOPICS.GET_TRANSACTION_TOKEN_REQUESTED_FROM_VENDOR,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                error,
                vendType: this.meterInfo.vendType,
                timestamp: new Date(),
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addGetTransactionTokenRequestedFromVendorRetryEvent(error: { cause: TransactionErrorCause, code: number, }, retryCount: number): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            eventText: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                vendType: this.meterInfo.vendType,
                timestamp: new Date(),
                superagent: this.superAgent,
                partnerEmail: this.partner,
                error,
                retryCount
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addGetTransactionTokenFromVendorInitiatedEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED,
            eventText: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                vendType: this.meterInfo.vendType,
                timestamp: new Date(),
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }
    public async addTokenRequestSuccessfulWithNoTokenEvent(): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_REQUEST_TIMEDOUT,
            eventText: TOPICS.TOKEN_REQUEST_TIMEDOUT,
            payload: JSON.stringify({
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addTokenReceivedEvent(token: string): Promise<Event> {
        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_RECIEVED_FROM_VENDOR,
            eventText: TOPICS.TOKEN_RECIEVED_FROM_VENDOR,
            payload: JSON.stringify({
                token,
                transactionId: this.transaction.id,
                superAgent: this.transaction.superagent,
                amount: this.transaction.amount,
                disco: this.transaction.disco,
                meterId: this.transaction.meterId,
                meterNumber: this.meterInfo.meterNumber,
                vendType: this.meterInfo.vendType,
                superagent: this.superAgent,
                partnerEmail: this.partner
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addTokenSentToUserEmailEvent(): Promise<Event> {
        const user = await this.transaction.$get('user');
        if (!user) {
            throw new Error('Transaction does not have a user');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_SENT_TO_EMAIL,
            eventText: TOPICS.TOKEN_SENT_TO_EMAIL,
            payload: JSON.stringify({
                email: user.email,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addSmsTokenSentToUserEvent(): Promise<Event> {
        const user = await this.transaction.$get('user');
        if (!user) {
            throw new Error('Transaction does not have a user');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.SMS_TOKEN_SENT_TO_USER,
            eventText: TOPICS.SMS_TOKEN_SENT_TO_USER,
            payload: JSON.stringify({
                email: user.email,
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
                phone: user.phoneNumber
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addTokenSentToPartnerEvent(): Promise<Event> {
        const partner = await this.transaction.$get('partner');
        if (!partner) {
            throw new Error('Transaction does not have a partner');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_SENT_TO_PARTNER,
            eventText: TOPICS.TOKEN_SENT_TO_PARTNER,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addTokenSentToPartnerRetryEvent(): Promise<Event> {
        const partner = await this.transaction.$get('partner');
        if (!partner) {
            throw new Error('Transaction does not have a partner');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_SENT_TO_PARTNER_RETRY,
            eventText: TOPICS.TOKEN_SENT_TO_PARTNER_RETRY,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addTokenRequestFailedNotificationToPartnerEvent(): Promise<Event> {
        const partner = await this.transaction.$get('partner');
        if (!partner) {
            throw new Error('Transaction does not have a partner');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.TOKEN_REQUEST_FAILED,
            eventText: TOPICS.TOKEN_REQUEST_FAILED,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addWebHookNotificationSentEvent(): Promise<Event> {
        const partner = await this.transaction.$get('partner')
        if (!partner) {
            throw new Error('Transaction does not have a partner')
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addWebHookNotificationConfirmedEvent(): Promise<Event> {
        const partner = await this.transaction.$get('partner')
        if (!partner) {
            throw new Error('Transaction does not have a partner')
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_CONFIRMED_FROM_PARTNER,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_CONFIRMED_FROM_PARTNER,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }

    public async addWebHookNotificationRetryEvent({ url, retryCount, timeStamp }: { url: string, retryCount: number, timeStamp: Date }): Promise<Event> {
        const partner = await this.transaction.$get('partner')
        if (!partner) {
            throw new Error('Transaction does not have a partner')
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY,
            eventText: TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                webHookUrl: url,
                retryCount,
                superagent: this.superAgent,
                timeStamp,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }
    public async addPartnerTransactionCompleteEvent(): Promise<Event> {
        const partner = await this.transaction.$get('partner');
        if (!partner) {
            throw new Error('Transaction does not have a partner');
        }

        const event: ICreateEvent = {
            transactionId: this.transaction.id,
            eventType: TOPICS.PARTNER_TRANSACTION_COMPLETE,
            eventText: TOPICS.PARTNER_TRANSACTION_COMPLETE,
            payload: JSON.stringify({
                partner: {
                    email: partner.email,
                    id: partner.id,
                },
                superagent: this.superAgent,
                partnerEmail: this.partner,
                disco: this.meterInfo.disco,
            }),
            source: this.transaction.superagent.toUpperCase(),
            eventTimestamp: new Date(),
            id: uuidv4(),
            status: Status.COMPLETE,
        }

        return await EventService.addEvent(event);
    }


}
