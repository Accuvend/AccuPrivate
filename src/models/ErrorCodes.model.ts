// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, BelongsTo, ForeignKey, HasMany, BelongsToMany, BeforeConnect, BeforeCreate, BeforeValidate, AllowNull } from "sequelize-typescript";
import User from "./User.model";
import PowerUnit from "./PowerUnit.model";
import Transaction from "./Transaction.model";
import Product from "./Product.model";
import VendorProduct from "./VendorProduct.model";
import Vendor from "./Vendor.model";

// Define the Sequelize model for the "ErrorCode" table
@Table
export default class ErrorCode extends Model<ErrorCode | IErrorCode> {
    // Unique identifier for the meter
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    httpCode: number

    @Column({ type: DataType.STRING, allowNull: true })
    category: string

    @Column({ type: DataType.STRING, allowNull: true })
    description: string

    @Column({ type: DataType.STRING, allowNull: true })
    accuvendDescription: string

    @Column({ type: DataType.INTEGER, allowNull: true })
    accuvendMasterResponseCode?: Number

    @Column({ type: DataType.STRING, allowNull: true })
    request: string

    @Column({ type: DataType.STRING, allowNull: true })
    STATUS_CODE: string

    @Column({ type: DataType.BOOLEAN, allowNull: true })
    STATUS_BOOLEAN: boolean

    @Column({ type: DataType.STRING, allowNull: true })
    STATUS: string

    @Column({ type: DataType.STRING, allowNull: true })
    CODE: string

    @Column({ type: DataType.STRING, allowNull: true })
    MSG: string


    @Column({ type: DataType.STRING, allowNull: true })
    vendor: string
}

// Interface to represent a ErrorCode object with specific properties
export interface IErrorCode {
    id: string
    httpCode?: number
    description?: string
    accuvendDescription?: string
    accuvendMasterResponseCode?: number
    category?: string
    request?: string
    vendor?: string
    STATUS_CODE?: string
    STATUS_BOOLEAN?: boolean
    STATUS?: string
    CODE?: string
    MSG?: string

}

// Interface to represent thep structure of data for creating a new ErrorCode
export interface ICreateErrorCode extends IErrorCode {
    // (You can add specific properties here if needed when creating a new meter)
}

// Interface to represent the structure of data for updating an existing ErrorCode
export interface IUpdateErrorCode {
    // (You can add specific properties here if needed when updating an existing meter)
}