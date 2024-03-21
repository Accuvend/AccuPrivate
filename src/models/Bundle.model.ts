// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, BelongsTo, ForeignKey, HasMany, BelongsToMany, BeforeConnect, BeforeCreate, BeforeValidate } from "sequelize-typescript";
import User from "./User.model";
import PowerUnit from "./PowerUnit.model";
import Transaction from "./Transaction.model";
import Product from "./Product.model";
import VendorProduct from "./VendorProduct.model";
import Vendor from "./Vendor.model";

// Define the Sequelize model for the "Bundle" table
@Table
export default class Bundle extends Model<Bundle | IBundle> {
    // Unique identifier for the meter
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @ForeignKey(() => Product)
    @IsUUID(4)
    @Column
    productId: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: false })
    validity: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    bundleCode: string;

    @Column({ type: DataType.STRING, allowNull: false })
    bundleName: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    bundleAmount: number;

    @HasMany(() => VendorProduct)
    vendorProducts: VendorProduct[];

    @ForeignKey(() => Vendor)
    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
    vendorIds: string[];

    @HasMany(() => Vendor, 'vendorIds')
    vendors: Vendor[];

    @HasMany(() => Transaction)
    transactions: Transaction[];

    @BelongsTo(() => Product)
    product: Product;

    @BeforeValidate
    static validateArraySize(instance: Bundle, options: any) {
        if (instance.vendorIds && instance.vendorIds.length < 1) {
            throw new Error('Your array must contain at least 1 elements');
        }
    }
}

// Interface to represent a Bundle object with specific properties
export interface IBundle {
    id: string;          // Unique identifier for the meter
    productId: string;      // Identifier of the associated user
    validity: string;     // address associated with the meter
    bundleCode: string; // Meter number for identification
    bundleName: string;      // Disco name for meter
    bundleAmount: number;
    vendorIds: string[];
}

// Interface to represent thep structure of data for creating a new Bundle
export interface ICreateBundle extends IBundle {
    // (You can add specific properties here if needed when creating a new meter)
}

// Interface to represent the structure of data for updating an existing Bundle
export interface IUpdateBundle {
    // (You can add specific properties here if needed when updating an existing meter)
}