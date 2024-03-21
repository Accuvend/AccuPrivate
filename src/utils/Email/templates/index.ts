import ejs from 'ejs';
import fs from 'fs';
import { LOGO_URL } from '../../Constants';
import { IReceiptEmailTemplateProps } from '../../Interface';
import Transaction from '../../../models/Transaction.model';
import { randomUUID } from 'crypto';

const containerTemplate = fs.readFileSync(__dirname + '/container.ejs', 'utf8')

const container = (contentTemplate: string) => ejs.render(containerTemplate, { contentTemplate, LOGO_URL })

interface EmailVerificationProps {
    partnerEmail: string;
    otpCode: string;
}

class EmailTemplate {
    failedTransaction = async ({ transaction }: { transaction: Transaction }) => {
        return container(await ejs.renderFile(__dirname + '/failedtxn.ejs', { transaction }))
    }
    receipt = async ({ transaction, meterNumber, token, address, name }: IReceiptEmailTemplateProps) => {
        return container(await ejs.renderFile(__dirname + '/receipt.ejs', { transaction, meterNumber, token, address, name }))
    }
    postpaid_receipt = async ({ transaction, meterNumber, token, address, name }: IReceiptEmailTemplateProps) => {
        return container(await ejs.renderFile(__dirname + '/postpaid_receipt.ejs', { transaction, meterNumber, token, address, name }))
    }
    airTimeReceipt = async ({ transaction, phoneNumber }: {
        transaction: Transaction,
        phoneNumber: string,
    }) => {
        return container(await ejs.renderFile(__dirname + '/airtime-receipt.ejs', { transaction, phoneNumber }))
    }
    emailVerification = async ({ partnerEmail, otpCode }: EmailVerificationProps) => {
        return container(await ejs.renderFile(__dirname + '/emailverification.ejs', { partnerEmail, otpCode }))
    }
    awaitActivation = async (partnerEmail: string) => {
        return container(await ejs.renderFile(__dirname + '/awaitactivation.ejs', { partnerEmail }))
    }
    forgotPassword = async ({ email, otpCode }: { email: string, otpCode: string }) => {
        return container(await ejs.renderFile(__dirname + '/forgotpassword.ejs', { email, otpCode }))
    }
    accountActivation = async (email: string) => {
        return container(await ejs.renderFile(__dirname + '/accountactivation.ejs', { email }))
    }
    inviteTeamMember = async ({ email, password }: { email: string, password: string }) => {
        return container(await ejs.renderFile(__dirname + '/teaminvitation.ejs', { email, password }))
    }
    invitePartner = async ({ email, password }: { email: string, password: string }) => {
        return container(await ejs.renderFile(__dirname + '/partnerinvitation.ejs', { email, password }))
    }
    suAccountActivation = async ({ email, authorizationCode }: { email: string, authorizationCode: ReturnType<typeof randomUUID> }) => {
        return container(await ejs.renderFile(__dirname + '/su_activation_request.ejs', { email, authorizationCode }))
    }
    suDeAccountActivation = async ({ email, authorizationCode }: { email: string, authorizationCode: ReturnType<typeof randomUUID> }) => {
        return container(await ejs.renderFile(__dirname + '/su_deactivation_request.ejs', { email, authorizationCode }))
    }
}

export default EmailTemplate
