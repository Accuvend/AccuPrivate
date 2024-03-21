// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, HasMany, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import Transaction from "../../Transaction.model";
import ApiKey from "../../ApiKey.model";
import Entity from "../Entity.model";
import TeamMember from "./TeamMemberProfile.model";


// Define the "Partner" table model
@Table
export default class PartnerProfile extends Model<PartnerProfile | IPartnerProfile> {
    // Define a primary key field with a UUID (Universally Unique Identifier) as its type
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // Define a column for the Partner's email (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    // Define a column for the Partner's email (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: true })
    companyName: string;

    // Define a column for the Partner's email (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: true })
    address: string;

    @HasOne(() => Entity)
    entity?: Entity;

    // Establish a "HasMany" association with the "Transaction" model
    @HasMany(() => Transaction)
    transactions: Transaction[];

    @HasMany(() => TeamMember)
    teamMembers: TeamMember[];

    @HasMany(() => ApiKey)
    apiKeys: ApiKey[];


    @Column({ type: DataType.STRING, allowNull: false })
    key: string;

    @Column({ type: DataType.STRING, allowNull: false })
    sec: string;

}

// Interface representing the structure of a Partner entity
export interface IPartnerProfile {
    id: string;              // Unique identifier for the Partner
    email: string;   // Phone number for contacting the Partner
    companyName?: string;
    address?: string;
    key: string;
    sec: string;
}

export interface IPartnerStatsProfile  extends IPartnerProfile {
    stats ?: {
        failed_Transactions: number 
        pending_Transactions: number 
        success_Transactions: number
    }
}

export interface IPartnerProfileAssociations extends IPartnerProfile {
    transactions: Transaction[];
    entity?: Entity;
}

// Interface representing the structure for creating a new Partner (inherits from IPartner)
export interface ICreatePartnerProfile extends IPartnerProfile {
    // Inherits the properties from IPartner for creating a new Partner
}

// Interface for updating an existing Partner
export interface IUpdatePartnerProfile {
    // You can define specific properties here that are updatable for a Partner
    // This interface is intentionally left empty for flexibility
}
