import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../../utils/Interface";
import EntityService from "../../services/Entity/Entity.service";
import fs from "fs";
import FileUploadService from "../../utils/FileUpload";
import { Status } from "../../models/Complaint.model";
import { InternalServerError, BadRequestError } from "../../utils/Errors";

import ComplaintService, {
    IComplaint,
    ICreateComplaint,
} from "../../services/ComplaintV2.Service";
import { PartnerProfileService } from "../../services/Entity/Profiles";
import Entity from "../../models/Entity/Entity.model";
import Transaction from "../../models/Transaction.model";
import TransactionService from "../../services/Transaction.service";
import { PartnerProfile } from "../../models/Entity/Profiles";
require("newrelic");


/**
 * Interface representing query parameters for filtering complaints.
 */
interface IComplaintQueryParams {
    size?: number; // The number of complaints to retrieve per page (optional).
    page?: number; // The page number of complaints to retrieve (optional).
    status?: string; // The status of complaints to filter by (optional).
}

/**
 * Version 2 Controller class for handling complaint-related operations.
 */
export class ComplaintController {
    /**
     * Retrieves complaints for admin view.
     * @param req The request object containing parameters and user authentication data.
     * @param res The response object to send back to the client.
     * @param next The next middleware function in the request-response cycle.
     */
    static async getComplaintAdmin(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        const {
            size,
            page,
            status,
        }: IComplaintQueryParams = req.query;
        try {
            const complaint =
                await ComplaintService.viewAllComplainsPaginatedFilteredAdmin(
                    size ? size : 10,
                    page ? page : 0,
                    status ? status : null
                );
            res.status(200).json({
                status: "success",
                data: {
                    complaint,
                },
            });
        } catch (err) {
            next(new InternalServerError("Sorry, couldn't get complaints."));
        }
    }

    /**
     * Controller method for creating a new complaint.
     * @param req The request object containing the authenticated user data and complaint details.
     * @param res The response object to send back to the client.
     * @param next The next middleware function in the request-response cycle.
     */
    static async createComplaint(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // Extracting necessary data from request body
        const { 
            //title,
            description , 
            category , 
            transactionId
            // upload
         }: { title?: string; description: string , category: string, transactionId : string } /*upload: any}*/ = req.body;
        
        const upload = req.file
        // console.log(upload , 'file----')
        // checking the route calling the Endpoint
        let channel = ''
        const _route = req.url

        // selecting the channel based on the route path
        if(_route === '/create/complaint') channel = 'PARTNER API'
        else if (_route === '/create') channel = 'PARTNER PORTAL'
        else channel = 'OTHERS'
        
        // Extracting the entity ID from the authenticated user data for basic Auth
        const id =  req?.user?.user?.entity?.id || null;

        // Extracting the entity ID from the authenticated user data for Api Key 
        const partnerId  = (req as any).key;
        

        const transaction: Transaction | null = await TransactionService.viewSingleTransaction(transactionId)
        try {
            // removed title validation , Title is now based on the category selected
            // Validation of inputs
            // if (!title) {
            //     next(new BadRequestError("title of Complaint is required"));
            //     return;
            // }

            if (!description) {
                next(new BadRequestError("Description of complaint is required"));
                return;
            }

            if (!category) {
                next(new BadRequestError("Category of complaint is required"));
                return;
            }

            if (!transaction) {
                next(new BadRequestError("Transaction of complaint is required"));
                return;
            }

            // Fetching entity details
            let entity : Entity | null | undefined
            if(id){
                entity = await EntityService.viewSingleEntity(
                    id
                );
            }else if(partnerId){
                let partner: PartnerProfile | null = await PartnerProfileService.viewSinglePartner(partnerId)
                entity = partner?.entity
            }

            if (!entity) throw new Error("Entity doesn't exist ");
            

            // Creating complaint schema based on request data
            const complaintSchema: ICreateComplaint = {
                subject: category, // The subject of the complaint.
                channel: "WEB", // The channel through which the complaint is received.
                contactId: entity.zohoContactId, // The ID of the contact associated with the complaint.
                description: description, // The description of the complaint.
                status: "Open", // The status of the complaint, typically either 'Open' or another custom status.
                email: entity.email, // The email address associated with the complaint (optional).
                category : category, // The category of the complaint (optional)
                uploads: upload, // The Upload
                cf: {
                    // Additional custom fields related to the complaint (optional).
                    cf_transanction_id: transaction.id, // The transaction ID associated with the complaint.
                    cf_complain_type: category , // The type of complaint.
                    cf_customer_email: transaction.user.email, // The email address of the customer associated with the complaint.
                    cf_customer_phone: transaction.user.phoneNumber, // The phone of the customer associated with the complaint.
                    cf_customer_name: transaction.user.name && "", // The name of the customer associated with the complaint.
                    cf_product_code: transaction.disco, // The Product Code Attached to the transaction
                    cf_complain_channel: channel //The Channel which the complaint is coming from
                }
            };

            // Creating the complaint
            const complaint = await ComplaintService.createComplain(
                complaintSchema
            );

            // Sending success response
            res.status(200).json({
                status: "success",
                message: "complaint created successfully",
                data: {
                    complaint,
                },
            });

            return;
        } catch (err: any) {
            // Handling errors
            if(err.message === "Error occurred while uploading attachment to in Zoho."){
                res.status(202).json({
                    status: "success",
                    message: "complaint successful error creating attachment"
                })
            }
            next(
                new InternalServerError(
                    "Sorry an error occurred, couldn't create complaint"
                )
            );
        }
    }


