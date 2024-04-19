// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, ForeignKey, BelongsTo, HasMany, HasOne, BeforeCreate } from "sequelize-typescript";
import User from "./User.model";
import Partner from "./Entity/Profiles/PartnerProfile.model";
import Event from "./Event.model";
import PowerUnit from "./PowerUnit.model";
import Meter from "./Meter.model";
import { generateRandomString } from "../utils/Helper";
import { NigerianDate } from "../utils/Date";
import ProductCode from "./ProductCode.model";
import Bundle from "./Bundle.model";

// Define enums for status and payment type
export enum Status {
    COMPLETE = 'COMPLETE',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    INPROGRESS = 'INPROGRESS',
    FLAGGED = 'FLAGGED'
}

export enum PaymentType {
    REVERSAL = 'REVERSAL',
    PAYMENT = 'PAYMENT'
}

export enum TransactionType {
    AIRTIME = 'AIRTIME',
    ELECTRICITY = 'ELECTRICITY',
    DATA = 'DATA',
    CABLE = 'CABLE',
}

// Define the Sequelize model for the "Transaction" table
@Table
export default class Transaction extends Model<ITransaction | Transaction> {
    // Unique identifier for the transaction
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // amount associated with the transaction
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '0' })
    amount: string;

    @Column({ type: DataType.STRING, allowNull: true })
    tokenFromVend: string;
    
    @Column({ type: DataType.STRING, allowNull: true })
    tokenFromRequery: string;

    // Status of the transaction (complete, pending, or failed)
    @Column({ type: DataType.ENUM, values: Object.values(Status), defaultValue: Status.PENDING, allowNull: false })
    status: Status;

    // Type of payment (reversal or payment)
    @Column({ type: DataType.ENUM, values: Object.values(PaymentType), defaultValue: PaymentType.PAYMENT, allowNull: false })
    paymentType: PaymentType;

    // Timestamp of the transaction
    @Column({ type: DataType.DATE, allowNull: false })
    transactionTimestamp: Date;

    // Disco associated with the transaction
    @Column({ type: DataType.STRING, allowNull: true })
    disco: string;

    // Bank Transaction Reference ID associated with the transaction
    @Column({ type: DataType.STRING, allowNull: true, unique: true })
    bankRefId?: string;

    // Bank Comment Reference ID associated with the transaction
    @Column({ type: DataType.STRING, allowNull: true })
    bankComment?: string;

    // superagent associated with the transaction
    @Column({ type: DataType.STRING, allowNull: false })
    superagent: ITransaction['superagent'];

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: () => generateRandomString(10) })
    reference: string;

    @Column({ type: DataType.JSONB, allowNull: true, defaultValue: [] })
    retryRecord: {
        vendor: ITransaction['superagent'],
        reference: string[],
        data?: Record<string, any>,
        retryCount: number,
        attempt: number,
    }[]

    @Column({ type: DataType.STRING, allowNull: true })
    productType: string;

    @ForeignKey(() => ProductCode)
    @IsUUID(4)
    @Column({ type: DataType.STRING, allowNull: true })
    productCodeId: string;

    @Column({ type: DataType.STRING, allowNull: true })
    irechargeAccessToken: string

    @Column({ type: DataType.STRING, allowNull: true })
    vendorReferenceId: string

    @Column({ type: DataType.STRING, allowNull: true })
    networkProvider: string

    @ForeignKey(() => Bundle)
    @Column({ type: DataType.STRING, allowNull: true })
    bundleId?: string

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
    previousVendors: string[]

    // Foreign key for the associated User
    @ForeignKey(() => User)
    @IsUUID(4)
    @Column
    userId: string;

    @Column({ type: DataType.ENUM, values: Object.values(TransactionType), allowNull: true })
    transactionType: TransactionType

    // Belongs to a User
    @BelongsTo(() => User)
    user: User;

    // Foreign key for the associated Partner
    @ForeignKey(() => Partner)
    @IsUUID(4)
    @Column
    partnerId: string;

    @ForeignKey(() => PowerUnit)
    @IsUUID(4)
    @Column
    powerUnitId?: string;

    // Belongs to a Partner
    @BelongsTo(() => Partner)
    partner: Partner;

    // Has many associated events
    @HasMany(() => Event)
    events: Event[];

    // Has one associated PowerUnit
    @HasOne(() => PowerUnit)
    powerUnit: PowerUnit;

    // Optional foreign key
    @ForeignKey(() => Meter)
    @IsUUID(4)
    @Column
    meterId?: string;

    // Has one associated Meter
    @BelongsTo(() => Meter)
    meter: Meter;

    @Column({ type: DataType.STRING, allowNull: true })
    channel: 'USSD' | 'WEB' | 'MOBILE' | 'POS' | 'ATM' | 'OTHERS'

    @BelongsTo(() => Bundle)
    bundle: Bundle;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: new NigerianDate().getCurrentNigerianDate(),
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: new NigerianDate().getCurrentNigerianDate(),
    })
    updatedAt: Date;

    @BeforeCreate
    static async checkIfAccesstokenExistForIRecharge(transaction: Transaction) {
        if (transaction.superagent === 'IRECHARGE') {
            if (!transaction.irechargeAccessToken) {
                // throw new Error('irechargeAccessToken is required')
            }
        }
    }

    @BeforeCreate
    static async checkIfDiscoExistForElectricity(transaction: Transaction) {
        if (transaction.transactionType === TransactionType.ELECTRICITY) {
            if (!transaction.disco) {
                throw new Error('disco is required')
            }
        }
    }

    @BeforeCreate
    static async checkDiscoForAirtime(transaction: Transaction) {
        if (transaction.transactionType === TransactionType.AIRTIME) {
            if (['MTN', 'GLO', 'AIRTEL', '9MOBILE', 'ETISALAT'].indexOf(transaction.disco.toUpperCase()) === -1) {
                // throw new Error('disco is required')
            }
        }
    }

    @BeforeCreate
    static async checkIfProductCodeExistForElectricity(transaction: Transaction) {
        if (transaction.transactionType === TransactionType.ELECTRICITY) {
            if (!transaction.productCodeId) {
                throw new Error('productCodeId is required')
            }
        }
    }

}


