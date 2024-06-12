import { NextFunction, Request, Response } from "express";
import Transaction, { ITransaction } from "../../models/Transaction.model";
import TransactionService from "../../services/Transaction.service";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../../utils/Errors";
import ResponseTrimmer from "../../utils/ResponseTrimmer";
import VendorService from "../../services/VendorApi.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import PartnerService from "../../services/Entity/Profiles/PartnerProfile.service";
import { RoleEnum } from "../../models/Role.model";
import TransactionEventService from "../../services/TransactionEvent.service";
import { VendorPublisher } from "../../kafka/modules/publishers/Vendor";
import { Op } from "sequelize";
import { TeamMemberProfileService } from "../../services/Entity/Profiles";
import Event from "../../models/Event.model";
import { Status } from "../../models/Transaction.model";
import PowerUnit from "../../models/PowerUnit.model";
import Partner from "../../models/Entity/Profiles/PartnerProfile.model";
import User from "../../models/User.model";
import Meter from "../../models/Meter.model";
import Bundle from "../../models/Bundle.model";
require("newrelic");

interface getTransactionsRequestBody extends ITransaction {
    page: `${number}`;
    limit: `${number}`;
    status: Status;
    startDate: Date;
    endDate: Date;
    userId: string;
    meterId: string;
    disco: string;
    superagent: "BUYPOWERNG" | "BAXI" | "IRECHARGE";
    includes?: string;
}

export default class TransactionController {
    static async getTransactionInfo(req: Request, res: Response) {
        const { bankRefId, transactionId } = req.query as Record<
            string,
            string
        >;

        const transaction: Transaction | null = bankRefId
            ? await TransactionService.viewSingleTransactionByBankRefID(
                  bankRefId
              )
            : await TransactionService.viewSingleTransaction(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        const powerUnit = await transaction.$get("powerUnit");

        res.status(200).json({
            status: "success",
            message: "Transaction info retrieved successfully",
            // data: { transaction: { ...ResponseTrimmer.trimTransactionResponse(transaction.dataValues), powerUnit, disco: transaction.productType == 'AIRTIME' ? undefined : transaction.disco } },
            data: { transaction },
        });
    }

    static async getTransactions(req: AuthenticatedRequest, res: Response) {
        const {
            page,
            limit,
            status,
            startDate,
            endDate,
            userId,
            disco,
            superagent,
            partnerId,
        } = req.query as any as getTransactionsRequestBody;

        const query = { where: {} } as any;

        if (status) query.where.status = status;
        if (startDate && endDate)
            query.where.transactionTimestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        if (userId) query.where.userId = userId;
        if (disco) query.where.disco = disco;
        if (superagent) query.where.superagent = superagent;
        if (limit) query.limit = parseInt(limit);
        if (page && page != "0" && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit);
        }
        if (partnerId) query.where.partnerId = partnerId;
        if (userId) query.where.userId = userId;

        const requestWasMadeByAnAdmin =
            [RoleEnum.Admin].includes(req.user.user.entity.role) ||
            [RoleEnum.SuperAdmin].includes(req.user.user.entity.role);
        if (!requestWasMadeByAnAdmin) {
            const requestMadeByEnduser = [RoleEnum.EndUser].includes(
                req.user.user.entity.role
            );
            const requestWasMadeByTeamMember = [RoleEnum.TeamMember].includes(
                req.user.user.entity.role
            );

            if (requestMadeByEnduser) {
                query.where.userId = req.user.user.entity.userId;
            } else if (requestWasMadeByTeamMember) {
                //To show Partner Data to Teammember
                const _teamMember =
                    await TeamMemberProfileService.viewSingleTeamMember(
                        req.user.user.entity.teamMemberProfileId || ""
                    );
                query.where.partnerId = _teamMember?.partnerId;
            } else {
                query.where.partnerId = req.user.user.profile.id;
            }
        }

        //To show Partner Data to Teammember

        const transactions: Transaction[] =
            await TransactionService.viewTransactionsWithCustomQuery(query);
        if (!transactions) {
            throw new NotFoundError("Transactions not found");
        }

        const totalAmount = transactions.reduce(
            (acc, curr) => acc + parseInt(curr.amount),
            0
        );

        const paginationData = {
            page: parseInt(page),
            limit: parseInt(limit),
            totalCount: transactions.length,
            totalPages: Math.ceil(transactions.length / parseInt(limit)),
        };

        const response = {
            transactions: transactions.map((transaction) => ({
                ...transaction.dataValues,
                disco:
                    transaction?.productType?.toUpperCase() == "AIRTIME"
                        ? undefined
                        : transaction.disco,
            })),
            totalAmount,
        } as any;

        if (page && page != "0" && limit) {
            response["pagination"] = paginationData;
        }

        res.status(200).json({
            status: "success",
            message: "Transactions retrieved successfully",
            data: response,
        });
    }

