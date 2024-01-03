import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../utils/Errors";
import RoleService from "../../services/Role.service";
const newrelic = require('newrelic');

export default class RoleController {

    static async getRoleInfo(req: Request, res: Response, next: NextFunction) {
        newrelic.setTransactionName("Show Role Info")
        const { roleId } = req.query as Record<string, string>

        const role = await RoleService.viewRoleById(roleId)
        if (!role) {
            throw new BadRequestError('Role not found')
        }

        res.status(200).json({
            status: 'success',
            message: 'Role retrieved successfully',
            data: { role }
        })
    }

    static async getRoles(req: Request, res: Response, next: NextFunction) {
        newrelic.setTransactionName("Show Roles")
        const roles = await RoleService.viewAllRoles()

        res.status(200).json({
            status: 'success',
            message: 'Roles retrieved successfully',
            data: { roles }
        })
    }
}