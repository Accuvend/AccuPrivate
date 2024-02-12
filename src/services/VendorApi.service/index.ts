// Import required modules and types
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { BaseResponse, IBaxiGetProviderResponse, IBaxiPurchaseResponse, IBaxiValidateMeterResponse, IBuyPowerGetProvidersResponse, IBuyPowerValidateMeterResponse, IValidateMeter, IVendToken } from "../../utils/Interface";
import querystring from "querystring";
import { BAXI_TOKEN, BAXI_URL, BUYPOWER_TOKEN, BUYPOWER_URL, IRECHARGE_PUBLIC_KEY, IRECHARGE_PRIVATE_KEY, IRECHARGE_VENDOR_CODE, NODE_ENV } from "../../utils/Constants";
import logger from "../../utils/Logger";
import { v4 as UUIDV4 } from 'uuid'
import crypto from 'crypto'
import Transaction from "../../models/Transaction.model";
import { generateRandomString, generateRandomToken, generateRandonNumbers } from "../../utils/Helper";
import { response } from "express";
import BuypowerApi from "./Buypower";
import { BuypowerAirtimePurchaseData } from "./Buypower/Airtime";
import { IRechargeApi } from "./Irecharge";
import BaxiApi from "./Baxi";
import { BaxiRequeryResultForPurchase, BaxiSuccessfulPuchaseResponse } from "./Baxi/Config";

export interface PurchaseResponse extends BaseResponse {
    source: 'BUYPOWERNG';
    status: string;
    statusCode: string;
    responseCode: 200,
    responseMessage: string,
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
        responseCode: 200;
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

interface TimedOutResponse extends BaseResponse {
    source: 'BUYPOWERNG';
    data: {
        status: false,
        error: true,
        responseCode: 202,
        message: 'Transaction is still in progress. Please requery in 20 seconds',
        delay: [20, 20, 20, 20, 20, 20]
    }
}

interface _RequeryBuypowerSuccessResponse extends BaseResponse {
    source: 'BUYPOWERNG';
    result: {
        status: true,
        data: {
            id: number,
            amountGenerated: `${number}`,
            disco: string,
            orderId: string,
            receiptNo: string,
            tax: `${number}`,
            vendTime: Date,
            token: `${number}-${number}-${number}-${number}-${number}`,
            units: `${number}`,
            vendRef: string,
            responseCode: number,
            responseMessage: string
        }
    }
}

export interface SuccessResponseForBuyPowerRequery extends BaseResponse {
    source: 'BUYPOWERNG'
    status: true,
    message: string,
    data: _RequeryBuypowerSuccessResponse['result']['data']
    responseCode: 200,
}

interface InprogressResponseForBuyPowerRequery {
    source: 'BUYPOWERNG'
    status: false,
    message: string,
    responseCode: 201
}

interface FailedResponseForBuyPowerRequery {
    source: 'BUYPOWERNG'
    status: false,
    message: string,
    responseCode: 202
}

interface IRechargeSuccessfulVendResponse {
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

interface IRechargeRequeryResponse {
    source: 'IRECHARGE',
    status: '00' | '15' | '43',
    vend_status: 'successful',
    vend_code: '00',
    token: string,
    units: `${number}`,
    response_hash: string

}

interface IRechargeMeterValidationResponse {
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

type BuypowerRequeryResponse = _RequeryBuypowerSuccessResponse | InprogressResponseForBuyPowerRequery | FailedResponseForBuyPowerRequery

abstract class VendorApi {
    protected static client: AxiosInstance

    static getDiscos: () => Promise<any>
    static isDiscoUp: (disco: string) => Promise<boolean>
    static validateMeter: (disco: string, meterNumber: string, vendType: 'PREPAID' | 'POSTPAID') => Promise<any>
    static vend: (disco: string, meterNumber: string, vendType: 'PREPAID' | 'POSTPAID') => Promise<any>
    static requery: (disco: string, meterNumber: string, vendType: 'PREPAID' | 'POSTPAID') => Promise<any>
}

declare namespace IRechargeVendorService {
    interface Disco {
        id: `${number}`,
        code: string,
        description: string,
        minimum_value: `${number}`,
        maximum_value: `${number}`,
    }

