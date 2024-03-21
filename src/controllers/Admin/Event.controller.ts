import { NextFunction, Request, Response } from "express";
import EventService from "../../services/Event.service";
import { AuthenticatedRequest } from "../../utils/Interface";
require('newrelic');

export default class EventController {

    static async getEventInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { eventId } = req.query as { eventId: string }

        const event = await EventService.viewSingleEvent(eventId)

        res.status(200).json({
            status: 'success',
            data: {
                event
            }
        })
    }

    static async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { transactionId, page, limit } = req.query as { transactionId: string, page?: `${number}`, limit?: `${number}` }

        const events = await EventService.viewEventsForTransaction(transactionId)

        res.status(200).json({
            status: 'success',
            data: {
                events
            }
        })
    }
}