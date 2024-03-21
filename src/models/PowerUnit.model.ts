// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import Meter from "./Meter.model";
import Transaction from "./Transaction.model";

// Define the Sequelize model for the "PowerUnit" table
@Table
export default class PowerUnit extends Model<PowerUnit | IPowerUnit> {
    // Unique identifier for the power unit
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // address of the power unit
    @Column({ type: DataType.STRING, allowNull: false })
    address: string;

    // Disco associated with the power unit
    @Column({ type: DataType.STRING, allowNull: false })
    disco: string;

    @Column({ type: DataType.STRING, allowNull: false })
    discoLogo: string;

    // superagent associated with the power unit
    @Column({ type: DataType.STRING, allowNull: false })
    superagent: string;

    // amount associated with the power unit (with a default value)
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '0' })
    amount: string;

    // Token number associated with the power unit (with a default value)
    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    tokenNumber: number

    // Token number associated with the power unit (with a default value)
    @Column({ type: DataType.STRING, allowNull: false, unique: false })
    token: string

    // Token units associated with the power unit (with a default value)
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '0' })
    tokenUnits: string

    // Foreign key for the associated Meter
    @ForeignKey(() => Meter)
    @IsUUID(4)
    @Column
    meterId: string;

    // Belongs to a Meter
    @BelongsTo(() => Meter)
    meter: Meter;

    // Foreign key for the associated Transaction
    @ForeignKey(() => Transaction)
    @IsUUID(4)
    @Column
    transactionId: string;

    // Belongs to a Transaction
    @BelongsTo(() => Transaction)
    transaction: Transaction;
}


// Define an interface for a PowerUnit, representing the shape of a PowerUnit object.
export interface IPowerUnit {
    id: string;               // Unique identifier for the PowerUnit.
    address: string;         // address associated with the PowerUnit.
    disco: string;           // Disco (Distribution Company) associated with the PowerUnit.
    discoLogo: string;       // Disco (Distribution Company) associated with the PowerUnit.
    superagent: 'BUYPOWERNG' | 'BAXI';      // superagent associated with the PowerUnit.
    amount: string;          // amount related to the PowerUnit.
    tokenNumber: number;    // Token number associated with the PowerUnit.
    token: String;          // Token number associated with the PowerUnit
    tokenUnits: string;    // Token units associated with the PowerUnit.
    meterId: string;         // Unique identifier of the Meter associated with the PowerUnit.
    transactionId: string;  // Unique identifier of the Transaction associated with the PowerUnit.
}

// Define an interface that extends the IPowerUnit interface, representing the shape of a new PowerUnit to be created.
export interface ICreatePowerUnit extends IPowerUnit {
    // This interface includes all the properties of IPowerUnit, as it represents a new PowerUnit to be created.
}

// Define an interface for updating a PowerUnit, allowing only specific properties to be modified.
export interface IUpdatePowerUnit {
    // This interface is currently empty, indicating that it doesn't add any new properties for updating a PowerUnit.
}
