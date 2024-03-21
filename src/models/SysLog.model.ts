import { all } from "axios";
import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, ForeignKey } from "sequelize-typescript";
import Transaction from "./Transaction.model";

// Define the Sequelize model for the "SysLog" table
@Table
export default class SysLog extends Model<SysLog | ISysLog> {
    // Unique identifier for the log
    @PrimaryKey
    @Column
    id: string;

    // Timestamp of the log
    @Column({ type: DataType.DATE, allowNull: false })
    timestamp: Date;

    // Level of the log
    @Column(DataType.STRING)
    level: string;

    // Message of the log
    @Column(DataType.TEXT)
    message: string;

    @ForeignKey(() => Transaction)
    @Column({ type: DataType.STRING, allowNull: true, })
    transactionId?: string;

    @Column({ type: DataType.STRING, allowNull: true, })
    logType: LogType

    // Additional metadata associated with the log
    @Column(DataType.JSONB)
    meta: Record<string, any>;

    // Additional metadata associated with the log
    @Column({ type: DataType.JSONB, allowNull: true, defaultValue: {} })
    description: Record<string, any>;

    // Optional created at timestamp
    @CreatedAt
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;
}

export type LogType = "apiRequest" | "apiResponse" | "kafkaPublisher" | "kafkaFailure" | "kafkaMessageProcessing" | "retries" | 'cronJob';

interface ISysLog {
    id: string;
    timestamp: Date;
    level: string;
    message: string;
    meta: object;
    transactionId: string;
    description: object;
}
