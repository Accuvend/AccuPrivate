import { NODE_ENV } from "../../../utils/Constants";
import { generateRandonNumbers } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import { IRechargeBaseConfig, IRechargeApi } from "./Config";

export class IRechargeDataApi extends IRechargeBaseConfig {
    static async purchase(
        data: IRechargeApi.DataPurchaseParams & { transactionId: string },
    ) {
        const { email, amount, phoneNumber, serviceType } = data;

        const reference =
            // NODE_ENV === "development"
            //     ? generateRandonNumbers(12)
            //     :
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
            data.dataCode.toString() +
            "|" +
            this.PUBLIC_KEY;
        const hash = this.generateHash(combinedString);

        const params = {
            vendor_code: this.VENDOR_CODE,
            vtu_network:
                network[serviceType.toLowerCase() as keyof typeof network],
            vtu_amount: parseFloat(amount.toString()),
            vtu_data: data.dataCode,
            vtu_number: phoneNumber,
            email: email,
            reference_id: reference,
            response_format: "json",
            hash,
        };
        console.log({ params });

        const logMeta = {
            description: {
                url: this.API.defaults.baseURL + "/vend_data.php",
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
                | IRechargeApi.DataSuccessfulVendResponse
                | IRechargeApi.RequeryResponse
            >("/vend_data.php", { params });

            logger.info("Vend response from IRECHARGE", {
                meta: {
                    requestData: params,
                    responseData: response.data,
                    ...logMeta,
                },
            });
            console.log({ params, response: response.data });

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
