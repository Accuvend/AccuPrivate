import { Request, Response } from "express";
import { NotFoundError } from "../../utils/Errors";
import User from "../../models/User.model";
import UserService from "../../services/User.service";

export default class TransactionController {
    static async getUserInfo(req: Request, res: Response) {
        const { email } = req.query as Record<string, string>

        const user: User | null = await UserService.viewSingleUserWithEmail(email)
        if (!user) {
            throw new NotFoundError('User not found')
        }

        const userTransactions = await user.$get('transactions')
        const userMeters = await user.$get('meters')

        res.status(200).json({
            status: 'success',
            message: 'User info retrieved successfully',
            data: { user: { ...user.dataValues, meters: userMeters, transactions: userTransactions } }
        })
    }

    static async getUsers(req: Request, res: Response) {
        const users: User[] | null = await UserService.viewUsers()
        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: {
                users
            }
        })
    }
}