    /**
     * Retrieves filtered transactions based on the request parameters
     * @param req The request object containing parameters for filtering transactions and user authentication data.
     * @param res The response object to send back to the client.
     */
    static async getTransactionsFiltered(
        req: AuthenticatedRequest,
        res: Response
    ) {
        // Extracting request query parameters
        const {
            page,
            limit,
            status,
            startDate,
            endDate,
            userId,
            disco,
            superagent,
            partnerId,
            includes,
        } = req.query as any as getTransactionsRequestBody;

        // Initializing query object

        const query = { where: {}, include: [] } as any;
        if (includes) {
            const include = includes.split(",");
            include.map((item) => {
                switch (item) {
                    case "PowerUnit":
                        query.include.push(PowerUnit);
                        break;
                    case "User":
                        query.include.push(User);
                        break;
                    case "Event":
                        query.include.push(Event);
                        break;
                    case "Partner":
                        query.include.push(Partner);
                        break;
                    case "Bundle":
                        query.include.push(Bundle);
                        break;
                    case "Meter":
                        query.include.push(Meter);
                        break;

                    default:
                        break;
                }
            });
        }

        // Applying filters based on query parameters
        if (status) query.where.status = status;
        if (startDate && endDate)
            query.where.transactionTimestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        if (userId) query.where.userId = userId;
        if (disco) query.where.disco = disco;
        if (superagent) query.where.superagent = superagent;
        if (limit) query.limit = parseInt(limit);
        if (page && page != "0" && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit);
        }
        if (partnerId) query.where.partnerId = partnerId;
        if (userId) query.where.userId = userId;

        // Handling access control based on user roles
        const requestWasMadeByAnAdmin =
            [RoleEnum.Admin].includes(req.user.user.entity.role) ||
            [RoleEnum.SuperAdmin].includes(req.user.user.entity.role);
        if (!requestWasMadeByAnAdmin) {
            const requestMadeByEnduser = [RoleEnum.EndUser].includes(
                req.user.user.entity.role
            );
            const requestWasMadeByTeamMember = [RoleEnum.TeamMember].includes(
                req.user.user.entity.role
            );

            if (requestMadeByEnduser) {
                query.where.userId = req.user.user.entity.userId;
            } else if (requestWasMadeByTeamMember) {
                // To show Partner Data to Teammember
                const _teamMember =
                    await TeamMemberProfileService.viewSingleTeamMember(
                        req.user.user.entity.teamMemberProfileId || ""
                    );
                query.where.partnerId = _teamMember?.partnerId;
            } else {
                query.where.partnerId = req.user.user.profile.id;
            }
        }

        // Retrieving transactions based on the constructed query
        const transactions: Transaction[] =
            await TransactionService.viewTransactionsWithCustomQueryAndInclude(
                query
            );
        if (!transactions) {
            throw new NotFoundError("Transactions not found");
        }

        // Calculating total amount of transactions
        const totalAmount = transactions.reduce(
            (acc, curr) => acc + parseInt(curr.amount),
            0
        );

        // Constructing pagination data
        const paginationData = {
            page: parseInt(page),
            limit: parseInt(limit),
            totalCount: transactions.length,
            totalPages: Math.ceil(transactions.length / parseInt(limit)),
        };

        // Constructing response data
        const response = {
            transactions: transactions.map((transaction) => ({
                ...transaction.dataValues,
                disco:
                    transaction?.productType?.toUpperCase() == "AIRTIME"
                        ? undefined
                        : transaction.disco,
            })),
            totalAmount,
        } as any;

        // Adding pagination data to response if pagination is applied
        if (page && page != "0" && limit) {
            response["pagination"] = paginationData;
        }

