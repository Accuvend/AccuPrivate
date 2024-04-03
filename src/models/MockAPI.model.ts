import {IsUUID, Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, ForeignKey } from "sequelize-typescript";

export enum APISTATUSTYPE{
    FAILURE =  'FAILURE' ,
    SUCCESS = 'SUCCESS'
} 

// Define a Sequelize model for MockEndpointData
@Table
export default class MockEndpointData extends Model<MockEndpointData | IMockEndpointData> {
    // Primary key column
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;

    // Column for vendor name
    @Column(DataType.STRING)
    vendorName: string;

    // Column for vendor code
    @Column(DataType.TEXT)
    vendorCode: string;

    // Column for vendor message
    @Column(DataType.JSON)
    vendorResponse: Record<string,any>;

    // Column for HTTP response code , returns the actually api reponse code 
    @Column(DataType.INTEGER)
    httpCode: number;

    // Column for API Type, descibes whether it's for airtime , data , meter request or vending 
    @Column(DataType.TEXT)
    apiType: string;

    // Column for API Status Type, describes whether is a failure or a success 
    @Column({ type: DataType.ENUM, values: Object.values(APISTATUSTYPE), allowNull: true})
    apiStatusType: APISTATUSTYPE;

    // Column for activation status
    @Column({type: DataType.BOOLEAN , allowNull: false , defaultValue: false})
    activated: boolean;

    // Column for description
    @Column({type: DataType.STRING, allowNull: true})
    description: string;
}

// Interface for MockEndpointData structure
export interface IMockEndpointData {
    id: string;
    vendorName: string;
    vendorCode: string;
    vendorResponse: Record<string,any>;
    httpCode: number;
    activated: boolean;
    desccription: string ;
    apiType: string;
}
