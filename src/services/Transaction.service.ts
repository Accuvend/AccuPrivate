// Import required modules, types, and models
import Transaction, { Status } from "../models/Transaction.model";
import {
    ICreateTransaction,
    IUpdateTransaction,
} from "../models/Transaction.model";
import EventService from "./Event.service";
import Event from "../models/Event.model";
import PowerUnit from "../models/PowerUnit.model";
import Partner from "../models/Entity/Profiles/PartnerProfile.model";
import User from "../models/User.model";
import Meter from "../models/Meter.model";
import { Op, literal } from "sequelize";
import { $GetType, Sequelize } from "sequelize-typescript";
import Bundle from "../models/Bundle.model";
import PaymentProvider from "../models/PaymentProvider.model";
import { CustomError } from "../utils/Errors";

type RelationTypeMap = {
    user: User;
    partner: Partner;
    events: Event[];
    powerUnit: PowerUnit;
    meter: Meter;
    bundle: Bundle;
    paymentProvider: PaymentProvider;
};

type RelationFields = keyof RelationTypeMap;

// Define the TransactionService class for handling transaction-related operations
export default class TransactionService {
    // Create an instance of EventService for handling events
    private static eventService: EventService = new EventService();

    static async flaggTransaction(transactionId: string) {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            throw new Error("Transaction not found");
        }

