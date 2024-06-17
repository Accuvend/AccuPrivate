import { trace } from "console";
import { Logger } from "../../../utils/Logger";
import { TOPICS } from "../../Constants";
import { PublisherEventAndParameters } from "../util/Interface";
import ProducerFactory from "../util/Producer";

export class VendorPublisher extends ProducerFactory {
    static async publishEventToScheduleAirtimeRequery(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_REQUERY_FOR_AIRTIME_TRANSACTION],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.SCHEDULE_REQUERY_FOR_AIRTIME_TRANSACTION,
            message: {
                log: data.log,
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
            },
        });
    }

    static async publishEventToScheduleAirtimeRetry(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_AIRTIME_TRANSACTION],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.SCHEDULE_RETRY_FOR_AIRTIME_TRANSACTION,
            message: {
                log: data.log,
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
            },
        });
    }

    static async publishEventToScheduleDataRequery(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_REQUERY_FOR_DATA_TRANSACTION],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.SCHEDULE_REQUERY_FOR_DATA_TRANSACTION,
            message: {
                log: data.log,
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
            },
        });
    }

    static async publishEventToScheduleDataRetry(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_DATA_TRANSACTION],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.SCHEDULE_RETRY_FOR_DATA_TRANSACTION,
            message: {
                log: data.log,
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
            },
        });
    }

    static async publishEventToScheduleRequery(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.SCHEDULE_REQUERY_FOR_TRANSACTION,
            message: {
                log: data.log,
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
            },
        });
    }

    static async publishEventToScheduleRetry(
        data: PublisherEventAndParameters[TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.SCHEDULE_RETRY_FOR_TRANSACTION,
            message: {
                log: data.log,
                scheduledMessagePayload: data.scheduledMessagePayload,
                timeStamp: data.timeStamp,
                delayInSeconds: data.delayInSeconds,
            },
        });
    }

    static async publishEventForMeterValidationRequested(
        data: PublisherEventAndParameters[TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEvnetForVendAirtimeRequestedFromVendor(
        data: PublisherEventAndParameters[TOPICS.VEND_AIRTIME_REQUESTED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.VEND_AIRTIME_REQUESTED_FROM_VENDOR,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEvnetForVendElectricityRequestedFromVendor(
        data: PublisherEventAndParameters[TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEventForMeterValidationReceived(
        data: PublisherEventAndParameters[TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR,
            message: {
                log: data.log,
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForMeterValidationSentToPartner(
        data: PublisherEventAndParameters[TOPICS.METER_VALIDATION_SENT_PARTNER],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.METER_VALIDATION_SENT_PARTNER,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForDiscoUpCheckConfirmedFromVendor(
        data: PublisherEventAndParameters[TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForInitiatedPowerPurchase(
        data: PublisherEventAndParameters[TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                partner: {
                    email: data.partner.email,
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                vendorRetryRecord: data.vendorRetryRecord,
            },
        });
    }

    static async publishEventForRetryPowerPurchaseWithNewVendor(
        data: PublisherEventAndParameters[TOPICS.RETRY_PURCHASE_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.RETRY_PURCHASE_FROM_VENDOR,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                partner: {
                    email: data.partner.email,
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                newVendor: data.newVendor,
            },
        });
    }

    static async publishEventForTokenReceivedFromVendor(
        data: PublisherEventAndParameters[TOPICS.TOKEN_RECIEVED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_RECIEVED_FROM_VENDOR,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                    token: data.meter.token,
                },
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                partner: {
                    email: data.partner.email,
                },
                transactionId: data.transactionId,
                tokenUnits: data.tokenUnits,
            },
        });
    }

    static async publishEventForTokenReceivedFromRequery(
        data: PublisherEventAndParameters[TOPICS.TOKEN_RECIEVED_FROM_REQUERY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_RECIEVED_FROM_REQUERY,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                    token: data.meter.token,
                },
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                partner: {
                    email: data.partner.email,
                },
                transactionId: data.transactionId,
                tokenUnits: data.tokenUnits,
            },
        });
    }

    static async publishEventForWebhookNotificationToPartnerRetry(
        data: PublisherEventAndParameters[TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                    token: data.meter.token,
                },
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                partner: {
                    email: data.partner.email,
                },
                transactionId: data.transactionId,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEventForGetTransactionTokenRequestedFromVendorRetry(
        data: PublisherEventAndParameters[TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_REQUERY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_REQUERY,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                requeryCount: data.requeryCount,
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                waitTime: data.waitTime,
                vendorRetryRecord: data.vendorRetryRecord,
            },
        });
    }

    static async publishEventForGetDataRequestedFromVendorRequery(
        data: PublisherEventAndParameters[TOPICS.GET_DATA_FROM_VENDOR_REQUERY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_DATA_FROM_VENDOR_REQUERY,
            message: {
                log: data.log,
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                bundle: data.bundle,
                superAgent: data.superAgent,
                waitTime: data.waitTime,
                vendorRetryRecord: data.vendorRetryRecord,
                phone: data.phone,
            },
        });
    }

    static async publishEventForGetAirtimeRequestedFromVendorRequery(
        data: PublisherEventAndParameters[TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY,
            message: {
                log: data.log,
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                waitTime: data.waitTime,
                vendorRetryRecord: data.vendorRetryRecord,
                phone: data.phone,
            },
        });
    }

    static async publishEventForGetTransactionTokenFromVendorInitiated(
        data: PublisherEventAndParameters[TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED,
            message: {
                log: data.log,
                meter: data.meter,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEventForTransactionRequery(
        data: PublisherEventAndParameters[TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        });
    }

    static async pulishEventForSuccessfulTokenRequestWithNoToken(
        data: PublisherEventAndParameters[TOPICS.TOKEN_REQUEST_SUCCESS_WITH_NO_TOKEN],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_REQUEST_SUCCESS_WITH_NO_TOKEN,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForTokenSentToPartnerRetry(
        data: PublisherEventAndParameters[TOPICS.TOKEN_SENT_TO_PARTNER_RETRY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_SENT_TO_PARTNER_RETRY,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                    token: data.meter.token,
            },
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    address: data.user.address,
                    phoneNumber: data.user.phoneNumber,
                },
                partner: {
                    email: data.partner.email,
                },
                transactionId: data.transactionId,
                tokenUnits: data.tokenUnits,
            },
        });
    }

    static async publishEventForFailedTokenRequest(
        data: PublisherEventAndParameters[TOPICS.TOKEN_REQUEST_FAILED],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_REQUEST_FAILED,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForCompletedPowerPurchase(
        data: PublisherEventAndParameters[TOPICS.PARTNER_TRANSACTION_COMPLETE],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.PARTNER_TRANSACTION_COMPLETE,
            message: {
                log: data.log,
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                partner: data.partner,
                user: data.user,
                transactionId: data.transactionId,
            },
        });
    }

    // AIRTIME SPECIFIC PUBLISHERS
    static async publshEventForAirtimePurchaseInitiate(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER,
            message: {
                log: data.log,
                phone: data.phone,
                partner: data.partner,
                user: data.user,
                transactionId: data.transactionId,
                vendorRetryRecord: data.vendorRetryRecord,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEventForAirtimeReceivedFromVendor(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_RECEIVED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_RECEIVED_FROM_VENDOR,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
            },
        });
    }

    static async publishEventForAirtimeWebhookNotificationSentToPartner(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForAirtimePurchaseComplete(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_TRANSACTION_COMPLETE],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_TRANSACTION_COMPLETE,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEventForGetAirtimeFromVendorRetry(
        data: PublisherEventAndParameters[TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_AIRTIME_FROM_VENDOR_REQUERY,
            message: {
                log: data.log,
                phone: data.phone,
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                vendorRetryRecord: data.vendorRetryRecord,
                waitTime: data.waitTime,
            },
        });
    }

    static async publishEventForAirtimePurchaseRetryFromVendorWithNewVendor(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                newVendor: data.newVendor,
                partner: data.partner,
                vendorRetryRecord: data.vendorRetryRecord,
                user: data.user,
            },
        });
    }

    // DATA PUBLISHERS
    // AIRTIME SPECIFIC PUBLISHERS
    static async publshEventForDataPurchaseInitiate(
        data: PublisherEventAndParameters[TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER,
            message: {
                log: data.log,
                bundle: data.bundle,
                phone: data.phone,
                partner: data.partner,
                user: data.user,
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                vendorRetryRecord: data.vendorRetryRecord,
            },
        });
    }

    static async publishEventForDataReceivedFromVendor(
        data: PublisherEventAndParameters[TOPICS.DATA_RECEIVED_FROM_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_RECEIVED_FROM_VENDOR,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                bundle: data.bundle,
                user: data.user,
            },
        });
    }

    static async publishEventForDataWebhookNotificationSentToPartner(
        data: PublisherEventAndParameters[TOPICS.DATA_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
            },
        });
    }

    static async publishEventForDataPurchaseComplete(
        data: PublisherEventAndParameters[TOPICS.DATA_TRANSACTION_COMPLETE],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_TRANSACTION_COMPLETE,
            message: {
                log: data.log,
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
                superAgent: data.superAgent,
            },
        });
    }

    static async publishEventForGetDataFromVendorRetry(
        data: PublisherEventAndParameters[TOPICS.GET_DATA_FROM_VENDOR_RETRY],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_DATA_FROM_VENDOR_RETRY,
            message: {
                log: data.log,
                phone: data.phone,
                error: data.error,
                bundle: data.bundle,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                waitTime: data.waitTime,
                vendorRetryRecord: data.vendorRetryRecord,
            },
        });
    }

    static async publishEventForDataPurchaseRetryFromVendorWithNewVendor(
        data: PublisherEventAndParameters[TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR],
    ) {
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR,
            message: {
                log: data.log,
                phone: data.phone,
                vendorRetryRecord: data.vendorRetryRecord,
                bundle: data.bundle,
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                newVendor: data.newVendor,
                partner: data.partner,
                user: data.user,
            },
        });
    }
}
