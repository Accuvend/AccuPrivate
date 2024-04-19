import { Logger } from "../../../utils/Logger";
import { TOPICS } from "../../Constants";
import { PublisherEventAndParameters } from "../util/Interface";
import ProducerFactory from "../util/Producer";

interface User {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    id: string;
}

export class CRMPublisher extends ProducerFactory {
    static async publishEventForInitiatedUser(
        data: PublisherEventAndParameters[TOPICS.CREATE_USER_INITIATED],
    ) {
        try {
            await ProducerFactory.sendMessage({
                topic: TOPICS.CREATE_USER_INITIATED,
                message: {
                    user: {
                        name: data.user.name,
                        email: data.user.email,
                        address: data.user.address,
                        phoneNumber: data.user.phoneNumber,
                    },
                    transactionId: data.transactionId,
                },
            });
        } catch (error) {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.CREATE_USER_INITIATED} event for transaction` +
                    data.transactionId,
            );
            return error;
        }
    }

    static async publishEventForConfirmedUser(
        data: PublisherEventAndParameters[TOPICS.CREATE_USER_CONFIRMED],
    ) {
        try {
            await ProducerFactory.sendMessage({
                topic: TOPICS.CREATE_USER_CONFIRMED,
                message: {
                    user: {
                        name: data.user.name,
                        email: data.user.email,
                        address: data.user.address,
                        phoneNumber: data.user.phoneNumber,
                        id: data.user.id,
                    },
                    transactionId: data.transactionId,
                },
            });
        } catch (error) {
            Logger.kafkaPublisher.error(
                `An error occured while publishing ${TOPICS.CREATE_USER_CONFIRMED} event for transaction` +
                    data.transactionId,
            );
            return error;
        }
    }
}

