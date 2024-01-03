// Import required modules and types
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { BaseResponse, IBaxiGetProviderResponse, IBaxiPurchaseResponse, IBaxiValidateMeterResponse, IBuyPowerGetProvidersResponse, IBuyPowerValidateMeterResponse, IValidateMeter, IVendToken } from "../utils/Interface";
import querystring from "querystring";
import { BAXI_TOKEN, BAXI_URL, BUYPOWER_TOKEN, BUYPOWER_URL, IRECHARGE_PUBLIC_KEY, IRECHARGE_PRIVATE_KEY, IRECHARGE_VENDOR_CODE, NODE_ENV } from "../utils/Constants";
import logger from "../utils/Logger";
import { v4 as UUIDV4 } from 'uuid'
import crypto from 'crypto'
import Transaction from "../models/Transaction.model";
import { generateRandomToken } from "../utils/Helper";
import { response } from "express";
require('newrelic');
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

interface SuccessResponseForBuyPowerRequery extends BaseResponse {
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


type BuypowerRequeryResponse = _RequeryBuypowerSuccessResponse | InprogressResponseForBuyPowerRequery | FailedResponseForBuyPowerRequery

abstract class Vendor {
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

    static async validateMeter({ disco, reference, meterNumber }: { disco: string, meterNumber: string, reference: string }): Promise<any> {
        const combinedString = this.VENDOR_CODE + "|" + reference + "|" + meterNumber + "|" + disco + "|" + this.PUBLIC_KEY
        const hash = this.generateHash(combinedString)

        const response = await this.client.get(`/get_meter_info.php/?vendor_code=${this.VENDOR_CODE}&reference_id=${reference}&meter=${meterNumber}&disco=${disco}&response_format=json&hash=${hash}`)

        return response.data
    };

    static async vend(disco: string, meterNumber: string, vendType: "PREPAID" | "POSTPAID"): Promise<any> {

    };

    static async requery(disco: string, meterNumber: string, vendType: "PREPAID" | "POSTPAID"): Promise<any> {

    };
}

class BaxipaySeed {
    static generateDataForSuccessfulVend(reference: string, amount: string) {
        const statuses = ['success', 'failure', 'pending'];
        const transactionStatuses = ['completed', 'pending', 'failed'];
        const statusCode = Math.floor(Math.random() * 1000).toString();
        const tokenAmount = Math.random() > 0.5 ? null : Math.floor(Math.random() * 100);
        const amountOfPower = amount
        const feesAmount = Math.floor(Math.random() * 10);
        const feeder = 'Feeder Name';
        const dssName = 'DSS Name';
        const serviceBand = 'Service Band';
        const message = Math.random() > 0.5 ? 'Transaction successful' : 'Transaction failed';
        const token = generateRandomToken();
        const exchangeReference = 'Exchange Ref';
        const tariff = 'Tariff Type';
        const power = 'Power Type';
        const status = 'OK';
        const providerMessage = 'Provider Message';
        const baxiReference = Math.floor(Math.random() * 100000);

        return {
            source: 'BAXI' as const,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            statusCode: statusCode,
            message: message,
            data: {
                transactionStatus: transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)],
                transactionReference: reference,
                statusCode: statusCode,
                transactionMessage: message,
                tokenCode: 'Token Code',
                tokenAmount: tokenAmount,
                amountOfPower: amountOfPower,
                rawOutput: {
                    fees: [
                        {
                            amount: feesAmount,
                            kind: 'Kind of Fee',
                            description: 'Fee Description',
                            taxAmount: Math.floor(Math.random() * 5)
                        }
                    ],
                    feeder: feeder,
                    dssName: dssName,
                    serviceBand: serviceBand,
                    message: message,
                    token: token,
                    rate: 'Exchange Rate',
                    exchangeReference: exchangeReference,
                    tariff: tariff,
                    power: power,
                    status: status,
                    statusCode: statusCode
                },
                provider_message: providerMessage,
                baxiReference: baxiReference
            },
            responseCode: 200
        }
    }
}

