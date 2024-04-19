import { generateRandomString } from '../../../utils/Helper';
import BaxiApiBaseConfig, { BaxiSuccessfulPuchaseResponse } from './Config';

export type BaxiAirtimeServiceType = 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'

export interface PurchaseInfo {
    serviceType: BaxiAirtimeServiceType, phoneNumber: string, amount: number
}

export default class BaxiAirtimeApi extends BaxiApiBaseConfig {
    static async getRechargeProviders() {
        const response = await this.baxiApi.get('/airtime/providers')

        return response.data
    }

    static async purchase(purchaseData: PurchaseInfo) {
        const {
            serviceType, phoneNumber, amount
        } = purchaseData

        const response = await this.baxiApi.post<BaxiSuccessfulPuchaseResponse>('/airtime/request', {
            agentReference: generateRandomString(20),
            agentId: this.agentId,
            plan: 'prepaid',
            service_type: serviceType.toLowerCase(),
            phone: phoneNumber,
            amount
        })

        return response.data
    }
}

