import { ConsumerSubscribeTopics, EachMessagePayload } from "kafkajs";
import { TOPICS } from "../../Constants";
import Transaction from "../../../models/Transaction.model";

export type Topic = TOPICS;

export interface CustomMessageFormat {
    topic: Topic;
    partition: number;
    offset: string;
    value: any;
    timestamp: string;
    headers: any;
}

export interface MeterInfo {
    meterNumber: string;
    disco: string;
    vendType: "PREPAID" | "POSTPAID";
}

interface User {
    name?: string;
    address?: string;
    phoneNumber: string;
    email: string;
}

interface MeterValidationRequested {
    user: User;
    meter: MeterInfo;
    transactionId: string;
    log?: 1 | 0
}

interface Partner {
    email: string;
}

export enum TransactionErrorCause {
    TRANSACTION_TIMEDOUT = "TRANSACTION_TIMEDOUT",
    TRANSACTION_FAILED = "TRANSACTION_FAILED",
    UNKNOWN = "UNKNOWN",
    MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED = "MAINTENANCE_ACCOUNT_ACTIVATION_REQUIRED",
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
    NO_TOKEN_IN_RESPONSE = "NO_TOKEN_IN_RESPONSE",
    RESCHEDULED_BEFORE_WAIT_TIME = "RESCHEDULED_BEFORE_WAIT_TIME"
}

export interface VendorRetryRecord {
    retryCount: number;
}

export interface PublisherEventAndParameters extends Record<TOPICS, { log?: 1 | 0, [k in typeof TOPICS]: PublisherEventAndParameters[k]  }> {
    [TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION]: {
        log?: 1 | 0,
        timeStamp: string,
        delayInSeconds: number,
        scheduledMessagePayload: PublisherEventAndParameters[TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_REQUERY]
    }
    [TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION]: {
        log?: 1 | 0,
        timeStamp: string,
        delayInSeconds: number,
        scheduledMessagePayload: PublisherEventAndParameters[TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER] & {
            retryRecord: Transaction['retryRecord'],
            newVendor: Transaction['superagent'],
            newTransactionReference: string,
            irechargeAccessToken: string,
            previousVendors: Transaction['superagent'][],
        }
    }
    [TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR]: {
        log?: 1 | 0,
        meter: MeterInfo;
        transactionId: string;
        superAgent: Transaction['superagent']
    };
    [TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR]: MeterValidationRequested;
    [TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
    [TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        transactionId: string;
        superAgent: Transaction['superagent'],
    };
    [TOPICS.TOKEN_RECIEVED_FROM_VENDOR]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string; token: string };
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string; token: string };
        user: User;
        partner: Partner;
        transactionId: string;
        retryCount: number;
        superAgent: Transaction['superagent'],
    };
    [TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_REQUERY]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        transactionId: string;
        timeStamp: Date;
        error: { code: number; cause: TransactionErrorCause };
        retryCount: number;
        superAgent: Transaction['superagent'],
        waitTime: number,
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        transactionId: string;
        timeStamp: Date;
        superAgent: Transaction['superagent']
    };
    [TOPICS.PARTNER_TRANSACTION_COMPLETE]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.TOKEN_SENT_TO_PARTNER]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.TOKEN_SENT_TO_EMAIL]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string };
        user: User & { id: string };
        transactionId: string;
    };
    [TOPICS.TOKEN_SENT_TO_PARTNER_RETRY]: {
        log?: 1 | 0,
        meter: MeterInfo & { id: string; token: string };
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.CREATE_USER_INITIATED]: {
        log?: 1 | 0,
        user: User;
        transactionId: string;
    };
    [TOPICS.CREATE_USER_CONFIRMED]: {
        log?: 1 | 0,
        user: User & { id: string };
        transactionId: string;
    };
    [TOPICS.TOKEN_REQUEST_FAILED]: {
        log?: 1 | 0,
        transactionId: string;
        meter: MeterInfo;
    };


    // Airtime
    [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent']
    };
    [TOPICS.AIRTIME_TRANSACTION_COMPLETE]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        },
        user: User;
        partner: Partner;
        superAgent: Transaction['superagent']
        transactionId: string;
    };
    [TOPICS.RETRY_AIRTIME_PURCHASE_FROM_NEW_VENDOR]: {
        log?: 1 | 0,
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
    [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]: {
        log?: 1 | 0,
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent']
    };
    [TOPICS.AIRTIME_RECEIVED_FROM_VENDOR]: {
        log?: 1 | 0,
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        };
        transactionId: string;
        timeStamp: Date;
        error: { code: number; cause: TransactionErrorCause };
        retryCount: number;
        superAgent: Transaction['superagent'],
        waitTime: number,
    };
    [TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };

    // Data
    [TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.DATA_TRANSACTION_COMPLETE]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        },
        user: User;
        partner: Partner;
        superAgent: Transaction['superagent']
        transactionId: string;
    };
    [TOPICS.RETRY_DATA_PURCHASE_FROM_NEW_VENDOR]: {
        log?: 1 | 0,
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
    [TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER]: {
        log?: 1 | 0,
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.DATA_RECEIVED_FROM_VENDOR]: {
        log?: 1 | 0,
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.GET_DATA_FROM_VENDOR_RETRY]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        };
        transactionId: string;
        timeStamp: Date;
        error: { code: number; cause: TransactionErrorCause };
        retryCount: number;
        superAgent: Transaction['superagent'],
        waitTime: number,
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR]: {
        log?: 1 | 0,
        phone: {
            phoneNumber: string;
            amount: number;
        },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
}

export type PublisherParamsUnion = {
    [K in keyof PublisherEventAndParameters]: {
        topic: K;
        message: PublisherEventAndParameters[K];
    };
}[keyof PublisherEventAndParameters];

export type MessageHandler = {
    [K in TOPICS]?: (data: PublisherEventAndParameters[K]) => Promise<any>;
};

export type KafkaTopics = Omit<ConsumerSubscribeTopics, "topics"> & {
    topics: Topic[];
};

export abstract class Registry {
    static registry: MessageHandler = {};
}

export type MessagePayload = EachMessagePayload & { topic: TOPICS };

