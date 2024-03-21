import { NextFunction, Request, Response } from "express";
import ProductService from "../../services/ProductCode.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import { randomUUID } from "crypto";
require('newrelic');

export default class ProductController {

    static async createProductCode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { location, type, code, vendType, amount, network } = req.body as {
            code: string, location: string,
            type: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE',
            vendType: 'POSTPAID' | 'PREPAID',
            amount?: number,
            network?: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE'
        };

        if (!location || !type) {
            throw new BadRequestError('Location and type are required');
        }

        const data = { location, type, productCode: code, id: randomUUID(), vendType, amount, network };
        const productCode = await ProductService.addProductCode(data);

        res.status(201).json({
            status: 'success',
            data: {
                productCode,
            },
        });
    }

    static async updateProductCode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { location, productCodeId, amount, network, code } = req.body as { productCodeId: string, code: string, location?: string, amount?: number, network?: 'MTN' | 'GLO' | 'AIRTEL' | '9MOBILE' };

        if (!location) {
            // throw new BadRequestError('Location or type is required');
        }

        const data = { location, amount, network, productCode: code };
        const updatedProductCode = await ProductService.updateProductCode(productCodeId, data);

        if (!updatedProductCode) {
            throw new NotFoundError('Product code not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                productCode: updatedProductCode,
            },
        });
    }

    static async getAllProductCodes(req: Request, res: Response, next: NextFunction) {
        const { type } = req.query as { type: 'AIRTIME' | 'ELECTRICITY' | 'DATA' | 'CABLE' };
        const productCodes = type ? await ProductService.getProductCodesByType(type, true) : await ProductService.getAllProductCodes();

        res.status(200).json({
            status: 'success',
            data: {
                productCodes,
            },
        });
    }

    static async getInfoForProductCode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { productCodeId } = req.query as { productCodeId: string };

        const productCode = await ProductService.viewSingleProductCode(productCodeId, true);

        if (!productCode) {
            throw new NotFoundError('Product code not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                productCode,
            },
        });
    }
}
