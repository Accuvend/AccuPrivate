/**
 * Sequelize model for handling ComplaintReply entities.
 * @remarks
 * This model defines the structure of the `ComplaintReply` table in the database.
 *
 * @class
 * @extends Model
 */
import {
    Table,
    ForeignKey,
    Column,
    Model,
    DataType,
    IsUUID,
    PrimaryKey,
    BelongsTo,
  } from "sequelize-typescript";
  import Entity from "./Entity/Entity.model";
  import Complaint from "./Complaint.model";
  
  
  
  @Table
  export default class ComplaintReply extends Model<ComplaintReply | IComplaintReply> {
    /**
     * Unique identifier for the ComplaintReply.
     */
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
  
  
    /**
     * Message associated with the ComplaintReply.
     */
    @Column({ type: DataType.STRING, allowNull: false })
    message: string;
  
    /**
     * Message associated with the ComplaintReply.
     */
    // @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
    // title: string;
  
    /**
     * Image URL for support.
     */
    @Column({ type: DataType.STRING, allowNull: true , defaultValue : '' })
    image: string;
  
    /** 
     * Foreign key reference to the Entity table, holding the UUIDv4 identifier of the associated entity for the ComplaintReply. 
     * */
    @ForeignKey(() => Entity)
    @IsUUID(4)
    @Column
    entityId: string;
  
    /**
     * Entity associated with the ComplaintReply.
     */
    @BelongsTo(() => Entity)
    entity: Entity;


     /** 
     * Foreign key reference to the Complaint table, holding the UUIDv4 identifier of the associated Complaint for the ComplaintReply. 
     * */
     @ForeignKey(() => Complaint)
     @IsUUID(4)
     @Column
     complaintId: string;
   
     /**
      * Complaint associated with the ComplaintReply.
      */
     @BelongsTo(() => Complaint)
     complaint: Complaint;


    
  }
  
  /**
   * Interface representing the structure of a ComplaintReply.
   */
  export interface IComplaintReply {
    id?: string;
    message: string;
    image?: string;
    entity?: Entity;
    complaint?: Complaint
  }
  
  /**
   * Interface representing the structure of a new ComplaintReply for creation.
   */
  export interface ICreateComplaintReply extends IComplaintReply {
    entityId?: string;
  }
  
  /**
   * Interface representing the structure of an updated ComplaintReply.
   */
  export interface IUpdateComplaintReply extends Partial<ICreateComplaintReply> {}
  