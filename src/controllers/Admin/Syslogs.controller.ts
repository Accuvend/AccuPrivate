import { NextFunction, Response } from "express";
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import { AuthenticatedRequest } from "../../utils/Interface";
import SysLog from "../../models/SysLog.model"; // Import the SysLog Sequelize model
import TransactionService from "../../services/Transaction.service";

export default class syslogController {
    static async getSystemLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        interface QueryParams {
            page: string,
            limit: string,
            level: 'info' | 'warn' | 'error',
            message_type: 'Request' | 'Response'
            start_date: string,
            end_date: string,
            transaction_id: string
        }
        const { page, limit, level, message_type, start_date, end_date } = req.query as unknown as QueryParams;

        // Construct the query object based on query parameters
        const query: any = {};
        if (level) query.level = level.toLowerCase();
        if (message_type) query.message = message_type;
        if (start_date) query.timestamp = { $gte: new Date(start_date) };
        if (end_date) query.timestamp = { ...query.timestamp, $lte: new Date(end_date) };
        if (req.query.transaction_id) query['meta.transactionId'] = req.query.transaction_id;

        // Execute the query
        try {
            const options: any = { order: [['timestamp', 'DESC']] };
            if (page && limit) {
                options.offset = (parseInt(page) - 1) * parseInt(limit);
                options.limit = parseInt(limit);
            }
            const logs = await SysLog.findAll({ where: query, ...options });

            res.status(200).send({
                message: 'Logs fetched successfully',
                success: true,
                data: { logs }
            });
        } catch (error) {
            next(new BadRequestError('Error fetching logs'));
        }
    }

    static async getSystemLogInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { syslogId } = req.query;

        try {
            const log = await SysLog.findByPk(syslogId as string);
            if (!log) {
                return next(new NotFoundError('Log not found'));
            }

            if (log.meta.transactionId) {
                const transaction = await TransactionService.viewSingleTransaction(log.meta.transactionId);
                if (transaction) {
                    log.meta.transaction = transaction;
                }
            }

            res.status(200).send({
                success: true,
                message: 'Log fetched successfully',
                data: { log }
            });
        } catch (error) {
            next(new BadRequestError('Error fetching log'));
        }
    }
}
