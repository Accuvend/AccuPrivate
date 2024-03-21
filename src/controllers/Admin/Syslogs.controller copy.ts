import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, NotFoundError } from "../../utils/Errors";
import RoleService from "../../services/Role.service";
import { RoleEnum } from "../../models/Role.model";
import { AuthenticatedRequest } from "../../utils/Interface";
// import SysLog from "../../models/SysLog.mgModel"
require('newrelic');

// export default class syslogController {
//     //  Create role
//     static async getSystemLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//         interface QueryParams {
//             page: string,
//             limit: string,
//             level: 'info' | 'warn' | 'error',
//             message_type: 'Request' | 'Response'
//             start_date: string,
//             end_date: string,
//         }
//         const { page, limit, level, message_type, start_date, end_date } = req.query as unknown as QueryParams

//         interface Query extends Omit<QueryParams, 'message' | 'start_date' | 'end_date'> {
//             message?: 'Request' | 'Response'
//             timestamp?: {
//                 $gte?: Date,
//                 $lte?: Date,
//             }
//         }
//         const query = {} as Query

//         if (level) query.level = level.toLowerCase() as Query['level']
//         if (message_type) query.message = message_type
//         if (start_date) query.timestamp = { $gte: new Date(start_date) }
//         if (end_date) {
//             if (query.timestamp) {
//                 query.timestamp = { ...query.timestamp, $lte: new Date(end_date) }
//             } else {
//                 query.timestamp = { $lte: new Date(end_date) }
//             }
//         }

//         // TODO: Move DB operations to service
//         if (page && limit) {
//             const skip = (parseInt(page) - 1) * parseInt(limit)
//             const logs = await SysLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit))

//             res.status(200).send({
//                 message: 'Logs fetched successfully',
//                 success: true,
//                 data: {
//                     logs
//                 }
//             })
//             return
//         }

//         const logs = await SysLog.find(query).sort({ timestamp: -1 }).limit(100)

//         res.status(200).send({
//             message: 'Logs fetched successfully',
//             success: true,
//             data: {
//                 logs
//             }
//         })
//     }

//     static async getSystemLogInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//         const {
//             syslog_id,
//         } = req.query;

//         const log = await SysLog.findById(syslog_id)
//         if (!log) {
//             return next(new NotFoundError('Log not found'));
//         }

//         res.status(200).send({
//             success: true,
//             message: 'Log fetched successfully',
//             data: {
//                 log,
//             },
//         });
//     }
// }