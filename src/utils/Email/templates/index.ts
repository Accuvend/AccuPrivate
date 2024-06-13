import ejs from "ejs";
import fs from "fs";
import {
    ACCUVEND_ORDER_CONFIRMATION_BASE_URL,
    ACCUVEND_RECEIPT_BASE_URL,
    ACCUVEND_USER_INVITE_URL,
    LOGO_URL,
} from "../../Constants";
import { IReceiptEmailTemplateProps } from "../../Interface";
import Transaction from "../../../models/Transaction.model";
import { randomUUID } from "crypto";
import { string } from "zod";

const containerTemplate = fs.readFileSync(__dirname + "/container.ejs", "utf8");

const container = (contentTemplate: string) =>
    ejs.render(containerTemplate, { contentTemplate, LOGO_URL });

interface EmailVerificationProps {
    partnerEmail: string;
    otpCode: string;
}

class EmailTemplate {
    failedTransaction = async ({
        transaction,
    }: {
        transaction: Transaction;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/failedtxn.ejs", { transaction }),
        );
    };
    order_confirmation = async ({
        transaction,
        meterNumber,
        token,
        address,
        name,
        units,
    }: IReceiptEmailTemplateProps) => {
        return container(
            await ejs.renderFile(__dirname + "/order-confirmation.ejs", {
                transaction,
                meterNumber,
                token,
                address,
                name,
                unit: units,
                receiptUrl: ACCUVEND_RECEIPT_BASE_URL,
            }),
        );
    };
    processing_order_confirmation = async ({
        transaction,
        meterNumber,
        address,
        name,
    }: Omit<IReceiptEmailTemplateProps, "token" | "units">) => {
        return container(
            await ejs.renderFile(
                __dirname + "/processing-order-confirmation.ejs",
                {
                    transaction,
                    meterNumber,
                    address,
                    name,
                    orderConfirmationUrl: ACCUVEND_ORDER_CONFIRMATION_BASE_URL,
                },
            ),
        );
    };
    postpaid_order_confirmation = async ({
        transaction,
        meterNumber,
        token,
        address,
        name,
        units,
    }: IReceiptEmailTemplateProps) => {
        return container(
            await ejs.renderFile(
                __dirname + "/order-confirmation-postpaid.ejs",
                {
                    transaction,
                    meterNumber,
                    token,
                    address,
                    name,
                    unit: units,
                    receiptUrl: ACCUVEND_RECEIPT_BASE_URL,
                },
            ),
        );
    };
    receipt = async ({
        transaction,
        meterNumber,
        token,
        address,
        name,
    }: IReceiptEmailTemplateProps) => {
        return container(
            await ejs.renderFile(__dirname + "/receipt.ejs", {
                transaction,
                meterNumber,
                token,
                address,
                name,
            }),
        );
    };
    postpaid_receipt = async ({
        transaction,
        meterNumber,
        token,
        address,
        name,
    }: IReceiptEmailTemplateProps) => {
        return container(
            await ejs.renderFile(__dirname + "/postpaid_receipt.ejs", {
                transaction,
                meterNumber,
                token,
                address,
                name,
            }),
        );
    };
    airTimeReceipt = async ({
        transaction,
        phoneNumber,
    }: {
        transaction: Transaction;
        phoneNumber: string;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/airtime-receipt.ejs", {
                transaction,
                phoneNumber,
            }),
        );
    };
    emailVerification = async ({
        partnerEmail,
        otpCode,
    }: EmailVerificationProps) => {
        return container(
            await ejs.renderFile(__dirname + "/emailverification.ejs", {
                partnerEmail,
                otpCode,
            }),
        );
    };
    awaitActivation = async (partnerEmail: string) => {
        return container(
            await ejs.renderFile(__dirname + "/awaitactivation.ejs", {
                partnerEmail,
            }),
        );
    };
    forgotPassword = async ({
        email,
        otpCode,
    }: {
        email: string;
        otpCode: string;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/forgotpassword.ejs", {
                email,
                otpCode,
            }),
        );
    };
    accountActivation = async (email: string) => {
        return container(
            await ejs.renderFile(__dirname + "/accountactivation.ejs", {
                email,
            }),
        );
    };
    inviteTeamMember = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/teaminvitation.ejs", {
                email,
                password,
            }),
        );
    };
    invitePartner = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/partnerinvitation.ejs", {
                email,
                password,
            }),
        );
    };
    reInvitePartner = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/partnerinvitation.ejs", {
                email,
                password,
            }),
        );
    };
    suAccountActivation = async ({
        email,
        authorizationCode,
    }: {
        email: string;
        authorizationCode: ReturnType<typeof randomUUID>;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/su_activation_request.ejs", {
                email,
                authorizationCode,
            }),
        );
    };
    suDeAccountActivation = async ({
        email,
        authorizationCode,
    }: {
        email: string;
        authorizationCode: ReturnType<typeof randomUUID>;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/su_deactivation_request.ejs", {
                email,
                authorizationCode,
            }),
        );
    };
    userInvite = async ({
        email,
        roleId,
        name,
    }: {
        name: string;
        email: string;
        roleId: string;
    }) => {
        return container(
            await ejs.renderFile(__dirname + "/userinvite.ejs", {
                email,
                name,
                roleId,
                link: ACCUVEND_USER_INVITE_URL + `/${email}`,
            }),
        );
    };
}

export default EmailTemplate;
