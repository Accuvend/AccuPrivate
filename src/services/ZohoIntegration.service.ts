import Complaint, { ICreateComplaint , IUpdateComplaint } from "../models/Complaint.model";
import Entity from "../models/Entity/Entity.model";
import ComplaintReply, {ICreateComplaintReply , IUpdateComplaintReply} from "../models/ComplaintReply.model";
import logger from "../utils/Logger";
import { v4 as uuidv4 } from 'uuid';
import ZohoIntegrationSettings from "../models/ZohoIntegrationSettings.model";


/**
 * Service class for handling operations related to Zoho Integrations 
 */
export default class ZohoIntegrationService {
  

  /**
   * Adds a new complaint.
   * @param complaint The complaint data to be added.
   * @returns A Promise resolving to the added complaint or void if an error occurs.
   */
  static async generateAccessToken(
  ): Promise<Complaint | void> {
    try {
      const zohoSettings: ZohoIntegrationSettings | null = await ZohoIntegrationSettings.findOne()
      if(zohoSettings == null) throw Error('Empty Zoho Setting')
      const AccessToken = await fetch(`https://accounts.zoho.com/oauth/v2/token?code=${zohoSettings?.authorizationcode}&grant_type=authorization_code
      &client_id=${zohoSettings?.clientid}
      &client_secret=${zohoSettings?.clientsecret}
      &redirect_uri=${zohoSettings?.redirecturl}`, {
        method: "POST", 
        mode: "no-cors", 
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

    } catch (err) {
      logger.error("Error Generation Acccess Token");
      throw err;
    }
  }

  /**
   * Adds a new complaint.
   * @param complaint The complaint data to be added.
   * @returns A Promise resolving to the added complaint or void if an error occurs.
   */
  static async refreshAccessToken(
    complaint: ICreateComplaint
  ): Promise<Complaint | void> {
    try {
      const newComplaint: Complaint = await Complaint.build({
        id: uuidv4(),
        ...complaint
      });
      await newComplaint.save();
      return newComplaint;
    } catch (err) {
      logger.error("Error Generating Refresh Token");
      throw err;
    }
  }





  /**
   * Retrieves a single complaint by its UUID.
   * @param uuid The UUID of the complaint to be retrieved.
   * @returns A Promise resolving to the complaint or void if an error occurs.
   */
  static async viewSingleComplaint(
    uuid: string
  ): Promise<Complaint | void | null> {
    try {
      const complaint: Complaint | null = await Complaint.findOne({
        where: { id: uuid },
        include: [Entity],
      });
      return complaint;
    } catch (err) {
      logger.error("Error Reading Complaint");
      throw err;
    }
  }

  /**
   * Retrieves a paginated and filtered list of complaints.
   * @param limit The maximum number of complaints to retrieve.
   * @param offset The number of complaints to skip.
   * @param entityId The ID of the entity related to the complaints.
   * @param status The status of the complaints to filter by.
   * @returns A Promise resolving to an object containing the complaints and pagination info, or void if an error occurs.
   */
  static async viewAllComplainsPaginatedFiltered(
    limit: number | null,
    offset: number | null,
    entityId: string | null,
    status: string | null,
  ): Promise<{
    complaint: Complaint[];
    pagination?: {
      currentPage?: number;
      totalPages?: number;
      totalItems?: number;
      pageSize?: number; 
    };
  } | void | null> {
    let _limit = 9;
    let _offset = 1;
    const findAllObject: { where?: { entityId?: string , status?: string } , limit: number , offset: number} | any =  {}
    if (limit) findAllObject.limit = limit;
    if (offset) findAllObject.offset = offset - 1;
    if(entityId || status ) findAllObject.where = {}
    if (entityId) findAllObject.where.entityId = entityId;
    if(status) findAllObject.where.status = status;
    
    try {
      const complaints: {
        rows: Complaint[];
        count: number;
       } | null = await Complaint.findAndCountAll(findAllObject);
      const totalItems  = complaints.count;
      const totalPages = Math.ceil(totalItems / _limit);
      return {
        complaint : complaints.rows,
        pagination: {
            currentPage : _offset,
            pageSize : _limit,
            totalItems,
            totalPages
        }
      };
    } catch (err) {
      logger.error("Error Reading Complaints");
      throw err;
    }
  }

  /**
   * Updates a complaint by its UUID.
   * @param uuid The UUID of the complaint to be updated.
   * @param complaint The updated complaint data.
   * @returns A Promise resolving to an object containing the update result and the updated complaint, or void if an error occurs.
   */
  static async updateAComplaint(uuid: string,complaint: IUpdateComplaint){
    try{
      const result : [number] = await Complaint.update(complaint,{ where : {id : uuid}});
      let _complaint : Complaint | null = null;
      if(result[0] > 1) _complaint = await Complaint.findByPk(uuid);
      return {
        result,
        _complaint
      };
    } catch (error) {
      logger.error("Error Reading Complaints");
      throw error;
    }
  }

  /**
   * Adds a new reply to a complaint.
   * @param uuid The UUID of the complaint to add the reply to.
   * @param complaintReply The reply data to be added.
   * @returns A Promise resolving to the added reply or void if an error occurs.
   */
  static async addComplaintReply(uuid: string , complaintReply : ICreateComplaintReply){
    try {
      const newComplaintRely: ComplaintReply = await ComplaintReply.build({
        id: uuidv4(),
        complaintId: uuid,
        ...complaintReply
      });
      await newComplaintRely.save();
      return newComplaintRely; 
    } catch (error) {
      logger.error("Error Reading Complaints");
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of replies for a complaint.
   * @param uuid The UUID of the complaint to retrieve replies for.
   * @param limit The maximum number of replies to retrieve.
   * @param offset The number of replies to skip.
   * @returns A Promise resolving to an object containing the replies and pagination info, or void if an error occurs.
   */
  static async viewListOfComplaintPaginatedRelies(uuid: string , limit?: number | null, offset?: number | null) {
    let _limit = 9;
    let _offset = 1;
    const findAllObject: { where? : { complaintId? : string } , limit?: number , offset?: number} | any =  {};
    if (limit) findAllObject.limit = limit;
    if (offset) findAllObject.offset = offset - 1;
    try {
      const complaint : Complaint | null = await Complaint.findByPk(uuid,{
        include: [{
          model: ComplaintReply,
          ...findAllObject,
          include: [Entity]
        }]
      });
      if(uuid){
        findAllObject.where = {};
        findAllObject.where.complaintId = uuid;
      }
      const totalItems = await ComplaintReply.count({ where : findAllObject.where });
      const totalPages = Math.ceil(totalItems / _limit);
      return {
          complaint: complaint,
          pagination: {
              currentPage : _offset,
              pageSize : _limit,
              totalItems,
              totalPages
          }
        };
    } catch (error) {
      logger.error("Error Reading Complaints Replies");
      throw error;
    }
  }
}
