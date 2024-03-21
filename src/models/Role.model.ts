// Import necessary modules and dependencies
import { Table, Column, Model, DataType, IsUUID, PrimaryKey, HasMany, HasOne, ForeignKey, Unique } from "sequelize-typescript";
import Password from "./Password.model";
import Entity from "./Entity/Entity.model";

// Roles for each entity
// One to one relationship with entity
export enum RoleEnum {
    Admin = 'ADMIN',
    Partner = 'PARTNER',
    TeamMember = 'TEAMMEMBER',
    SuperAdmin = 'SUPERADMIN',
    EndUser = 'ENDUSER',
}

@Table
export default class Role extends Model<IRole | Role> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    @Unique('unique_name_type')
    @Column({ type: DataType.STRING, allowNull: false })
    name: RoleEnum;

    @Unique('unique_name_type')
    @Column({ type: DataType.STRING, allowNull: true })
    type: string;

    // One to many with Entity
    @HasMany(() => Entity)
    entities: Entity[];

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;
}

// Interface representing the structure of a Entity entity
export interface IRole {
    id: string;                 // Unique identifier for the Entity
    name: RoleEnum;            // Phone number for contacting the Entity
    description: string;
    type?: string; // To allow diffent types of admins
}

export interface IUpdateRole {
    name: RoleEnum;            // Phone number for contacting the Entity
    description: string;
}