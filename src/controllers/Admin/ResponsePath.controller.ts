import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../../utils/Interface";
import ResponsePathService from "../../services/ResponsePath.service";
import { randomUUID } from "crypto";
import VendorService from "../../services/Vendor.service";
import fs from 'fs'

export default class ResponsePathController {
    static async seedResponsePatsh(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        const filePath = __dirname + '/../../models/response_path.csv'

        // Read CSV file
        const csvData = fs.readFileSync(filePath, 'utf-8');

        // Parse CSV data
        // It has columns, id, Path, Vendor, AccuvendRefCode, RequestType, description
        const rows = csvData.split('\n');
        const data = rows.map(row => {
            const [id, path, vendor, accuvendRefCode, requestType, description] = row.split(',');

            return {
                id,
                path,
                vendor,
                accuvendRefCode,
                requestType,
                description
            };
        });

        // Seed data
        for (const row of data.slice(1)) {
            const { id, path, vendor, accuvendRefCode, requestType, description } = row;

            console.log({ row })
            await ResponsePathService.addResponsePath({
                id,
                path,
                vendor,
                accuvendRefCode,
                requestType,
                description
            });
        }
        console.log('Data seeded successfully!');


        res.status(200).send({
            message: 'Success',
            success: true,
            data: {}
        })
    }
    static async createResponsePath(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        const {
            path, accuvendRefCode, description, requestType, vendor
        } = req.body

        // const existingVendor = await VendorService.viewSingleVendor(vendorId)
        // if (!existingVendor) {
        //     res.status(400).send({
        //         success: false,
        //         message: "Vendor does not exist",
        //         data: {},
        //     });
        //     return
        // }
        const responsePath = await ResponsePathService.addResponsePath({
            path, accuvendRefCode, description, requestType, id: randomUUID(), vendor
        })

        res.status(200).send({
            success: true,
            message: "Response path created successfully",
            data: { responsePath },
        });
    }

    static async getResponsePaths(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        const responsePaths = await ResponsePathService.viewAllResponsePaths()

        res.status(200).send({
            success: true,
            message: "Response path fetched successfully",
            data: { responsePaths },
        });
    }

    static async getResponsePathInfo(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        const responsePathId = req.query.responsePathId as string;
        const responsePath = await ResponsePathService.viewSingleResponsePathById(responsePathId, { include: true })

        res.status(200).send({
            success: true,
            message: "Response path fetched successfully",
            data: { responsePath },
        });
    }

    static async updateResponsePath(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        const {
            path, accuvendRefCode, description, requestType
        } = req.body
        const responsePathId = req.body.responsePathId;
        const responsePath = await ResponsePathService.updateResponsePath(responsePathId, {
            path, accuvendRefCode, description, requestType
        })

        res.status(200).send({
            success: true,
            message: "Response path updated successfully",
            data: { responsePath },
        });
    }
}

async function seedDataFromCSV(filePath: string) {
    try {

    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