    interface GetDiscosResponse {
        status: '00',
        message: 'Successful',
        bundles: IRechargeVendorService.Disco[]
    }
}

export class IRechargeVendorService {
    protected static PRIVATE_KEY = IRECHARGE_PRIVATE_KEY
    protected static PUBLIC_KEY = IRECHARGE_PUBLIC_KEY
    protected static client = axios.create({
        baseURL: NODE_ENV === 'production' ? "https://irecharge.com.ng/pwr_api_live/v2" : "https://irecharge.com.ng/pwr_api_sandbox/v2"
    })
    protected static VENDOR_CODE = IRECHARGE_VENDOR_CODE

    private static generateHash(combinedString: string): string {
        const hash = crypto.createHmac('sha1', IRECHARGE_PRIVATE_KEY).update(combinedString).digest('hex')
        return hash
    }

    static async getDiscos() {
        const response = await this.client.get<IRechargeVendorService.GetDiscosResponse>('/get_electric_disco.php?response_format=json')
        return response.data
    }

    static async validateMeter({ disco, reference, meterNumber }: { disco: string, meterNumber: string, reference: string }) {
        reference = NODE_ENV === 'development' ? generateRandonNumbers(12) : reference
        meterNumber = NODE_ENV === 'development' ? '1234567890' : meterNumber

        const combinedString = this.VENDOR_CODE + "|" + reference + "|" + meterNumber + "|" + disco + "|" + this.PUBLIC_KEY
        const hash = this.generateHash(combinedString)

        const response = await this.client.get<IRechargeMeterValidationResponse>(`/get_meter_info.php/?vendor_code=${this.VENDOR_CODE}&reference_id=${reference}&meter=${meterNumber}&disco=${disco}&response_format=json&hash=${hash}`)

        return response.data
    };

    static async vend({ disco, reference, meterNumber, accessToken, amount, phone, email }: { disco: string, meterNumber: string, vendType: "PREPAID" | "POSTPAID", reference: string, accessToken: string, phone: string, email: string, amount: number }): Promise<any> {
        reference = NODE_ENV === 'development' ? generateRandonNumbers(12) : reference
        amount = NODE_ENV === 'development' ? 500 : amount  // IRecharge has a minimum amount of 500 naira and the wallet balance is limited
        meterNumber = NODE_ENV === 'development' ? '1234567890' : meterNumber

        const combinedString = this.VENDOR_CODE + "|" + reference + "|" + meterNumber + "|" + disco + "|" + amount + "|" + accessToken + "|" + this.PUBLIC_KEY
        const hash = this.generateHash(combinedString)

        const response = await this.client.get<IRechargeSuccessfulVendResponse>('/vend_power.php', {
            params: {
                vendor_code: this.VENDOR_CODE,
                reference_id: reference,
                meter: meterNumber,
                disco,
                amount,
                email,
                phone,
                access_token: accessToken,
                response_format: 'json',
                hash
            }
        })

        const responseData = { ...response.data, source: 'IRECHARGE' }
        return responseData
    };

    static async requery({ accessToken, serviceType }: { accessToken: string, serviceType: string }) {
        const combinedString = this.VENDOR_CODE + "|" + accessToken + "|" + this.PUBLIC_KEY
        const hash = this.generateHash(combinedString)

        const params = {
            vendor_code: this.VENDOR_CODE,
            access_token: accessToken,
            type: serviceType,
            response_format: 'json',
            hash
        }

        console.log({ params })

        const response = await this.client.get<IRechargeRequeryResponse>('/vend_status.php', { params })

        return { ...response.data, source: 'IRECHARGE' }

    };
}

export class VendorAirtimeService {

}
// Define the VendorService class for handling provider-related operations
export default class VendorService {
    // Static method for obtaining a Baxi vending token
    static async baxiVendToken(body: IVendToken) {
        const {
            reference,
            meterNumber,
            disco,
            amount,
            phone
        } = body

        try {
            const response = await this.baxiAxios().post<BaxiSuccessfulPuchaseResponse['Postpaid' | 'Prepaid']>('/electricity/request', {
                amount,
                phone,
                account_number: meterNumber,
                service_type: disco,
                agentId: 'baxi',
                agentReference: reference
            })

            console.log({
                info: 'Vend response from baxi',
                data: response.data
            })

            return { ...response.data, source: 'BAXI' as const }
        } catch (error: any) {
            console.log({
                message: error.message,
                response: error.response?.data.errors
            })
            throw new Error(error.message)
        }
    }

