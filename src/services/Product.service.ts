// Import necessary types and the models
import { Transaction } from "sequelize";
import Product, { IProduct, IUpdateProduct } from "../models/Product.model";
import VendorProduct from "../models/VendorProduct.model";
import { NotFoundError } from "../utils/Errors";
import Bundle from "../models/Bundle.model";

// ProductService class for handling product-related operations
export default class ProductService {
    // Method for adding a new product to the database
    static async addProduct(data: IProduct, transaction?: Transaction): Promise<Product> {
        const product = Product.build(data);
        transaction ? await product.save({ transaction }) : await product.save();
        return product;
    }

    // Method for updating an existing product
    static async updateProduct(productId: string, data: Partial<IUpdateProduct>, transaction?: Transaction): Promise<Product> {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        transaction ? await product.update(data, { transaction }) : await product.update(data);
        return product;
    }

    // Method for viewing a single product
    static async viewSingleProduct(productId: string): Promise<Product | null> {
        const product = await Product.findByPk(productId, { include: [VendorProduct, Bundle] });
        return product;
    }

    static async viewProductCodeByProductName(productName: string): Promise<Product | null> {
        const product = await Product.findOne({ where: { productName }, include: [VendorProduct, Bundle] });
        return product;
    }

    static async viewSingleProductByNameAndCategory(productName: string, category: string): Promise<Product | null> {
        const product = await Product.findOne({ where: { productName, category }, include: [VendorProduct, Bundle] });
        return product;
    }

    static async viewSingleProductByProductNameAndVendType(productName: string, vendType: string): Promise<Product | null> {
        const product = await Product.findOne({ where: { productName, type: vendType }, include: [VendorProduct, Bundle] });
        return product;
    }

    static async viewSingleProductByMasterProductCode(masterProductCode: string): Promise<Product | null> {
        const product = await Product.findOne({ where: { masterProductCode }, include: [VendorProduct, Bundle] });
        return product;
    }

    // Method for retrieving all products
    static async getAllProducts(query?: { category?: IProduct['category'], type?: IProduct['type'] }): Promise<Product[]> {
        console.log({ query })
        const products = await Product.findAll({ where: query ?? {}, include: [Bundle] });
        return products;
    }    
}