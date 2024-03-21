// Import necessary types and the Event model
import { Transaction } from "sequelize";
import ApiKey, { IApiKey } from "../models/ApiKey.model";
import { ICreateEvent, IEvent } from "../models/Event.model";
import Event from "../models/Event.model";
import logger from "../utils/Logger";
import Partner from "../models/Entity/Profiles/PartnerProfile.model";
import { TokenUtil } from "../utils/Auth/Token";
import Cypher from "../utils/Cypher";

// EventService class for handling event-related operations
export default class ApiKeyService {
    // Method for adding a new event to the database
    static async addApiKey(data: IApiKey, transaction?: Transaction): Promise<ApiKey> {
        const apiKey = ApiKey.build(data);
        transaction ? await apiKey.save({ transaction }) : await apiKey.save();
        return apiKey;
    }

    static async viewSingleApiKey(key: string): Promise<ApiKey | null> {
        const apiKey = await ApiKey.findOne({ where: { key: key } });
        return apiKey;
    }

    static async viewActiveApiKeyByPartnerId(partnerId: string): Promise<ApiKey | null> {
        const apiKey = await ApiKey.findOne({ where: { partnerId: partnerId, active: true } });
        return apiKey;
    }

    static async deactivateApiKey(apiKey: ApiKey): Promise<ApiKey> {
        apiKey.active = false;
        await apiKey.save();
        return apiKey;
    }

    static async viewSingleApiKeyById(id: string): Promise<ApiKey | null> {
        const apiKey = await ApiKey.findOne({ where: { id: id } });
        return apiKey;
    }

    static async viewAllApiKeys(): Promise<ApiKey[]> {
        const apiKeys = await ApiKey.findAll();
        return apiKeys;
    }

    static async setCurrentActiveApiKeyInCache(partner: Partner, key: string) {
        await TokenUtil.saveTokenToCache({ key: `active_api_key:${partner.id}`, token: Cypher.encryptString(key) })
    }

    static async getCurrentActiveApiKeyInCache(partner: Partner): Promise<string | null> {
        const key = await TokenUtil.getTokenFromCache(`active_api_key:${partner.id}`)
        return key ? Cypher.decryptString(key) : null
    }

    static async updateLastUsedTime(partnerId: string) {
        const activeApiKey = await ApiKeyService.viewActiveApiKeyByPartnerId(partnerId)
        if (!activeApiKey) {
            throw new Error('Api key not found')
        }

        await activeApiKey.update({ lastUsed: new Date() })
    }
}
