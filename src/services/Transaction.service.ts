// Import required modules, types, and models
import Transaction from "../models/Transaction.model";
import {
    ITransaction,
    ICreateTransaction,
    IUpdateTransaction,
} from "../models/Transaction.model";
import EventService from "./Event.service";
import { v4 as uuidv4 } from "uuid";
import Event, { Status } from "../models/Event.model";
import logger from "../utils/Logger";
import PowerUnit from "../models/PowerUnit.model";
import Partner from "../models/Entity/Profiles/PartnerProfile.model";
import User from "../models/User.model";
import Meter from "../models/Meter.model";
import { Op } from "sequelize";
import { generateRandomString } from "../utils/Helper";
import { Sequelize } from "sequelize-typescript";
require('newrelic');

// Define the TransactionService class for handling transaction-related operations
export default class TransactionService {
    // Create an instance of EventService for handling events
    private static eventService: EventService = new EventService();

    static async addTransactionWithoutValidatingUserRelationship(
        transaction: Omit<ICreateTransaction, "userId" | "reference">,
    ): Promise<Transaction> {
        const transactionData = Transaction.build({
            ...transaction,
            reference: generateRandomString(10),
        } as Transaction);

        await transactionData.save({ validate: false });
        const _transaction = await TransactionService.viewSingleTransaction(transactionData.id)
        if (!_transaction) {
            throw new Error("Error fetching transaction");
        }

        return _transaction
    }

    // Static method for adding a new transaction
    static async addTransaction(
        transaction: ICreateTransaction,
    ): Promise<Transaction> {
        // Build a new transaction object
        const newTransaction: Transaction = Transaction.build(transaction);
        // Save the new tran    saction to the database
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        newTransaction.transactionTimestamp = yesterdayDate;

        await newTransaction.save();
        return newTransaction;
    }

    // Static method for viewing all transactions
    static async viewTransactions(): Promise<Transaction[] | Error> {
        // Retrieve all transactions from the database
        const transactions: Transaction[] = await Transaction.findAll({
            where: {},
            include: [PowerUnit, Event, Partner, User, Meter],
        });
        return transactions;
    }

    static async viewTransactionsWithCustomQuery(
        query: Record<string, any>,
    ): Promise<Transaction[]> {
        // Retrieve all transactions from the database
        // Sort from latest
        const transactions: Transaction[] = (
            await Transaction.findAll({
                ...query,
                include: [PowerUnit, Event, Partner, User, Meter],
            })
        ).sort((a, b) => {
            return (
                b.transactionTimestamp.getTime() -
                a.transactionTimestamp.getTime()
            );
        });
        return transactions;
    }

    static async viewTransactionsCountWithCustomQuery(
        query: Record<string, any>,
    ): Promise<number> {
        // Retrieve all transactions from the database
        // Sort from latest
        const transactionCount: number = (
            await Transaction.count({
                ...query,
            })
        )
        return transactionCount;
    }

    static async viewTransactionsAmountWithCustomQuery(
        query: Record<string, any>,
    ): Promise<number> {
        // Retrieve all transactions from the database
        // Sort from latest
        const transactionCount: any = (
            await Transaction.findAll({
                ...query,
                
                attributes : [
                    [Sequelize.fn('sum', Sequelize.cast(Sequelize.col('amount'),'DECIMAL') ), 'total_amount'],
                ]
                
            })
        )
        return transactionCount;
    }


    // Static method for viewing a single transaction by UUID
    static async viewSingleTransaction(
        uuid: string,
    ): Promise<Transaction | null> {
        // Retrieve a single transaction by its UUID
        const transaction: Transaction | null = await Transaction.findByPk(
            uuid,
            {
                include: [PowerUnit, Event, Partner, User, Meter],
            },
        );
        return transaction;
    }

    static async viewSingleTransactionByBankRefID(
        bankRefId: string,
    ): Promise<Transaction | null> {
        // Retrieve a single transaction by its UUID
        const transaction: Transaction | null = await Transaction.findOne({ where: { bankRefId: bankRefId }, include: [PowerUnit, Event, Partner, User, Meter] },);
        return transaction;
    }

    // Static method for updating a single transaction by UUID
    static async updateSingleTransaction(
        uuid: string,
        updateTransaction: IUpdateTransaction,
    ): Promise<Transaction | null> {
        // Update the transaction in the database
        const updateResult: [number] = await Transaction.update(
            updateTransaction,
            {
                where: { id: uuid },
            },
        );
        // Retrieve the updated transaction by its UUID
        const updatedTransaction: Transaction | null =
            await Transaction.findByPk(uuid);
        return updatedTransaction;
    }

    static async viewTransactionForYesterday(
        partnerId: string,
    ): Promise<Transaction[]> {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const transactions: Transaction[] = await Transaction.findAll({
            where: {
                partnerId: partnerId,
                transactionTimestamp: {
                    [Op.between]: [yesterdayDate, new Date()],
                },
            },
        });

        return transactions;
    }

    static async viewTransactionsForYesterdayByStatus(partnerId: string, status: 'COMPLETED' | 'PENDING' | 'FAILED'): Promise<Transaction[]> {
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)

        const transactions: Transaction[] = await Transaction.findAll({
            where: {
                partnerId: partnerId,
                status,
                transactionTimestamp: {
                    [Op.between]: [yesterdayDate, new Date()],
                },
            },
        });

        return transactions;
    }
}
