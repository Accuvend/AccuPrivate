import { TOPICS } from "../../Constants";
import ConsumerFactory from "../util/Consumer";
import { Topic } from "../util/Interface";
import MessageProcessor from "../util/MessageProcessor";

class TransactionMessageProcessor extends MessageProcessor {
    constructor () {
        super({
            'METER_VALIDATION_REQUESTED': async () => {
                console.log('METER VALIDATION RECEIVED IN TRANSACTION MODULE')
            }
        })
    }
}

export default class TransactionConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor()

        const topics: Topic[] = [TOPICS.METER_VALIDATION_REQUESTED, TOPICS.TOKEN_RECEIVED]
        super(messageProcessor, topics)
    }
}