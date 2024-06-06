import {
    Column,
    Model,
    DataType,
    IsUUID,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    Table,
} from "sequelize-typescript";
import User from "./User.model";
import Meter from "./Meter.model";

@Table
export default class UserMeter extends Model<UserMeter | IUserMeter> {
    @PrimaryKey
    @IsUUID(4)
    @Column
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.STRING, allowNull: false })
    userId: string;

    @ForeignKey(() => Meter)
    @Column({ type: DataType.STRING, allowNull: false })
    meterId: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Meter)
    meter: Meter;
}

export interface IUserMeter {
    id: string;
    userId: string;
    meterId: string;
}
