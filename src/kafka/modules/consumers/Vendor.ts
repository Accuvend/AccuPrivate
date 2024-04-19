import { TOPICS } from "../../Constants";
import ConsumerFactory from "../util/Consumer";
import { Topic } from "../util/Interface";
import MessageProcessor from "../util/MessageProcessor";
require('newrelic');

export default class VendorConsumer extends ConsumerFactory {
    constructor() {
        const messageProcessor = new MessageProcessor({}, 'VENDOR_CONSUMER')
        super(messageProcessor)
    }
}