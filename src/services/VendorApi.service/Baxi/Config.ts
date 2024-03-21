import axios, { AxiosInstance } from "axios";
import {
    BAXI_AGENT_ID,
    BAXI_TOKEN,
    NODE_ENV,
    VENDOR_URL,
} from "../../../utils/Constants";

class BaxiApiBaseConfig {
    protected static baxiApi = axios.create({
        baseURL:
            NODE_ENV === "production"
                ? VENDOR_URL.BAXI.PROD
                : VENDOR_URL.BAXI.DEV,

        headers: {
            "x-api-key": BAXI_TOKEN,
        },
    });
    protected static agentId = BAXI_AGENT_ID;
}

export interface BaxiSuccessfulPuchaseResponse {
    status: string;
    message: string;
    code: number;
    data: {
        statusCode: string;
        transactionStatus: string;
        transactionReference: number;
        transactionMessage: string;
        baxiReference: number;
        provider_message: string;
        extraData: {
            balance: string;
            exchangeReference: string;
            responseMessage: string;
            status: string;
            statusCode: string;
            responseCode: string;
        };
    };
}

export interface BaxiSuccessfulPuchaseResponse {
    Prepaid: {
        status: "success";
        message: string;
        code: number;
        data: {
            statusCode: string;
            transactionStatus: string;
            transactionReference: number;
            transactionMessage: string;
            baxiReference: number;
            provider_message: string;
            extraData: {
                balance: string;
                exchangeReference: string;
                responseMessage: string;
                status: string;
                statusCode: string;
                responseCode: string;
            };
        };
    };
    Postpaid: {
        status: "success";
        message: "Successful";
        code: 200;
        data: {
            transactionStatus: "success";
            transactionReference: number;
            statusCode: "0";
            transactionMessage: "Payment Successful";
            provider_message: "Successful";
            baxiReference: number;
        };
    };
}

export interface BaxiRequeryResultForPurchase {
    Prepaid: {
        status: "success";
        message: "Successful";
        code: 200;
        data: {
            statusCode: "0";
            transactionStatus: "success";
            transactionReference: number;
            transactionMessage: string;
            baxiReference: string;
            pins: any[]; // Assuming pins can be of any type
            tokenCode: string;
            rawData: {
                bsstTokenValue: string;
                fixedTariff: string;
                bsstTokenAmount: number;
                tokenTechnologyCode: string;
                standardTokenUnits: number;
                tariffIndex: string;
                bsstTokenUnits: number;
                bsstTokenTax: number;
                keyRevisionNumber: string;
                terminalId: string;
                standardTokenValue: string;
                bsstTokenDescription: string;
                debtTariff: string;
                responseCode: string;
                algorithmCode: string;
                debtDescription: string;
                standardTokenTax: number;
                fixedAmount: number;
                utilityAddress: string;
                utilityName: string;
                debtAmount: number;
                retailerMessage: string;
                standardTokenDescription: string;
                clientId: string;
                customerMessage: string;
                bsstTokenDate: string;
                utilityTaxReference: string;
                supplyGroupCode: string;
                exchangeReference: string;
                utilityDistrictId: string;
                responseMessage: string;
                status: string;
                standardTokenAmount: number;
            };
        };
    };
    Postpaid: {
        status: "success";
        message: "Successful";
        code: 200;
        data: {
            statusCode: "0";
            transactionStatus: "success";
            transactionReference: number;
            transactionMessage: "Successful";
            baxiReference: "1552283";
            pins: [];
            tokenCode: "";
            rawData: {
                reference: string;
                purchasedUnits: "0.0 Kwh";
                totalAmount: number;
                vendAmount: number;
                vat: number;
                generatedAmount: number;
                freeUnits: "0";
                responseMessage: "Successful";
                receiptNumber: string;
                status: "ACCEPTED";
                responseCode: "200";
                outstandingBalance: number;
            };
        };
    };
}

export default BaxiApiBaseConfig;
