import Complaint, { ICreateComplaint , IUpdateComplaint } from "../models/Complaint.model";
import Entity from "../models/Entity/Entity.model";
import ComplaintReply, {ICreateComplaintReply , IUpdateComplaintReply} from "../models/ComplaintReply.model";
import logger from "../utils/Logger";
import { v4 as uuidv4 } from 'uuid';

export default class ComplaintService {
  static async addComplaint(
    complaint: ICreateComplaint
  ): Promise<Complaint | void> {
    try {
        console.log(complaint)
      const newComplaint: Complaint = await Complaint.build({
        id: uuidv4(),
        ...complaint
        });
      await newComplaint.save();
      return newComplaint;
    } catch (err) {
      logger.error("Error Logging Event");
      throw err
    }
  }

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
      throw err
    }
  }

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
    // const where: { entityId?: string } = {};
    const findAllObject: { where? : { entityId?: string , status?: string } , limt: number , offset: number} | any =  {}
    if (limit) findAllObject.limt = limit;
    if (offset) findAllObject.offset = offset - 1;
    if(entityId || status ) findAllObject.where = {}
    if (entityId) findAllObject.where.entityId = entityId;
    if(status) findAllObject.where.status = status
    console.log(findAllObject)
    
    try {
      const complaints: {
        rows: Complaint[]
        count: number
       } | null = await Complaint.findAndCountAll(findAllObject);
      const totalItems  = complaints.count
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
        console.log(err)
      logger.error("Error Reading Complaints");
      throw err
    }
  }


  static async updateAComplaint(uuid: string,complaint: IUpdateComplaint){
    try{
      const result : [number] = await Complaint.update(complaint,{ where : {id : uuid}})
      let _complaint : Complaint | null = null
      if(result[0] > 1) _complaint = await Complaint.findByPk(uuid)
      return {
        result,
        _complaint
      }
    }catch (error) {
      console.log(error)
      logger.error("Error Reading Complaints");
      throw error
    }
  }

  static async addComplaintReply(uuid: string , complaintReply : ICreateComplaintReply){
    try {
      // const complaint : Complaint | null = await Complaint.findByPk(uuid)
      // const ComplaintReply =  await complaint?.$create('complaintReplies', complaintReply )
      // return ComplaintReply
      const newComplaintRely: ComplaintReply = await ComplaintReply.build({
        id: uuidv4(),
        complaintId: uuid,
        ...complaintReply
        });
      await newComplaintRely.save();
      return newComplaintRely; 

    } catch (error) {
      console.log(error)
      logger.error("Error Reading Complaints");
      throw error
    }
    

  }

  static async viewListOfComplaintPaginatedRelies(uuid: string , limit?: number | null, offset?: number | null) {
      let _limit = 9;
      let _offset = 1;
      const findAllObject: { where? : { complaintId? : string } , limt?: number , offset?: number} | any =  {}
      console.log(uuid,'inner')
      if (limit) findAllObject.limt = limit;
      if (offset) findAllObject.offset = offset - 1;
      try {
      const complaint : Complaint | null = await Complaint.findByPk(uuid,{
        include: [{
          model: ComplaintReply,
          ...findAllObject,
          include: [Entity]
        }]
        
      })
      if(uuid){
        findAllObject.where = {}
        findAllObject.where.complaintId = uuid
      }
      const totalItems = await ComplaintReply.count({ where : findAllObject.where });
      console.log(totalItems)
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
        console.log(error)
        logger.error("Error Reading Complaints Relpies");
        throw error
      }

  }

  


}
