// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, BelongsTo, ForeignKey, HasMany, BelongsToMany, BeforeConnect, BeforeCreate, BeforeValidate } from "sequelize-typescript";
import User from "./User.model";
import PowerUnit from "./PowerUnit.model";
import Transaction from "./Transaction.model";
import Product from "./Product.model";
import VendorProduct from "./VendorProduct.model";
import Vendor from "./Vendor.model";

// Define the Sequelize model for the "ResponsePath" table
@Table
export default class ResponsePath extends Model<ResponsePath | IResponsePath> {
    // Unique identifier for the meter
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    vendor: string

    @Column({ type: DataType.STRING, allowNull: true })
    path: string

    @Column({ type: DataType.STRING, allowNull: true })
    accuvendRefCode: string
    
    @Column({ type: DataType.STRING, allowNull: true })
    description: string

    @Column({ type: DataType.STRING, allowNull: false })
    requestType: string
}

// Interface to represent a ResponsePath object with specific properties
export interface IResponsePath {
    id: string
    vendor: string
    path?: string
    description?: string
    accuvendRefCode?: string
    requestType: string
}

// Interface to represent thep structure of data for creating a new ResponsePath
export interface ICreateResponsePath extends IResponsePath {
    // (You can add specific properties here if needed when creating a new meter)
}

// Interface to represent the structure of data for updating an existing ResponsePath
export interface IUpdateResponsePath {
    // (You can add specific properties here if needed when updating an existing meter)
}