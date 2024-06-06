import { generateRandonNumbers } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import BaxiApiBaseConfig, { BaxiSuccessfulPuchaseResponse } from "./Config";
export type BaxiDataServiceType = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";

interface BaxiPurchaseData {
    dataCode: string;
    serviceType: BaxiDataServiceType;
    phoneNumber: string;
    amount: number;
    package?: "RENEW" | "CHANGE_IMMEDIATE" | "CHANGE_AFTER_EXPIRY";
}

export default class BaxiDataApi extends BaxiApiBaseConfig {
    static async getServiceProviders() {
        const response = await this.baxiApi.get("/databundle/providers");

        return response.data;
    }

    static async getServiceProviderBundles(
        serviceType: BaxiDataServiceType,
        accountNumber?: number,
    ) {
        const response = await this.baxiApi.post("/databundle/bundles", {
            service_type: serviceType,
        });

        return response.data;
    }

    static async purchase(
        purchaseData: BaxiPurchaseData & { transactionId: string },
    ) {
        const {
            dataCode,
            serviceType,
            phoneNumber,
            amount,
            package: selectedPackage, // Package is a reserved word in classes
        } = purchaseData;

        const logMeta = {
            description: {
                url: this.baxiApi.defaults.baseURL + "/databundle/request",
                method: "POST",
            },
            data: purchaseData,
            transactionId: purchaseData.transactionId,
        };

        const requestPayload = {
            agentReference: generateRandonNumbers(8),
            agentId: this.agentId,
            datacode: dataCode,
            service_type: serviceType.toLowerCase(),
            amount,
            phone: phoneNumber,
            package: selectedPackage,
        };

        try {
            logger.info("Vending request with BAXI", {
                meta: { postData: requestPayload, ...logMeta },
            });
            const response =
                await this.baxiApi.post<BaxiSuccessfulPuchaseResponse>(
                    "/databundle/request",
                    requestPayload,
                );
            logger.info("Vend response from BAXI", {
                meta: {
                    requestData: requestPayload,
                    responseData: response.data,
                    ...logMeta,
                },
            });
            return {
                ...response.data,
                source: "BAXI" as const,
                httpStatusCode: response.status,
            };
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

    static async getPriceForBundle(
        serviceProvider: BaxiDataServiceType,
        dataCode: string,
    ) {
        const bundles = await this.getServiceProviderBundles(serviceProvider);

        const bundle = bundles.data.find(
            (bundle: any) => bundle.datacode === dataCode,
        );
        if (!bundle) {
            throw new Error("Data bundle price not found");
        }

        return bundle;
    }
}