// Define the VendorService class for handling provider-related operations
export default class VendorService {
    private static generateToken(): string {
        // format 1234-1234-1234-1234-1234
        let token = ''
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                token += Math.floor(Math.random() * 10).toString()
            }
            token += '-'
        }

        return token
    }

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
            const response = await this.baxiAxios().post<IBaxiPurchaseResponse>('/electricity/request', {
                amount,
                phone,
                account_number: meterNumber,
                service_type: disco.toLowerCase() + '_electric' + '_prepaid',
                agentId: 'baxi',
                agentReference: reference
            })

            response.data.data.rawOutput.token = NODE_ENV === 'development' 
                ? generateRandomToken() 
                : response.data.data.rawOutput.token
                
            return { ...response.data, source: 'BAXI' as const }
        } catch (error: any) {
            if (NODE_ENV === 'development') {
                // This is because baxi API currently has been failing on dev mode
                const res = BaxipaySeed.generateDataForSuccessfulVend(reference, amount)
                return res
            }

            throw new Error(error.message)
        }
    }

    static async baxiRequeryTransaction({ reference }: { reference: string }) {
        try {
            const response = await this.baxiAxios().get<IBaxiPurchaseResponse>(`/superagent/transaction/requery?agentReference=${reference}`)

            const responseData = response.data
            if (responseData.status === 'success') {
                return {
                    source: 'BAXI' as const,
                    status: true,
                    message: 'Transaction successful',
                    data: responseData.data,
                    responseCode: 200
                }
            }

            return NODE_ENV === 'development'
                ? BaxipaySeed.generateDataForSuccessfulVend(reference, '10000')
                : {
                    source: 'BAXI' as const,
                    status: false,
                    message: responseData.message,
                    responseCode: 202
                }
        } catch (error) {
            throw error
        }
    }

    // Static method for validating a meter with Baxi
    static async baxiValidateMeter(disco: string, meterNumber: string, vendType: 'PREPAID' | 'POSTPAID') {
        const serviceType = disco.toLowerCase() + '_electric' + `_${vendType.toLowerCase()}`  // e.g. aedc_electric_prepaid
        const postData = {
            service_type: serviceType,
            account_number: NODE_ENV === 'development' ? '6528651914' : meterNumber // Baxi has a test meter number
        }

        try {
            const response = await this.baxiAxios().post<IBaxiValidateMeterResponse>('/electricity/verify', postData)
            return response.data.data
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
            // Buypower requery has been returning 500 error on dev mode
            if (NODE_ENV === 'development') {
                return {
                    'source': 'BUYPOWERNG',
                    "status": true,
                    "message": "Transaction succesful",
                    'responseCode': 200,
                    "data": {
                        "id": 80142232,
                        "amountGenerated": "16600.00",
                        "tariff": null,
                        "disco": "DSTV",
                        "debtAmount": "0.00",
                        "debtRemaining": "0.00",
                        "orderId": reference,
                        "receiptNo": "342544321342",
                        "tax": "0.00",
                        "vendTime": new Date(),
                        "token": this.generateToken(),
                        "totalAmountPaid": 16600,
                        "units": "1",
                        "vendAmount": "16600",
                        "vendRef": "sfasdfa2432323",
                        "responseCode": 100,
                        "responseMessage": "Request successful",
                        "address": "12342112345",
                        "name": "23456564345",
                        "phoneNo": null,
                        "charges": "0.00",
                        "tariffIndex": null,
                        "parcels": [],
                    }
                } as SuccessResponseForBuyPowerRequery
            }

            const response = await this.buyPowerAxios().get<BuypowerRequeryResponse>(`/transaction/${reference}`)

            const successResponse = response.data as _RequeryBuypowerSuccessResponse
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
        return response
    }
}
