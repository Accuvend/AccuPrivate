// Import necessary modules and dependencies
import { Table, Column, Model, DataType, HasOne, HasMany, IsUUID, PrimaryKey, Unique, BeforeCreate, ForeignKey, BelongsToMany, BelongsTo, Index } from "sequelize-typescript";
import VendorRates from './VendorRates.model';
import Product from "./Product.model";
import Vendor from "./Vendor.model";
import Bundle from "./Bundle.model";

// Define the Sequelize model for the "VendorProduct" table
@Table
export default class VendorProduct extends Model<IVendorProduct | VendorProduct> {
    // Unique identifier for the product code
    @IsUUID(4)
    @PrimaryKey
    @Unique
    @Column
    id: string;

    // Unique identifier for the vendor
    @ForeignKey(() => Vendor)
    @IsUUID(4)
    @Column({ type: DataType.STRING, allowNull: false })
    vendorId: string;

    // Unique identifier for the product
    @ForeignKey(() => Product)
    @IsUUID(4)
    @Column({ type: DataType.STRING, allowNull: false })
    productId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    productCode: string;

    @Column({ type: DataType.FLOAT, allowNull: true })
    bundleAmount: number;

    // Commission for the product
    @Column({ type: DataType.FLOAT, allowNull: false })
    commission: number;

    // Bonus for the product
    @Column({ type: DataType.FLOAT, allowNull: false })
    bonus: number;

    @Column({ type: DataType.STRING, allowNull: true })
    vendorCode: string;

    @Column({ type: DataType.STRING, allowNull: true })
    vendorName: string;

    // Schema data for the product
    @Column({ type: DataType.JSONB, allowNull: true })
    schemaData: {
        code: string
    } & Record<string, any>;

    // Vendor HTTP URL
    @Column({ type: DataType.STRING, allowNull: false })
    vendorHttpUrl: string;

    @ForeignKey(() => Bundle)
    @IsUUID(4)
    @Column({ type: DataType.STRING, allowNull: true })
    bundleId?: string;

    @BelongsTo(() => Bundle)
    bundle: Bundle;

    @Column({ type: DataType.STRING, allowNull: true })
    bundleCode?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    bundleName?: string;

    @BelongsTo(() => Vendor)
    vendor: Vendor;

    @BelongsTo(() => Product)
    product: Product;
}

export declare namespace VendorProductSchemaData {
    interface IRECHARGE {
        code: string
    }

    interface BUYPOWERNG {
        code: string
    }

    interface BAXI {
        code: string
    }
}

// Define an interface representing a product code (IVendorProduct) with various properties.
export interface IVendorProduct {
    id: string;
    vendorId: string;
    productId: string;
    commission: number;
    productCode: string;
    bonus: number;
    schemaData: {
        code: string
    } & Record<string, any>;
    vendorHttpUrl: string;
    vendorName: string;
    vendorCode: string;
    bundleCode?: string | null;
    bundleName?: string | null;
    bundleAmount?: number;
    bundleId?: string | null;
}
