import { EachBatchPayload, EachMessagePayload, Message } from "kafkajs";
import logger from "../../../utils/Logger";
import { CustomMessageFormat, MessageHandler, PublisherEventAndParameters, Topic } from "./Interface";
import { CustomError } from "../../../utils/Errors";

export default class MessageProcessorFactory {
    private handlers: () => MessageHandler
    private consumerName: string

    constructor(handlers: MessageHandler, consumerName: string) {
        this.handlers = () => handlers ?? {} as MessageHandler
        this.consumerName = consumerName
    }

    private async processMessage(messageData: CustomMessageFormat) {
        const handler = this.handlers()[messageData.topic]
        if (!handler) {
            logger.error(`No handler for topic ${messageData.topic}`)
            return
        }

        try {
            await handler(messageData.value)
        } catch (error) {
            logger.error('MESSAGE_PROCESSING_ERROR: ' + (error as Error).message ?? "An Error occured while processing message", {
                meta: {
                    messageData,
                    errorData: error,
                    transactionId: messageData.value.transactionId
                }
            })
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta)
            } else {
                logger.error((error as Error).message)
            }

            console.log(error)
        }
    }

    public async processEachMessage(messagePayload: Omit<EachMessagePayload, 'topic'> & { topic: Topic }): Promise<void> {
        const { topic, partition, message } = messagePayload;
        const prefix = `[${topic}][${partition} | ${message.offset}] / ${message.timestamp}`;
        const data: CustomMessageFormat = {
            topic,
            partition,
            offset: message?.offset,
            value: JSON.parse(message?.value?.toString() ?? '{}') as PublisherEventAndParameters[keyof PublisherEventAndParameters],
            timestamp: message?.timestamp,
            headers: message?.headers,
        }

        try {
            const shouldLogToDB = data.value.log == undefined ? 1 : data.value.log

            shouldLogToDB && logger.info(`Received message => [${this.consumerName}]: ` + prefix)

            await this.processMessage(data)

            await messagePayload.heartbeat()
        } catch (error) {
            console.log(error)
            logger.error('MESSAGE_PROCESSING_ERROR: ' + (error as Error).message ?? "An Error occured while processing message", {
                meta: {
                    messageData: messagePayload.message,
                    errorData: error,
                    transactionId: data.value.transactionId
                }
            })
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta)
            } else {
                logger.error((error as Error).message)
            }
        }
    }

    public async processEachBatch(eachBatchPayload: EachBatchPayload): Promise<void> {
        try {
            const { batch } = eachBatchPayload;

            let shouldLogToDB = 1
            for (let i = 0; i < batch.messages.length; i++) {
                const message = batch.messages[i]
                const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`;

                const data: CustomMessageFormat = {
                    topic: batch.topic as Topic,
                    partition: batch.partition,
                    offset: message.offset,
                    value: JSON.parse(message.value?.toString() ?? '{}') as PublisherEventAndParameters[keyof PublisherEventAndParameters],
                    timestamp: message.timestamp,
                    headers: message.headers,
                }

                shouldLogToDB = data.value.log == undefined ? 1 : data.value.log

                shouldLogToDB && logger.info(`- ${prefix} ${message.key}#${message.value}`, {
                    meta: {
                        transactionId: (message.value as any).transactionId
                    }
                });

                await this.processMessage(data)

                shouldLogToDB && logger.info('Message processed successfully')
                eachBatchPayload.resolveOffset(message.offset)  // Commit offset
                await eachBatchPayload.commitOffsetsIfNecessary()
                await eachBatchPayload.heartbeat()
            }


            shouldLogToDB && logger.info('Committing offsets...')
        } catch (error) {
            console.log(error)
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta)
            } else {
                logger.error((error as Error).message)
            }
        }
    }

    public getTopics(): Topic[] {
        return Object.keys(this.handlers()) as Topic[]
    }

    public getConsumerName(): string {
        return this.consumerName
    }
}
