
// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, ForeignKey, BelongsTo, HasMany, HasOne, BeforeCreate } from "sequelize-typescript";
import User from "./User.model";
import Partner from "./Entity/Profiles/PartnerProfile.model";
import Event from "./Event.model";
import PowerUnit from "./PowerUnit.model";
import Meter from "./Meter.model";
import { generateRandomString } from "../utils/Helper";
import { NigerianDate } from "../utils/Date";
import ProductCode from "./ProductCode.model";

// Define enums for status and payment type
export enum Status {
    COMPLETE = 'COMPLETE',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    FLAGGED = 'FLAGGED'
}

export enum PaymentType {
    REVERSAL = 'REVERSAL',
    PAYMENT = 'PAYMENT'
}

export enum TransactionType {
    AIRTIME = 'AIRTIME',
    ELECTRICITY = 'ELECTRICITY',
    DATA = 'DATA',
    CABLE = 'CABLE',
}

// Define the Sequelize model for the "Transaction" table
@Table
export default class DiscoStatus extends Model<IDiscoStatus | DiscoStatus> {
    // Unique identifier for the transaction
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Column({ type: DataType.ENUM('available', 'unavailable') })
    status: 'available' | 'unavailable';

    @Column({ type: DataType.STRING })
    disco: string;
}


// Define an interface representing a transaction (ITransaction) with various properties.
export interface IDiscoStatus {
    id: string;
    disco: string;
    status: 'available'  | 'unavailable';
}

