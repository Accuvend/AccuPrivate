import { NextFunction, Request, Response } from "express";
import ProductService from "../../services/Product.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import { randomUUID } from "crypto";

export default class ProductController {
    static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { masterProductCode, category, type, productName } = req.body as {
            masterProductCode: string,
            category: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE',
            type?: 'POSTPAID' | 'PREPAID',
            productName: string
        };

        if (!masterProductCode || !category || !type || !productName) {
            throw new BadRequestError('Master Product Code, Category, ProductName and Type are required');
        }

        const existingProductWithSameMasterProductCode = await ProductService.viewSingleProductByMasterProductCode(masterProductCode);
        if (existingProductWithSameMasterProductCode) {
            throw new BadRequestError('Product with same master product code already exists');
        }

        if (category === 'DATA' || category === 'AIRTIME') {
            if (!['MTN', 'GLO', 'AIRTEL', '9MOBILE'].includes(masterProductCode)) {
                throw new BadRequestError(`Master code for data must contain either MTN, GLO, AIRTEL, or 9MOBILE`);
            }
        }

        const data = { masterProductCode, category, type, id: randomUUID(), productName } as { masterProductCode: string, category: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE', type?: 'POSTPAID' | 'PREPAID', id: string, productName: string}
        ['DATA', 'AIRTIME'].includes(category) && delete data.type;

        const product = await ProductService.addProduct(data);

        res.status(201).json({
            status: 'success',
            data: {
                product,
            },
        });
    }

    static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { productId, masterProductCode, category, type, productName } = req.body as {
            productId: string,
            masterProductCode?: string,
            category?: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE',
            type?: 'POSTPAID' | 'PREPAID',
            productName?: string
        };

        if (!productId) {
            throw new BadRequestError('Product ID is required');
        }

        if (masterProductCode) {
            const existingProductWithSameMasterProductCode = await ProductService.viewSingleProductByMasterProductCode(masterProductCode);
            if (existingProductWithSameMasterProductCode) {
                throw new BadRequestError('Product with same master product code already exists');
            }
        }

        const product = await ProductService.viewSingleProduct(productId);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        if ((category === 'DATA' || category === 'AIRTIME') && productName) {
            const existingProductcodeWithSameName = await ProductService.viewProductCodeByProductName(productName);
            if (existingProductcodeWithSameName) {
                throw new BadRequestError('Product with same name already exists');
            }
        }

        const data = { masterProductCode, category, type, productName };
        const updatedProduct = await ProductService.updateProduct(productId, data);

        if (!updatedProduct) {
            throw new NotFoundError('Product not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                product: updatedProduct,
            },
        });
    }

    static async getAllProducts(req: Request, res: Response, next: NextFunction) {
        const { category, type } = req.query as { category?: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE', type?: 'POSTPAID' | 'PREPAID' };
        const query = { category, type };
        if (!category) delete query.category;
        if (!type) delete query.type;

        const products = await ProductService.getAllProducts(query);

        res.status(200).json({
            status: 'success',
            data: {
                products,
            },
        });
    }

    static async getProductInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { productId } = req.query as { productId: string };

        const product = await ProductService.viewSingleProduct(productId);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    }
}
