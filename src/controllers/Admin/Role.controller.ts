import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from "../../utils/Errors";
import RoleService from "../../services/Role.service";
import { RoleEnum } from "../../models/Role.model";
import { AuthenticatedRequest } from "../../utils/Interface";
require('newrelic');

export default class RoleController {
    //  Create role
    static async createRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { name, description, type } = req.body
      
        const role = await RoleService.addRole({ name, description, id: uuidv4(), type })

        res.status(200).json({
            status: 'success',
            message: 'Role created successfully',
            data: { role }
        })
    }

    static async updateRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { roleId, name, description }: { roleId: string, name: RoleEnum, description: string } = req.body

        const role = await RoleService.viewRoleById(roleId)
        if (!role) {
            throw new BadRequestError('Role not found')
        }

        // Check if role name is among the default roles
        if ((Object.values(RoleEnum).includes(name) || Object.values(RoleEnum).includes(role.name)) && name) {
            throw new BadRequestError('You cannot update name of a default role')
        }

        const updatedRole = await RoleService.updateRole(role, { name, description })

        res.status(200).json({
            status: 'success',
            message: 'Role updated successfully',
            data: { role: updatedRole }
        })
    }
}