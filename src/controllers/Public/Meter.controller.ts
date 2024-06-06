import { Request, Response } from "express";
import { ITransaction } from "../../models/Transaction.model";
import { NotFoundError } from "../../utils/Errors";
import MeterService from "../../services/Meter.service";
import Meter from "../../models/Meter.model";
import UserService from "../../services/User.service";
import UserMeterService from "../../services/UserMeter.service";
require("newrelic");

interface getMetersQueryParams extends ITransaction {
    page: `${number}`;
    limit: `${number}`;
    userId: string;
    disco: string;
    vendType: string;
}

export default class TransactionController {
    static async getMeterInfo(req: Request, res: Response) {
        const { meterNumber } = req.query as Record<string, string>;

        const meter: Meter | null =
            await MeterService.viewSingleMeterByMeterNumber(meterNumber);
        if (!meter) {
            throw new NotFoundError("Meter not found");
        }

        const powerUnits = await meter.$get("powerUnits");

        res.status(200).json({
            status: "success",
            message: "Meter info retrieved successfully",
            data: { meter: { ...meter.dataValues, powerUnits } },
        });
    }

    static async getMeters(req: Request, res: Response) {
        const { page, limit, disco, vendType, userId } =
            req.query as any as getMetersQueryParams;

        const query = { where: {} } as any;
        if (vendType) query.where.vendType = vendType;
        if (userId) query.where.userId = userId;
        if (disco) query.where.disco = disco;
        if (page && page != "0" && limit) {
            query.offset = Math.abs(parseInt(page) - 1) * parseInt(limit);
        }

        const meters: Meter[] =
            await MeterService.viewMetersWithCustomQuery(query);

        res.status(200).json({
            status: "success",
            message: "Meters retrieved successfully",
            data: {
                meters,
            },
        });
    }

    static async getUserMeters(req: Request, res: Response) {
        const { userId } = req.query as Record<string, string>;

        const existingUser = await UserService.viewSingleUser(userId);
        if (!existingUser) {
            throw new NotFoundError("User not found");
        }

        const userMeters = await UserMeterService.findByUserId(userId);

        res.status(200).send({
            status: "success",
            message: "User meters retrieved successfully",
            data: { meters: userMeters.map((rec) => rec.meter) },
        });
    }

    static async getUsersTiedToMeter(req: Request, res: Response) {
        const { meterId } = req.query as Record<string, string>;

        const userMeters = await UserMeterService.findByMeterId(meterId);

        res.status(200).send({
            status: "success",
            message: "Users tied to meter retrieved successfully",
            data: { users: userMeters.map((rec) => rec.user) },
        });
    }
}
