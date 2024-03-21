// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, BelongsTo, ForeignKey } from "sequelize-typescript";
import PartnerProfile from "./Entity/Profiles/PartnerProfile.model";

// Define the Sequelize model for the "ApiKey" table
@Table
export default class ApiKey extends Model<ApiKey | IApiKey> {
    // Unique identifier for the ApiKey
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // Timestamp of the ApiKey
    @Column({ type: DataType.STRING, allowNull: false })
    key: String;

    // Foreign key for the associated Transaction
    @ForeignKey(() => PartnerProfile)
    @IsUUID(4)
    @Column
    partnerId: string;

    @BelongsTo(() => PartnerProfile)
    PartnerProfile: PartnerProfile;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    active: boolean;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    lastUsed: Date
}

// Define an interface representing an ApiKey (IEvent) with various properties.
export interface IApiKey {
    id: string; // Unique identifier for the ApiKey
    key: string; // Timestamp of the ApiKey
    partnerId: string; // Data associated with the ApiKey (can be a string or JSON)
    active: boolean; // Data associated with the ApiKey (can be a string or JSON)
    lastUsed?: Date;
}

// Define an interface (ICreateEvent) that extends IEvent, typically used for creating new events.
export interface ICreateApiKey extends IApiKey {
    // This interface inherits all properties from IEvent and does not add any new ones.
}

// Define an interface (IUpdateEvent) for potential updates to an ApiKey (intentionally left empty).
export interface IUpdateEvent {
    // This interface is currently empty, but it can be extended with specific properties if needed.
}
