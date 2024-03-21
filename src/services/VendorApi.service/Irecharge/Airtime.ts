import { NODE_ENV } from "../../../utils/Constants";
import { generateRandonNumbers } from "../../../utils/Helper";
import { IRechargeBaseConfig, IRechargeApi } from "./Config";

export class IRechargeAirtimeApi extends IRechargeBaseConfig {
    static async purchase(data: IRechargeApi.AirtimePurchaseParams) {
        const { email, amount, phoneNumber, serviceType } = data

        const reference = NODE_ENV === 'development' ? generateRandonNumbers(12) : data.reference

        const network = {
            'mtn': 'MTN',
            'glo': 'Glo',
            'airtel': 'Airtel',
            '9mobile': 'Etisalat',
            'etisalat': 'Etisalat'
        }

        const combinedString = this.VENDOR_CODE + "|" + reference + "|" + phoneNumber + "|" + network[serviceType.toLowerCase() as keyof typeof network] + "|" + amount + "|" + this.PUBLIC_KEY
        const hash = this.generateHash(combinedString)

        const params = {
            vendor_code: this.VENDOR_CODE,
            vtu_network: network[serviceType.toLowerCase() as keyof typeof network],
            vtu_amount: amount,
            vtu_number: phoneNumber,
            vtu_email: email,
            reference_id: reference,
            response_format: 'json',
            hash
        }
        console.log({ params})
        const response = await this.API.get<IRechargeApi.AirtimeSuccessfulVendResponse | IRechargeApi.RequeryResponse>('/vend_airtime.php', {
            params
        })

        console.log(response.data)

        return response.data
    }
}