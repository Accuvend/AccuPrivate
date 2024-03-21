import { string } from "zod";
import Transaction, { ITransaction } from "../models/Transaction.model";
import { DecodedTokenData } from "./Auth/Token";
import { Request as ExpressApiRequest, NextFunction, Response } from "express";
import { UUID } from "crypto";
import { RoleEnum } from "../models/Role.model";

export interface IVendToken {
    transactionId: string;
    reference: string;
    meterNumber: string;
    disco: string;
    amount: string;
    phone: string;
    vendType: "PREPAID" | "POSTPAID";
}

export interface IValidateMeter {
    transactionId: string;
    meterNumber: string;
    disco: string;
    vendType: "PREPAID" | "POSTPAID";
}

export interface IBaxiGetProviderResponse extends BaseResponse {
    source: "BAXI";
    status: "success";
    message: "Successful";
    code: 200;
    data: {
        providers: {
            service_type: string;
            shortname: string;
            biller_id: number;
            product_id: number;
            name: string;
        }[];
    };
}

export interface BaseResponse {
    source: Transaction["superagent"];
}

export interface IBaxiPurchaseResponse extends BaseResponse {
    source: "BAXI";
    status: string;
    statusCode: string;
    message: string;
    data: {
        transactionStatus: string;
        transactionReference: number;
        statusCode: string;
        transactionMessage: string;
        tokenCode: string;
        tokenAmount: null | number;
        amountOfPower: null | number;
        rawOutput: {
            fees: {
                amount: number;
                kind: string | null;
                description: string | null;
                taxAmount: number;
            }[];
            feeder: string;
            dssName: string;
            serviceBand: string;
            message: string | null;
            token: string;
            rate: string | null;
            exchangeReference: string;
            tariff: string | null;
            power: string | null;
            resetToken: string;
            status: string;
            statusCode: string;
        };
        provider_message: string;
        baxiReference: number;
    };
}

export interface IBaxiValidateMeterResponse {
    status: "success" | "pending";
    message: "Successful";
    code: 200;
    data: {
        name: string;
        address: string;
        outstandingBalance: number;
        dueDate: string;
        district: string;
        accountNumber: string;
        minimumAmount: number;
        rawOutput: null;
        errorMessage: null;
    };
}

export interface IBuyPowerValidateMeterResponse {
    error: false;
    discoCode: string;
    vendType: "PREPAID" | "POSTPAID";
    meterNo: `${number}`;
    minVendAmount: number;
    maxVendAmount: number;
    responseCode: number;
    outstanding: number;
    debtRepayment: number;
    name: string;
    address: string;
    orderId: string;
}

export interface IBuyPowerGetProvidersResponse {
    ABUJA: true;
    EKO: true;
    IKEJA: true;
    IBADAN: true;
    ENUGU: true;
    PH: true;
    JOS: true;
    KADUNA: true;
    KANO: true;
    BH: true;
    PROTOGY: false;
    PHISBOND: false;
    ACCESSPOWER: false;
    APLE: false;
    BENIN: false;
    YOLA: true;
}

export interface IReceiptEmailTemplateProps {
    transaction: ITransaction;
    meterNumber: string;
    token: string;
    address: string;
    name: string;
}

export interface INotification {
    title: string;
    message: string;
    heading?: string;
    entityId: string;
    eventId?: string;
}

export type AuthOptions = "authenticated" | "none";

export interface AuthenticatedRequest<T extends RoleEnum = RoleEnum.Partner>
    extends ExpressApiRequest {
    headers: {
        authorization: string;
        signature?: string;
        Signature?: string;
    };
    user: DecodedTokenData<T>;
}

export type AuthenticatedAsyncController = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => Promise<void>;

// TODO: Add option to specify if authentication type is through API Key or JWT
export function AuthenticatedController(
    controller: AuthenticatedAsyncController,
) {
    return async (
        req: ExpressApiRequest,
        res: Response,
        next: NextFunction,
    ) => {
        return controller(req as AuthenticatedRequest, res, next);
    };
}

