import { NODE_ENV } from "../../../utils/Constants";
import { generateRandonNumbers } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import { IRechargeBaseConfig, IRechargeApi } from "./Config";

export class IRechargeAirtimeApi extends IRechargeBaseConfig {
    static async purchase(
        data: IRechargeApi.AirtimePurchaseParams & { transactionId: string },
    ) {
        const { email, amount, phoneNumber, serviceType } = data;

        const reference =
            data.reference;

        const network = {
            mtn: "MTN",
            glo: "Glo",
            airtel: "Airtel",
            "9mobile": "Etisalat",
            etisalat: "Etisalat",
        };

        const combinedString =
            this.VENDOR_CODE +
            "|" +
            reference +
            "|" +
            phoneNumber +
            "|" +
            network[serviceType.toLowerCase() as keyof typeof network] +
            "|" +
            amount +
            "|" +
            this.PUBLIC_KEY;
        const hash = this.generateHash(combinedString);

        const params = {
            vendor_code: this.VENDOR_CODE,
            vtu_network:
                network[serviceType.toLowerCase() as keyof typeof network],
            vtu_amount: amount,
            vtu_number: phoneNumber,
            vtu_email: email,
            reference_id: reference,
            response_format: "json",
            hash,
        };
        console.log({ params });

        const logMeta = {
            description: {
                url: this.API.defaults.baseURL + "/vend_airtime.php",
                method: "GET",
            },
            data: params,
            transactionId: data.transactionId,
        };

        try {
            logger.info("Vending request with IRECHARGE", {
                meta: { postData: params, ...logMeta },
            });
            const response = await this.API.get<
                | IRechargeApi.AirtimeSuccessfulVendResponse
                | IRechargeApi.RequeryResponse
            >("/vend_airtime.php", {
                params,
            });

            logger.info("Vend response from IRECHARGE", {
                meta: {
                    requestData: params,
                    responseData: response.data,
                },
            });
            console.log(response.data);

            
        return {
            ...response.data,
            source: "IRECHARGE" as const,
            httpStatusCode: response.status,
        };
        } catch (error: any) {
            if (error.response) {
                logger.error("Vend response from IRECHARGE", {
                    meta: {
                        requestData: params,
                        responseData: error.response.data,
                    },
                });
            }
            throw error;
        }
    }
}

