/**
 * Sequelize model for handling ZohoIntegrationSettings entities.
 * @remarks
 * This model defines the structure of the `ZohoIntegrationSettings.` table in the database.
 *
 * @class
 * @extends Model
 */
import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table
export default class ZohoIntegrationSettings extends Model<ZohoIntegrationSettings | IZohoIntegrationSettings> {
  /**
   * Unique identifier for the complaint.
   */
  // @IsUUID(4)
  // @PrimaryKey
  // @Column
  // id: string;

  /**
   * Refresh token to call zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  refreshtoken: string;


  /**
   * Authorization Code to call zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  authorizationcode: string;

  /**
   * Access token to call Zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  accesstoken: string;

  /**
   * Client Id to call Zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  clientid: string;


  /**
   * Client Secret to call Zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  clientsecret: string;

  /**
   * RedirectUrl to call Zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  redirecturl: string;

  /**
   *  Organization Id to call Zoho Endpoint
   */
  @Column({ type: DataType.STRING, allowNull: false , defaultValue : '' })
  organizationId: string;
}

/**
 * Interface representing the structure of a Complaint.
 */
export interface IZohoIntegrationSettings {


  /**
   * Refresh token to call zoho Endpoint
   */
  refreshtoken: string;

  /**
   * Authorization Code to call zoho Endpoint
   */
  authorizationcode: string;

  /**
   * Access token to call Zoho Endpoint
   */
  accesstoken: string;

  /**
   * Client Id to call Zoho Endpoint
   */
  clientid: string;


  /**
   * Client Secret to call Zoho Endpoint
   */
  clientsecret: string;

  /**
   * RedirectUrl to call Zoho Endpoint
   */
  redirecturl: string;

  /**
   *  Organization Id to call Zoho Endpoint
   */
  organizationId: string;
}

/**
 * Interface representing the structure of a new ZohoIntegrationSettings for creation.
 */
export interface ICreateZohoIntegrationSettings extends IZohoIntegrationSettings {
}

/**
 * Interface representing the structure of an updated ZohoIntegrationSettings.
 */
export interface IUpdateZohoIntegrationSettings extends Partial<ICreateZohoIntegrationSettings> {}
