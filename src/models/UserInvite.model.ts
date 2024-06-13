import { all } from "axios";
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Role from "./Role.model";

export enum UserInviteStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
}

// Define the Sequelize model for the "UserInvite" table
@Table
export default class UserInvite extends Model<UserInvite | IUserInvite> {
    // Unique identifier for the log
    @PrimaryKey
    @Column
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    name?: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.STRING, allowNull: false })
    roleId: string;

    @Column({
        type: DataType.STRING,
        values: Object.values(UserInviteStatus),
        allowNull: true,
    })
    status: UserInviteStatus;

    // Optional created at timestamp
    @CreatedAt
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @BelongsTo(() => Role)
    @ForeignKey(() => Role)
    role: Role;
}

export interface IUserInvite {
    id: string;
    name?: string;
    email: string;
    roleId: string;
    status: UserInviteStatus;
    createdAt: Date;
}

export interface ICreateUserInvite {
    name?: string;
    email: string;
    status: UserInviteStatus;
    roleId: string;
    createdAt: Date;
}

export interface IUpdateUserInvite {
    status: UserInviteStatus;
}
