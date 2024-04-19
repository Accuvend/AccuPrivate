// Import necessary types and the models
import { Op, Transaction, col, fn, literal } from "sequelize";
import VendorProduct, { IVendorProduct } from "../models/VendorProduct.model";
import Product from "../models/Product.model";
import Vendor from "../models/Vendor.model";
import { NotFoundError } from "../utils/Errors";

// VendorProductService class for handling vendor product-related operations
export default class VendorProductService {
    // Method for adding a new vendor product to the database
    static async addVendorProduct(
        data: IVendorProduct,
        transaction?: Transaction
    ): Promise<VendorProduct> {
        const vendorProduct = VendorProduct.build(data);
        transaction
            ? await vendorProduct.save({ transaction })
            : await vendorProduct.save();
        return vendorProduct;
    }

    // Method for updating an existing vendor product
    static async updateVendorProduct(
        vendorProductId: string,
        data: Partial<IVendorProduct>,
        transaction?: Transaction
    ): Promise<VendorProduct> {
        const vendorProduct = await VendorProduct.findByPk(vendorProductId);

        if (!vendorProduct) {
            throw new NotFoundError("Vendor Product not found");
        }

        const dataToUpdate = { ...data };
        if (dataToUpdate.schemaData) {
            dataToUpdate.schemaData = {
                ...vendorProduct.schemaData,
                ...dataToUpdate.schemaData,
            };
        }
        transaction
            ? await vendorProduct.update(dataToUpdate, { transaction })
            : await vendorProduct.update(dataToUpdate);
        return vendorProduct;
    }

    // Method for viewing a single vendor product
    static async viewSingleVendorProduct(
        vendorProductId: string
    ): Promise<VendorProduct | null> {
        const vendorProduct = await VendorProduct.findByPk(vendorProductId, {
            include: [Product, Vendor],
        });
        return vendorProduct;
    }

    // Method for retrieving all vendor products
    static async getAllVendorProducts(): Promise<VendorProduct[]> {
        const vendorProducts = await VendorProduct.findAll();
        return vendorProducts;
    }

    static async getAllVendorProductsByProductId(
        productId: string
    ): Promise<VendorProduct[]> {
        const vendorProducts = await VendorProduct.findAll({
            where: { productId },
        });
        return vendorProducts;
    }

    static async viewSingleVendorProductByVendorIdAndProductId(
        vendorId: string,
        productId: string
    ): Promise<VendorProduct | null> {
        const vendorProduct = await VendorProduct.findOne({
            where: { vendorId, productId },
        });
        return vendorProduct;
    }

    /**
     * Retrieves vendor products based on the specified bundle code.
     * @param {string} bundleCode - The bundle code to filter vendor products.
     * @returns {Promise<Array<VendorProduct> | Error>} A promise that resolves to an array of VendorProduct objects matching the bundle code, or throws Error if an exception occurs.
     */
    static async getVendorProductsforBundleCode(
        bundleCode: string
    ): Promise<Array<VendorProduct> | void> {
        try {
            // Find all vendor products matching the specified bundle code
            const vendorProducts: Array<VendorProduct> =
                await VendorProduct.findAll({ where: { bundleCode } });
            return vendorProducts;
        } catch (error) {
            // Return the error if an exception occurs during database operation
            throw error as Error;
        }
    }

    /**
     * Retrieves distinct vendor products based on the specified network provider.
     * @param {string} networkProvider - The network provider to filter vendor products.
     * @returns {Promise<Array<VendorProduct> | void>} A promise that resolves to an array of distinct VendorProduct objects based on the network provider, or throws an Error if an exception occurs.
     */
    static async getVendorProductsBasedOnProvider(
        networkProvider: string
    ): Promise<Array<VendorProduct> | void> {
        try {
            // Find distinct vendor products based on the specified network provider
            const vendorProducts: Array<VendorProduct> =
                await VendorProduct.findAll({
                    include: [
                        {
                            model: Product,
                            attributes: [["productName", "Network"]],
                            where: {
                                productName: networkProvider,
                                category: "DATA",
                            },
                        },
                    ],
                    attributes: [
                        // [fn("DISTINCT", col("bundle")), "bundleCode"],
                        [literal('DISTINCT "bundleCode" '),"bundleCode"],
                        "bundleName",
                    ],
                    where: {
                        bundleCode: {
                            [Op.not] : null
                        }, 
                        bundleName : {
                            [Op.not]: null
                        }
                    },
                    order: [
                        ["bundleCode", "ASC"]
                    ],
                    raw: true
                });
            return vendorProducts;
        } catch (error) {
            // Return the error if an exception occurs during database operation
            console.log(error)
            throw error as Error;
            
        }
    }
}
