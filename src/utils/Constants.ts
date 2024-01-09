import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const deployed = process.env.DEPLOYED;
const path = deployed ? `/etc/secrets/.env` : `${__dirname}/../.env`;
dotenv.config({ path });

export const BAXI_URL: string | undefined = process.env.BAXI_URL
export const BAXI_TOKEN: string | undefined = process.env.BAXI_TOKEN
export const BUYPOWER_URL: string | undefined = process.env.BUYPOWER_URL
export const BUYPOWER_TOKEN: string | undefined = process.env.BUYPOWER_TOKEN
export const DEFAULT_ELECTRICITY_PROVIDER = process.env.DEFAULT_ELECTRICITY_PROVIDER as 'BAXI' | 'BUYPOWERNG' | 'IRECHARGE'
export const NODE_ENV = process.env.NODE_ENV as 'development' | 'production'
export const EMAIL_HOST = process.env.EMAIL_HOST as string
export const EMAIL_PORT = process.env.EMAIL_PORT as string
export const EMAIL_HOST_ADDRESS = process.env.EMAIL_HOST_ADDRESS as string
export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID as string
export const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET as string
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN as string
export const OAUTH_ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN as string
export const LOGO_URL = process.env.LOGO_URL as string
export const JWT_SECRET = process.env.JWT_SECRET as string
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string
export const REDIS_HOST = process.env.REDIS_HOST as string
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string
export const REDIS_PORT = parseInt(process.env.REDIS_PORT as string)
export const REDIS_URL = process.env.REDIS_URL as string
export const API_KEY_SECRET = process.env.API_KEY_SECRET as string;
export const CRYPTO_IV = process.env.CRYPTO_IV as string;
export const CRYPTO_PASSWORD = process.env.CRYPTO_PASSWORD as string;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string;
export const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY as string;
export const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID as string;
export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID as string;
export const KAFKA_USERNAME = process.env.KAFKA_USERNAME as string;
export const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD as string;
export const KAFKA_BROKER = process.env.KAFKA_BROKER as string;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;
export const MAX_REQUERY_PER_VENDOR = parseInt(process.env.MAX_REQUERY_PER_VENDOR as string, 10) 

export const DISCO_LOGO = {
    abuja: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/dpijlhj08ard76zao2uk.jpg",
    benin: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948367/WhatsApp_Image_2023-11-14_at_08.50.33_zh84o3.jpg",
    eko: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/yz6zowii45nsn3xl9lgv.jpg",
    ibadan: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948368/WhatsApp_Image_2023-11-14_at_08.50.32_vt9mdc.jpg",
    ikeja: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/hyrk5hn5pqszmdcqsrt5.jpg",
    enugu: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948368/WhatsApp_Image_2023-11-14_at_08.50.32_1_iu9iwx.jpg",
    jos: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/evry1ddtzu6ot6qrr7km.jpg",
    kano: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947956/jjvpfvqk9o3pwhrm0ivl.jpg",
    ph: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/i2gsvzisxezdkbcwqvtk.jpg",
    bh: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/i2gsvzisxezdkbcwqvtk.jpg",
    kaduna: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948178/WhatsApp_Image_2023-11-14_at_08.46.59_szkkyr.jpg",
    yola: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948178/WhatsApp_Image_2023-11-14_at_08.46.59_1_ckh3ce.jpg",

    ABUJA: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/dpijlhj08ard76zao2uk.jpg",
    BENIN: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948367/WhatsApp_Image_2023-11-14_at_08.50.33_zh84o3.jpg",
    EKO: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/yz6zowii45nsn3xl9lgv.jpg",
    IBADAN: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948368/WhatsApp_Image_2023-11-14_at_08.50.32_vt9mdc.jpg",
    IKEJA: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/hyrk5hn5pqszmdcqsrt5.jpg",
    ENUGU: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948368/WhatsApp_Image_2023-11-14_at_08.50.32_1_iu9iwx.jpg",
    JOS: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/evry1ddtzu6ot6qrr7km.jpg",
    KANO: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947956/jjvpfvqk9o3pwhrm0ivl.jpg",
    PH: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/i2gsvzisxezdkbcwqvtk.jpg",
    BH: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699947957/i2gsvzisxezdkbcwqvtk.jpg",
    KADUNA: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948178/WhatsApp_Image_2023-11-14_at_08.46.59_szkkyr.jpg",
    YOLA: "https://res.cloudinary.com/richiepersonaldev/image/upload/v1699948178/WhatsApp_Image_2023-11-14_at_08.46",
};

export const IRECHARGE_PRIVATE_KEY = process.env.IRECHARGE_PRIVATE_KEY as string,
    IRECHARGE_PUBLIC_KEY = process.env.IRECHARGE_PUBLIC_KEY as string,
    IRECHARGE_VENDOR_CODE = process.env.IRECHARGE_VENDOR_CODE as string;

export const DB_CONFIG = {
    NAME: process.env.DB_NAME as string,
    USER: process.env.DB_USER as string,
    PASS: process.env.DB_PASS as string,
    PORT: parseInt(process.env.DB_PORT as string),
    DIALECT: process.env.DB_DIALECT as "postgres",
    HOST: process.env.DB_HOST as string,
    URL: process.env.DB_URL as string,
};

export const PRIMARY_ROLES = ["Admin", "Partner", "TeamMember", "SuperAdmin"];

export const SU_HOST_EMAIL_1 = process.env.SU_HOST_EMAIL_1 as string,
    SU_HOST_EMAIL_2 = process.env.SU_HOST_EMAIL_2 as string,
    SU_HOST_EMAIL_3 = process.env.SU_HOST_EMAIL_3 as string;

export const NEW_RELIC_APP_NAME = process.env.NEW_RELIC_APP_NAME as string
export const  NEW_RELIC_LICENSE_KEY =  process.env.NEW_RELIC_LICENSE_KEY as string
export const NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED = process.env.NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED as string