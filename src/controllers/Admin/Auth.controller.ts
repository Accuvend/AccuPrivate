import { NextFunction, Response, Request } from "express";
import { BadRequestError, ForbiddenError } from "../../utils/Errors";
import EmailService, { EmailTemplate } from "../../utils/Email";
import Validator from "../../utils/Validators";
import { AuthenticatedRequest } from "../../utils/Interface";
import EntityService from "../../services/Entity/Entity.service";
import { AuthUtil } from "../../utils/Auth/Token";
import { NODE_ENV, SU_HOST_EMAIL_1, SU_HOST_EMAIL_2, SU_HOST_EMAIL_3 } from "../../utils/Constants";
import { randomUUID } from "crypto";
import { RoleEnum } from "../../models/Role.model";
require('newrelic');

class AuthControllerValidator {
    static async activatePartner() {

    }


}

export default class AuthController {
    static async activatePartner(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { email } = req.body

        const validEmail = Validator.validateEmail(email)
        if (!validEmail) {
            throw new BadRequestError('Invalid email')
        }

        const entity = await EntityService.viewSingleEntityByEmail(email)
        if (!entity) {
            throw new BadRequestError('Entity not found')
        }

        const role = await entity.$get('role')
        if (!role) {
            throw new BadRequestError('Role not found')
        }

        if (role.name === RoleEnum.SuperAdmin) {
            throw new ForbiddenError('Unauthorized access')
        }

        await entity.update({ status: { ...entity.status, activated: true } })

        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Account Activation',
            html: await new EmailTemplate().accountActivation(entity.email)
        })

        await AuthUtil.clear({ entity })

        res.status(200).json({
            status: 'success',
            message: 'Activated user successfully',
            data: null
        })
    }

    static async deactivatePartner(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { email } = req.body

        const validEmail = Validator.validateEmail(email)
        if (!validEmail) {
            throw new BadRequestError('Invalid email')
        }

        const entity = await EntityService.viewSingleEntityByEmail(email)
        if (!entity) {
            throw new BadRequestError('Entity not found')
        }

        const role = await entity.$get('role')
        if (!role) {
            throw new BadRequestError('Role not found')
        }

        if (role.name === RoleEnum.SuperAdmin) {
            throw new ForbiddenError('Unauthorized access')
        }

        await entity.update({ status: { ...entity.status, activated: false } })
        await AuthUtil.clear({ entity })

        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Account Activation',
            html: await new EmailTemplate().accountActivation(entity.email)
        })

        res.status(200).json({
            status: 'success',
            message: 'Deactivated user successfully',
            data: null
        })
    }

    static async requestSuperAdminActivation(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body

        const validEmail = Validator.validateEmail(email)
        if (!validEmail) {
            throw new BadRequestError('Invalid email')
        }

        const entity = await EntityService.viewSingleEntityByEmail(email)
        if (!entity) {
            throw new BadRequestError('Entity not found')
        }

        const role = await entity.$get('role')
        if (!role) {
            throw new BadRequestError('Role not found')
        }

        if (role.name !== RoleEnum.SuperAdmin) {
            throw new ForbiddenError('Unauthorized access')
        }

        const activationCode = await AuthUtil.generateCode({ type: 'su_activation', entity, expiry: 5 * 60 * 60 })
        const [activationCode1, activationCode2, activationCode3] = activationCode.split(':') as ReturnType<typeof randomUUID>[]

        // console.log({
        //     activationCode1,
        //     activationCode2,
        //     activationCode3
        // })
        // Send activation code to 3 Admins
        EmailService.sendEmail({
            to: SU_HOST_EMAIL_1,
            html: await (new EmailTemplate().suAccountActivation({
                email: email,
                authorizationCode: activationCode1,
            })),
            subject: 'Super Admin account activation request'
        })

        EmailService.sendEmail({
            to: SU_HOST_EMAIL_2,
            html: await (new EmailTemplate().suAccountActivation({
                email: email,
                authorizationCode: activationCode2,
            })),
            subject: 'Super Admin account activation request'
        })

        EmailService.sendEmail({
            to: SU_HOST_EMAIL_3,
            html: await (new EmailTemplate().suAccountActivation({
                email: email,
                authorizationCode: activationCode3,
            })),
            subject: 'Super Admin account activation request'
        })

        const accessToken = await AuthUtil.generateToken({ type: 'su_activation', entity, profile: entity, expiry: 5 * 60 * 60 })

        res.status(200).json({
            status: 'success',
            message: 'Activation request sent successfully',
            data: {
                accessToken
            }
        })
    }

    static async completeSuperAdminActivationRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { authorizationCode1, authorizationCode2, authorizationCode3 } = req.body

        const authorizationCode = `${authorizationCode1}:${authorizationCode2}:${authorizationCode3}`

        const entity = await EntityService.viewSingleEntityByEmail(req.user.user.entity.email)
        if (!entity) {
            throw new BadRequestError('Entity not found')
        }

        const validCode = await AuthUtil.compareCode({ entity, tokenType: 'su_activation', token: authorizationCode })
        if (!validCode) {
            throw new BadRequestError('Invalid authorization code')
        }

        await entity.update({ status: { ...entity.status, activated: true } })

        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Account Activation',
            html: await new EmailTemplate().accountActivation(entity.email)
        })

        await AuthUtil.deleteToken({ entity, tokenType: 'su_activation', tokenClass: 'code' })

        res.status(200).json({
            status: 'success',
            message: 'Super admin activation successful',
            data: null
        })
    }

    static async completeSuperAdminDeActivationRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { authorizationCode1, authorizationCode2, authorizationCode3 } = req.body

        const authorizationCode = `${authorizationCode1}:${authorizationCode2}:${authorizationCode3}`

        const entity = await EntityService.viewSingleEntityByEmail(req.user.user.entity.email)
        if (!entity) {
            throw new BadRequestError('Entity not found')
        }

        const validCode = await AuthUtil.compareCode({ entity, tokenType: 'su_activation', token: authorizationCode })
        if (!validCode) {
            throw new BadRequestError('Invalid authorization code')
        }

        await entity.update({ status: { ...entity.status, activated: false } })

        await EmailService.sendEmail({
            to: entity.email,
            subject: 'Account Deactivation',
            html: await new EmailTemplate().accountActivation(entity.email)
        })

        await AuthUtil.deleteToken({ entity, tokenType: 'su_activation', tokenClass: 'code' })

        res.status(200).json({
            status: 'success',
            message: 'Super admin deactivation successful',
            data: null
        })
    }

    static async requestSuperAdminDeActivation(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body

        const validEmail = Validator.validateEmail(email)
        if (!validEmail) {
            throw new BadRequestError('Invalid email')
        }

        const entity = await EntityService.viewSingleEntityByEmail(email)
        if (!entity) {
            throw new BadRequestError('Entity not found')
        }

        const role = await entity.$get('role')
        if (!role) {
            throw new BadRequestError('Role not found')
        }

        if (role.name !== RoleEnum.SuperAdmin) {
            throw new ForbiddenError('Unauthorized access')
        }

        const deactivationCode = await AuthUtil.generateCode({ type: 'su_activation', entity, expiry: 5 * 60 * 60 })
        const [deactivationCode1, deactivationCode2, deactivationCode3] = deactivationCode.split(':') as ReturnType<typeof randomUUID>[]


        // NODE_ENV === 'development' && console.log({
        //     deactivationCode1,
        //     deactivationCode2,
        //     deactivationCode3
        // })
        // Send activation code to 3 Admins
        EmailService.sendEmail({
            to: SU_HOST_EMAIL_1,
            html: await (new EmailTemplate().suDeAccountActivation({
                email: email,
                authorizationCode: deactivationCode1,
            })),
            subject: 'Super Admin account deactivation request'
        })

        EmailService.sendEmail({
            to: SU_HOST_EMAIL_2,
            html: await (new EmailTemplate().suDeAccountActivation({
                email: email,
                authorizationCode: deactivationCode2,
            })),
            subject: 'Super Admin account deactivation request'
        })

        EmailService.sendEmail({
            to: SU_HOST_EMAIL_3,
            html: await (new EmailTemplate().suDeAccountActivation({
                email: email,
                authorizationCode: deactivationCode3,
            })),
            subject: 'Super Admin account deactivation request'
        })

        const accessToken = await AuthUtil.generateToken({ type: 'su_activation', entity, profile: entity, expiry: 5 * 60 * 60 })

        res.status(200).json({
            status: 'success',
            message: 'Deactivation request sent successfully',
            data: {
                accessToken
            }
        })
    }
}