// Define an interface representing a transaction (ITransaction) with various properties.
export interface ITransaction {
    id: string; // Unique identifier for the transaction
    amount: string; // amount associated with the transaction
    status: Status; // Status of the transaction (e.g., COMPLETE, PENDING, FAILED)
    paymentType: PaymentType; // Type of payment (e.g., REVERSAL, PAYMENT)
    transactionTimestamp: Date; // Timestamp of the transaction
    disco?: string; // Disco associated with the transaction
    bankRefId?: string; // Bank reference ID related to the transaction
    bankComment?: string; // Comments or notes from the bank regarding the transaction
    superagent: 'BUYPOWERNG' | 'BAXI' | 'IRECHARGE'; // superagent associated with the transaction
    transactionType: TransactionType;
    userId: string; // Unique identifier of the user associated with the transaction
    partnerId: string; // Unique identifier of the Partner associated with the transaction
    meterId?: string; // Unique identifier of the Meter associated with the transaction
    reference: string;
    productCodeId: string;
    irechargeAccessToken?: string;
    vendorReferenceId: string;
    previousVendors: string[];
    tokenFromVend?: string
    tokenFromRequery?: string;
    retryRecord: {
        vendor: ITransaction['superagent'],
        reference: string[],
        data?: Record<string, any>,
        retryCount: number,
        attempt: number,
    }[],
    productType: string;
    networkProvider?: string;
    bundleId?: string;
    channel: 'USSD' | 'WEB' | 'MOBILE' | 'POS' | 'ATM' | 'OTHERS'
}

// Define an interface representing the creation of a transaction (ICreateTransaction).
// This extends the ITransaction interface, inheriting its properties.
export interface ICreateTransaction extends ITransaction {
    // Additional properties can be defined if needed for creating a new transaction.
}

// Define an interface representing the update of a transaction (IUpdateTransaction).
// This interface does not include any specific properties, but it can be extended as needed.
export interface IUpdateTransaction {
    // Properties for updating a transaction can be added here.
}

type DateQuery = {
    transactionTimestamp?: { $between: [Date, Date] } | Date;
    createdAt: { $between: [Date, Date] } | Date,
}
export interface IQueryTransaction {
    where: {
        [K in keyof Omit<ITransaction, keyof DateQuery>]?: ITransaction[K];
    } & DateQuery,
    offset?: number, limit?: number
}
