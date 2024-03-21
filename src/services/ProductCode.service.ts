// Import necessary types and the models
import { Transaction } from "sequelize";
import ProductCode, { IProductCode } from "../models/ProductCode.model";
import VendorRates, { IVendorRates } from "../models/VendorRates.model";
import { NotFoundError } from "../utils/Errors";

// ProductService class for handling product-related operations
export default class ProductService {
    // Method for adding a new product code to the database
    static async addProductCode(data: IProductCode, transaction?: Transaction): Promise<ProductCode> {
        const productCode = ProductCode.build(data);
        transaction ? await productCode.save({ transaction }) : await productCode.save();
        return productCode;
    }

    // Method for updating an existing product code
    static async updateProductCode(productCodeId: string, data: Partial<IProductCode>, transaction?: Transaction): Promise<ProductCode> {
        const productCode = await ProductCode.findByPk(productCodeId);
        if (!productCode) {
            throw new NotFoundError('Product code not found');
        }

        transaction ? await productCode.update(data, { transaction }) : await productCode.update(data);
        return productCode;
    }

    static async viewSingleProductCode(productCodeId: string, include = false): Promise<ProductCode | null> {
        const productCode = await ProductCode.findByPk(productCodeId, { include: include ? [VendorRates] : undefined });
        return productCode;
    }

    static async viewSingleProductCodeByCode(productCode: string, include = false): Promise<ProductCode | null> {
        const _productCode = await ProductCode.findOne({ where: { productCode }, include: include ? [VendorRates] : undefined });
        return _productCode;
    }

    // Method for adding a new vendor rate to the database
    static async addVendorRate(data: IVendorRates, transaction?: Transaction): Promise<VendorRates> {
        const vendorRate = VendorRates.build(data);
        transaction ? await vendorRate.save({ transaction }) : await vendorRate.save();
        return vendorRate;
    }

    static async viewSingleVendorRate(vendorRateId: string): Promise<VendorRates | null> {
        const vendorRate = await VendorRates.findByPk(vendorRateId);
        return vendorRate;
    }

    static async viewSingleVendorRateByNames(vendorName: string, discoCode: string): Promise<VendorRates | null> {
        const vendorRate = await VendorRates.findOne({ where: { vendorName, discoCode } });
        return vendorRate;
    }

    // Method for updating an existing vendor rate
    static async updateVendorRate(vendorRateId: string, data: Partial<IVendorRates>, transaction?: Transaction): Promise<VendorRates> {
        const vendorRate = await VendorRates.findByPk(vendorRateId);
        if (!vendorRate) {
            throw new Error('Vendor rate not found');
        }

        transaction ? await vendorRate.update(data, { transaction }) : await vendorRate.update(data);
        return vendorRate;
    }

    // Method for retrieving all product codes
    static async getAllProductCodes(include?: boolean): Promise<ProductCode[]> {
        const productCodes = await ProductCode.findAll({ where: {}, include: include ? [VendorRates] : undefined });
        return productCodes;
    }

    static async getProductCodesByType(type: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE', include?: boolean): Promise<ProductCode[]> {
        const productCodes = await ProductCode.findAll({ where: { type }, include: include ? [VendorRates] : undefined });
        return productCodes;
    }
    
    // Method for retrieving all vendor rates
    static async getAllVendorRates(): Promise<VendorRates[]> {
        const vendorRates = await VendorRates.findAll();
        return vendorRates;
    }
}
