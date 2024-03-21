import { NextFunction, Request, Response } from "express";
import { BadRequestError, ForbiddenError, InternalServerError } from "../../utils/Errors";
import Partner, { IPartnerProfile } from "../../models/Entity/Profiles/PartnerProfile.model";
import PartnerService from "../../services/Entity/Profiles/PartnerProfile.service";
import { TokenUtil } from "../../utils/Auth/Token";
import ApiKeyService from "../../services/ApiKey.service ";
import Cypher from "../../utils/Cypher";
import { AuthenticatedRequest } from "../../utils/Interface";
import { TeamMemberProfileService } from "../../services/Entity/Profiles";
import PartnerProfile from "../../models/Entity/Profiles/PartnerProfile.model";
require('newrelic');

export default class ApiController {
    static async getActiveAPIKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { entity, profile } = req.user.user

        if (entity.role !== 'PARTNER' && entity.role !== 'TEAMMEMBER' ) {
            throw new ForbiddenError('Only partners or partner\'s members can access this resource')
        }
        let partner_ : PartnerProfile | null
        if(entity.role === 'PARTNER'){
            partner_ = await PartnerService.viewSinglePartnerByEmail(entity.email)
            
        }else{
            // console.log(entity.email)
            const teammember_ = await TeamMemberProfileService.viewSingleTeamMemberByEmail(entity.email);
            if(!teammember_) throw new InternalServerError('Authenticated teammember not found')
            partner_ = await PartnerService.viewSinglePartner(teammember_.partnerId) 
        }

        if (!partner_) {
            throw new InternalServerError('Partner not found')
        }

        
        const apiKey = await ApiKeyService.viewActiveApiKeyByPartnerId(partner_.id)
        if (!apiKey) {
            throw new BadRequestError('API Key not found')
        }

        const secKeyInCache = Cypher.encryptString(partner_.sec)
        await TokenUtil.saveTokenToCache({ key: secKeyInCache, token: Cypher.encryptString(partner_.key) })

        res.status(200).json({
            status: 'success',
            message: 'API Keys retrieved successfully',
            data: {
                apiKey: apiKey.key,
                secretKey: secKeyInCache,
                createdAt: apiKey.createdAt,
                lastUsed: apiKey.lastUsed
            }
        })
    }

    static async generateApiKeys(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { email } = req.user.user.entity

        const partner: Partner | null = await PartnerService.viewSinglePartnerByEmail(email)
        if (!partner) {
            throw new BadRequestError('Partner not found')
        }

        const { key, sec } = await PartnerService.generateKeys(partner)

        const secKeyInCache = Cypher.encryptString(sec)
        await TokenUtil.saveTokenToCache({ key: secKeyInCache, token: Cypher.encryptString(key) })
        await ApiKeyService.setCurrentActiveApiKeyInCache(partner, key)

        const apiKey = await ApiKeyService.viewActiveApiKeyByPartnerId(partner.id)
        if (!apiKey) {
            throw new InternalServerError('API key not found for user')
        }

        res.status(200).json({
            status: 'success',
            message: 'Generated API keys successfully',
            data: {
                apiKey: key,
                secretKey: secKeyInCache,
                createdAt: apiKey.createdAt,
                lastUsed: apiKey.lastUsed
            }
        })
    }
}
