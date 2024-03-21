// Import necessary modules and dependencies
import { Table, Column, Model, DataType, HasOne, HasMany, IsUUID, PrimaryKey, Unique, BeforeCreate } from "sequelize-typescript";
import VendorRates from './VendorRates.model';
import VendorProduct from "./VendorProduct.model";
import Bundle from "./Bundle.model";

// Define the Sequelize model for the "Product" table
@Table
export default class Product extends Model<IProduct | Product> {
    // Unique identifier for the product code
    @IsUUID(4)
    @PrimaryKey
    @Unique
    @Column
    id: string;

    // TODO: add unique constraint only when category is not DATA
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    masterProductCode: string;

    @Column({ type: DataType.ENUM('AIRTIME', 'ELECTRICITY', 'DATA', 'CABLE'), allowNull: false })
    category: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE';

    // Type of the product code (POSTPAID or PREPAID)
    @Column({ type: DataType.ENUM('POSTPAID', 'PREPAID'), allowNull: true })
    type?: 'POSTPAID' | 'PREPAID';

    @Column({ type: DataType.STRING, allowNull: false })
    productName: string;

    @Column({ type: DataType.FLOAT, allowNull: true })
    amount?: number;

    @HasMany(() => VendorProduct)
    vendorProducts: VendorProduct[];

    @HasMany(() => Bundle)
    bundles: Bundle[];
    
    @BeforeCreate
    static async checkIfProductNameIsValidForDataAndAirtime(instance: Product) {
        if (instance.category === 'DATA' || instance.category === 'AIRTIME') {
            console.log({ datavalue: instance.dataValues })

            // Check if MTN, GLO, AIRTEL, or 9MOBILE is in the product name
            const mtn = instance.productName?.includes('MTN');
            const glo = instance.productName?.includes('GLO');
            const airtel = instance.productName?.includes('AIRTEL');
            const nineMobile = instance.productName?.includes('9MOBILE');

            if (instance.category === 'AIRTIME' && !(mtn || glo || airtel || nineMobile)) {
                throw new Error(`Master code for airtime must contain either MTN, GLO, AIRTEL, or 9MOBILE`);
            }
        }
    }
}


// Define an interface representing a product code (IProduct) with various properties.
export interface IProduct {
    id: string;
    masterProductCode: string; // Unique identifier for the product code
    type?: 'POSTPAID' | 'PREPAID'; // Type of the product code (POSTPAID or PREPAID)
    category: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE';
    productName?: string,
    amount?: number;
}


export interface IUpdateProduct {
    masterProductCode?: string;
    type?: 'POSTPAID' | 'PREPAID';
    amount?: number;
    productName: string;
}