import kafka from "kafkajs";
import { readFileSync } from "fs";
import {
    KAFKA_BROKER,
    KAFKA_CLIENT_ID,
    KAFKA_PASSWORD,
    KAFKA_USERNAME,
    NODE_ENV,
    KAFKA_ENV,
    KAFKA_CA_CERT,
    KAFA_LOGS,
    KAFA_REGION
} from "../../utils/Constants";
// import { generateAuthToken } from 'aws-msk-iam-sasl-signer-js'

// async function oauthBearerTokenProvider(region: string) {
//     // Uses AWS Default Credentials Provider Chain to fetch credentials
//     const authTokenResponse = await generateAuthToken({ region });
//     return {
//         value: authTokenResponse.token
//     }
// }
require('newrelic');


const getKafkaConfig = (configType: string): kafka.KafkaConfig => {
    if(configType === "digitalocean"){
        return {
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER],
            connectionTimeout: 450000,
            ssl: {
                rejectUnauthorized: false,
                ca: KAFKA_CA_CERT ? [KAFKA_CA_CERT] : [readFileSync(__dirname + "/ca-certificate.crt", "utf-8")],
            },
            sasl: {
                mechanism: 'scram-sha-256',
                username: KAFKA_USERNAME,
                password: KAFKA_PASSWORD,
            },

            logLevel: isNaN(parseInt(KAFA_LOGS)) ? 0 : parseInt(KAFA_LOGS)
        }
    }else if(configType === 'aws'){
        console.log('connected using aws')
        return {
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER],
            connectionTimeout: 450000,
            logLevel: isNaN(parseInt(KAFA_LOGS)) ? 0 : parseInt(KAFA_LOGS),
        }
    }else{
        return {
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER],
            connectionTimeout: 450000,
            ssl: true,
            sasl: {
                mechanism: "plain",
                username: KAFKA_USERNAME,
                password: KAFKA_PASSWORD,
            },
            logLevel: isNaN(parseInt(KAFA_LOGS)) ? 0 : parseInt(KAFA_LOGS),
        }
    }
}

const kafkaConfig: kafka.KafkaConfig =
    NODE_ENV === "development"
        ? {
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER],
            logLevel: isNaN(parseInt(KAFA_LOGS)) ? 0 : parseInt(KAFA_LOGS),
            // clientId: KAFKA_CLIENT_ID,
            // brokers: [KAFKA_BROKER],
            // connectionTimeout: 450000,
            // ssl: true,
            // sasl: {
            //     mechanism: "plain",
            //     username: KAFKA_USERNAME,
            //     password: KAFKA_PASSWORD,
            // },
            // logLevel: isNaN(parseInt(KAFA_LOGS)) ? 0 : parseInt(KAFA_LOGS),
        }
        : getKafkaConfig(KAFKA_ENV) ;
console.log(KAFKA_ENV)
const Kafka = new kafka.Kafka(kafkaConfig);

export default Kafka;
