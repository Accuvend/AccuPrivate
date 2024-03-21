import EmailTemplate from "./templates";
import logger from "../Logger";
import {
    EMAIL_HOST,
    EMAIL_PASSWORD,
    EMAIL_HOST_ADDRESS, EMAIL_PORT, OAUTH_ACCESS_TOKEN, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN, SENDGRID_API_KEY,
} from "../Constants";
import sendgridClient from "@sendgrid/mail";
import nodemailer from "nodemailer";
require("newrelic");

interface IPartialMailOptions {
    from?: string;
    to: string;
    subject: string;
}
type TMailOptions = IPartialMailOptions & ({ text: string } | { html: string });

class Mailer {
    private mailOptions: TMailOptions;
    public send: () => Promise<void | Error>;

    constructor(mailOptions: TMailOptions) {
        this.send = this.sendEmailWithNodemailer;
        this.mailOptions = mailOptions;
    }

    public async sendEmailWithSendgrid(): Promise<void | Error> {
        sendgridClient.setApiKey(SENDGRID_API_KEY);
        this.mailOptions.from = this.mailOptions.from ?? EMAIL_HOST_ADDRESS;

        await sendgridClient.send({
            ...this.mailOptions,
            from: EMAIL_HOST_ADDRESS,
            to: this.mailOptions.to,
            subject: this.mailOptions.subject,
        });

        console.log("Sending with sendgrid");
    }

    public async sendEmailWithNodemailer(): Promise<void | Error> {
        // const transporter = nodemailer.createTransport({
        //     host: EMAIL_HOST,
        //     port: EMAIL_PORT,
        //     secure: true,
        //     auth: {
        //         type: 'OAuth2',
        //         user: EMAIL_HOST_ADDRESS,
        //         clientId: OAUTH_CLIENT_ID,
        //         clientSecret: OAUTH_CLIENT_SECRET,
        //         refreshToken: OAUTH_REFRESH_TOKEN,
        //         accessToken: OAUTH_ACCESS_TOKEN,
        //     },
        // });
        const transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: true,
  
            auth:{
                user:EMAIL_HOST_ADDRESS,
                pass:EMAIL_PASSWORD,
              },
        });

        this.mailOptions.from = this.mailOptions.from ?? EMAIL_HOST_ADDRESS;

        const response = await transporter.sendMail(this.mailOptions);
    }
}

export default class EmailService {
    static async sendEmail(mailOptions: TMailOptions): Promise<void | Error> {
        try {
            await new Mailer(mailOptions).send();
        } catch (error: any) {
            console.log(error);
            logger.error(error.stack);
        }
    }
}

export { EmailTemplate };
