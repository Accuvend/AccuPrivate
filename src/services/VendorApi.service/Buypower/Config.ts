import axios from "axios";
import {
    BUYPOWER_TOKEN,
    BUYPOWER_URL,
    NODE_ENV,
    VENDOR_URL,
} from "../../../utils/Constants";
import { BaseResponse } from "../../../utils/Interface";

interface _RequeryBuypowerSuccessResponse extends BaseResponse {
    source: "BUYPOWERNG";
    result: {
        status: true;
        data: {
            id: number;
            amountGenerated: `${number}`;
            disco: string;
            orderId: string;
            receiptNo: string;
            tax: `${number}`;
            vendTime: Date;
            token: `${number}-${number}-${number}-${number}-${number}`;
            units: `${number}`;
            vendRef: string;
            responseCode: number;
            responseMessage: string;
        };
    };
}

export interface SuccessResponseForBuyPowerRequery extends BaseResponse {
    source: "BUYPOWERNG";
    status: true;
    message: string;
    data: _RequeryBuypowerSuccessResponse["result"]["data"];
    responseCode: 200;
}

interface InprogressResponseForBuyPowerRequery {
    source: "BUYPOWERNG";
    status: false;
    message: string;
    responseCode: 201;
}

interface FailedResponseForBuyPowerRequery {
    source: "BUYPOWERNG";
    status: false;
    message: string;
    responseCode: 202;
}

type BuypowerRequeryResponse =
    | _RequeryBuypowerSuccessResponse
    | InprogressResponseForBuyPowerRequery
    | FailedResponseForBuyPowerRequery;

export class BuyPowerApi {
    protected static API = axios.create({
        baseURL:
            NODE_ENV === "production"
                ? VENDOR_URL.BUYPOWERNG.PROD
                : VENDOR_URL.BUYPOWERNG.DEV,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${BUYPOWER_TOKEN}`,
        },
    });

    private static generateToken(): string {
        // format 1234-1234-1234-1234-1234
        let token = "";
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                token += Math.floor(Math.random() * 10).toString();
            }
            token += "-";
        }

        return token;
    }

    static requeryTransaction = async ({
        reference,
    }: {
        reference: string;
    }) => {
        // Buypower requery has been returning 500 error on dev mode
        if (NODE_ENV === "development") {
            return {
                source: "BUYPOWERNG",
                status: true,
                message: "Transaction succesful",
                responseCode: 200,
                data: {
                    id: 80142232,
                    amountGenerated: "16600.00",
                    tariff: null,
                    disco: "DSTV",
                    debtAmount: "0.00",
                    debtRemaining: "0.00",
                    orderId: reference,
                    receiptNo: "342544321342",
                    tax: "0.00",
                    vendTime: new Date(),
                    token: this.generateToken(),
                    totalAmountPaid: 16600,
                    units: "1",
                    vendAmount: "16600",
                    vendRef: "sfasdfa2432323",
                    responseCode: 100,
                    responseMessage: "Request successful",
                    address: "12342112345",
                    name: "23456564345",
                    phoneNo: null,
                    charges: "0.00",
                    tariffIndex: null,
                    parcels: [],
                },
            } as SuccessResponseForBuyPowerRequery;
        }

        const response = await this.API.get<BuypowerRequeryResponse>(
            `/transaction/${reference}`,
        );

        const successResponse =
            response.data as _RequeryBuypowerSuccessResponse;
        if (successResponse.result.status === true) {
            return {
                source: "BUYPOWERNG",
                status: true,
                message: "Transaction successful",
                data: successResponse.result.data,
                responseCode: 200,
            } as SuccessResponseForBuyPowerRequery;
        }

        return { ...response.data, source: "BUYPOWERNG" } as
            | InprogressResponseForBuyPowerRequery
            | FailedResponseForBuyPowerRequery;
    };
}

