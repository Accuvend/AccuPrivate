// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, HasMany } from "sequelize-typescript";
import Transaction from "./Transaction.model";

// Define the "Partner" table model
@Table
export default class Partner extends Model<Partner | IPartner> {

    // Define a primary key field with a UUID (Universally Unique Identifier) as its type
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // Define a column for the Partner's address (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: false })
    Company_address: string;

    // Define a column for the Partner's email (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: false })
    Company_email: string;

    // Define a column for the Partner's name (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: false })
    Company_name: string;

    // Define a column for the Partner's phone number (string type, not nullable)
    @Column({ type: DataType.STRING, allowNull: false })
    Contact_phone: string;

    // Establish a "HasMany" association with the "Transaction" model
    @HasMany(() => Transaction)
    Transactions: Transaction[];
}

// Interface representing the structure of a Partner entity
export interface IPartner {
    id: string;              // Unique identifier for the Partner
    Company_address: string; // Address of the Partner's company
    Company_email: string;   // Email address of the Partner's company
    Company_name: string;    // Name of the Partner's company
    Contact_phone: string;   // Phone number for contacting the Partner
}

// Interface representing the structure for creating a new Partner (inherits from IPartner)
export interface ICreatePartner extends IPartner {
    // Inherits the properties from IPartner for creating a new Partner
}

// Interface for updating an existing Partner
export interface IUpdatePartner {
    // You can define specific properties here that are updatable for a Partner
    // This interface is intentionally left empty for flexibility
}
