import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../../utils/Interface";
import WaitTimeService from "../../services/Waittime.service";
import { NotFoundError } from "../../utils/Errors";
require('newrelic');

export class WaitTimeController {
    static async setWaittimeForSwitchingToNewVendor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { specificTimesForRetry }: { specificTimesForRetry: number[] } = req.body

        await WaitTimeService.setRetryTime(specificTimesForRetry)

        res.status(200).json({
            status: 'success',
            data: {
                specificTimesForRetry
            }
        })
    }

    static async getWaittimeForSwitchingToNewVendor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const specificTimesForRetry = await WaitTimeService.getWaitTime()

        if (!specificTimesForRetry) {
            throw new NotFoundError('Wait time not found')
        }

        res.status(200).json({
            status: 'success',
            data: {
                specificTimesForRetry
            }
        })
    }
}