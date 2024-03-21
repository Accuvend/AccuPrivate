import AfricasTalking from 'africastalking'
import { AFRICASTALKING_API_KEY, AFRICASTALKING_USERNAME, NODE_ENV } from './Constants';
import axios from 'axios'
import Transaction from '../models/Transaction.model';

const client = axios.create({
    baseURL: NODE_ENV == "development" ? "https://api.sandbox.africastalking.com/version1/messaging" : "https://api.sandbox.africastalking.com/version1/messaging",
    headers: {
        apiKey: AFRICASTALKING_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
    }
})


export class SmsService {
    private static formatPhoneNumber = (phoneNumber: string) => {
        if (phoneNumber.startsWith("0")) {
            return `+234${phoneNumber.slice(1)}`
        }
        return phoneNumber
    }
    
    static sendSms = async (to: string, message: string) => {
        try {
            const result = await client.post("", {
                username: AFRICASTALKING_USERNAME,
                to: this.formatPhoneNumber(to),
                message: message,
                from: "32345"
            })
            return result;
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