import { trace } from "console";
import { Logger } from "../../../utils/Logger";
import { TOPICS } from "../../Constants";
import { PublisherEventAndParameters } from "../util/Interface";
import ProducerFactory from "../util/Producer";

export class VendorPublisher extends ProducerFactory {
    static async publishEventForMeterValidationRequested(
        data: PublisherEventAndParameters[TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR],
    ) {

        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.METER_VALIDATION_REQUEST_SENT_TO_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEvnetForVendElectricityRequestedFromVendor(
        data: PublisherEventAndParameters[TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR]
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id
                },
                transactionId: data.transactionId,
                superAgent: data.superAgent
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.VEND_ELECTRICITY_REQUESTED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForMeterValidationReceived(
        data: PublisherEventAndParameters[TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR],
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR,
            message: {
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
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.METER_VALIDATION_RECIEVED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForMeterValidationSentToPartner(
        data: PublisherEventAndParameters[TOPICS.METER_VALIDATION_SENT_PARTNER],
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.METER_VALIDATION_SENT_PARTNER, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.METER_VALIDATION_SENT_PARTNER,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.METER_VALIDATION_SENT_PARTNER} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForDiscoUpCheckConfirmedFromVendor(
        data: PublisherEventAndParameters[TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR],
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.CHECK_DISCO_UP_CONFIRMED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForInitiatedPowerPurchase(
        data: PublisherEventAndParameters[TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER,
            message: {
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
                vendorRetryRecord: data.vendorRetryRecord
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForRetryPowerPurchaseWithNewVendor(
        data: PublisherEventAndParameters[TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR],
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR,
            message: {
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
                newVendor: data.newVendor
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.RETRY_PURCHASE_FROM_NEW_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForTokenReceivedFromVendor(
        data: PublisherEventAndParameters[TOPICS.TOKEN_RECIEVED_FROM_VENDOR],
    ) {
        Logger.kafkaPublisher.info('Sending message to topic: ' + TOPICS.TOKEN_RECIEVED_FROM_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_RECIEVED_FROM_VENDOR,
            message: {
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
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.TOKEN_RECIEVED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForWebhookNotificationToPartnerRetry(
        data: PublisherEventAndParameters[TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.WEBHOOK_NOTIFICATION_TO_PARTNER_RETRY,
            message: {
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
                superAgent: data.superAgent
            },
        });
    }

    static async publishEventForGetTransactionTokenRequestedFromVendorRetry(
        data: PublisherEventAndParameters[TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_RETRY,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                    id: data.meter.id,
                },
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                waitTime: data.waitTime,
                vendorRetryRecord: data.vendorRetryRecord
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.GET_TRANSACTION_TOKEN_REQUESTED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForGetTransactionTokenFromVendorInitiated(
        data: PublisherEventAndParameters[TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED,
            message: {
                meter: data.meter,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                superAgent: data.superAgent
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.GET_TRANSACTION_TOKEN_FROM_VENDOR_INITIATED} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForTransactionRequery(
        data: PublisherEventAndParameters[TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.POWER_PURCHASE_INITIATED_BY_CUSTOMER_REQUERY} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForSuccessfulTokenRequestWithNoToken(
        data: PublisherEventAndParameters[TOPICS.TOKEN_REQUEST_SUCCESS_WITH_NO_TOKEN],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.TOKEN_REQUEST_SUCCESS_WITH_NO_TOKEN}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_REQUEST_SUCCESS_WITH_NO_TOKEN,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.TOKEN_REQUEST_SUCCESS_WITH_NO_TOKEN} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForTokenSentToPartnerRetry(
        data: PublisherEventAndParameters[TOPICS.TOKEN_SENT_TO_PARTNER_RETRY],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.TOKEN_SENT_TO_PARTNER_RETRY}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_SENT_TO_PARTNER_RETRY,
            message: {
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
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.TOKEN_REQUEST_FAILED} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForFailedTokenRequest(
        data: PublisherEventAndParameters[TOPICS.TOKEN_REQUEST_FAILED],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.TOKEN_REQUEST_FAILED}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.TOKEN_REQUEST_FAILED,
            message: {
                meter: {
                    meterNumber: data.meter.meterNumber,
                    disco: data.meter.disco,
                    vendType: data.meter.vendType,
                },
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.TOKEN_REQUEST_FAILED} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForCompletedPowerPurchase(
        data: PublisherEventAndParameters[TOPICS.PARTNER_TRANSACTION_COMPLETE],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.PARTNER_TRANSACTION_COMPLETE}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.PARTNER_TRANSACTION_COMPLETE,
            message: {
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
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.PARTNER_TRANSACTION_COMPLETE} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    // AIRTIME SPECIFIC PUBLISHERS
    static async publshEventForAirtimePurchaseInitiate(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER,
            message: {
                phone: data.phone,
                partner: data.partner,
                user: data.user,
                transactionId: data.transactionId,
                superAgent: data.superAgent
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.AIRTIME_PURCHASE_INITIATED_BY_CUSTOMER} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForAirtimeReceivedFromVendor(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_RECEIVED_FROM_VENDOR],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.AIRTIME_RECEIVED_FROM_VENDOR}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_RECEIVED_FROM_VENDOR,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.AIRTIME_RECEIVED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForAirtimeWebhookNotificationSentToPartner(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.AIRTIME_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.AIRTIME_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForAirtimePurchaseComplete(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_TRANSACTION_COMPLETE],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.AIRTIME_TRANSACTION_COMPLETE}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_TRANSACTION_COMPLETE,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
                superAgent: data.superAgent
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.AIRTIME_TRANSACTION_COMPLETE} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForGetAirtimeFromVendorRetry(
        data: PublisherEventAndParameters[TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY}`, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_AIRTIME_FROM_VENDOR_RETRY,
            message: {
                phone: data.phone,
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                waitTime: data.waitTime
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.GET_TRANSACTION_TOKEN_REQUESTED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForAirtimePurchaseRetryFromVendorWithNewVendor(
        data: PublisherEventAndParameters[TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR]
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        }}`)
        return ProducerFactory.sendMessage({
            topic: TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                newVendor: data.newVendor,
                partner: data.partner,
                user: data.user
            }
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.AIRTIME_PURCHASE_RETRY_FROM_NEW_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        })
    }


    // DATA PUBLISHERS
    // AIRTIME SPECIFIC PUBLISHERS
    static async publshEventForDataPurchaseInitiate(
        data: PublisherEventAndParameters[TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER} `, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER,
            message: {
                phone: data.phone,
                partner: data.partner,
                user: data.user,
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                vendorRetryRecord: data.vendorRetryRecord,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.DATA_PURCHASE_INITIATED_BY_CUSTOMER} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForDataReceivedFromVendor(
        data: PublisherEventAndParameters[TOPICS.DATA_RECEIVED_FROM_VENDOR],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.DATA_RECEIVED_FROM_VENDOR} `, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_RECEIVED_FROM_VENDOR,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.DATA_RECEIVED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForDataWebhookNotificationSentToPartner(
        data: PublisherEventAndParameters[TOPICS.DATA_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.DATA_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER} `, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.DATA_WEBHOOK_NOTIFICATION_SENT_TO_PARTNER} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForDataPurchaseComplete(
        data: PublisherEventAndParameters[TOPICS.DATA_TRANSACTION_COMPLETE],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.DATA_TRANSACTION_COMPLETE} `, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_TRANSACTION_COMPLETE,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
                partner: data.partner,
                user: data.user,
                superAgent: data.superAgent
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing  ${TOPICS.DATA_TRANSACTION_COMPLETE} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForGetDataFromVendorRetry(
        data: PublisherEventAndParameters[TOPICS.GET_DATA_FROM_VENDOR_RETRY],
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.GET_DATA_FROM_VENDOR_RETRY} `, {
            meta: {
                transactionId: data.transactionId,
            }
        })
        return ProducerFactory.sendMessage({
            topic: TOPICS.GET_DATA_FROM_VENDOR_RETRY,
            message: {
                phone: data.phone,
                error: data.error,
                transactionId: data.transactionId,
                timeStamp: data.timeStamp,
                retryCount: data.retryCount,
                superAgent: data.superAgent,
                waitTime: data.waitTime,
                vendorRetryRecord: data.vendorRetryRecord
            },
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.GET_TRANSACTION_TOKEN_REQUESTED_FROM_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        });
    }

    static async publishEventForDataPurchaseRetryFromVendorWithNewVendor(
        data: PublisherEventAndParameters[TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR]
    ) {
        Logger.kafkaPublisher.info(`Sending message to topic: ${TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR, {
            meta: {
                transactionId: data.transactionId,
            }
        }} `)
        return ProducerFactory.sendMessage({
            topic: TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR,
            message: {
                phone: data.phone,
                transactionId: data.transactionId,
                superAgent: data.superAgent,
                newVendor: data.newVendor,
                partner: data.partner,
                user: data.user
            }
        }).catch((e) => {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.DATA_PURCHASE_RETRY_FROM_NEW_VENDOR} event for transaction` +
                data.transactionId,
            );
            return e;
        })
    }

}

