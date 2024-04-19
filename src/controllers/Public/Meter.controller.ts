import { Request, Response } from "express";
import { ITransaction } from "../../models/Transaction.model";
import { NotFoundError } from "../../utils/Errors";
import MeterService from "../../services/Meter.service";
import Meter from "../../models/Meter.model";
require('newrelic');

interface getTransactionInfoRequestBody {
    bankRefId: string
}

interface getMetersQueryParams extends ITransaction {
    page: `${number}`
    limit: `${number}`
    userId: string
    disco: string,
    vendType: string
}

export default class TransactionController {
    static async getMeterInfo(req: Request, res: Response) {
        const { meterNumber } = req.query as Record<string, string>

        const meter: Meter | null = await MeterService.viewSingleMeterByMeterNumber(meterNumber)
        if (!meter) {
            throw new NotFoundError('Meter not found')
        }

        const powerUnits = await meter.$get('powerUnits')

        res.status(200).json({
            status: 'success',
            message: 'Meter info retrieved successfully',
            data: { meter: { ...meter.dataValues, powerUnits } }
        })
    }

    static async getMeters(req: Request, res: Response) {
        const {
            page, limit,
            disco, vendType, userId
        } = req.query as any as getMetersQueryParams

        const query = { where: {} } as any
        if (vendType) query.where.vendType = vendType
        if (userId) query.where.userId = userId
        if (disco) query.where.disco = disco
        if (page && page != '0' && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit)
        }

        const meters: Meter[] = await MeterService.viewMetersWithCustomQuery(query)

        res.status(200).json({
            status: 'success',
            message: 'Meters retrieved successfully',
            data: {
                meters
            }
        })
    }
}