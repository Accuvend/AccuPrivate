import { NextFunction, Request, Response } from "express";
import VendorService from "../../services/Vendor.service";
import { AuthenticatedRequest } from "../../utils/Interface";
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import { randomUUID } from "crypto";

export default class VendorController {

    static async createVendor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { name, schemaData } = req.body as { name: string, schemaData: {
            ELECTRICITY: Record<string, any>,
            AIRTIME: Record<string, any>,
            DATA: Record<string, any>,
            CABLE: Record<string, any>,
        } };

        if (!name) {
            throw new BadRequestError('Name is required');
        }

        const existingVendorWithSameName = await VendorService.viewSingleVendorByName(name);
        if (existingVendorWithSameName) {
            throw new BadRequestError('Vendor with same name already exists');
        }

        const data = { name, id: randomUUID(), schemaData };
        const vendor = await VendorService.addVendor(data);

        res.status(201).json({
            status: 'success',
            data: {
                vendor,
            },
        });
    }

    static async updateVendor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { vendorId, name } = req.body as { vendorId: string, name?: string };

        if (!vendorId) {
            throw new BadRequestError('Vendor ID is required');
        }

        if (!name) {
            throw new BadRequestError('Name is required');
        }

        const existingVendorWithSameName = await VendorService.viewSingleVendorByName(name);
        if (existingVendorWithSameName) {
            throw new BadRequestError('Vendor with same name already exists');
        }

        const data = { name };
        const updatedVendor = await VendorService.updateVendor(vendorId, data);

        if (!updatedVendor) {
            throw new NotFoundError('Vendor not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                vendor: updatedVendor,
            },
        });
    }

    static async getAllVendors(req: Request, res: Response, next: NextFunction) {
        const vendors = await VendorService.getAllVendors();

        res.status(200).json({
            status: 'success',
            data: {
                vendors,
            },
        });
    }

    static async getVendorInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { vendorId } = req.query as { vendorId: string };

        const vendor = await VendorService.viewSingleVendor(vendorId);

        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        res.status(200).json({
            status: 'success',
            data: {
                vendor,
            },
        });
    }
}
