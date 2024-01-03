import kafka from "kafkajs";
require('newrelic');
import {
    KAFKA_BROKER,
    KAFKA_CLIENT_ID,
    KAFKA_PASSWORD,
    KAFKA_USERNAME,
    NODE_ENV,
} from "../../utils/Constants";

const kafkaConfig: kafka.KafkaConfig = NODE_ENV === 'development'
    ? {
        clientId: KAFKA_CLIENT_ID,
        brokers: [KAFKA_BROKER],
        logLevel: 0
    }
    : {
        clientId: KAFKA_CLIENT_ID,
        brokers: [KAFKA_BROKER],
        connectionTimeout: 450000,
        ssl: true,
        sasl: {
            mechanism: 'plain',
            username: KAFKA_USERNAME,
            password: KAFKA_PASSWORD,
        },
        logLevel: 0,
    };

const Kafka = new kafka.Kafka(kafkaConfig);

export default Kafka;