    static async baxiRequeryTransaction<T extends keyof BaxiRequeryResultForPurchase>({ reference }: { reference: string }) {
        try {
            const response = await this.baxiAxios().get<BaxiRequeryResultForPurchase[T]>(`/superagent/transaction/requery?agentReference=${reference}`)

            const responseData = response.data

            console.log({
                info: 'Requery response from baxi',
                data: responseData
            })
            if (responseData.status === 'success') {
                return {
                    source: 'BAXI' as const,
                    status: true,
                    message: 'Transaction successful',
                    data: responseData.data,
                    responseCode: 200
                }
            }

            return {
                source: 'BAXI' as const,
                status: false,
                message: responseData.message,
                data: responseData.data,
                responseCode: 202
            }
        } catch (error) {
            throw error
        }
    }

    // Static method for validating a meter with Baxi
    static async baxiValidateMeter(disco: string, meterNumber: string, vendType: 'PREPAID' | 'POSTPAID') {
        const serviceType = disco.toLowerCase()
        const postData = {
            service_type: disco,
            account_number: NODE_ENV === 'development' ? '6528651914' : meterNumber // Baxi has a test meter number
        }

        try {
            const response = await this.baxiAxios().post<IBaxiValidateMeterResponse>('/electricity/verify', postData)
            const responseData = response.data

            console.log({ responseData })
            if ((responseData as any).status == 'pending') {
                throw new Error('Transaction timeout')
            }

            return responseData
        } catch (error: any) {
            console.log(error.response)
            throw new Error(error.message)
        }
    }

    static async baxiFetchAvailableDiscos() {
        try {
            const response = await this.baxiAxios().get<IBaxiGetProviderResponse>('/electricity/billers')
            const responseData = response.data
            const providers = [] as { name: string, serviceType: 'PREPAID' | 'POSTPAID' }[]

            for (const provider of responseData.data.providers) {
                const serviceProvider = provider.service_type.split('_')[0].toUpperCase()
                const serviceType = provider.service_type.split('_')[2].toUpperCase()

                if (provider.service_type.includes('electric')) {
                    providers.push({
                        name: serviceProvider + ` ${serviceType}`,
                        serviceType: serviceType as 'PREPAID' | 'POSTPAID',
                    })
                }
            }

            return providers
        } catch (error) {
            throw error
        }
    }

    // Static method for checking Disco updates with Baxi
    static async baxiCheckDiscoUp(disco: string) {
        try {
            const responseData = await this.baxiFetchAvailableDiscos()

            for (const provider of responseData) {
                const name = provider.name.split(' ')[0]
                if (name.toUpperCase() === disco.toUpperCase()) {
                    return true
                }
            }

            return false
        } catch (error) {
            console.error(error)
            logger.error(error)
            throw new Error()
        }
    }

    static baxiAxios(): AxiosInstance {
        const AxiosCreate = axios.create({
            baseURL: `${BAXI_URL}`,
            headers: {
                'x-api-key': BAXI_TOKEN
            }
        });

        return AxiosCreate;
    }

    // Static method for creating a BuyPower Axios instance
    static buyPowerAxios(): AxiosInstance {
        // Create an Axios instance with BuyPower URL and token in the headers
        const AxiosCreate = axios.create({
            baseURL: `${BUYPOWER_URL}`,
            headers: {
                Authorization: `Bearer ${BUYPOWER_TOKEN}`
            }
        });

        return AxiosCreate;
    }

    // Static method for vending a token with BuyPower
    static async buyPowerVendToken(body: IVendToken): Promise<PurchaseResponse | TimedOutResponse> {
        // Define data to be sent in the POST request
        const postData = {
            orderId: body.reference,
            meter: body.meterNumber,
            disco: body.disco,
            paymentType: "B2B",
            vendType: body.vendType.toUpperCase(),
            amount: body.amount,
            phone: body.phone
        }

        if (NODE_ENV === 'development') {
            postData.phone = '08034210294'
            postData.meter = '12345678910'
        }

        try {
            // Make a POST request using the BuyPower Axios instance
            const response = await this.buyPowerAxios().post<PurchaseResponse | TimedOutResponse>(`/vend?strict=0`, postData);
            console.log({
                requestData: postData,
                info: 'Vend response from buypower',
                data: response.data
            })
            return { ...response.data, source: 'BUYPOWERNG' };
        } catch (error: any) {
            if (error instanceof AxiosError) {
                const requery = error.response?.data?.message === "An unexpected error occurred. Please requery." || error.response?.data?.responseCode === 500
                if (requery) {
                    logger.error(error.message, { meta: { stack: error.stack, responseData: error.response?.data } })
                    throw new Error('Transaction timeout')
                }
            }

            throw error
        }

        // TODO: Use event emitter to requery transaction after 10s
    }

