// Import necessary modules and dependencies
import { Table, Column, Model, DataType, BelongsTo, ForeignKey, IsUUID, PrimaryKey, Unique } from "sequelize-typescript";
import ProductCode from "./ProductCode.model";

// Define the Sequelize model for the "VendorRates" table
@Table
export default class VendorRates extends Model<IVendorRates | VendorRates> {
    // Unique identifier for the vendor rates
    @IsUUID(4)
    @PrimaryKey
    @Unique
    @Column
    id: string;

    // Vendor name (e.g., Baxi, BuyPower, iRecharge)
    @Column({ type: DataType.ENUM('IRECHARGE', 'BUYPOWERNG', 'BAXI'), allowNull: false })
    vendorName: 'IRECHARGE' | 'BUYPOWERNG' | 'BAXI';

    // Disco code associated with the vendor
    @Column({ type: DataType.STRING, allowNull: false })
    discoCode: string;

    // Commission rate for the vendor
    @Column({ type: DataType.FLOAT, allowNull: false })
    commission: number;

    @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
    bonus: number;

    @Column({ type: DataType.STRING, allowNull: true })
    title: string;

    @Column({ type: DataType.STRING, allowNull: true })
    validity: string;

    // Foreign key for the associated ProductCode
    @ForeignKey(() => ProductCode)
    @IsUUID(4)
    @Column
    productCodeId: string;

    // Belongs to a ProductCode
    @BelongsTo(() => ProductCode)
    productCode: ProductCode;
}

// Define an interface representing vendor rates (IVendorRates) with various properties.
export interface IVendorRates {
    id: string; // Unique identifier for the vendor rates
    vendorName: 'IRECHARGE' | 'BUYPOWERNG' | 'BAXI'; // Vendor name (e.g., Baxi, BuyPower, iRecharge)
    discoCode: string; // Disco code associated with the vendor
    commission: number; // Commission rate for the vendor
    productCodeId: string; // Unique identifier of the associated ProductCode
    bonus: number;
    title: string | undefined;
    validity: string | undefined;
}