        // Sending success response with data
        res.status(200).json({
            status: "success",
            message: "Transactions retrieved successfully",
            data: response,
        });
    }

    /**
     * Retrieves the latest transactions associated with a specific phone number within a given date range.
     * @param req - The authenticated request object containing request parameters.
     * @param res - The response object to send back to the client.
     * @param next - The next function to call middleware in the request-response cycle.
     * @returns A JSON response containing the latest transactions for the specified phone number.
     * @throws BadRequestError if the user is not a partner or if no phone number is provided.
     * @throws NotFoundError if no transactions are found.
     */
    static async getTransactionsLatest(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // Extracts parameters from the request
        const { phoneNumber } = req.params as any as { phoneNumber: string };
        const { startDate, endDate } = req.query as any as {
            startDate: string | null | void;
            endDate: string | null | void;
        };

        // Constructs a query for date range filtering
        const dateQuery: { transactionTimestamp?: Object } = {};
        if (startDate && endDate) {
            dateQuery.transactionTimestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Retrieves the ID of the authenticated user's partner profile
        const partnerBasicAuthId  = req?.user?.user?.profile?.id;

        const partnerApiKeyId = (req as any).key;

        let id = ''
        if(partnerApiKeyId) id = partnerApiKeyId
        if(partnerBasicAuthId ) id = partnerBasicAuthId

        // Retrieves the partner profile based on the ID
        const partner = await PartnerService.viewSinglePartner(id);
        if (!partner) {
            throw new BadRequestError("User must be a partner");
        }

        // Throws an error if no phone number is provided
        if (!phoneNumber) {
            return next(new BadRequestError("No number provided"));
        }

        // Retrieves transactions based on the constructed query and includes related models
        const transactions: Transaction[] =
            await TransactionService.viewTransactionsWithCustomQueryAndInclude({
                offset: 0,
                limit: 7,
                include: [
                    Meter,
                    {
                        model: User,
                        where: {
                            phoneNumber,
                        },
                    },
                    {
                        model: Partner,
                        where: {
                            id,
                        },
                    },
                    Bundle,
                    PowerUnit,
                ],
                where: dateQuery,
            });

        // Throws an error if no transactions are found
        if (!transactions) {
            throw new NotFoundError("Transactions not found");
        }

        // Constructs the response data
        const response = {
            transactions: transactions.map((transaction) => ({
                ...transaction.dataValues,
                // Removes "disco" field if the product type is "AIRTIME"
                disco:
                    transaction?.productType?.toUpperCase() == "AIRTIME"
                        ? undefined
                        : transaction.disco,
            })),
        } as any;

        // Sends a success response with the retrieved data
        res.status(200).json({
            status: "success",
            message: "Transactions retrieved successfully",
            data: response,
        });
    }

    /**
     * Retrieves transaction Key Performance Indicators (KPIs) based on specified query parameters.
     * @param req - The authenticated request object containing query parameters.
     * @param res - The response object to send back to the client.
     * @returns A JSON response containing transaction KPIs such as total transaction amount and count.
     */
    static async getTransactionsKPI(req: AuthenticatedRequest, res: Response) {
        // Extracts query parameters from the request
        const {
            page,
            limit,
            status,
            startDate,
            endDate,
            userId,
            disco,
            superagent,
            partnerId,
        } = req.query as any as getTransactionsRequestBody;

        // Constructs the query object for Sequelize
        const query = { where: {} } as any;
        query.where.amount = {
            [Op.notIn]: ["", " "], // Filters out empty or whitespace amounts
        };
        if (status) query.where.status = status.toUpperCase();
        if (startDate && endDate)
            query.where.transactionTimestamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        if (userId) query.where.userId = userId;
        if (disco) query.where.disco = disco;
        if (superagent) query.where.superagent = superagent;
        if (limit) query.limit = parseInt(limit);
        if (page && page != "0" && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit);
        }
        if (partnerId) query.where.partnerId = partnerId;

        // Checks if the request was made by an admin
        const requestWasMadeByAnAdmin =
            [RoleEnum.Admin].includes(req.user.user.entity.role) ||
            [RoleEnum.SuperAdmin].includes(req.user.user.entity.role);

        // Checks if the request was made by a customer
        const requestWasMadeByCustomer = [RoleEnum.EndUser].includes(
            req.user.user.entity.role
        );
        if (requestWasMadeByCustomer) {
            // Restricts data access to the current user's transactions if they are a customer
            query.where.userId = req.user.user.entity.userId;
        }
        if (!requestWasMadeByAnAdmin && !requestWasMadeByCustomer) {
            // If the request was made by a team member, restricts data access to their partner's transactions
            const requestWasMadeByTeamMember = [RoleEnum.TeamMember].includes(
                req.user.user.entity.role
            );
            if (requestWasMadeByTeamMember) {
                const _teamMember =
                    await TeamMemberProfileService.viewSingleTeamMember(
                        req.user.user.entity.teamMemberProfileId || ""
                    );
                query.where.partnerId = _teamMember?.partnerId;
            } else {
                // If the request was made by a partner, restricts data access to their own transactions
                query.where.partnerId = req.user.user.profile.id;
            }
        }

        // Retrieves the total transaction amount and count based on the constructed query
        const totalTransactionAmount: any =
            await TransactionService.viewTransactionsAmountWithCustomQuery(
                query
            );
        const totalTransactionCount: number =
            await TransactionService.viewTransactionsCountWithCustomQuery(
                query
            );

        // Constructs the response object
        const response = {
            totalTransactionAmount,
            totalTransactionCount,
        };

        // Sends a JSON response containing the transaction KPIs
        res.status(200).json({
            status: "success",
            message: "Transactions retrieved successfully",
            data: response,
        });
    }

    // static async requeryTimedOutTransaction(
    //     req: AuthenticatedRequest,
    //     res: Response
    // ) {
    //     const { bankRefId }: { bankRefId: string } = req.query as any;

    //     let transactionRecord =
    //         await TransactionService.viewSingleTransactionByBankRefID(
    //             bankRefId
    //         );
    //     if (!transactionRecord) {
    //         throw new NotFoundError("Transaction record not found");
    //     }

    //     if (transactionRecord.superagent !== "BUYPOWERNG") {
    //         throw new BadRequestError(
    //             "Transaction cannot be requery for this superagent"
    //         );
    //     }

    //     let powerUnit = await transactionRecord.$get("powerUnit");
    //     const response = await VendorService.buyPowerRequeryTransaction({
    //         reference: transactionRecord.reference,
    //         transactionId: transactionRecord.id,
    //     });
    //     if (response.status === false) {
    //         const transactionFailed = response.responseCode === 202;
    //         const transactionIsPending = response.responseCode === 201;

    //         if (transactionFailed)
    //             await TransactionService.updateSingleTransaction(
    //                 transactionRecord.id,
    //                 {
    //                     status: Status.FAILED,
    //                 }
    //             );
    //         else if (transactionIsPending)
    //             await TransactionService.updateSingleTransaction(
    //                 transactionRecord.id,
    //                 {
    //                     status: Status.PENDING,
    //                 }
    //             );

    //         res.status(200).json({
    //             status: "success",
    //             message: "Requery request successful",
    //             data: {
    //                 requeryStatusCode: transactionFailed ? 400 : 202,
    //                 requeryStatusMessage: transactionFailed
    //                     ? "Transaction failed"
    //                     : "Transaction pending",
    //                 transaction:
    //                     ResponseTrimmer.trimTransaction(transactionRecord),
    //             },
    //         });

    //         return;
    //     }

    //     const partner = await transactionRecord.$get("partner");
    //     if (!partner) {
    //         throw new InternalServerError("Partner not found");
    //     }

    //     const transactionEventService = new TransactionEventService(
    //         transactionRecord,
    //         {
    //             meterNumber: transactionRecord.meter.meterNumber,
    //             disco: transactionRecord.disco,
    //             vendType: transactionRecord.meter.vendType,
    //         },
    //         transactionRecord.superagent,
    //         partner.email
    //     );
    //     await transactionEventService.addTokenReceivedEvent(
    //         response.data.token
    //     );
    //     await VendorPublisher.publishEventForTokenReceivedFromVendor({
    //         meter: {
    //             id: transactionRecord.meter.id,
    //             meterNumber: transactionRecord.meter.meterNumber,
    //             disco: transactionRecord.disco,
    //             vendType: transactionRecord.meter.vendType,
    //             token: response.data.token,
    //         },
    //         user: {
    //             name: transactionRecord.user.name as string,
    //             email: transactionRecord.user.email,
    //             address: transactionRecord.user.address,
    //             phoneNumber: transactionRecord.user.phoneNumber,
    //         },
    //         partner: {
    //             email: transactionRecord.partner.email,
    //         },
    //         transactionId: transactionRecord.id,
    //     });

    //     res.status(200).json({
    //         status: "success",
    //         message: "Requery request successful",
    //         data: {
    //             requeryStatusCode: 200,
    //             requeryStatusMessage: "Transaction successful",
    //             transaction: ResponseTrimmer.trimTransaction(transactionRecord),
    //         },
    //     });
    // }

    /**
     * Retrieves yesterday's transactions for a given partner.
     * @param req - The authenticated request object containing query parameters.
     * @param res - The response object to send back to the client.
     * @returns A JSON response containing yesterday's transactions and their total amount.
     */
    static async getYesterdaysTransactions(
        req: AuthenticatedRequest,
        res: Response
    ) {
        // Extracts the transaction status from the request query parameters
        const { status } = req.query as any as {
            status: "COMPLETED" | "FAILED" | "PENDING";
        };

        // Extracts the partner's profile ID from the authenticated user object
        const {
            profile: { id },
        } = req.user.user;

        // Retrieves the partner information from the PartnerService
        const partner = await PartnerService.viewSinglePartner(id);
        if (!partner) {
            throw new InternalServerError("Authenticated partner not found");
        }

        // Retrieves yesterday's transactions based on the provided status (if any)
        const transactions = status
            ? await TransactionService.viewTransactionsForYesterdayByStatus(
                  partner.id,
                  status.toUpperCase() as typeof status
              )
            : await TransactionService.viewTransactionForYesterday(partner.id);

        // Calculates the total amount of yesterday's transactions
        const totalAmount = transactions.reduce(
            (acc, curr) => acc + parseInt(curr.amount),
            0
        );

        // Sends a JSON response containing the retrieved transactions and total amount
        res.status(200).json({
            status: "success",
            message: "Transactions retrieved successfully",
            data: { transactions, totalAmount },
        });
    }
}