    static async buyPowerRequeryTransaction({ reference }: { reference: string }) {
        try {
            const response = await this.buyPowerAxios().get<BuypowerRequeryResponse>(`/transaction/${reference}`)

            const successResponse = response.data as _RequeryBuypowerSuccessResponse
            console.log({
                requestData: { reference },
                info: 'Requery response from buypower',
                data: successResponse
            })
            if (successResponse.result.status === true) {
                return {
                    source: 'BUYPOWERNG',
                    status: true,
                    message: 'Transaction successful',
                    data: successResponse.result.data,
                    responseCode: 200
                } as SuccessResponseForBuyPowerRequery
            }

            return { ...response.data, source: 'BUYPOWERNG' } as InprogressResponseForBuyPowerRequery | FailedResponseForBuyPowerRequery
        } catch (error) {
            throw error
        }
    }

    // Static method for validating a meter with BuyPower
    static async buyPowerValidateMeter(body: IValidateMeter) {
        // Define query parameters using the querystring module
        const paramsObject: any = {
            meter: NODE_ENV === 'development' ? '12345678910' : body.meterNumber,
            disco: body.disco,
            vendType: body.vendType.toUpperCase(),
            vertical: 'ELECTRICITY'
        }
        const params: string = querystring.stringify(paramsObject);

        try {
            // Make a GET request using the BuyPower Axios instance
            const response = await this.buyPowerAxios().get<IBuyPowerValidateMeterResponse>(`/check/meter?${params}`);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error('An error occurred while validating meter');
        }
    }

    // Static method for checking Disco updates with BuyPower
    static async buyPowerCheckDiscoUp(disco: string): Promise<boolean> {
        try {
            // Make a GET request to check Disco updates
            const response = await this.buyPowerAxios().get(`${BUYPOWER_URL}/discos/status`);
            const data = response.data;
            if (data[disco.toUpperCase()] === true) return true;
            else return false;
        } catch (error) {
            logger.info(error)
            throw new Error()
        }
    }

    static async buyPowerFetchAvailableDiscos() {
        try {
            const providers = [] as { name: string, serviceType: 'PREPAID' | 'POSTPAID' }[]

            const response = await this.buyPowerAxios().get<IBuyPowerGetProvidersResponse>('/discos/status')
            const responseData = response.data

            for (const key of Object.keys(responseData)) {
                if (responseData[key as keyof IBuyPowerGetProvidersResponse] === true) {
                    providers.push({
                        name: key.toUpperCase() + ' PREPAID',
                        serviceType: 'PREPAID',
                    })

                    providers.push({
                        name: key.toUpperCase() + ' POSTPAID',
                        serviceType: 'POSTPAID',
                    })
                }
            }

            return providers
        } catch (error) {
            logger.error(error)
            throw new Error()
        }
    }

    static async irechargeFetchAvailableDiscos() {
        try {
            const response = await IRechargeVendorService.getDiscos()
            const responseData = response.bundles

            const providers = [] as { name: string, serviceType: 'PREPAID' | 'POSTPAID' }[]

            for (const provider of responseData) {
                const providerDescription = provider.description.split(' ')
                const serviceType = providerDescription[providerDescription.length - 1].toUpperCase()
                providers.push({
                    name: provider.code.split('_').join(' ').toUpperCase(),
                    serviceType: serviceType as 'PREPAID' | 'POSTPAID'
                })
            }

            return providers
        } catch (error) {
            console.error(error)
            logger.error(error)
            throw new Error()
        }
    }

    static async irechargeValidateMeter(disco: string, meterNumber: string, reference: string) {
        const response = await IRechargeVendorService.validateMeter({ disco, meterNumber, reference })
        console.log(response)
        return response
    }

