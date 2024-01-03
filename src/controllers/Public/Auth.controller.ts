import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, ForbiddenError, InternalServerError } from "../../utils/Errors";
import EmailService, { EmailTemplate } from "../../utils/Email";
import ResponseTrimmer from '../../utils/ResponseTrimmer';
import Partner from "../../models/Entity/Profiles/PartnerProfile.model";
import PartnerService from "../../services/Entity/Profiles/PartnerProfile.service";
import { Database } from "../../models/index";
import PasswordService from "../../services/Password.service";
import { AuthUtil, TokenUtil } from "../../utils/Auth/Token";
import Validator from "../../utils/Validators";
import logger from "../../utils/Logger";
import Cypher from "../../utils/Cypher";
import ApiKeyService from "../../services/ApiKey.service ";
import EntityService from "../../services/Entity/Entity.service";
import { RoleEnum } from "../../models/Role.model";
import { AuthenticatedRequest } from "../../utils/Interface";
import { TeamMemberProfile } from "../../models/Entity/Profiles";
import NotificationUtil from "../../utils/Notification";
import { NODE_ENV } from "../../utils/Constants";
import NotificationService from "../../services/Notification.service";
import WebhookService from "../../services/Webhook.service";
import RoleService from "../../services/Role.service";
const newrelic = require('newrelic');

export default class AuthController {
    static async signup(req: Request, res: Response, next: NextFunction) {
        newrelic.setTransactionName("Sign up")
        
        const { email, password } = req.body

        const validEmail = Validator.validateEmail(email)
        if (!validEmail) {
            throw new BadRequestError('Invalid email')
        }

        const validPassword = Validator.validatePassword(password)
        if (!validPassword) {
            throw new BadRequestError('Invalid password')
        }

        const existingPartner: Partner | null = await PartnerService.viewSinglePartnerByEmail(email)
        if (existingPartner) {
            throw new BadRequestError('Email has been used before')
        }

        const transaction = await Database.transaction()

        const newPartner = await PartnerService.addPartner({
            id: uuidv4(),
            email,
        }, transaction)

        const entity = await EntityService.addEntity({
            id: uuidv4(),
            email,
            status: {
                activated: false,
                emailVerified: false
            },
            partnerProfileId: newPartner.id,
            role: RoleEnum.Partner,
            notificationSettings: {
                login: true,
                failedTransactions: true,
                logout: true
            }
        }, transaction)

        const apiKey = await ApiKeyService.addApiKey({
            partnerId: newPartner.id,
            key: newPartner.key,
            active: true,
            id: uuidv4()
        }, transaction)

        const secKeyInCache = Cypher.encryptString(newPartner.sec)
        await TokenUtil.saveTokenToCache({ key: secKeyInCache, token: Cypher.encryptString(newPartner.key) })
        await ApiKeyService.setCurrentActiveApiKeyInCache(newPartner, apiKey.key.toString())

        const partnerPassword = await PasswordService.addPassword({
            id: uuidv4(),
            entityId: entity.id,
            password
        }, transaction)

        await WebhookService.addWebhook({
            id: uuidv4(),
            partnerId: newPartner.id,
        }, transaction)

        await entity.update({ status: { ...entity.status, emailVerified: true } })
        const accessToken = await AuthUtil.generateToken({ type: 'emailverification', entity, profile: newPartner, expiry: 60 * 10 })
        const otpCode = await AuthUtil.generateCode({ type: 'emailverification', entity, expiry: 60 * 10 })
        await transaction.commit()

        logger.info(otpCode)
        await EmailService.sendEmail({
            to: newPartner.email,
            subject: 'Succesful Email Verification',
            html: await new EmailTemplate().awaitActivation(newPartner.email)
        })

        res.status(201).json({
            status: 'success',
            message: 'Partner created successfully',
            data: {
                partner: ResponseTrimmer.trimPartner({ ...newPartner.dataValues, entity }),
                accessToken,
            }
        })
    }

