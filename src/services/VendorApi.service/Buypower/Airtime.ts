import { AxiosError } from "axios";
import { NODE_ENV } from "../../../utils/Constants";
import { removeSpacesFromString } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import { BuyPowerApi } from "./Config";

export type BuyPowerAirtimeProvider = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

export interface BuypowerAirtimePurchaseData {
    phoneNumber: string;
    email: string;
    amount: number;
    accountNumber: string;
    serviceType: BuyPowerAirtimeProvider;
    reference: string;
    transactionId: string;
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
        status: false;
        error: true;
        responseCode: 202;
        message: "Transaction is still in progress. Please requery in 20 seconds";
        delay: [20, 20, 20, 20, 20, 20];
    };
}

export default class BuypowerAirtimeApi extends BuyPowerApi {
    private static formatPhoneNumber(phoneNumber: string) {
        return phoneNumber.startsWith("+234")
            ? `0${phoneNumber.slice(4)}`
            : phoneNumber;
    }

    static async purchase(
        data: BuypowerAirtimePurchaseData & { transactionId: string },
    ) {
        const {
            amount,
            accountNumber,
            serviceType,
            phoneNumber,
            reference,
            email,
        } = data;
        const phoneNumberToRecharge = this.formatPhoneNumber(accountNumber);
        const phoneNumberForId = this.formatPhoneNumber(phoneNumber);

        const requestPayload = {
            phone: removeSpacesFromString(phoneNumberForId),
            email,
            meter: removeSpacesFromString(phoneNumberToRecharge), // TODO: Remove this before pushing to production
            disco: serviceType,
            paymentType: "B2B",
            vendType: "PREPAID",
            vertical: "VTU",
            orderId: reference,
            amount: `${amount}`,
        };

        const mainMeta = {
            description: {
                url: this.API.defaults.baseURL + "/vend?strict=0",
                method: "POST",
            },
            data: requestPayload,
            transactionId: data.transactionId,
        };

        try {
            logger.info("Vending request with buypower", {
                meta: { postData: requestPayload, ...mainMeta },
            });
            const response = await this.API.post<PurchaseResponse>(
                "/vend",
                requestPayload,
            );

            logger.info("Vend response from buypower", {
                meta: {
                    requestData: requestPayload,
                    responseData: response.data,
                },
            });
            return {
                ...response.data,
                source: "BUYPOWERNG" as const,
                httpStatusCode: response.status,
            };
        } catch (error: any) {
            if (error instanceof AxiosError) {
                const requery =
                    error.response?.data?.message ===
                        "An unexpected error occurred. Please requery." ||
                    error.response?.data?.responseCode === 500;
                if (requery) {
                    logger.error(error.message, {
                        meta: {
                            stack: error.stack,
                            responseData: error.response?.data,
                            ...mainMeta,
                        },
                    });
                }
            }

            throw error;
        }
    }
}
