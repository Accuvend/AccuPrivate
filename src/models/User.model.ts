// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, HasMany } from "sequelize-typescript";
import Meter  from "./Meter.model";
import Transaction  from "./Transaction.model";

// Define a table for the User model
@Table
export default class User extends Model<User | IUser> {
    // Define the primary key as a UUID and annotate it as such
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // Define a column for the user's address, specifying data type and non-null constraint
    @Column({ type: DataType.STRING, allowNull: true })
    address: string;

    // Define a column for the user's email address, specifying data type and non-null constraint
    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    // Define a column for the user's name, specifying data type and non-null constraint
    @Column({ type: DataType.STRING, allowNull: true })
    name?: string;

    // Define a column for the user's phone number, specifying data type and non-null constraint
    @Column({ type: DataType.STRING, allowNull: false })
    phoneNumber: string;

    // Establish a "HasMany" relationship with the Meter model, indicating that a user can have multiple meters
    @HasMany(() => Meter)
    meters: Meter[];

    // Establish a "HasMany" relationship with the Transaction model, indicating that a user can have multiple transactions
    @HasMany(() => Transaction)
    transactions: Transaction[];
}


// Define an interface for a User
export interface IUser {
    id: string;             // A unique identifier for the user
    address?: string;        // The user's address
    email: string;          // The user's email address
    name?: string;           // The user's name
    phoneNumber: string;   // The user's phone number
}

// Define an interface for creating a new User by extending the IUser interface
export interface ICreateUser extends IUser {
    // No additional properties are required for creating a user, 
    // so ICreateUser inherits the properties from IUser.
}

// Define an interface for updating a User
export interface IUpdateUser {
    // This interface can be used to define properties that can be updated for a user.
    // However, it does not require any additional properties beyond what IUser provides.
}
