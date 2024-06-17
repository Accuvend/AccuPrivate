import { NextFunction, Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import { RoleEnum } from "../../models/Role.model";
import { Database } from "../../models";
import EntityService from "../../services/Entity/Entity.service";
import PartnerService from "../../services/Entity/Profiles/PartnerProfile.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import PasswordService from "../../services/Password.service";
import EmailService, { EmailTemplate } from "../../utils/Email";
import RoleService from "../../services/Role.service";
import Cypher from "../../utils/Cypher";
import { TokenUtil } from "../../utils/Auth/Token";
import ApiKeyService from "../../services/ApiKey.service ";
import WebhookService from "../../services/Webhook.service";
import { PartnerProfile } from "../../models/Entity/Profiles";
import ResponseTrimmer from "../../utils/ResponseTrimmer";
import {
    IPartnerProfile,
    IPartnerStatsProfile,
    IUpdatePartnerProfile,
} from "../../models/Entity/Profiles/PartnerProfile.model";
import TransactionService from "../../services/Transaction.service";
import { randomUUID } from "crypto";
import ZohoIntegrationService from "../../services/ZohoIntegration.service";
import { getUniquePartnerCode } from "./Auth.controller";
import PartnerProfileService from "../../services/Entity/Profiles/PartnerProfile.service";
import { IUpdateEntity } from "../../models/Entity/Entity.model";
require("newrelic");

export default class PartnerProfileController {
    static async invitePartner(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // The partner is the entity that is inviting the team member
        const { email, companyName, address } = req.body;

        // create use contact using the zohoAPI

        // let zohoId : string | undefined

        // try {
        //     const zohodata = await ZohoIntegrationService.zohoEndpoint('/api/v1/contacts' , 'POST' , {
        //         firstName: companyName,
        //         lastName: companyName,
        //         email,
        //         description: `${companyName} zoho contact`,
        //         street: address || ""
        //     })
        //     console.log(zohodata)
        //     if(zohodata?.errorCode) throw Error('Error Creating Zoho Contact')

        //     zohoId = zohodata.id

        // } catch (error) {
        //    res.status(500).json({
        //         status: 'failed',
        //         message: 'Partner invited not successfully',
        //     })
        //     return ;
        // }

        const role = await RoleService.viewRoleByName(RoleEnum.Partner);
        if (!role) {
            throw new BadRequestError("Role not found");
        }

        const existingPartner: PartnerProfile | null =
            await PartnerService.viewSinglePartnerByEmail(email);
        if (existingPartner) {
            throw new BadRequestError("Email has been used before");
        }

        const transaction = await Database.transaction();

        try {
            const newPartner = await PartnerService.addPartner(
                {
                    id: uuidv4(),
                    email,
                    companyName,
                    address,
                    partnerCode: await getUniquePartnerCode(
                        companyName.split("@")[0]
                    ),
                },
                transaction
            );

            const entity = await EntityService.addEntity(
                {
                    id: uuidv4(),
                    email,
                    // zohoContactId: zohoId,
                    status: {
                        passwordApproved: false,
                        activated: false,
                        emailVerified: false,
                    },
                    partnerProfileId: newPartner.id,
                    role: RoleEnum.Partner,
                    notificationSettings: {
                        login: true,
                        failedTransactions: true,
                        logout: true,
                    },
                    requireOTPOnLogin: false,
                },
                transaction
            );

            const apiKey = await ApiKeyService.addApiKey(
                {
                    partnerId: newPartner.id,
                    key: newPartner.key,
                    active: true,
                    id: uuidv4(),
                },
                transaction
            );

            const secKeyInCache = Cypher.encryptString(newPartner.sec);
            await TokenUtil.saveTokenToCache({
                key: secKeyInCache,
                token: Cypher.encryptString(newPartner.key),
            });
            await ApiKeyService.setCurrentActiveApiKeyInCache(
                newPartner,
                apiKey.key.toString()
            );

            const password = uuidv4();
            const partnerPassword = await PasswordService.addPassword(
                {
                    id: uuidv4(),
                    entityId: entity.id,
                    password,
                },
                transaction
            );

            await WebhookService.addWebhook(
                {
                    id: uuidv4(),
                    partnerId: newPartner.id,
                },
                transaction
            );

            await transaction.commit();

            await entity.update({
                status: { ...entity.status, emailVerified: true },
            });

            await EmailService.sendEmail({
                to: newPartner.email,
                subject: "Partner invitation",
                html: await new EmailTemplate().invitePartner({
                    email: newPartner.email,
                    password,
                }),
            });

            res.status(200).json({
                status: "success",
                message: "Partner invited successfully",
                data: {
                    partner: ResponseTrimmer.trimPartner({
                        ...newPartner.dataValues,
                        entity,
                    }),
                },
            });
        } catch (err) {
            await transaction.rollback();
            res.status(500).json({
                status: "failed",
                message: "Partner invited not successfully",
            });
            return;
        }
    }

    static async reSendPartnerPassword(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const { email } = req.body;

        const partnerProfile = await PartnerService.viewSinglePartnerByEmail(
            email
        );
        if (!partnerProfile) {
            throw new NotFoundError("Partner not found");
        }

        const entity = await partnerProfile.$get("entity");
        if (!entity) {
            throw new BadRequestError("Entity not found");
        }

        if (entity.status.passwordApproved) {
            throw new BadRequestError("Password has been approved");
        }

        const newPassword = randomUUID();
        await PasswordService.updatePassword(entity.id, newPassword);

        await EmailService.sendEmail({
            to: partnerProfile.email,
            subject: "Password Reset",
            html: await new EmailTemplate().reInvitePartner({
                email: partnerProfile.email,
                password: newPassword,
            }),
        });

        res.status(200).json({
            status: "success",
            message: "Password sent successfully",
        });
    }

    static async getPartnerInfo(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const {
            entity: { id },
        } = req.user.user;
        const { email } = req.query as Record<string, string>;

        const partnerProfile = await PartnerService.viewSinglePartnerByEmail(
            email
        );
        if (!partnerProfile) {
            throw new NotFoundError("Partner not found");
        }

        const entity = await partnerProfile.$get("entity");
        if (!entity) {
            throw new BadRequestError("Entity not found");
        }

        res.status(200).json({
            status: "success",
            message: "Partner fetched successfully",
            data: {
                partner: {
                    ...partnerProfile.dataValues,
                    entity: entity.dataValues,
                },
            },
        });
    }

    /**
     * Fetch all partners with pagination and their transaction statistics.
     *
     * This function handles the request to retrieve a paginated list of partners
     * along with their transaction statistics (success, failed, pending, flagged).
     *
     * @param {AuthenticatedRequest} req - The authenticated request object containing query parameters for pagination.
     * @param {Response} res - The response object to send the result back to the client.
     * @param {NextFunction} next - The next middleware function in the request-response cycle.
     *
     * @throws {NotFoundError} If no partners are found.
     */
    static async getAllPartners(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // Extract page and limit from query parameters
        const { page, limit } = req.query as any;

        // Initialize query object for pagination
        const query = { where: {} } as any;

        // Set limit if provided in query parameters
        if (limit) query.limit = parseInt(limit);

        // Calculate offset for pagination if both page and limit are provided
        if (page && page != "0" && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit);
        }

        // Fetch partners with custom query excluding sensitive fields
        const _partners: IPartnerProfile[] | void =
            await PartnerService.viewPartnersWithCustomQuery(query, {
                exclude: ["key", "sec"],
            });

        // Throw an error if no partners are found
        if (!_partners) {
            throw new NotFoundError("Partners Not found");
        }

        // Remove sensitive fields from each partner object
        const partners: IPartnerStatsProfile[] = _partners.map((item) => {
            (item.key as any) = undefined;
            (item.sec as any) = undefined;
            return item;
        });

        // Initialize an array to hold transaction statistics
        const _stats: any = [];

        // Loop through each partner to gather transaction statistics
        for (let index = 0; index < partners.length; index++) {
            let failed_Transactions: number = 0;
            let pending_Transactions: number = 0;
            let success_Transactions: number = 0;
            let flagged_Transactions: number = 0;
            const element = partners[index];

            // Fetch count of failed transactions for the current partner
            const _failed_Transaction =
                await TransactionService.viewTransactionsCountWithCustomQuery({
                    where: {
                        partnerId: element.id,
                        status: "FAILED",
                    },
                });
            failed_Transactions = _failed_Transaction;

            // Fetch count of flagged transactions for the current partner
            const _flagged_Transaction =
                await TransactionService.viewTransactionsCountWithCustomQuery({
                    where: {
                        partnerId: element.id,
                        status: "FLAGGED",
                    },
                });
            flagged_Transactions = _flagged_Transaction;

            // Fetch count of pending transactions for the current partner
            const _pending_Transaction =
                await TransactionService.viewTransactionsCountWithCustomQuery({
                    where: {
                        partnerId: element.id,
                        status: "PENDING",
                    },
                });
            pending_Transactions = _pending_Transaction;

            // Fetch count of completed transactions for the current partner
            const _complete_Transaction =
                await TransactionService.viewTransactionsCountWithCustomQuery({
                    where: {
                        partnerId: element.id,
                        status: "COMPLETE",
                    },
                });
            success_Transactions = _complete_Transaction;

            // Add the gathered statistics to the _stats array
            _stats.push({
                id: element.id,
                success_Transactions,
                failed_Transactions,
                pending_Transactions,
                flagged_Transactions,
            });
        }

        // Send the response with the partners and their transaction statistics
        res.status(200).json({
            status: "success",
            message: "Partners data retrieved successfully",
            data: {
                partners,
                stats: _stats,
            },
        });
    }

    /**
     * Update a partner's information.
     *
     * This function handles the request to update the information of a specific partner identified by their ID.
     *
     * @param {AuthenticatedRequest} req - The authenticated request object containing the partner ID in the parameters and update data in the body.
     * @param {Response} res - The response object to send the result back to the client.
     * @param {NextFunction} next - The next middleware function in the request-response cycle.
     */
    static async updatePartner(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // Extract partner ID from request parameters
        const { id } = req.params;

        // Extract update data from request body and cast to the appropriate type
        const {
            phoneNumber,
            zohoContactId,
            email,  // Phone number for contacting the Partner
            companyName,
            address,
        } = req.body as {
            phoneNumber?: string
            zohoContactId?: string
            email: string;   // Phone number for contacting the Partner
            companyName?: string;
            address?: string;
        } 

        // Fetch the partner profile using the provided ID
        const partner: PartnerProfile | null =
            await PartnerProfileService.viewSinglePartner(id);

        // Return a 404 error if the partner does not exist
        if (!partner || !partner.entity) {
            res.status(404).json({
                status: "error",
                message: "Partner's data doesn't exist",
            });
            return ;
        }

        const transaction = await Database.transaction();

        try {

            const entityUpdateData: IUpdateEntity  ={}
            const partnerUpdateData: IUpdatePartnerProfile = {}
            if(email) entityUpdateData.email = email
            if(phoneNumber) entityUpdateData.phoneNumber = phoneNumber
            if(zohoContactId) entityUpdateData.zohoContactId = zohoContactId
            if(email) partnerUpdateData.email = email
            if(address) partnerUpdateData.address = address
            if(companyName) partnerUpdateData.companyName = companyName

            // Update the entity associated with the partner
            await EntityService.updateEntity(partner.entity,entityUpdateData , transaction);

            await PartnerProfileService.updatePartner(partner,partnerUpdateData , transaction);

            await transaction.commit();

            // Return a success response if the update is successful
            res.status(200).json({
                status: "success",
                message: "Partner's Information Updated Successfully",
            });
            return ;
        } catch (err) {
            await transaction.rollback();
            // Return an error response if the update fails
            res.status(505).json({
                status: "error",
                message: "Partner Information Couldn't be Updated",
            });
            return ;
        }
    }
}