    static async otherSignup(req: Request, res: Response, next: NextFunction) {
        const { email, password, roleId } = req.body


        const role = await RoleService.viewRoleById(roleId)
        if (!role) {
            throw new BadRequestError('Invalid role')
        }

        const validEmail = Validator.validateEmail(email)
        if (!validEmail) {
            throw new BadRequestError('Invalid email')
        }

        const validPassword = Validator.validatePassword(password)
        if (!validPassword) {
            throw new BadRequestError('Invalid password')
        }

        const transaction = await Database.transaction()

        const entity = await EntityService.addEntity({
            id: uuidv4(),
            email,
            status: {
                activated: false,
                emailVerified: false
            },
            role: role.name,
            notificationSettings: {
                login: true,
                failedTransactions: true,
                logout: true
            }
        }, transaction)

        const entityPassword = await PasswordService.addPassword({
            id: uuidv4(),
            entityId: entity.id,
            password
        }, transaction)

        await entity.update({ status: { ...entity.status, emailVerified: true } })
        const accessToken = await AuthUtil.generateToken({ type: 'emailverification', entity, profile: entity as any, expiry: 60 * 10 })
        const otpCode = await AuthUtil.generateCode({ type: 'emailverification', entity, expiry: 60 * 10 })
        await transaction.commit()

        logger.info(otpCode)
        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Succesful Email Verification',
            html: await new EmailTemplate().awaitActivation(entity.email)
        })

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                entity: entity.dataValues,
                accessToken,
            }
        })
    }

    static async verifyEmail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        newrelic.setTransactionName("Verify Email")
        
        const { otpCode }: { otpCode: string } = req.body

        const { entity: { id } } = req.user.user
        const entity = await EntityService.viewSingleEntity(id)
        if (!entity) {
            throw new InternalServerError('Entity not found')
        }

        if (entity.status.emailVerified) {
            throw new BadRequestError('Email already verified')
        }

        await entity.update({ status: { ...entity.status, emailVerified: true } })

        const validCode = await AuthUtil.compareCode({ entity, tokenType: 'emailverification', token: otpCode })
        if (!validCode) {
            throw new BadRequestError('Invalid otp code')
        }

        await AuthUtil.deleteToken({ entity, tokenType: 'emailverification', tokenClass: 'token' })

        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Succesful Email Verification',
            html: await new EmailTemplate().awaitActivation(entity.email)
        })

        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully',
            data: null
        })
    }

    static async resendVerificationEmail(req: Request, res: Response, next: NextFunction) {
        newrelic.setTransactionName("Resend Verification Email")

        const email = req.query.email as string

        const newPartner = await PartnerService.viewSinglePartnerByEmail(email)
        if (!newPartner) {
            throw new InternalServerError('Authenticate partner record not found')
        }

        const entity = await newPartner.$get('entity')
        if (!entity) {
            throw new InternalServerError('Partner entity not found')
        }

        if (entity.status.emailVerified) {
            throw new BadRequestError('Email already verified')
        }

        const otpCode = await AuthUtil.generateCode({ type: 'emailverification', entity, expiry: 60 * 10 })

        EmailService.sendEmail({
            to: newPartner.email,
            subject: 'Verify Email',
            html: await new EmailTemplate().emailVerification({
                partnerEmail: newPartner.email,
                otpCode: otpCode
            })
        })

        res.status(200).json({
            status: 'success',
            message: 'Verification code sent successfully',
            data: {
                partner: ResponseTrimmer.trimPartner({ ...newPartner.dataValues, entity: entity.dataValues }),
            }
        })
    }

    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body

        const entity = await EntityService.viewSingleEntityByEmail(email)
        if (!entity) {
            throw new BadRequestError('No account exist for this email')
        }

        const profile = await EntityService.getAssociatedProfile(entity)
        if (!profile) {
            throw new InternalServerError('Partner profile not found')
        }

        const accessToken = await AuthUtil.generateToken({ type: 'passwordreset', entity, profile, expiry: 60 * 10 })
        const otpCode = await AuthUtil.generateCode({ type: 'passwordreset', entity, expiry: 60 * 10 })
        NODE_ENV === 'development' && logger.info(otpCode)
        EmailService.sendEmail({
            to: email,
            subject: 'Forgot password',
            html: await new EmailTemplate().forgotPassword({ email, otpCode })
        })

        res.status(200).json({
            status: 'success',
            message: 'Otpcode sent to users email',
            data: {
                accessToken
            }
        })
    }

    static async resetPassword(req: AuthenticatedRequest, res: Response) {
        const { entity: { id } } = req.user.user

        const { otpCode, newPassword }: { otpCode: string, newPassword: string } = req.body

        const validPassword = Validator.validatePassword(newPassword)
        if (!validPassword) {
            throw new BadRequestError('Invalid password')
        }

        const entity = await EntityService.viewSingleEntity(id)
        if (!entity) {
            throw new InternalServerError('Partner entity not found')
        }

        const validCode = await AuthUtil.compareCode({ entity, tokenType: 'passwordreset', token: otpCode })
        if (!validCode) {
            throw new BadRequestError('Invalid otp code')
        }

        const password = await entity.$get('password')
        if (!password) {
            throw new InternalServerError('No password found for authneticate partner')
        }

        await PasswordService.updatePassword(entity.id, newPassword)
        await AuthUtil.deleteToken({ entity, tokenType: 'passwordreset', tokenClass: 'token' })

        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Succesful Email Verification',
            html: await new EmailTemplate().awaitActivation(entity.email)
        })

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully',
            data: null
        })
    }

    static async changePassword(req: AuthenticatedRequest, res: Response) {
        const { oldPassword, newPassword }: { oldPassword: string, newPassword: string } = req.body

        const validPassword = Validator.validatePassword(newPassword)
        if (!validPassword) {
            throw new BadRequestError('Invalid password')
        }

        const { entity: { id } } = req.user.user
        const entity = await EntityService.viewSingleEntity(id)
        if (!entity) {
            throw new InternalServerError('Entity not found')
        }

        const profile = await EntityService.getAssociatedProfile(entity)
        if (!profile) {
            throw new InternalServerError('Profile not found')
        }

        const password = await entity.$get('password')
        if (!password) {
            throw new InternalServerError('No password found for authneticate entity')
        }

        const validOldPassword = await PasswordService.comparePassword(oldPassword, password.password)
        if (!validOldPassword) {
            throw new BadRequestError('Invalid old password')
        }

        await PasswordService.updatePassword(entity.id, newPassword)

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully',
            data: null
        })
    }

    static async login(req: Request, res: Response) {
        newrelic.setTransactionName("Login")

        const { email, password } = req.body

        const entity = await EntityService.viewSingleEntityByEmail(email)
        if (!entity) {
            throw new BadRequestError('Invalid Email or password')
        }

        const entityPassword = await entity.$get('password')
        if (!entityPassword) {
            throw new InternalServerError('No password found for authneticate entity')
        }

        const validPassword = await PasswordService.comparePassword(password, entityPassword.password)
        if (!validPassword) {
            throw new BadRequestError('Invalid Email or password')
        }

        if (!entity.status.activated) {
            throw new BadRequestError('Account not activated')
        }

        const role = await entity.$get('role')
        if (!role) {
            throw new InternalServerError('Role not found for user')
        }

        const requestWasMadeToAdminRoute = req.url === '/login/admin'
        const userIsAdmin = [RoleEnum.SuperAdmin, RoleEnum.Admin].includes(role.name)
        const unauthorizedAccess = (requestWasMadeToAdminRoute && !userIsAdmin) || (!requestWasMadeToAdminRoute && userIsAdmin)
        if (unauthorizedAccess) {
            throw new ForbiddenError('Unauthorized access to current login route')
        }

        // Only partners and team members have a profile
        const profile = await EntityService.getAssociatedProfile(entity)
        if (!profile && [RoleEnum.Partner, RoleEnum.TeamMember].includes(entity.role.name)) {
            throw new InternalServerError('Profile not found')
        }

        const accessToken = await AuthUtil.generateToken({ type: 'access', entity, profile: profile ?? entity, expiry: 60 * 60 * 60 * 60 })
        const refreshToken = await AuthUtil.generateToken({ type: 'refresh', entity, profile: profile ?? entity, expiry: 60 * 60 * 24 * 30 })

        if ([RoleEnum.TeamMember].includes(entity.role.name)) {
            const memberProfile = profile as TeamMemberProfile
            const partnerProfile = await memberProfile.$get('partner')
            if (!partnerProfile) {
                throw new InternalServerError('Partner profile not found')
            }

            const partnerEntity = await partnerProfile.$get('entity')
            if (!partnerEntity) {
                throw new InternalServerError('Partner entity not found')
            }

            const notification = await NotificationService.addNotification({
                id: uuidv4(),
                title: 'New Login',
                message: `
                    A new login was detected on a member account at ${new Date().toLocaleString()}
                    
                    Member: ${memberProfile.name}
                    Email: ${entity.email}
                    Location: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}

                    If this was not you, please contact your administrator immediately.
                    `,
                heading: 'New Login Detected',
                entityId: partnerEntity.id,
                read: false
            })

            entity.notificationSettings.login && await NotificationUtil.sendNotificationToUser(entity.id, notification)
        }

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                entity: entity.dataValues,
                unreadNotificationsCount: (await NotificationService.getUnreadNotifications(entity.id)).length,
                accessToken,
                refreshToken
            }
        })
    }

    static async logout(req: AuthenticatedRequest, res: Response) {
        const { entity: { id } } = req.user.user
        const entity = await EntityService.viewSingleEntity(id)

        if (!entity) {
            throw new InternalServerError('Entity not found')
        }

        await AuthUtil.deleteToken({ entity, tokenType: 'access', tokenClass: 'token' })
        await AuthUtil.deleteToken({ entity, tokenType: 'refresh', tokenClass: 'token' })

        res.status(200).json({
            status: 'success',
            message: 'Logout successful',
            data: null
        })
    }

    static async getLoggedUserData(req: AuthenticatedRequest, res: Response) {
        newrelic.setTransactionName("Logged User Data")
        
        const entity = await EntityService.viewSingleEntityByEmail(req.user.user.entity.email)
        if (!entity) {
            throw new InternalServerError('Entity not found')
        }

        const partner = await entity.$get('partnerProfile')
        const role = entity.role.name
        if (partner === null && role === 'PARTNER') {
            throw new InternalServerError('Partner not found')
        }

        const returnData = role === 'PARTNER'
            ? { partner: ResponseTrimmer.trimPartner({ ...partner!.dataValues, entity }) }
            : { entity: entity.dataValues }

        res.status(200).json({
            status: 'success',
            message: 'Entity data retrieved successfully',
            data: returnData
        })
    }
}