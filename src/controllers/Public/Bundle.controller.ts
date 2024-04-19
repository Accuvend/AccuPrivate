import { NextFunction, Request, Response } from "express";
import { BadRequestError, InternalServerError } from "../../utils/Errors";
import BundleService from "../../services/Bundle.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import { randomUUID } from "crypto";
import VendorModelService from '../../services/Vendor.service'
require('newrelic');

export default class ApiController {
    static async getDataBundles(req: Request, res: Response, next: NextFunction) {
        const { productId } = req.query as Record<string, string>
        const bundles = productId ? await BundleService.viewBundlesByProductId(productId) : await BundleService.viewAllBundles();
        res.status(200).json({
            status: 'success',
            message: 'Bundles retrieved successfully',
            data: { bundles }
        });
    }

    static async getSingleDataBundle(req: Request, res: Response, next: NextFunction) {
        const { bundleCode, bundleId } = req.query as Record<string, string>

        if (!bundleCode && !bundleId) {
            throw new BadRequestError('Bundle code or id is required');
        }

        let bundle;
        if (bundleCode) {
            bundle = await BundleService.viewSingleBundleByBundleCode(bundleCode);
        } else {
            bundle = await BundleService.viewSingleBundleById(bundleId);
        }

        if (!bundle) {
            throw new InternalServerError('Bundle not found');
        }

        res.status(200).json({
            status: 'success',
            message: 'Bundle retrieved successfully',
            data: { bundle }
        });
    }

    static async addNewBundle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { productId, bundleCode, bundleName, amount, bonus, commission, vendorIds, validity } = req.body as {
            productId: string,
            bundleCode: string,
            bundleName: string,
            amount: number,
            bonus: number,
            validity: string,
            vendorIds: string[],
            commission: number
        };

        if (!productId || !bundleCode || !bundleName || !amount || !vendorIds) {
            throw new BadRequestError('ProductId, BundleCode, BundleName, Amount, Bonus and Commission are required');
        }

        if (vendorIds.length < 1) {
            throw new BadRequestError('At least one vendor ID is required');
        }

        for (const vendorId of vendorIds) {
            const vendor = await VendorModelService.viewSingleVendor(vendorId);
            if (!vendor) {
                throw new BadRequestError('Vendor not found');
            }
        }

        const bundle = await BundleService.addBundle({ productId, bundleCode, bundleName, bundleAmount: amount, id: randomUUID(), validity, vendorIds });
        res.status(201).json({
            status: 'success',
            message: 'Bundle added successfully',
            data: { bundle }
        });
    }

    static async updateBundle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { bundleId, bundleCode, bundleName, amount, vendorIds, validity } = req.body as {
            bundleId: string,
            bundleCode: string,
            bundleName: string,
            amount: number,
            validity: string,
            vendorIds: string[],
        };

        if (!bundleId) {
            throw new BadRequestError('Bundle ID is required');
        }

        const bundle = await BundleService.viewSingleBundleById(bundleId);
        if (!bundle) {
            throw new InternalServerError('Bundle not found');
        }

        for (const vendorId of vendorIds) {
            const vendor = await VendorModelService.viewSingleVendor(vendorId);
            if (!vendor) {
                throw new BadRequestError('Vendor not found');
            }
        }

        const data = { bundleCode, bundleName, bundleAmount: amount, validity, vendorIds };
        const updatedBundle = await BundleService.updateBundle(bundleId, data);
        if (!updatedBundle) {
            throw new InternalServerError('Bundle not found');
        }

        res.status(200).json({
            status: 'success',
            message: 'Bundle updated successfully',
            data: { updatedBundle }
        });
    }
}