    /**
     * Controller method for creating a new complaint from the vendor API
     * @param req The request object containing the authenticated user data and complaint details.
     * @param res The response object to send back to the client.
     * @param next The next middleware function in the request-response cycle.
     */
    static async createComplaintApi(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // Extracting necessary data from request body
        const { title, description , category }: { title: string; description: string , category: string } =
            req.body;
        // Extracting the entity ID from the authent
        // Extracting the partner  ID from the authenticated user data
        const partnerId = (req as any).key;

        const partner = await PartnerProfileService.viewSinglePartner(partnerId)
        try {
            // Validation of inputs
            if (!title) {
                next(new BadRequestError("title of Complaint is required"));
                return;
            }

            if (!description) {
                next(new BadRequestError("Subject of description is required"));
                return;
            }

            if (!category) {
                next(new BadRequestError("Subject of category is required"));
                return;
            }

            // Fetching entity details
            const entity: Entity | undefined =   partner?.entity
            if (!entity) throw new Error("Entity doesn't exist ");

            // Creating complaint schema based on request data
            const complaintSchema: ICreateComplaint = {
                subject: title, // The subject of the complaint.
                channel: "WEB", // The channel through which the complaint is received.
                contactId: entity.zohoContactId, // The ID of the contact associated with the complaint.
                description: description, // The description of the complaint.
                status: "Open", // The status of the complaint, typically either 'Open' or another custom status.
                email: entity.email, // The email address associated with the complaint (optional).
                category : category // The category of the complaint (optional)
            };

            // Creating the complaint
            const complaint = await ComplaintService.createComplain(
                complaintSchema
            );

            // Sending success response
            res.status(200).json({
                status: "success",
                message: "complaint created successfully",
                data: {
                    complaint,
                },
            });

            return;
        } catch (err) {
            // Handling errors
            next(
                new InternalServerError(
                    "Sorry an error occurred, couldn't create complaint"
                )
            );
        }
    }

    /**
     * Controller method for retrieving complaints associated with a partner.
     * @param req The request object containing the authenticated user data and query parameters.
     * @param res The response object to send back to the client.
     * @param next The next middleware function in the request-response cycle.
     */
    static async getComplaintsPartner(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) {
        // Extracting query parameters from the request
        const {
            size,
            page,
            status,
        }: IComplaintQueryParams = req.query;
        // Extracting the entity ID from the authenticated user data
        const {
            entity: { id },
        } = req.user.user;
        try {
            // Retrieving complaints associated with the partner
            // console.log(page, size , status)
            const complaint =
                await ComplaintService.viewAllComplainsPaginatedFilteredPartner(
                    id,
                    size ? size : 10,
                    page ? page : 0,
                    null
                );
            // Sending success response with the retrieved complaints
            res.status(200).json({
                status: "success",
                data: {
                    complaint: complaint.data,
                },
            });
        } catch (err) {
            // Handling errors
            next(new InternalServerError("Sorry, couldn't get complaints."));
        }
    }
}
