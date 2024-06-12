import { Transaction } from "sequelize";
import UserMeter, { IUserMeter } from "../models/UserMeter.model";
import Meter from "../models/Meter.model";
import User from "../models/User.model";

export default class UserMeterService {
    // Create a new UserMeter entry
    static async create(
        data: IUserMeter,
        transaction?: Transaction,
    ): Promise<UserMeter> {
        const userMeterData = UserMeter.build(data);
        const userMeter = transaction
            ? await userMeterData.save({ transaction })
            : await userMeterData.save();
        return userMeter;
    }

    // Find all UserMeter entries
    static async findAll(): Promise<UserMeter[]> {
        return await UserMeter.findAll({
            include: [User, Meter],
        });
    }

    // Find a UserMeter entry by ID
    static async findById(id: string): Promise<UserMeter | null> {
        return await UserMeter.findByPk(id, {
            include: [User, Meter],
        });
    }

    // Find UserMeter entries by userId
    static async findByUserId(userId: string): Promise<UserMeter[]> {
        return await UserMeter.findAll({
            where: { userId },
            include: [User, Meter],
        });
    }

    // Find UserMeter entries by meterId
    static async findByMeterId(meterId: string): Promise<UserMeter[]> {
        return await UserMeter.findAll({
            where: { meterId },
            include: [User, Meter],
        });
    }

    // Find UserMeter entry by userId and meterId
    static async findByUserAndMeterId({
        userId,
        meterId,
    }: {
        userId: string;
        meterId: string;
    }): Promise<UserMeter | null> {
        return await UserMeter.findOne({
            where: { userId, meterId },
            include: [User, Meter],
        });
    }

    // Find UserMeter entries by ownersName
    static async findByOwnersName(ownersName: string): Promise<UserMeter[]> {
        return await UserMeter.findAll({
            include: [
                {
                    model: Meter,
                    where: { ownersName },
                },
                User,
            ],
        });
    }
    // Update a UserMeter entry by ID
    static async updateById(
        id: string,
        data: Partial<IUserMeter>,
    ): Promise<UserMeter | null> {
        const userMeter = await UserMeter.findByPk(id);
        if (userMeter) {
            await userMeter.update(data);
            return await UserMeter.findByPk(id, {
                include: [User, Meter],
            });
        }
        return null;
    }

    // Delete a UserMeter entry by ID
    static async deleteById(
        id: string,
        transaction?: Transaction,
    ): Promise<void> {
        const userMeter = await UserMeter.findByPk(id);
        if (userMeter) {
            transaction
                ? await userMeter.destroy({ transaction })
                : await userMeter.destroy();
        }
    }

    // Find UserMeter entries with pagination
    static async findWithPagination({
        page,
        limit,
        query,
    }: {
        page: number;
        limit: number;
        query?: Record<string, any>;
    }): Promise<UserMeter[]> {
        return await UserMeter.findAll({
            where: query ?? {},
            limit,
            offset: (page - 1) * limit,
            include: [User, Meter],
        });
    }
}
