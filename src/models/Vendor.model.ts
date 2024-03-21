// Import necessary modules and dependencies
import { Table, Column, Model, DataType, HasOne, HasMany, IsUUID, PrimaryKey, Unique, BeforeCreate, BelongsTo, BelongsToMany } from "sequelize-typescript";
import VendorRates from './VendorRates.model';
import VendorProduct from "./VendorProduct.model";
import Bundle from "./Bundle.model";

// Define the Sequelize model for the "Vendor" table
@Table
export default class Vendor extends Model<IVendor | Vendor> {
    // Unique identifier for the product code
    @IsUUID(4)
    @PrimaryKey
    @Unique
    @Column
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    name: string;

    @Column({ type: DataType.JSONB, allowNull: true })
    schemaData: {
        ELECTRICITY: Record<string, any>,
        AIRTIME: Record<string, any>,
        DATA: Record<string, any>,
        CABLE: Record<string, any>,
    };

    @HasMany(() => VendorProduct)
    vendorProducts: VendorProduct[];

    @BelongsToMany(() => Bundle, () => VendorProduct)
    bundles: Bundle[];

    @BeforeCreate
    static async capitalizeVendorName(instance: Vendor) {
        instance.name = instance.name.toUpperCase();
    }

    @BeforeCreate
    static async trimVendorName(instance: Vendor) {
        instance.name = instance.name.trim();
    }
}

// Define an interface representing a product code (IVendor) with various properties.
export interface IVendor {
    id: string;
    name: string;
    schemaData: {
        ELECTRICITY: Record<string, any>,
        AIRTIME: Record<string, any>,
        DATA: Record<string, any>,
        CABLE: Record<string, any>,
    }
}