    static async irechargeVendToken(body: IVendToken & { email: string, accessToken: string }): Promise<IRechargeSuccessfulVendResponse> {
        const {
            reference,
            meterNumber,
            disco,
            amount,
            phone,
            vendType,
            accessToken,
            email
        } = body

        console.log({
            requestData: body,
            info: 'Vending token with IRecharge',
            data: {
                reference,
                meterNumber,
                disco,
                amount,
                phone,
                vendType,
                accessToken,
                email
            }
        })
        const response = await IRechargeVendorService.vend({ disco, reference, meterNumber, accessToken, amount: parseInt(amount, 10), phone, email, vendType })
        console.log({
            info: 'Vend response',
            data: response
        })
        return response
    }

    static async irechargeRequeryTransaction({ serviceType, accessToken }: { accessToken: string, serviceType: 'power' | 'airtime' | 'data' | 'tv' }) {
        const response = await IRechargeVendorService.requery({ serviceType, accessToken })
        console.log({
            requestData: { serviceType, accessToken },
            info: 'Requery response from irecharge',
            data: response
        })
        return response
    }

    static async purchaseAirtime<T extends Vendor>({ data, vendor }: { data: BuypowerAirtimePurchaseData, vendor: T }): Promise<AirtimePurchaseResponse[T]> {
        if (vendor === 'BUYPOWERNG') {
            return await BuypowerApi.Airtime.purchase(data) as AirtimePurchaseResponse[T]
        } else if (vendor === 'IRECHARGE') {
            return await IRechargeApi.Airtime.purchase(data) as AirtimePurchaseResponse[T]
        } else if (vendor === 'BAXI') {
            return await BaxiApi.Airtime.purchase(data) as AirtimePurchaseResponse[T]
        } else {
            throw new Error('UNAVAILABLE_VENDOR')
        }
    }

    static async purchaseData<T extends Vendor>({ data, vendor }: {
        data: {
            amount: number,
            dataCode: string,
            serviceType: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE',
            phoneNumber: string,
            reference: string,
            email: string,
        },
        vendor: T
    }): Promise<DataPurchaseResponse[T]> {
        if (vendor === 'BUYPOWERNG') {
            return await BuypowerApi.Data.purchase(data) as DataPurchaseResponse[T]
        } else if (vendor === 'IRECHARGE') {
            return await IRechargeApi.Data.purchase(data) as DataPurchaseResponse[T]
        } else if (vendor === 'BAXI') {
            return await BaxiApi.Data.purchase(data) as DataPurchaseResponse[T]
        } else {
            throw new Error('UNAVAILABLE_VENDOR')
        }
    }

    static async purchaseElectricity<T extends Vendor>({ data, vendor }: {
        data: {
            reference: string,
            meterNumber: string,
            disco: string,
            amount: string,
            vendType: 'PREPAID' | 'POSTPAID',
            phone: string,
            email: string,
            accessToken: string
        }, vendor: T
    }): Promise<ElectricityPurchaseResponse[T]> {
        if (vendor === 'BUYPOWERNG') {
            return await this.buyPowerVendToken(data) as ElectricityPurchaseResponse[T]
        } else if (vendor === 'IRECHARGE') {
            return await this.irechargeVendToken(data) as ElectricityPurchaseResponse[T]
        } else if (vendor === 'BAXI') {
            return await this.baxiVendToken(data) as ElectricityPurchaseResponse[T]
        } else {
            throw new Error('UNAVAILABLE_VENDOR')
        }
    }
}

interface AirtimePurchaseResponse {
    BUYPOWERNG: Awaited<ReturnType<typeof BuypowerApi.Airtime.purchase>>,
    IRECHARGE: Awaited<ReturnType<typeof IRechargeApi.Airtime.purchase>>,
    BAXI: Awaited<ReturnType<typeof BaxiApi.Airtime.purchase>>,
}

export interface DataPurchaseResponse {
    BUYPOWERNG: Awaited<ReturnType<typeof BuypowerApi.Data.purchase>>,
    IRECHARGE: Awaited<ReturnType<typeof IRechargeApi.Data.purchase>>,
    BAXI: Awaited<ReturnType<typeof BaxiApi.Data.purchase>>,
}

export interface ElectricityPurchaseResponse {
    BUYPOWERNG: PurchaseResponse | TimedOutResponse,
    IRECHARGE: IRechargeSuccessfulVendResponse,
    BAXI: Awaited<ReturnType<typeof VendorService.baxiVendToken>>,
}

export type Prettify<T extends {}> = { [K in keyof T]: T[K] }

export type Vendor = 'BUYPOWERNG' | 'IRECHARGE' | 'BAXI'