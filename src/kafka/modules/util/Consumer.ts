import { Consumer } from "kafkajs";
import logger from "../../../utils/Logger";
import MessageProcessorFactory from "./MessageProcessor";
import Kafka from "../../config";
import { KafkaTopics, MessagePayload } from "./Interface";
import { randomUUID } from "crypto";
import { CustomError } from "../../../utils/Errors";

export default class ConsumerFactory {
    private kafkaConsumer: Consumer;
    private messageProcessor: MessageProcessorFactory;

    constructor(messageProcessor: MessageProcessorFactory) {
        this.messageProcessor = messageProcessor;
        this.kafkaConsumer = this.createKafkaConsumer();
    }

    public async start(): Promise<void> {
        const subscription: KafkaTopics = {
            topics: this.messageProcessor.getTopics(),
            fromBeginning: false,
        };

        try {
            await this.kafkaConsumer.connect();
            await this.kafkaConsumer.subscribe(subscription);
            await this.kafkaConsumer.run({
                eachMessage: async (messagePayload) => {
                    try {
                        await this.messageProcessor.processEachMessage(
                            messagePayload as MessagePayload,
                        );
                        await this.kafkaConsumer.commitOffsets([
                            {
                                topic: messagePayload.topic,
                                partition: messagePayload.partition,
                                offset: messagePayload.message.offset,
                            },
                        ]);
                    } catch (error) {
                        if (error instanceof CustomError) {
                            logger.error(error.message, error.meta);
                        } else {
                            logger.error((error as Error).message);
                        }
                        console.error(error);
                    }
                },
            });
        } catch (error) {
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta);
            } else {
                logger.error((error as Error).message);
            }
            console.error(error);
        }
    }

    public async startBatchConsumer(): Promise<void> {
        const topic: KafkaTopics = {
            topics: this.messageProcessor.getTopics(),
            fromBeginning: false,
        };

        try {
            await this.kafkaConsumer.connect();
            await this.kafkaConsumer.subscribe(topic);
            await this.kafkaConsumer.run({
                eachBatch: async (messagePayload) => {
                    try {
                        return await this.messageProcessor.processEachBatch(
                            messagePayload,
                        );
                    } catch (error) {
                        if (error instanceof CustomError) {
                            logger.error(error.message, error.meta);
                        } else {
                            logger.error((error as Error).message);
                        }
                        console.error(error);
                    }
                },
            });
        } catch (error) {
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta);
            } else {
                logger.error((error as Error).message);
            }
        }
    }

    public async shutdown(): Promise<void> {
        await this.kafkaConsumer.disconnect();
    }

    private createKafkaConsumer(): Consumer {
        console.log({ groupId: this.messageProcessor.getConsumerName() });
        const consumer = Kafka.consumer({
            groupId: this.messageProcessor.getConsumerName(),
        });
        return consumer;
    }
}
