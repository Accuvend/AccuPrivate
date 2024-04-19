import AfricasTalking from "africastalking";
import {
    AFRICASTALKING_API_KEY,
    AFRICASTALKING_USERNAME,
    CYBER_PAY_API_KEY,
    CYBER_PAY_BASE_URL,
    CYBER_PAY_PASSWORD,
    CYBER_PAY_SENDER_ID,
    CYBER_PAY_USERNAME,
    NODE_ENV,
} from "./Constants";
import axios from "axios";
import Transaction from "../models/Transaction.model";
import logger from "./Logger";

const client = axios.create({
    baseURL:
        NODE_ENV == "development"
            ? "https://api.sandbox.africastalking.com/version1/messaging"
            : "https://api.sandbox.africastalking.com/version1/messaging",
    headers: {
        apiKey: AFRICASTALKING_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

abstract class SmsServiceHandler {
    abstract sendSms(to: string, message: string): Promise<any>;
}
export class CyberPaySmsService implements SmsServiceHandler {
    private client = axios.create({
        baseURL: CYBER_PAY_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });
    private apiKey = CYBER_PAY_API_KEY;
    private senderId = CYBER_PAY_SENDER_ID;
    private token = "";

    private login = async () => {
        const response = await this.client.post<{ token: string }>(
            "/auth/login",
            {
                username: CYBER_PAY_USERNAME,
                password: CYBER_PAY_PASSWORD,
            },
        );

        this.token = response.data.token;

        return this;
    };

    public sendSms = async (to: string, message: string): Promise<any> => {
        await this.login();

        const requestBody = {
            SenderId: this.senderId,
            Msisdn: to,
            MsgBody: message,
            MessageType: "PROMOTIONAL",
        };

        const response = await this.client.post(
            "/messages/network-lookup-and-send",
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    ApiKey: btoa(this.apiKey),
                },
            },
        );

        return response.data;
    };
}

export class AfricasTalkingSmsService implements SmsServiceHandler {
    public sendSms = async (to: string, message: string) => {
        try {
            const result = await client.post("", {
                username: AFRICASTALKING_USERNAME,
                to: to,
                message: message,
                from: "32345",
            });
            return result;
        } catch (ex) {
            throw ex;
        }
    };
}

const DEFAULT_SMS_SERVICE = new CyberPaySmsService();
export class SmsService {
    private static smsHost = DEFAULT_SMS_SERVICE;
    private static formatPhoneNumber = (phoneNumber: string) => {
        if (phoneNumber.startsWith("0")) {
            return `+234${phoneNumber.slice(1)}`;
        }
        return phoneNumber;
    };

    static sendSms = async (to: string, message: string) => {
        try {
            return await this.smsHost.sendSms(
                this.formatPhoneNumber(to),
                message,
            );
        } catch (ex) {
            throw ex;
        }
    };

    static prepaidElectricityTemplate = async (transaction: Transaction) => {
        const powerUnit = await transaction.$get("powerUnit");

        return `
            Payment successful for ${transaction.transactionType}

            Transaction amount: ${transaction.amount}

            Token: ${powerUnit?.token}

            Date: ${transaction.transactionTimestamp}
        `;
    };

    static postpaidElectricityTemplate = async (transaction: Transaction) => {
        return `
            Payment successful for ${transaction.transactionType}

            Transaction amount: ${transaction.amount}

            Date: ${transaction.transactionTimestamp}
        `;
    };

    static airtimeTemplate = async (transaction: Transaction) => {
        return `
            Payment successful for ${transaction.transactionType}

            Transaction amount: ${transaction.amount}

            Date: ${transaction.transactionTimestamp}
        `;
    };
}

