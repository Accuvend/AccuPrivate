import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../models/Role.model";
import { AuthenticatedController, AuthenticatedRequest } from "../utils/Interface";
import { ForbiddenError } from "../utils/Errors";
require('newrelic');

export default class RBACMiddelware {
    static validateRole = (allowedRoles: RoleEnum[]) => {
        return AuthenticatedController(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const userIsPermitted = allowedRoles.includes(req.user.user.entity.role)
            if (!userIsPermitted) {
                throw new ForbiddenError('Unauthorized access')
            }

            next()
        })
    }
}

