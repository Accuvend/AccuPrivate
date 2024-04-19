import { NODE_ENV } from "../../../utils/Constants";
import { generateRandonNumbers } from "../../../utils/Helper";
import { IRechargeBaseConfig, IRechargeApi } from "./Config";

export class IRechargeDataApi extends IRechargeBaseConfig {
    static async purchase(data: IRechargeApi.DataPurchaseParams) {
        const { email, amount, phoneNumber, serviceType } = data;

        const reference =
            NODE_ENV === "development"
                ? generateRandonNumbers(12)
                : data.reference;

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
            vtu_data: parseInt(data.dataCode),
            vtu_number: phoneNumber,
            email: email,
            reference_id: reference,
            response_format: "json",
            hash,
        };
        const response = await this.API.get<
            | IRechargeApi.DataSuccessfulVendResponse
            | IRechargeApi.RequeryResponse
        >("/vend_data.php", { params });

        console.log({ params, response: response.data });
        return (response.data) as
            | IRechargeApi.DataSuccessfulVendResponse
            | IRechargeApi.RequeryResponse;
    }
}

