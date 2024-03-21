import {
    Table,
    Column,
    Model,
    DataType,
    IsUUID,
    PrimaryKey,
    BelongsTo,
    HasOne,
    ForeignKey,
    BeforeCreate,
    BeforeSave,
} from "sequelize-typescript";
import Entity from "./Entity/Entity.model";
import Event from "./Event.model";
import { NigerianDate } from "../utils/Date";

@Table
export default class Notification extends Model<INotification | Notification> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    message: string;

    @Column({ type: DataType.STRING, allowNull: false })
    heading: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    read: boolean;

    @ForeignKey(() => Event)
    @IsUUID(4)
    @Column({ type: DataType.STRING, allowNull: true })
    eventId: string;

    @BelongsTo(() => Event)
    event: Event;

    @ForeignKey(() => Entity)
    @IsUUID(4)
    @Column({ type: DataType.STRING, allowNull: false })
    entityId: string;

    @BelongsTo(() => Entity)
    entity: Entity;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: new NigerianDate().getCurrentNigerianDate().toString(),
    })
    timeStamp: string;
}

enum NotificationType {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    FAILED_TRANSACTION = "FAILED_TRANSACTION",
    NEW_MEMBER_ACCOUNT = "NEW_MEMBER_ACCOUNT",
}

export interface INotification {
    id: string;
    title: string;
    message: string;
    heading: string;
    read: boolean;
    eventId?: string;
    entityId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateNotification extends INotification { }

export interface IUpdateNotification {
    title?: string;
    message?: string;
    heading?: string;
}
