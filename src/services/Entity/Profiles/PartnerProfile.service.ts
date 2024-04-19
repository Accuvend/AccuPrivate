import { Transaction, UUIDV4 } from "sequelize";
import PartnerProfile, { IPartnerProfile } from "../../../models/Entity/Profiles/PartnerProfile.model";
import Cypher, { generateRandomString } from "../../../utils/Cypher";
import { randomUUID } from "crypto";
import ApiKeyService from "../../ApiKey.service ";
import Entity from "../../../models/Entity/Entity.model";
import EntityService from "../Entity.service";

export default class PartnerProfileService {
    private static createKeys(data: string): { key: string, sec: string } {
        const randomString = generateRandomString(20)
        const apiKey = Cypher.generateAPIKey(data, randomString)
        const sec = randomUUID()

        return {
            key: apiKey,
            sec: sec
        }
    }

    static async addPartner(partner: Omit<IPartnerProfile, 'key' | 'sec'>, transaction?: Transaction): Promise<PartnerProfile> {
        const { key, sec } = this.createKeys(partner.id)

        const newPartner: PartnerProfile = PartnerProfile.build({ ...partner, key, sec })
        const result = transaction ? await newPartner.save({ transaction }) : await newPartner.save()

        return result
    }

    static async viewPartners(): Promise<PartnerProfile[] | void> {
        const partners: PartnerProfile[] = await PartnerProfile.findAll()
        return partners
    }

    static async viewSinglePartner(uuid: string): Promise<PartnerProfile | null> {
        const partner: PartnerProfile | null = await PartnerProfile.findByPk(uuid, {
            include: [Entity]
        })
        return partner
    }

    static async viewSinglePartnerByPartnerCode(partnerCode: string): Promise<PartnerProfile | null> {
        const partner: PartnerProfile | null = await PartnerProfile.findOne({ where: { partnerCode }, include: [Entity] })
        return partner
    }

    static async viewSinglePartnerByEmail(email: string): Promise<PartnerProfile | null> {
        const entity = await Entity.findOne({ where: { email }, include: [PartnerProfile] })
        if (!entity) {
            return null
        }

        const partner = await entity.$get('partnerProfile')
        if (!partner) {
            return null
        }

        return partner
    }

    static async viewPartnersWithCustomQuery(query: any, attributes: any = {}): Promise<PartnerProfile[]> {
        const partners: PartnerProfile[] = await PartnerProfile.findAll({
            ...query, include: [Entity], attributes: attributes
        })
        return partners
    }

    static async updateProfilePicture(partner: PartnerProfile, profilePicture: string): Promise<PartnerProfile> {
        const partnerEntity = await partner.$get('entity')
        if (!partnerEntity) {
            throw new Error('Partner entity not found')
        }

        await EntityService.updateEntity(partnerEntity, { profilePicture })

        // Get updated partner info
        const updatedPartner = await PartnerProfile.findByPk(partner.id)
        if (!updatedPartner) {
            throw new Error('PartnerProfile not found')
        }

        return updatedPartner
    }

    static async generateKeys(partner: PartnerProfile): Promise<{ key: string, sec: string }> {
        const { key, sec } = this.createKeys(partner.id)
        await PartnerProfile.update({ key, sec }, { where: { id: partner.id } })
        const partnerActiveKey = await ApiKeyService.viewActiveApiKeyByPartnerId(partner.id)
        if (partnerActiveKey) {
            await ApiKeyService.deactivateApiKey(partnerActiveKey)
        }

        await ApiKeyService.addApiKey({
            key,
            partnerId: partner.id,
            active: true,
            id: randomUUID()
        })

        return { key, sec }
    }
}