import { NextFunction, Request, Response } from "express";
import VendorProductService from "../../services/VendorProduct.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import { randomUUID } from "crypto";
import ProductService from "../../services/Product.service";
import VendorService from "../../services/Vendor.service";
import BundleService from "../../services/Bundle.service";

export default class VendorProductController {
    static async createVendorProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { vendorId, productId, commission, bonus, schemaData, vendorHttpUrl, amount, bundleId } = req.body as {
            vendorId: string,
            productId: string,
            bundleId: string,
            commission: number,
            bonus: number,

            schemaData: { code: string },
            vendorHttpUrl: string,
            amount: number,
        };

        if (!vendorId || !productId || (!commission && commission !== 0) || ( !bonus && bonus !== 0) || !schemaData || !vendorHttpUrl) {
            throw new BadRequestError('Vendor ID, Product ID, Commission, Bonus, Schema Data, and Vendor HTTP URL are required');
        }

        const vendor = await VendorService.viewSingleVendor(vendorId);
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        const docWithSameVendorIdAndProductId = await VendorProductService.viewSingleVendorProductByVendorIdAndProductId(vendorId, productId);
        if (docWithSameVendorIdAndProductId) {
            throw new BadRequestError('Vendor Product with same Vendor ID and Product ID already exists');
        }

        const product = await ProductService.viewSingleProduct(productId);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        if (bundleId) {
            const bundle = await BundleService.viewSingleBundleById(bundleId);
            if (!bundle) {
                throw new NotFoundError('Bundle not found');
            }
        } else if (product.category === 'DATA') {
            throw new BadRequestError('Bundle ID is required for Data product');
        }

        if (product.category === 'DATA' && !amount) {
            throw new BadRequestError('Amount is required for Data product');
        }

        const data = { vendorId, vendorName: vendor.name, vendorCode: schemaData.code, productId, commission, bonus, bundleId, bundleAmount: amount, schemaData, vendorHttpUrl, id: randomUUID(), productCode: product.masterProductCode };
        const vendorProduct = await VendorProductService.addVendorProduct(data);

        res.status(201).json({
            status: 'success',
            data: {
                vendorProduct,
            },
        });
    }

    static async updateVendorProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { vendorProductId, vendorCode, bundleAmount, commission, bonus, vendorHttpUrl } = req.body as {
            vendorProductId: string,
            commission?: number,
            bundleAmount?: number,
            vendorCode?: string,
            bonus?: number,
            vendorHttpUrl?: string,
        };

        let { schemaData } = req.body as { schemaData: { code: string } };

        if (!vendorProductId) {
            throw new BadRequestError('Vendor Product ID is required');
        }

        const vendorProduct = await VendorProductService.viewSingleVendorProduct(vendorProductId);
        if (!vendorProduct) {
            throw new NotFoundError('Vendor Product not found');
        }

        if (schemaData && vendorProduct.schemaData) {
            schemaData = { ...vendorProduct.schemaData, ...schemaData };
        }
        const data = { commission, vendorCode, bundleAmount, bonus, schemaData, vendorHttpUrl };
        const updatedVendorProduct = await VendorProductService.updateVendorProduct(vendorProductId, data);

        if (!updatedVendorProduct) {
            throw new NotFoundError('Vendor Product not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                vendorProduct: updatedVendorProduct,
            },
        });
    }

    static async getAllVendorProducts(req: Request, res: Response, next: NextFunction) {
        const productId = req.query.productId as string;

        const vendorProducts = productId ? await VendorProductService.getAllVendorProductsByProductId(productId) : await VendorProductService.getAllVendorProducts();

        res.status(200).json({
            status: 'success',
            data: {
                vendorProducts,
            },
        });
    }

    static async getVendorProductInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { vendorProductId } = req.query as { vendorProductId: string };

        const vendorProduct = await VendorProductService.viewSingleVendorProduct(vendorProductId);

        if (!vendorProduct) {
            throw new NotFoundError('Vendor Product not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                vendorProduct,
            },
        });
    }
}
