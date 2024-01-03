import { Transaction } from "sequelize";
import WebHook, { IUpdateWebHook, IWebHook } from "../models/Webhook.model";
import axios from "axios";
import ApiKeyService from "./ApiKey.service ";
import Cypher from "../utils/Cypher";
import { PartnerProfileService } from "./Entity/Profiles";
import logger from "../utils/Logger";
require('newrelic');

export default class WebhookService {
    static async addWebhook(data: IWebHook, transaction: Transaction): Promise<WebHook> {
        const webhook = WebHook.build(data);
        transaction ? await webhook.save({ transaction }) : await webhook.save();
        return webhook;
    }

    static async viewWebhookByPartnerId(partnerId: string): Promise<WebHook | null> {
        const webhook = await WebHook.findOne({ where: { partnerId } });
        return webhook;
    }

    static async viewWebhookById(id: string): Promise<WebHook | null> {
        const webhook = await WebHook.findOne({ where: { id } });
        return webhook;
    }

    static async viewAllWebhooks(): Promise<WebHook[]> {
        const webhooks = await WebHook.findAll();
        return webhooks;
    }

    static async deleteWebhook(webhook: WebHook): Promise<WebHook> {
        await webhook.destroy();
        return webhook;
    }

    static async updateWebhook(webhook: WebHook, data: IUpdateWebHook): Promise<WebHook> {
        webhook.url = data.url;
        await webhook.save();
        return webhook;
    }

    private static async getHeaders(partnerId: string) {
        const apiKeyRecord = await ApiKeyService.viewActiveApiKeyByPartnerId(partnerId)
        if (!apiKeyRecord) {
            throw new Error('Api key for partner not found')
        } 

        const partner = await PartnerProfileService.viewSinglePartner(partnerId)
        if (!partner) {
            throw new Error('Partner not found')
        }

        const secretKey = Cypher.encryptString(partner.sec)

        const headerConfig = {
            'x-api-key': apiKeyRecord.key,
            'x-secret-key': secretKey,
        }

        return headerConfig
    }

    static async sendWebhookNotification(webhook: WebHook, data: any): Promise<void> {
        logger.info(`Sending webhook request for transaction`)
        const headers = await this.getHeaders(webhook.partnerId)

        if (!webhook.url) {
            throw new Error('Webhook url not found')
        }

        const response = await axios.post(webhook.url, data)

        return response.data
    }
}
