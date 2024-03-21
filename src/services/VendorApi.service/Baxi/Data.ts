import { generateRandonNumbers } from '../../../utils/Helper';
import BaxiApiBaseConfig, { BaxiSuccessfulPuchaseResponse } from './Config';
export type BaxiDataServiceType = 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE';

interface BaxiPurchaseData {
    dataCode: string,
    serviceType: BaxiDataServiceType,
    phoneNumber: string,
    amount: number,
    package?: 'RENEW' | 'CHANGE_IMMEDIATE' | 'CHANGE_AFTER_EXPIRY'
}

export default class BaxiDataApi extends BaxiApiBaseConfig {
    static async getServiceProviders() {
        const response = await this.baxiApi.get('/databundle/providers')

        return response.data
    }

    static async getServiceProviderBundles(serviceType: BaxiDataServiceType, accountNumber?: number) {
        const response = await this.baxiApi.post('/databundle/bundles', { service_type: serviceType })

        return response.data
    }

    static async purchase(purchaseData: BaxiPurchaseData) {
        const {
            dataCode, serviceType, phoneNumber, amount,
            package: selectedPackage, // Package is a reserved word in classes
        } = purchaseData

        const response = await this.baxiApi.post<BaxiSuccessfulPuchaseResponse>('/databundle/request', {
            agentId: this.agentId,
            agentReference: generateRandonNumbers(8),
            datacode: dataCode,
            service_type: serviceType.toLowerCase(),
            amount,
            phone: phoneNumber,
            package: selectedPackage,
        })

        return response.data
    }

    static async getPriceForBundle(serviceProvider: BaxiDataServiceType, dataCode: string) {
        const bundles = await this.getServiceProviderBundles(serviceProvider)

        const bundle = bundles.data.find((bundle: any) => bundle.datacode === dataCode)
        if (!bundle) {
            throw new Error('Data bundle price not found')
        }

        return bundle
    }
}

