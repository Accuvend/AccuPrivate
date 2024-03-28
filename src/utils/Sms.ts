import AfricasTalking from 'africastalking'
import { AFRICASTALKING_API_KEY, AFRICASTALKING_USERNAME, CYBER_PAY_BASE_URL, CYBER_PAY_PASSWORD, CYBER_PAY_USERNAME, NODE_ENV } from './Constants';
import axios from 'axios'
import Transaction from '../models/Transaction.model';

const client = axios.create({
    baseURL: NODE_ENV == "development" ? "https://api.sandbox.africastalking.com/version1/messaging" : "https://api.sandbox.africastalking.com/version1/messaging",
    headers: {
        apiKey: AFRICASTALKING_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
    }
})

abstract class SmsServiceHandler {
    abstract sendSms(to: string, message: string): Promise<any>
}
export class CyberPaySmsService implements SmsServiceHandler {
    private client = axios.create({
        baseURL: CYBER_PAY_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        }
    })
    login = async () => {
        const response = await this.client.post('/auth/login', {
            username: CYBER_PAY_USERNAME,
            password: CYBER_PAY_PASSWORD
        })

        console.log({ data: response.data })
    }

    sendSms = async (to: string, message: string): Promise<any> => {

    }
}

export class AfricasTalkingSmsService implements SmsServiceHandler {
    sendSms = async (to: string, message: string) => {
        try {
            const result = await client.post("", {
                username: AFRICASTALKING_USERNAME,
                to: (to),
                message: message,
                from: "32345"
            })
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}

new CyberPaySmsService().login().catch(e => {
    console.log({ e: e.response })
})

export class SmsService {
    private static smsHost = new CyberPaySmsService()
    private static formatPhoneNumber = (phoneNumber: string) => {
        if (phoneNumber.startsWith("0")) {
            return `+234${phoneNumber.slice(1)}`
        }
        return phoneNumber
    }

    static sendSms = async (to: string, message: string) => {
        try {
            return await this.smsHost.sendSms(this.formatPhoneNumber(to), message)
        } catch (ex) {
            throw ex;
        }
    }

    static prepaidElectricityTemplate = async (transaction: Transaction) => {
        const powerUnit = await transaction.$get('powerUnit')

        return `
            Payment successful for ${transaction.transactionType}

            Transaction amount: ${transaction.amount}

            Token: ${powerUnit?.token}

            Date: ${transaction.transactionTimestamp}
        `
    }

    static postpaidElectricityTemplate = async (transaction: Transaction) => {
        return `
            Payment successful for ${transaction.transactionType}

            Transaction amount: ${transaction.amount}

            Date: ${transaction.transactionTimestamp}
        `
    }

    static airtimeTemplate = async (transaction: Transaction) => {
        return `
            Payment successful for ${transaction.transactionType}

            Transaction amount: ${transaction.amount}

            Date: ${transaction.transactionTimestamp}
        `
    }
}