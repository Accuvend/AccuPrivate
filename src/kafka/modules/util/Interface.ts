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
}

export interface VendorRetryRecord {
    retryCount: number;
}

export interface PublisherEventAndParameters extends Record<TOPICS, any> {
    [TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR]: {
        meter: MeterInfo;
        transactionId: string;
        superAgent: Transaction['superagent']
    };
    [TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR]: MeterValidationRequested;
    [TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER]: {
        meter: MeterInfo & { id: string };
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR]: {
        meter: MeterInfo & { id: string };
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
    [TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR]: {
        meter: MeterInfo & { id: string };
        transactionId: string;
        superAgent: Transaction['superagent'],
    };
    [TOPICS.TOKEN_RECIEVED_FROM_VENDOR]: {
        meter: MeterInfo & { id: string; token: string };
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY]: {
        meter: MeterInfo & { id: string; token: string };
        user: User;
        partner: Partner;
        transactionId: string;
        retryCount: number;
        superAgent: Transaction['superagent'],
    };
    [TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY]: {
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
        meter: MeterInfo & { id: string };
        transactionId: string;
        timeStamp: Date;
        superAgent: Transaction['superagent']
    };
    [TOPICS.PARTNER_TRANSACTION_COMPLETE]: {
        meter: MeterInfo & { id: string };
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.TOKEN_SENT_TO_PARTNER]: {
        meter: MeterInfo & { id: string };
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.TOKEN_SENT_TO_EMAIL]: {
        meter: MeterInfo & { id: string };
        user: User & { id: string };
        transactionId: string;
    };
    [TOPICS.TOKEN_SENT_TO_PARTNER_RETRY]: {
        meter: MeterInfo & { id: string; token: string };
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.CREATE_USER_INITIATED]: {
        user: User;
        transactionId: string;
    };
    [TOPICS.CREATE_USER_CONFIRMED]: {
        user: User & { id: string };
        transactionId: string;
    };
    [TOPICS.TOKEN_REQUEST_FAILED]: {
        transactionId: string;
        meter: MeterInfo;
    };


    // Airtime
    [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]: {
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
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
    [TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER]: {
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent']
    };
    [TOPICS.AIRTIME_RECEIVED_FROM_VENDOR]: {
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY]: {
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
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        newVendor: Transaction['superagent'],
    };
    [TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER]: {
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
        superAgent: Transaction['superagent'],
        vendorRetryRecord: VendorRetryRecord
    };
    [TOPICS.DATA_RECEIVED_FROM_VENDOR]: {
        phone: { phoneNumber: string; amount: number; },
        user: User;
        partner: Partner;
        transactionId: string;
    };
    [TOPICS.GET_DATA_FROM_VENDOR_RETRY]: {
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

