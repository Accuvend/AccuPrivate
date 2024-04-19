import { NextFunction, Request, Response } from "express";
import ErrorCode, { ICreateErrorCode, IErrorCode } from "../../models/ErrorCodes.model";
import ErrorCodeService from "../../services/ErrorCodes.service";
import { NotFoundError } from "../../utils/Errors";
import { randomUUID } from "crypto";
import { AuthenticatedRequest } from "../../utils/Interface";
import fs from 'fs'

export default class ErrorCodeController {
    static async seedResponsePatsh(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        const filePath = __dirname + '/../../models/erro_codes.csv'

        // Read CSV file
        const csvData = fs.readFileSync(filePath, 'utf-8');

        // Parse CSV data
        // It has columns, id, Path, Vendor, AccuvendRefCode, RequestType, description
        const rows = csvData.split('\n');
        const data = rows.map(row => {
            const [httpCode, STATUS_CODE, STATUS, STATUS_BOOLEAN, CODE, MSG, category, description, accuvendMasterResponseCode, accuvendDescription, request, vendor] = row.split(',');

            return {
                id: randomUUID(),
                httpCode,
                STATUS_CODE,
                STATUS,
                STATUS_BOOLEAN: STATUS_BOOLEAN === 'TRUE' ? true : false,
                CODE,
                MSG,
                category,
                description,
                accuvendMasterResponseCode,
                accuvendDescription,
                request,
                vendor
            };
        });

        // Seed data
        for (const row of data.slice(1)) {
            const { id, httpCode,
                STATUS_CODE,
                STATUS_BOOLEAN,
                STATUS,
                CODE,
                MSG,
                category,
                description,
                accuvendMasterResponseCode,
                accuvendDescription,
                request,
                vendor } = row;

            console.log({ row })
            await ErrorCodeService.addErrorCode({
                id,
                httpCode: httpCode ? parseInt(httpCode?.toString(), 10) : undefined,
                category,
                description,
                STATUS_CODE,
                STATUS_BOOLEAN,
                STATUS,
                CODE,
                MSG,
                accuvendMasterResponseCode: accuvendMasterResponseCode ? parseInt(accuvendMasterResponseCode?.toString(), 10) : undefined,
                accuvendDescription,
                request,
                vendor: vendor?.toUpperCase().replace('\r', '')
            });
        }
        console.log('Data seeded successfully!');


        res.status(200).send({
            message: 'Success',
            success: true,
            data: {}
        })
    }

    static async createErrorCode(req: Request, res: Response): Promise<void> {
        const {
            httpCode, description, accuvendDescription, accuvendMasterResponseCode, request, vendor,
            STATUS_CODE, STATUS_BOOLEAN, STATUS, CODE, MSG
        }: ICreateErrorCode = req.body;
        const errorCodeData: ICreateErrorCode = {
            id: randomUUID(), httpCode,  description, accuvendDescription, accuvendMasterResponseCode, request, vendor,
            STATUS_CODE, STATUS_BOOLEAN, STATUS, CODE, MSG
        };
        const newErrorCode = await ErrorCodeService.addErrorCode(errorCodeData);
        res.status(201).send({ success: true, message: "ErrorCode created successfully", data: { errorCode: newErrorCode } });
    }

    static async getAllErrorCodes(req: Request, res: Response): Promise<void> {
        const errorCodes: ErrorCode[] = await ErrorCodeService.getAllErrorCodes();
        res.status(200).send({ success: true, message: "ErrorCodes retrieved successfully", data: errorCodes });
    }

    static async getErrorCodeById(req: Request, res: Response): Promise<void> {
        const { errorCodeId } = req.query as Record<string, string>;
        const errorCode: ErrorCode | null = await ErrorCodeService.getErrorCodeById(errorCodeId);
        if (!errorCode) {
            throw new NotFoundError("ErrorCode not found")
            return;
        }
        res.status(200).send({ success: true, message: "ErrorCode retrieved successfully", data: { errorCode } });
    }

    static async updateErrorCode(req: Request, res: Response): Promise<void> {
        const { errorCodeId, httpCode,
            category,
            description,
            accuvendMasterResponseCode,
            accuvendDescription,
            request,
            STATUS,
            STATUS_BOOLEAN,
            STATUS_CODE,
            CODE,
            MSG,
            vendor } = req.body;
        const updatedData: Partial<IErrorCode> = {
            httpCode,  category, description, accuvendDescription, accuvendMasterResponseCode, request, vendor,
            STATUS_CODE, STATUS_BOOLEAN, STATUS, CODE, MSG
        }
        const errorCode: ErrorCode | null = await ErrorCodeService.updateErrorCode(errorCodeId, updatedData);
        if (!errorCode) {
            throw new NotFoundError("ErrorCode not found")
            return;
        }
        res.status(200).send({ success: true, message: "ErrorCode updated successfully", data: { errorCode } });
    }
}
