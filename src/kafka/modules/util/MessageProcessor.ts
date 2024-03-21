import { EachBatchPayload, EachMessagePayload, Message } from "kafkajs";
import logger from "../../../utils/Logger";
import { CustomMessageFormat, MessageHandler, Topic } from "./Interface";
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
        logger.info(`Received message => [${this.consumerName}]: ` + prefix)

        const data: CustomMessageFormat = {
            topic,
            partition,
            offset: message.offset,
            value: JSON.parse(message.value?.toString() ?? '{}'),
            timestamp: message.timestamp,
            headers: message.headers,
        }

        return await this.processMessage(data)
    }

    public async processEachBatch(eachBatchPayload: EachBatchPayload): Promise<void> {
        try {
            const { batch } = eachBatchPayload;

            for (let i = 0; i < batch.messages.length; i++) {
                const message = batch.messages[i]
                const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`;
                logger.info(`- ${prefix} ${message.key}#${message.value}`, { meta: {
                    transactionId: (message.value as any).transactionId
                }});

                const data: CustomMessageFormat = {
                    topic: batch.topic as Topic,
                    partition: batch.partition,
                    offset: message.offset,
                    value: JSON.parse(message.value?.toString() ?? '{}'),
                    timestamp: message.timestamp,
                    headers: message.headers,
                }

                await this.processMessage(data)
                logger.info('Message processed successfully')
                eachBatchPayload.resolveOffset(message.offset)  // Commit offset
            }

            await eachBatchPayload.commitOffsetsIfNecessary()
            await eachBatchPayload.heartbeat()
            logger.info('Committing offsets...')

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
