import { Request, Response } from "express";
import { NotFoundError } from "../../utils/Errors";
import PowerUnit, { IPowerUnit } from "../../models/PowerUnit.model";
import PowerUnitService from "../../services/PowerUnit.service";
import { AuthenticatedRequest } from "../../utils/Interface";
require('newrelic');

interface getPowerUnitQueryParams extends IPowerUnit {
    limit: `${number}`
    page: `${number}`
}

export default class TransactionController {
    static async getPowerUnitInfo(req: AuthenticatedRequest, res: Response) {
        const { token } = req.query as Record<string, string>

        const powerUnit: PowerUnit | null = await PowerUnitService.viewPowerUnitByToken(token)
        if (!powerUnit) {
            throw new NotFoundError('Powerunit not found')
        }

        const transaction = await powerUnit.$get('transaction')
        const meter = await powerUnit.$get('meter')


        res.status(200).json({
            status: 'success',
            message: 'Power unit info retrieved successfully',
            data: { powerUnit: powerUnit.dataValues, transaction, meter }
        })
    }

    static async getPowerUnits(req: AuthenticatedRequest, res: Response) {
        const { page, limit, } = req.query as any as getPowerUnitQueryParams

        const query = { where: {} } as any
        if (limit) query.limit = limit
        if (page && page != '0' && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit)
        }

        const powerUnits: PowerUnit[] = await PowerUnitService.viewPowerUnitsWithCustomQuery(query)

        res.status(200).json({
            status: 'success',
            message: 'Meters retrieved successfully',
            data: {
                powerUnits
            }
        })
    }
}