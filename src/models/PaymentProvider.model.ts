/**
 * Sequelize model for handling PaymentProvider entities.
 * @remarks
 * This model defines the structure of the `PaymentProvider` table in the database.
 *
 * @class
 * @extends Model
 */
import {
    Table,
    Column,
    Model,
    IsUUID,
    PrimaryKey,
    DataType,
} from "sequelize-typescript";

@Table
export default class PaymentProvider extends Model<
    PaymentProvider | IPaymentProvider
> {
    /**
     * Unique identifier for the complaint.
     */
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    /**
     * Category of the complaint.
     */
    // List of complaint Replies attached to this complaint
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    name: string;
}

/**
 * Interface representing the structure of a PaymentProvider.
 */
export interface IPaymentProvider {
    id?: string;
    name: string;
}

/**
 * Interface representing the structure of a new PaymentProvider for creation.
 */
export interface ICreatePaymentProvider extends IPaymentProvider {}

/**
 * Interface representing the structure of an updated PaymentProvider.
 */
export interface IUpdatePaymentProvider
    extends Partial<ICreatePaymentProvider> {}
