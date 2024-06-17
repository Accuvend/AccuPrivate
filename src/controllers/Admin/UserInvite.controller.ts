import { Response } from "express";
import { AuthenticatedRequest } from "../../utils/Interface";
import RoleService from "../../services/Role.service";
import { ForbiddenError, NotFoundError } from "../../utils/Errors";
import UserInviteService from "../../services/UserInvite.service";
import { UserInviteStatus } from "../../models/UserInvite.model";
import { RoleEnum } from "../../models/Role.model";
import EntityService from "../../services/Entity/Entity.service";
import EmailService, { EmailTemplate } from "../../utils/Email";

export default class UserInviteController {
    static async addUserInvite(req: AuthenticatedRequest, res: Response) {
        const { email, name, roleId } = req.body;

        const role = await RoleService.viewRoleById(roleId);
        if (!role) {
            throw new NotFoundError("Role not found");
        }

        if (role.name === RoleEnum.SuperAdmin) {
            throw new ForbiddenError("Cannot invite a super admin");
        }

        const existingUser = await EntityService.viewSingleEntityByEmail(email);
        if (existingUser) {
            throw new ForbiddenError("User already exists");
        }

        const userInvite = await UserInviteService.addUserInvite({
            email,
            name,
            roleId,
            status: UserInviteStatus.PENDING,
            createdAt: new Date(),
        });

        await EmailService.sendEmail({
            to: userInvite.email,
            subject: "User Invite",
            html: await new EmailTemplate().userInvite({
                email: userInvite?.email || "",
                name: userInvite?.name ?? "",
                roleId: userInvite?.roleId ?? "",
            }),
        });

        res.status(201).send({
            status: "success",
            message: "User invite added",
            data: {
                userInvite,
            },
        });
    }

    static async viewUserInvites(req: AuthenticatedRequest, res: Response) {
        const { status } = req.query as Record<string, string>;
        const userInvites = status
            ? await UserInviteService.viewUserInvitesByStatus(
                  status as UserInviteStatus,
              )
            : await UserInviteService.viewAllUserInvites();

        res.status(200).send({
            status: "success",
            message: "User invites retrieved",
            data: {
                userInvites,
            },
        });
    }

    static async viewSingleUserInvite(
        req: AuthenticatedRequest,
        res: Response,
    ) {
        const { userInviteId: uuid } = req.query as Record<string, string>;
        const userInvite = await UserInviteService.viewSingleUserInvite(uuid);
        if (!userInvite) {
            throw new NotFoundError("User invite not found");
        }

        res.status(200).send({
            status: "success",
            message: "User invite retrieved",
            data: {
                userInvite,
            },
        });
    }

    static async cancelUserInvite(req: AuthenticatedRequest, res: Response) {
        const { userInviteId: uuid } = req.body;

        const userInvite = await UserInviteService.viewSingleUserInvite(uuid);
        if (!userInvite) {
            throw new NotFoundError("User invite not found");
        }

        if (userInvite.status !== UserInviteStatus.PENDING) {
            throw new ForbiddenError("Cannot cancel a non-pending invite");
        }

        await UserInviteService.updateAUserInvite(uuid, {
            status: UserInviteStatus.CANCELLED,
        });

        res.status(200).send({
            status: "success",
            message: "User invite cancelled",
        });
    }

    static async resendUserInvite(req: AuthenticatedRequest, res: Response) {
        const { userInviteId } = req.body;

        const userInvite =
            await UserInviteService.viewSingleUserInvite(userInviteId);
        if (!userInvite) {
            throw new NotFoundError("User invite not found");
        }

        const existingUser = await EntityService.viewSingleEntityByEmail(
            userInvite.email,
        );
        if (existingUser) {
            throw new ForbiddenError("User already accepted invite");
        }

        await EmailService.sendEmail({
            to: userInvite.email,
            subject: "User Invite",
            html: await new EmailTemplate().userInvite({
                email: userInvite.email,
                roleId: userInvite.roleId,
                name: userInvite.name ?? "",
            }),
        });

        // Send email to userInvite.email
        res.status(200).send({
            status: "success",
            message: "User invite resent",
        });
    }
}
