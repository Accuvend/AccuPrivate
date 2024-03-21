import { Consumer } from 'kafkajs'
import logger from '../../../utils/Logger'
import MessageProcessorFactory from './MessageProcessor'
import Kafka from '../../config'
import { KafkaTopics, MessagePayload } from './Interface'
import { randomUUID } from 'crypto'
import { CustomError } from '../../../utils/Errors'

export default class ConsumerFactory {
    private kafkaConsumer: Consumer
    private messageProcessor: MessageProcessorFactory

    constructor(messageProcessor: MessageProcessorFactory) {
        this.messageProcessor = messageProcessor
        this.kafkaConsumer = this.createKafkaConsumer()
    }

    public async start(): Promise<ConsumerFactory> {
        const subscription: KafkaTopics = {
            topics: this.messageProcessor.getTopics(),
            fromBeginning: false,
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(subscription)

            await this.kafkaConsumer.run({
                eachMessage: (messagePayload) => this.messageProcessor.processEachMessage(messagePayload as MessagePayload)
            })

        } catch (error) {
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta)
            } else {
                logger.error((error as Error).message)
            }
            console.error(error)
        } finally {
            return this
        }
    }

    public async startBatchConsumer(): Promise<void> {
        const topic: KafkaTopics = {
            topics: this.messageProcessor.getTopics(),
            fromBeginning: false,
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(topic)
            await this.kafkaConsumer.run({
                eachBatch: (messagePayload) => this.messageProcessor.processEachBatch(messagePayload)
            })
        } catch (error) {
            if (error instanceof CustomError) {
                logger.error(error.message, error.meta)
            } else {
                logger.error((error as Error).message)
            }
        }
    }

    public async shutdown(): Promise<void> {
        await this.kafkaConsumer.disconnect()
    }

    private createKafkaConsumer(): Consumer {
        console.log({ groupId: this.messageProcessor.getConsumerName() })
        const consumer = Kafka.consumer({ groupId: this.messageProcessor.getConsumerName() })
        return consumer
    }
}
