import Entity from "../models/Entity/Entity.model";
import ZohoIntegrationSettings from "../models/ZohoIntegrationSettings.model";
import logger from "../utils/Logger";
import EntityService from "./Entity/Entity.service";
import ZohoIntegrationService from "./ZohoIntegration.service";

/**
 * Interface representing a complaint object.
 */
export interface IComplaint {
    subject: string; // The subject of the complaint.
    channel: "WEB" | "EMAIL"; // The channel through which the complaint is received.
    contactId: string; // The ID of the contact associated with the complaint.
    description: string; // The description of the complaint.
    status: string | "Open"; // The status of the complaint, typically either 'Open' or another custom status.
    cf?: {
        // Additional custom fields related to the complaint (optional).
        cf_transanction_id?: string; // The transaction ID associated with the complaint.
        cf_complain_type?: string; // The type of complaint.
        cf_customer_email?: string; // The email address of the customer associated with the complaint.
        cf_customer_phone?: string; // The phone of the customer associated with the complaint.
        cf_customer_name?: string; // The name of the customer associated with the complaint.
        cf_product_code?: string // The Product Code Attached to the transaction
    };
    category ?: string // The category of the complaint (optional)
    email?: string; // The email address associated with the complaint (optional).
    uploads?: string; // Any file uploads or attachments related to the complaint (optional).
}

/**
 * Interface representing the structure of data required to create a new complaint.
 * Extends the base complaint interface.
 */
export interface ICreateComplaint extends IComplaint {}

/**
 * Interface representing the structure of data required to update an existing complaint.
 * Inherits properties from the interface for creating a new complaint, allowing partial updates.
 */
export interface IUpdateComplaint extends Partial<ICreateComplaint> {}

/**
 * Version2 Service class for handling operations related to complaints and their replies.
 */
export default class ComplaintService {
    /**
     * Retrieves a paginated and filtered list of complaints for admin view.
     * @param limit The maximum number of complaints to retrieve.
     * @param offset The number of complaints to skip.
     * @param entityId The ID of the entity related to the complaints.
     * @param status The status of the complaints to filter by.
     * @returns A Promise resolving to the paginated and filtered list of complaints or void if an error occurs.
     */
    static async viewAllComplainsPaginatedFilteredAdmin(
        limit: number | null,
        offset: number | null,
        status: string | null
    ) {
        try {
            const url =
                "/api/v1/tickets" +
                (limit || offset || status ? "?" : "") +
                (limit ? "limit=" + limit + "&" : "") +
                (offset || offset === 0 ? "from=" + offset + "&" : "") +
                (status ? "status=" + status : "");
            const data = await ZohoIntegrationService.zohoEndpoint(url);
            // if(data?.errorCode) throw new Error(data?.message || "Error occurred while creating a complaint in Zoho.")
            return data;
        } catch (err: any) {
            logger.error(
                err.message || "Error occurred while retrieving data from Zoho."
            );
            throw err;
        }
    }

    /**
     * Creates a new complaint in the Zoho service.
     * @param complaint The complaint data to be created.
     * @returns A Promise resolving to the response data from Zoho after creating the complaint.
     * @throws Throws an error if the creation process fails.
     */
    static async createComplain(complaint: IComplaint) {
        try {
            //Get Zoho Setting Information
            const zohoSetting: ZohoIntegrationSettings | null = await ZohoIntegrationSettings.findOne();

            // Making a request to the Zoho API to create a new complaint
            const data = await ZohoIntegrationService.zohoEndpoint(
                "/api/v1/tickets",
                "POST",
                { ...complaint, departmentId: zohoSetting?.departmentId}
            );
            // Handling errors if Zoho returns an error code
            if (data?.errorCode)
                throw new Error(
                    "Error occurred while creating a complaint in Zoho."
                );
            return data; // Returning the response data from Zoho
        } catch (err: any) {
            // Logging and throwing errors
            logger.error(
                err.message ||
                    "Error occurred while creating a complaint in Zoho."
            );
            throw err;
        }
    }

    /**
     * Retrieves complaints associated with a partner, filtered and paginated.
     * @param entityId The ID of the partner entity.
     * @param limit The maximum number of complaints to retrieve (optional).
     * @param offset The offset for pagination (optional).
     * @param status The status of complaints to filter by (optional).
     * @returns A Promise resolving to the response data containing the complaints associated with the partner.
     * @throws Throws an error if retrieval fails or if the partner entity is not found.
     */
    static async viewAllComplainsPaginatedFilteredPartner(
        entityId: string,
        limit: number | null,
        offset: number | null,
        status: string | null
    ) {
        try {
            // Retrieving partner entity details
            const entity: Entity | null = await EntityService.viewSingleEntity(
                entityId
            );
            if (!entity) throw new Error("Entity is required");

            // Constructing URL for Zoho API call with query parameters
            const url =
                `/api/v1/contacts/${entity.zohoContactId}/tickets` +
                (limit || offset || status ? "?" : "") +
                (limit ? "limit=" + limit + "&" : "") +
                (offset || offset === 0 ? "from=" + offset + "&" : "") +
                (status ? "status=" + status : "");

            console.log(url)

            // Making a request to the Zoho API to retrieve complaints associated with the partner
            const data = await ZohoIntegrationService.zohoEndpoint(url);

            if(data.errorCode) throw Error(data.message);

            return data; // Returning the response data containing the complaints
        } catch (error: any) {
            // Logging and throwing errors
            logger.error(
                error.message ||
                    "Error occurred while getting a complaint in Zoho."
            );
            throw error;
        }
    }
}
