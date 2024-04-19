import { NODE_ENV } from "../../../utils/Constants";
import { removeSpacesFromString } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import { BuyPowerApi } from "./Config";

export type BuyPowerDataProvider = 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'

export interface BuypowerDataPurchaseData {
    phoneNumber: string;
    email: string;
    amount: number;
    serviceType: BuyPowerDataProvider;
    reference: string,
    dataCode: string;
}

interface PurchaseResponse {
    status: string;
    responseCode: 200;
    message: string;
    data: {
        id: number;
        amountGenerated: number;
        tariff: null | string;
        debtAmount: number;
        debtRemaining: number;
        disco: string;
        freeUnits: number;
        orderId: string;
        receiptNo: number;
        tax: number;
        vendTime: string;
        token: string;
        totalAmountPaid: number;
        units: string;
        vendAmount: number;
        vendRef: number;
        responseCode: number;
        responseMessage: string;
        address: string;
        name: string;
        phoneNo: string;
        charges: number;
        tariffIndex: null | string;
        parcels: {
            type: string;
            content: string;
        }[];
        demandCategory: string;
        assetProvider: string;
    };
}

interface TimedOutResponse {
    data: {
        status: false,
        error: true,
        responseCode: 202,
        message: 'Transaction is still in progress. Please requery in 20 seconds',
        delay: [20, 20, 20, 20, 20, 20]
    }
}

export default class BuypowerDataApi extends BuyPowerApi {
    private static formatPhoneNumber(phoneNumber: string) {
        return phoneNumber.startsWith('+234') ? `0${phoneNumber.slice(4)}` : phoneNumber
    }

    static async purchase(data: BuypowerDataPurchaseData) {
        const { amount, serviceType, phoneNumber, reference, email, dataCode } = data
        const phoneNumberToRecharge = this.formatPhoneNumber(phoneNumber)

        const requestPayload = {
            phone: NODE_ENV === 'development' ? '08186077527' : removeSpacesFromString(phoneNumberToRecharge),
            email,
            meter: NODE_ENV === 'development' ? '08186077527' : removeSpacesFromString(phoneNumberToRecharge), // TODO: Remove this before pushing to production
            tariffClass: dataCode,
            "disco": serviceType,
            "paymentType": "B2B",
            "vendType": "PREPAID",
            "vertical": "DATA",
            "orderId": reference,
            "amount": `${amount}`,
        }

        console.log({ requestPayload })

        const response = await this.API
            .post<PurchaseResponse>('/vend', requestPayload)
            .catch((error) => {
                const transactionShouldBeRequeried = error.response?.data?.message === "An unexpected error occurred. Please requery." ||
                    error.response?.data?.responseCode === 500
                if (transactionShouldBeRequeried) {
                    logger.error(error.message, { meta: { stack: error.stack, responseData: error.response?.data } })
                    throw new Error('Transaction timeout')
                }

                throw error
            })

        return response.data
    }
}