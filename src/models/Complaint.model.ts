/**
 * Sequelize model for handling Complaint entities.
 * @remarks
 * This model defines the structure of the `Complaint` table in the database.
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
  HasMany
} from "sequelize-typescript";
import Entity from "./Entity/Entity.model";
import ComplaintReply from "./ComplaintReply.model";

// Define an enum for the status of complaint
export enum Status {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED'
}

@Table
export default class Complaint extends Model<Complaint | IComplaint> {
  /**
   * Unique identifier for the complaint.
   */
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  /**
   * Category of the complaint.
   */
  @Column({ type: DataType.STRING, allowNull: false })
  category: string;

  /**
   * Message associated with the complaint.
   */
  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  /**
   * Message associated with the complaint.
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  title: string;

  /**
   * Image URL for support.
   */
  @Column({ type: DataType.STRING, allowNull: true , defaultValue : '' })
  image: string;

  /** 
   * Foreign key reference to the Entity table, holding the UUIDv4 identifier of the associated entity for the complaint. 
   * */
  @ForeignKey(() => Entity)
  @IsUUID(4)
  @Column
  entityId: string;

  /**
   * Entity associated with the complaint.
   */
  @BelongsTo(() => Entity)
  entity: Entity;
  /**
   *  Status of the complain (open, pending, or closed)
   */
  @Column({ type: DataType.ENUM, values: Object.values(Status), defaultValue: Status.PENDING, allowNull: false })
  status: Status

  // List of complaint Replies attached to this complaint 
  @HasMany(()=>ComplaintReply)
  complaintReplies: ComplaintReply[];
}

/**
 * Interface representing the structure of a Complaint.
 */
export interface IComplaint {
  id?: string;
  category: string;
  message: string;
  image?: string;
  entity?: Entity;
  title: string;
  status: Status
}

/**
 * Interface representing the structure of a new Complaint for creation.
 */
export interface ICreateComplaint extends IComplaint {
  entityId?: string;
}

/**
 * Interface representing the structure of an updated Complaint.
 */
export interface IUpdateComplaint extends Partial<ICreateComplaint> {}
