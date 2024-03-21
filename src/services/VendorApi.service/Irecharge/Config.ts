import axios from "axios"
import { IRECHARGE_PRIVATE_KEY, IRECHARGE_PUBLIC_KEY, NODE_ENV, IRECHARGE_VENDOR_CODE, VENDOR_URL } from "../../../utils/Constants"
import crypto from "crypto"

export class IRechargeBaseConfig {
    protected static PRIVATE_KEY = IRECHARGE_PRIVATE_KEY
    protected static PUBLIC_KEY = IRECHARGE_PUBLIC_KEY
    protected static API = axios.create({
         baseURL:
            NODE_ENV === "production"
                ? VENDOR_URL.IRECHARGE.PROD
                : VENDOR_URL.IRECHARGE.DEV,
    })
    protected static VENDOR_CODE = IRECHARGE_VENDOR_CODE

    protected static generateHash(combinedString: string): string {
        const hash = crypto.createHmac('sha1', IRECHARGE_PRIVATE_KEY).update(combinedString).digest('hex')
        return hash
    }
}

export declare namespace IRechargeApi {
    interface AirtimePurchaseParams {
        phoneNumber: string;
        email: string;
        amount: number;
        serviceType: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'
        reference: string
    }

    interface MeterValidationParams {
        meterNumber: string;
        serviceType: 'prepaid' | 'postpaid'
    }

    interface IRechargeRequeryParams {
        reference: string
    }

    interface SuccessfulVendResponse {
        source: 'IRECHARGE'
        status: '00' | '15' | '43', // there are other response codes, but these are the only necessary ones. only '00' will have the response data shown below
        message: 'Successful',
        wallet_balance: string,
        ref: string,
        amount: number,
        units: `${number}`,
        meter_token: string,
        address: string,
        response_hash: string
    }

    interface AirtimeSuccessfulVendResponse {
        source: 'IRECHARGE'
        status: '00' | '15' | '43', // there are other response codes, but these are the only necessary ones. only '00' will have the response data shown below
        message: 'Successful',
        wallet_balance: string,
        ref: string,
        amount: number,
        response_hash: string
    }

    interface DataPurchaseParams {
        phoneNumber: string;
        email: string;
        amount: number;
        serviceType: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'
        reference: string;
        dataCode: string;
    }

    interface DataSuccessfulVendResponse {
        source: 'IRECHARGE'
        status: '00' | '15' | '43', // there are other response codes, but these are the only necessary ones. only '00' will have the response data shown below
        message: 'Successful',
        wallet_balance: string,
        ref: string,
        amount: number,
        response_hash: string
    }

    interface RequeryResponse {
        source: 'IRECHARGE',
        status: '00' | '15' | '43',
        vend_status: 'successful',
        vend_code: '00',
        token: string,
        units: `${number}`,
        ref: string,
        response_hash: string
    }

    interface MeterValidationResponse {
        status: '00';
        message: string;
        access_token: string;
        customer: {
            name: string;
            address: string;
            util: string;
            minimumAmount: string;
        };
        response_hash: string;
    }
}
