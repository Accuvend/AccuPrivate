import { AuthToken, DecodedTokenData, TokenUtil } from "../utils/Auth/Token";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "../utils/Constants";
import { UnauthenticatedError } from "../utils/Errors";
import Cypher from "../utils/Cypher";
import { AuthenticatedRequest } from "../utils/Interface";
import ApiKeyService from "../services/ApiKey.service ";
import logger from "../utils/Logger";
require('newrelic');

export const basicAuth = function (tokenType: AuthToken) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer'))
            return next(new Error('Invalid authorization header'));

        const jwtToken = authHeader.split(' ')[1];
        const payload = jwt.verify(jwtToken, JWT_SECRET) as string;

        const tokenData = payload as unknown as DecodedTokenData
        tokenData.token = jwtToken

        if (tokenData.misc.tokenType !== tokenType) {
            return next(new UnauthenticatedError('Invalid authentication'))
        }

        const key = `${tokenType}_token:${tokenData.user.entity.id}`;
        const token = await TokenUtil.getTokenFromCache(key);
        if (token !== jwtToken) {
            return next(new UnauthenticatedError('Invalid authentication'))
        }

        (req as AuthenticatedRequest).user = tokenData

        next()
    }
}

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string
    const apiSecret = req.headers['x-api-secret'] as string
    if (!apiKey) {
        return next(new UnauthenticatedError('Invalid API key'))
    }

    const encryptedSecretForDecodingApiKey = await TokenUtil.getTokenFromCache(apiSecret)
    if (!encryptedSecretForDecodingApiKey) {
        return next(new UnauthenticatedError('Invalid API Secret'))
    }

    const decryptedEncryptedSecretForDecodingApiKey = Cypher.decryptString(encryptedSecretForDecodingApiKey).replace(/"/g, '')
    const validApiKey = Cypher.decodeApiKey(apiKey, decryptedEncryptedSecretForDecodingApiKey)
    if (!validApiKey) {
        return next(new UnauthenticatedError('Invalid API key'))
    };

    (req as any).key = validApiKey // Partners id

    // Check if this si the current active api key
    const currentActiveApiKey = await TokenUtil.getTokenFromCache(`active_api_key:${validApiKey}`)
    // NODE_ENV === 'development' && console.log({
    //     validApiKey,
    //     currentActiveApiKey
    // })
    if (!currentActiveApiKey) {
        return next(new UnauthenticatedError('Invalid API key'))
    }

    // TODO: Disallow api key if user is not yet active
    if (Cypher.decryptString(currentActiveApiKey) !== apiKey) {
        return next(new UnauthenticatedError('Invalid API key'))
    }

    ApiKeyService.updateLastUsedTime(validApiKey).catch((e) => {
        logger.info('Error updating last used time for api key')
    })

    next()
}