        transaction.status = Status.FLAGGED;
        await transaction.save();
        return transaction;
    }

    static async addTransactionWithoutValidatingUserRelationship(
        transaction: Omit<ICreateTransaction, "userId">,
    ): Promise<Transaction> {
        const transactionData = Transaction.build({
            ...transaction,
            // reference: generateRandomString(10),
        } as Transaction);

        await transactionData.save({ validate: false });
        const _transaction = await TransactionService.viewSingleTransaction(
            transactionData.id,
        );
        if (!_transaction) {
            throw new Error("Error fetching transaction");
        }

        return _transaction;
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
            include: [
                PowerUnit,
                Event,
                Partner,
                User,
                Meter,
                Bundle,
                PaymentProvider,
            ],
            order: [["transactionTimestamp", "DESC"]],
        });
        return transactions;
    }

    static async viewTransactionsWithCustomQuery(
        query: Record<string, any>,
    ): Promise<Transaction[]> {
        // Retrieve all transactions from the database
        // Sort from latest

        //Removed Because of Performance issues
        // Getting the list of columns
        // const ListofColumns = await Transaction.describe()
        //convert the list of columns to array
        // const attributesMap: Array<string> = Object.keys(ListofColumns)
        const transactions: Transaction[] = (
            await Transaction.findAll({
                ...query,
                include: [PowerUnit, Event, Partner, User, Meter, Bundle],
                //add the transform disco to biller so it can be used in the frontend and for the partner
                attributes: [
                    ["disco", "biller"],
                    "id",
                    "amount",
                    "status",
                    "paymentType",
                    "transactionTimestamp",
                    "disco",
                    "bankRefId",
                    "bankComment",
                    "superagent",
                    "reference",
                    "productType",
                    "productCodeId",
                    "irechargeAccessToken",
                    "vendorReferenceId",
                    "networkProvider",
                    "previousVendors",
                    "userId",
                    "transactionType",
                    "partnerId",
                    "powerUnitId",
                    "meterId",
                    "createdAt",
                    "updatedAt",
                    "channel",
                    //...attributesMap
                ],
                order: [["transactionTimestamp", "DESC"]],
            })
        ).sort((a, b) => {
            return (
                b.transactionTimestamp.getTime() -
                a.transactionTimestamp.getTime()
            );
        });
        return transactions;

        /**PREVIOUS UTILIZIED CODE */
        //  // Retrieve all transactions from the database
        // // Sort from latest
        // const transactions: Transaction[] = (
        //     await Transaction.findAll({
        //         ...query,
        //         include: [PowerUnit, Event, Partner, User, Meter],
        //         order: [["transactionTimestamp", "DESC"]],
        //     })
        // ).sort((a, b) => {
        //     return (
        //         b.transactionTimestamp.getTime() -
        //         a.transactionTimestamp.getTime()
        //     );
        // });
        // return transactions;
    }

    /**
     * Retrieves transactions based on a custom query with included associations.
     * @param queryandinclude The custom query object including associations to be included in the result.
     * @returns A Promise resolving to an array of transactions that match the query criteria.
     */
    static async viewTransactionsWithCustomQueryAndInclude(
        queryandinclude: Record<string, any>,
    ): Promise<Transaction[]> {
        // Retrieve transactions from the database based on the provided query and included associations
        const transactions: Transaction[] = await Transaction.findAll({
            ...queryandinclude,
            attributes: [
                ["disco", "biller"], // Mapping 'disco' attribute to 'biller' for frontend and partner usage
                "id",
                "amount",
                "status",
                "paymentType",
                "transactionTimestamp",
                "disco",
                "bankRefId",
                "bankComment",
                "superagent",
                "reference",
                "productType",
                "productCodeId",
                "irechargeAccessToken",
                "vendorReferenceId",
                "networkProvider",
                "previousVendors",
                "userId",
                "transactionType",
                "partnerId",
                "powerUnitId",
                "meterId",
                "createdAt",
                "updatedAt",
                "channel",
            ],
            order: [["transactionTimestamp", "DESC"]], // Sorting transactions by transaction timestamp in descending order
        });
        return transactions; // Returning the array of transactions
    }

    static async viewTransactionsCountWithCustomQuery(
        query: Record<string, any>,
    ): Promise<number> {
        // Counting transactions from the database
        const transactionCount: number = await Transaction.count({
            ...query,
        });
        return transactionCount;
    }

    static async viewTransactionsAmountWithCustomQuery(
        query: Record<string, any>,
    ): Promise<number> {
        // Summing the total amount of transactions from the database

        const transactionCount: any = await Transaction.findAll({
            ...query,

            attributes: [
                [
                    Sequelize.fn(
                        "sum",
                        Sequelize.cast(Sequelize.col("amount"), "DECIMAL"),
                    ),
                    "total_amount",
                ],
            ],
        });
        return transactionCount;
    }

    // Static method for viewing a single transaction by UUID
    static async viewSingleTransaction(
        uuid: string,
    ): Promise<Transaction | null> {
        // Retrieve a single transaction by its UUID

        //Removed Because of Performance issues
        // Getting the list of columns
        // const ListofColumns = await Transaction.describe()
        //convert the list of columns to array
        // const attributesMap: Array<string> = Object.keys(ListofColumns)

        const transaction: Transaction | null = await Transaction.findByPk(
            uuid,
            {
                //add the transform disco to biller so it can be used in the frontend and for the partner
                attributes: [
                    ["disco", "biller"],
                    "id",
                    "amount",
                    "status",
                    "paymentType",
                    "transactionTimestamp",
                    "disco",
                    "bankRefId",
                    "bankComment",
                    "superagent",
                    "reference",
                    "productType",
                    "productCodeId",
                    "irechargeAccessToken",
                    "vendorReferenceId",
                    "networkProvider",
                    "previousVendors",
                    "userId",
                    "transactionType",
                    "partnerId",
                    "powerUnitId",
                    "meterId",
                    "createdAt",
                    "updatedAt",
                    "bundleId",
                    "retryRecord",
                    "reference",
                    "paymentProviderId",
                    //...attributesMap
                ],
                include: [
                    PowerUnit,
                    Event,
                    Partner,
                    User,
                    Meter,
                    Bundle,
                    PaymentProvider,
                ],
            },
        );
        return transaction;
        /**PREVIOUS UTILIZIED CODE */
        // const transaction: Transaction | null = await Transaction.findByPk(
        //     uuid,
        //     {
        //         include: [PowerUnit, Event, Partner, User, Meter],
        //     },
        // );
        // return transaction;
    }

    static async viewSingleTransactionByBankRefID(
        bankRefId: string,
    ): Promise<Transaction | null> {
        // Retrieve a single transaction by its UUID
        const transaction: Transaction | null = await Transaction.findOne({
            where: { bankRefId: bankRefId },
            include: [PowerUnit, Event, Partner, User, Meter, PaymentProvider],
        });
        return transaction;
    }

    // Static method for updating a single transaction by UUID
    static async updateSingleTransaction(
        uuid: string,
        updateTransaction: IUpdateTransaction,
    ): Promise<Transaction> {
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

        if (!updateResult[0] || !updatedTransaction) {
            throw new CustomError("Transaction not found", {
                meta: { transactionId: uuid },
            });
        }
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

    static async viewTransactionsForYesterdayByStatus(
        partnerId: string,
        status: "COMPLETED" | "PENDING" | "FAILED",
    ): Promise<Transaction[]> {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);

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

    static async populateRelations<
        T extends RelationFields,
        U extends boolean,
    >({
        transaction,
        fields,
        strict,
    }: {
        transaction: Transaction;
        strict: U;
        fields: T[];
    }) {
        const records = {} as {
            [K in T]: U extends true
                ? NonNullable<RelationTypeMap[K]>
                : RelationTypeMap[K] | null;
        };

        for (const field of fields) {
            const populatedRecord = await transaction.$get(field);
            if (!populatedRecord && strict) {
                throw new CustomError(`${field} not found in transaction`, {
                    transactionId: transaction.id,
                });
            }
            records[field] = populatedRecord as any;
        }

        return records;
    }
}
