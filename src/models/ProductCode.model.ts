// Import necessary modules and dependencies
import { Table, Column, Model, DataType, HasOne, HasMany, IsUUID, PrimaryKey, Unique, BeforeCreate } from "sequelize-typescript";
import VendorRates from './VendorRates.model';

// Define the Sequelize model for the "ProductCode" table
@Table
export default class ProductCode extends Model<IProductCode | ProductCode> {
    // Unique identifier for the product code
    @IsUUID(4)
    @PrimaryKey
    @Unique
    @Column
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    productCode: string;

    // Location associated with the product code
    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @Column({ type: DataType.ENUM('AIRTIME', 'ELECTRICITY', 'DATA', 'CABLE'), allowNull: false })
    type: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE';

    @Column({ type: DataType.FLOAT, allowNull: true })
    amount: number;

    @Column({ type: DataType.STRING, allowNull: true })
    network: string;

    // Type of the product code (POSTPAID or PREPAID)
    @Column({ type: DataType.ENUM('POSTPAID', 'PREPAID'), allowNull: false })
    vendType: 'POSTPAID' | 'PREPAID';

    // Has many associated VendorRates
    @HasMany(() => VendorRates)
    vendorRates: VendorRates[];

    @BeforeCreate
    static async checkIfProductCodeForDataHasAmount(instance: ProductCode) {
        if (instance.type === 'DATA' && (!instance.amount || !instance.network)) {
            throw new Error('Amount and network are required for data product codes');
        }
    }
}

// Define an interface representing a product code (IProductCode) with various properties.
export interface IProductCode {
    id: string;
    productCode: string; // Unique identifier for the product code
    location: string; // Location associated with the product code
    vendType: 'POSTPAID' | 'PREPAID'; // Type of the product code (POSTPAID or PREPAID)
    type: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE';
    amount: number | undefined;
    network: string | undefined;
}
