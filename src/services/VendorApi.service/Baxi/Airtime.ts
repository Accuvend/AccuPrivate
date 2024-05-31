import { generateRandomString } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import BaxiApiBaseConfig, { BaxiSuccessfulPuchaseResponse } from "./Config";

export type BaxiAirtimeServiceType = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

export interface PurchaseInfo {
    serviceType: BaxiAirtimeServiceType;
    phoneNumber: string;
    reference: string;
    amount: number;
}

export default class BaxiAirtimeApi extends BaxiApiBaseConfig {
    static async getRechargeProviders() {
        const response = await this.baxiApi.get("/airtime/providers");

        return response.data;
    }

    static async purchase(
        purchaseData: PurchaseInfo & { transactionId: string },
    ) {
        const { serviceType, phoneNumber, reference, amount } = purchaseData;

        const logMeta = {
            description: {
                url: this.baxiApi.defaults.baseURL + "/airtime/request",
                method: "POST",
            },
            data: purchaseData,
            transactionId: purchaseData.transactionId,
        };

        const requestPayload = {
            agentReference: reference,
            agentId: this.agentId,
            plan: "prepaid",
            service_type: serviceType.toLowerCase(),
            phone: phoneNumber,
            amount,
        };

        try {
            logger.info("Vending request with BAXI", {
                meta: { postData: requestPayload, ...logMeta },
            });

            const response =
                await this.baxiApi.post<BaxiSuccessfulPuchaseResponse>(
                    "/airtime/request",
                    requestPayload,
                );
            logger.info("Vend response from BAXI", {
                meta: {
                    requestData: requestPayload,
                    responseData: response.data,
                },
            });

            return response.data;
        } catch (error: any) {
            if (error.response) {
                logger.error("Vend response from BAXI", {
                    meta: {
                        requestData: requestPayload,
                        responseData: error.response.data,
                    },
                });
            }
            throw error;
        }
    }
}
