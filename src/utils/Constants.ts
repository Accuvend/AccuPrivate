import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const deployed = process.env.DEPLOYED;
const path = deployed ? `/etc/secrets/.env` : `${__dirname}/../.env`;
dotenv.config({ path });
import fs from 'fs';
import csvParser from 'csv-parser';

export const MONGO_URI_LOG = process.env.MONGO_URI_LOG as string;
export const BAXI_URL: string | undefined = process.env.BAXI_URL
export const BAXI_TOKEN: string | undefined = process.env.BAXI_TOKEN
export const BAXI_AGENT_ID: string | undefined = process.env.BAXI_AGENT_ID
export const BUYPOWER_URL: string | undefined = process.env.BUYPOWER_URL
export const BUYPOWER_TOKEN: string | undefined = process.env.BUYPOWER_TOKEN
export const DEFAULT_ELECTRICITY_PROVIDER = process.env.DEFAULT_ELECTRICITY_PROVIDER as 'BAXI' | 'BUYPOWERNG' | 'IRECHARGE'
export const DEFAULT_AIRTIME_PROVIDER = process.env.DEFAULT_AIRTIME_PROVIDER as 'BAXI' | 'BUYPOWERNG' | 'IRECHARGE'
export const DEFAULT_DATA_PROVIDER = process.env.DEFAULT_AIRTIME_PROVIDER as 'BAXI' | 'BUYPOWERNG' | 'IRECHARGE'
export const NODE_ENV = process.env.NODE_ENV as 'development' | 'production' | 'staging'
export const KAFKA_ENV = process.env.KAFKA_ENV as string
export const KAFKA_CA_CERT = process.env.KAFKA_CA_CERT as string
export const KAFA_LOGS = process.env.KAFA_LOGS as string
export const KAFA_REGION = process.env.KAFA_LOGS as string
export const EMAIL_HOST = process.env.EMAIL_HOST as string
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string
export const EMAIL_PORT = parseInt(process.env.EMAIL_PORT as string, 10)
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
export const AFRICASTALKING_API_KEY = process.env.AFRICASTALKING_API_KEY as string;
export const AFRICASTALKING_USERNAME = process.env.AFRICASTALKING_USERNAME as string;
export const AFRICASTALKING_SENDER = process.env.AFRICASTALKING_SENDER as string;

export const VENDOR_URL = {
    IRECHARGE: {
        DEV: process.env.IRECHARGE_DEV_URL as string,
        PROD: process.env.IRECHARGE_PROD_URL as string,
    },
    BAXI: {
        DEV: process.env.BAXI_DEV_URL as string,
        PROD: process.env.BAXI_PROD_URL as string,
    },
    BUYPOWERNG: {
        DEV: process.env.BUYPOWERNG_DEV_URL as string,
        PROD: process.env.BUYPOWERNG_PROD_URL as string,
    },
}


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
    IRECHARGE_VENDOR_CODE = process.env.IRECHARGE_VENDOR_CODE as string , 
    IRECHARGE_URL = process.env.IRECHARGE_URL as string;

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


export const discoProductMapping = {
    'ECABEPS': {
        productName: 'ABUJA',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'abuja_electric_postpaid', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'ABUJA', commission: 1.80 },
            IRECHARGE: { discoCode: 'AEDC', commission: 1.80 }
        }
    },
    'ECEKEPS': {
        productName: 'EKO',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'eko_electric_postpaid', commission: 1.35 },
            BUYPOWERNG: { discoCode: 'EKO', commission: 1.50 },
            IRECHARGE: { discoCode: 'Eko_Postpaid', commission: 1.50 }
        }
    },
    'ECIKEPS': {
        productName: 'IKEJA',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'ikeja_electric_postpaid', commission: 1.30 },
            BUYPOWERNG: { discoCode: 'IKEJA', commission: 1.40 },
            IRECHARGE: { discoCode: 'Ikeja_Electric_Bill_Payment', commission: 1.20 }
        }
    },
    'ECJOPPS': {
        productName: 'JOS',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'jos_electric_postpaid', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'JOS', commission: 1.50 },
            IRECHARGE: { discoCode: 'Jos_Disco_Postpaid', commission: 1.50 }
        }
    },
    'ECKAEPS': {
        productName: 'KADUNA',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'kaduna_electric_postpaid', commission: 2.30 },
            BUYPOWERNG: { discoCode: 'KADUNA', commission: 2.00 },
            IRECHARGE: { discoCode: 'Kaduna_Electricity_Disco_Postpaid', commission: 2.00 }
        }
    },
    'ECEKEPE': {
        productName: 'EKO',
        type: 'PREPAID',
        vendors: {
            BAXI: { discoCode: 'eko_electric_prepaid', commission: 1.50 },
            BUYPOWERNG: { discoCode: 'EKO', commission: 1.50 },
            IRECHARGE: { discoCode: 'Eko_Prepaid', commission: 1.35 }
        }
    },
    'ECKDEPS': {
        productName: 'KADUNA',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'kaduna_electric_postpaid', commission: 2.30 },
            BUYPOWERNG: { discoCode: 'KADUNA', commission: 2.00 },
            IRECHARGE: { discoCode: 'Kaduna_Electricity_Disco_Postpaid', commission: 2.00 }
        }
    },
    'ECJSEPE': {
        productName: 'JOS',
        type: 'PREPAID',
        vendors: {
            BAXI: { discoCode: 'jos_electric_prepaid', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'JOS', commission: 1.50 },
            IRECHARGE: { discoCode: 'Jos_Disco_Prepaid', commission: 1.50 }
        }
    },
    'ECJSEPS': {
        productName: 'JOS',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'jos_electric_postpaid', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'JOS', commission: 1.50 },
            IRECHARGE: { discoCode: 'Jos_Disco_Postpaid', commission: 1.50 }
        }
    },
    'ECPHEPE': {
        productName: 'PORT-HARCOURT',
        type: 'PREPAID',
        vendors: {
            BAXI: { discoCode: 'portharcourt_electric_prepaid', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'PH', commission: 1.50 },
            IRECHARGE: { discoCode: 'PH_Disco', commission: 1.50 }
        }
    },
    'ECPHEPS': {
        productName: 'PORT-HARCOURT',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'portharcourt_electric_postpaid', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'PH', commission: 1.50 },
            IRECHARGE: { discoCode: 'PH_Disco', commission: 1.50 }
        }
    },
    'ECBNEPS': {
        productName: 'BENIN',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'ECBNEPS', commission: 2.20 },
            BUYPOWERNG: { discoCode: 'BENIN', commission: 2.20 },
            IRECHARGE: { discoCode: 'Benin', commission: 2.20 }
        }
    },
    'ECBNEPE': {
        productName: 'BENIN',
        type: 'PREPAID',
        vendors: {
            BAXI: { discoCode: 'ECBNEPE', commission: 2.20 },
            BUYPOWERNG: { discoCode: 'BENIN', commission: 2.20 },
            IRECHARGE: { discoCode: 'Benin', commission: 2.20 }
        }
    },
    'ECAHBEPS': {
        productName: 'YOLA',
        type: 'POSTPAID',
        vendors: {
            BAXI: { discoCode: 'YOLA', commission: 1.80 },
            BUYPOWERNG: { discoCode: 'YOLA', commission: 1.80 },
            IRECHARGE: { discoCode: 'YOLA', commission: 1.20 }
        }
    },
} as const

export const SEED = {
    ELECTRICITY: {
        'ECABEPS': {
            productName: 'ABUJA',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'abuja_electric_postpaid', commission: 1.20, bonus: 0 },
                BUYPOWERNG: { discoCode: 'ABUJA', commission: 1.80, bonus: 0 },
                IRECHARGE: { discoCode: 'AEDC_Postpaid', commission: 2.00, bonus: 0 },
            }
        },
        'ECEKEPS': {
            productName: 'EKO',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'eko_electric_postpaid', commission: 1.50, bonus: 0 },
                BUYPOWERNG: { discoCode: 'EKO', commission: 1.50, bonus: 0 },
                IRECHARGE: { discoCode: 'Eko_Postpaid', commission: 1.35, bonus: 70 },
            }
        },
        'ECIKEPS': {
            productName: 'IKEJA',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'ikeja_electric_postpaid', commission: 1.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'IKEJA', commission: 1.40, bonus: 0 },
                IRECHARGE: { discoCode: 'Ikeja_Electric_Bill_Payment', commission: 1.0, bonus: 60 },
            }
        },
        'ECJSEPS': {
            productName: 'JOS',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'jos_electric_postpaid', commission: 1.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'JOS', commission: 1.80, bonus: 0 },
                IRECHARGE: { discoCode: 'Jos_Disco_Postpaid', commission: 1.50, bonus: 0 },
            }
        },
        'ECJSEPE': {
            productName: 'JOS',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'jos_electric_prepaid', commission: 1.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'JOS', commission: 1.80, bonus: 0 },
                IRECHARGE: { discoCode: 'Jos_Disco', commission: 1.50, bonus: 60 },
            }
        },
        'ECKDEPS': {
            productName: 'KADUNA',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'kaduna_electric_prepaid', commission: 1.20, bonus: 0 },
                BUYPOWERNG: { discoCode: 'KADUNA', commission: 2.30, bonus: 0 },
                IRECHARGE: { discoCode: 'Kaduna_Electricity_Disco_Prepaid', commission: 2.0, bonus: 0 },
            }
        },
        'ECEKEPE': {
            productName: 'EKO',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'eko_electric_prepaid', commission: 1.50, bonus: 0 },
                BUYPOWERNG: { discoCode: 'EKO', commission: 1.50, bonus: 0 },
                IRECHARGE: { discoCode: 'Eko_Prepaid', commission: 1.35, bonus: 70 },
            }
        },
        'ECKDEPE': {
            productName: 'KADUNA',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'kaduna_electric_prepaid', commission: 1.20, bonus: 0 },
                BUYPOWERNG: { discoCode: 'KADUNA', commission: 2.30, bonus: 0 },
                IRECHARGE: { discoCode: 'Kaduna_Electricity_Disco', commission: 2.00, bonus: 70 },
            }
        },

        'ECPHEPE': {
            productName: 'PORTHARCOURT',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'portharcourt_electric_prepaid', commission: 1.20, bonus: 0 },
                BUYPOWERNG: { discoCode: 'PH', commission: 1.80, bonus: 0 },
                IRECHARGE: { discoCode: 'PhED_Electricity', commission: 1.50, bonus: 50 },
            }
        },
        'ECPHEPS': {
            productName: 'PORTHARCOURT',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'portharcourt_electric_postpaid', commission: 1.20, bonus: 0 },
                BUYPOWERNG: { discoCode: 'PH', commission: 1.80, bonus: 0 },
                IRECHARGE: { discoCode: 'PH_Disco', commission: 1.50, bonus: 50 },
            }
        },
        // 'ECBNEPS': {
        //     productName: 'BENIN',
        //     type: 'POSTPAID',
        //     vendors: {
        //         // BAXI: { discoCode: 'ECBNEPS', commission: 2.20, bonus: 0 },
        //         BUYPOWERNG: { discoCode: 'BENIN', commission: 2.20, bonus: 0 },
        //         IRECHARGE: { discoCode: 'BEDC_Postpaid', commission: 0.0, bonus: 0 },
        //     }
        // },
        // 'ECBNEPE': {
        //     productName: 'BENIN',
        //     type: 'PREPAID',
        //     vendors: {
        //         // BAXI: { discoCode: 'ECBNEPE', commission: 2.20, bonus: 0 },
        //         BUYPOWERNG: { discoCode: 'BENIN', commission: 2.20, bonus: 0 },
        //         IRECHARGE: { discoCode: 'BEDC', commission: 0.0, bonus: 0 },
        //     }
        // },
        'ECEGEPE': {
            productName: 'ENUGU',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'enugu_electric_prepaid', commission: 1.80, bonus: 0 },
                BUYPOWERNG: { discoCode: 'ENUGU', commission: 2.20, bonus: 0 },
                IRECHARGE: { discoCode: 'Enugu_Electricity_Distribution_Prepaid', commission: 1.50, bonus: 50 },
            }
        },
        'ECEGEPS': {
            productName: 'ENUGU',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'enugu_electric_postpaid', commission: 1.80, bonus: 0 },
                BUYPOWERNG: { discoCode: 'ENUGU', commission: 2.20, bonus: 0 },
                IRECHARGE: { discoCode: 'Enugu_Electricity_Distribution_Postpaid', commission: 1.50, bonus: 50 },
            }
        },
        'ECIKEPE': {
            productName: 'IKEJA',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'ikeja_electric_prepaid', commission: 1.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'IKEJA', commission: 1.40, bonus: 0 },
                IRECHARGE: { discoCode: 'Ikeja_Token_Purchase', commission: 1.0, bonus: 60 },
            }
        },
        'ECABEPE': {
            productName: 'ABUJA',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'abuja_electric_prepaid', commission: 1.20, bonus: 0 },
                BUYPOWERNG: { discoCode: 'ABUJA', commission: 1.80, bonus: 0 },
                IRECHARGE: { discoCode: 'AEDC', commission: 2.00, bonus: 0 },
            }
        },
        // 'ECAAEPE': {
        //     productName: 'ABA',
        //     type: 'PREPAID',
        //     vendors: {
        //         //BAXI: { discoCode: 'abuja_electric_prepaid', commission: 2.30, bonus: 0 },
        //         BUYPOWERNG: { discoCode: 'ABA', commission: 0.0, bonus: 0 },
        //         IRECHARGE: { discoCode: 'Aba_Power_Prepaid', commission: 0.0, bonus: 0 },
        //     }
        // },
        // 'ECAAEPS': {
        //     productName: 'ABA',
        //     type: 'POSTPAID',
        //     vendors: {
        //         //BAXI: { discoCode: 'abuja_electric_prepaid', commission: 2.30, bonus: 0 },
        //         BUYPOWERNG: { discoCode: 'ABA', commission: 0.0, bonus: 0 },
        //         IRECHARGE: { discoCode: 'Aba_Power_Postpaid', commission: 0.0, bonus: 0 },
        //     }
        // },
        'ECIBEPE': {
            productName: 'IBADAN',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'ibadan_electric_postpaid', commission: 0.6, bonus: 0 },
                BUYPOWERNG: { discoCode: 'IBADAN', commission: 1.0, bonus: 0 },
                IRECHARGE: { discoCode: 'Ibadan_Disco_Postpaid', commission: 0.0, bonus: 0 },
            }
        },
        'ECIBEPS': {
            productName: 'IBADAN',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'ibadan_electric_prepaid', commission: 0.6, bonus: 0 },
                BUYPOWERNG: { discoCode: 'IBADAN', commission: 1.0, bonus: 0 },
                IRECHARGE: { discoCode: 'Ibadan_Disco_Prepaid', commission: 1.30, bonus: 70 },
            }
        },
        'ECKAEPS': {
            productName: 'KANO',
            type: 'POSTPAID',
            vendors: {
                BAXI: { discoCode: 'kedco_electric_postpaid', commission: 1.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'KANO', commission: 1.8, bonus: 0 },
                IRECHARGE: { discoCode: 'Kano_Electricity_Disco_Postpaid', commission: 1.50, bonus: 0 },
            }
        },
        'ECKAEPE': {
            productName: 'KANO',
            type: 'PREPAID',
            vendors: {
                BAXI: { discoCode: 'kedco_electric_prepaid', commission: 1.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'KANO', commission: 1.8, bonus: 0 },
                IRECHARGE: { discoCode: 'Kano_Electricity_Disco', commission: 1.50, bonus: 0 },
            }
        },
    },
    AIRTIME: {
        'TCMTNVT': {
            productName: 'MTN',
            type: '',
            vendors: {
                BAXI: { discoCode: 'mtn', commission: 2.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'MTN', commission: 0, bonus: 0 },
                IRECHARGE: { discoCode: 'MTN', commission: 2.50, bonus: 0 },
            }
        },
        'TCGLOVT': {
            productName: 'GLO',
            type: '',
            vendors: {
                BAXI: { discoCode: 'glo', commission: 3.50, bonus: 0 },
                BUYPOWERNG: { discoCode: 'GLO', commission: 0, bonus: 0 },
                IRECHARGE: { discoCode: 'Glo', commission: 4.0, bonus: 0 },
            }
        },
        'TC9MBVT': {
            productName: '9MOBILE',
            type: '',
            vendors: {
                BAXI: { discoCode: '9mobile', commission: 3.5, bonus: 0 },
                BUYPOWERNG: { discoCode: '9MOBILE', commission: 0, bonus: 0 },
                IRECHARGE: { discoCode: '9MOBILE', commission: 3.5, bonus: 0 },
            }
        },
        'TCATLVT': {
            productName: 'AIRTEL',
            type: '',
            vendors: {
                BAXI: { discoCode: 'airtel', commission: 2.0, bonus: 0 },
                BUYPOWERNG: { discoCode: 'AIRTEL', commission: 0, bonus: 0 },
                IRECHARGE: { discoCode: 'Airtel', commission: 3.0, bonus: 0 },
            }
        },
    },
} as const;

export const SCHEMADATA = {
    BUYPOWERNG: {
        AIRTIME: {
            paymentType: 'B2B',
            vendType: 'PREPAID',
            vertical: 'VTU',
        },
        DATA: {
            paymentType: 'B2B',
            vendType: 'PREPAID',
            vertical: 'DATA',
        },
        CABLE: {
            paymentType: 'B2B',
            vendType: 'PREPAID',
            vertical: 'CABLE',
        },
        ELECTRICITY: {
            paymentType: 'B2B',
            vendType: 'PREPAID',
            vertical: 'ELECTRICITY',
        },
    },
    IRECHARGE: {
        AIRTIME: {
            vendor_code: "23126C8537",
            response_format: "json",
        },
        DATA: {
            vendor_code: "23126C8537",
            response_format: "json",
        },
        CABLE: {
            vendor_code: "23126C8537",
            response_format: "json",
        },
        ELECTRICITY: {
            vendor_code: "23126C8537",
            response_format: "json",
        },
    },
    BAXI: {
        AIRTIME: {
            agentId: BAXI_AGENT_ID
        },
        DATA: {
            agentId: BAXI_AGENT_ID
        },
        CABLE: {
            agentId: BAXI_AGENT_ID
        },
        ELECTRICITY: {
            agentId: BAXI_AGENT_ID
        },
    },
} as const

export const SEED_DATA = {
    IRECHARGE: {
        MTN: [
            {
                "code": "1",
                "title": "MTN D-MFIN-5-Combo-97 for Xtradata 20000 Monthly Bundle",
                "price": "20000",
                "validity": "Xtradata 20000 Monthly Bundle"
            },
            {
                "code": "2",
                "title": "MTN D-MFIN-5-Combo-96 for Xtradata 15000 Monthly Bundle",
                "price": "15000",
                "validity": "Xtradata 15000 Monthly Bundle"
            },
            {
                "code": "3",
                "title": "MTN D-MFIN-5-Combo-95 for Xtradata 10000 Monthly Bundle",
                "price": "10000",
                "validity": "Xtradata 10000 Monthly Bundle"
            },
            {
                "code": "4",
                "title": "MTN D-MFIN-5-Combo-94 for Xtradata 5000 Monthly Bundle",
                "price": "5000",
                "validity": "Xtradata 5000 Monthly Bundle"
            },
            {
                "code": "5",
                "title": "MTN D-MFIN-5-Combo-93 for Xtradata 2000 Monthly Bundle",
                "price": "2000",
                "validity": "Xtradata 2000 Monthly Bundle"
            },
            {
                "code": "6",
                "title": "MTN D-MFIN-5-Combo-92 for Xtradata 1000 Monthly Bundle",
                "price": "1000",
                "validity": "Xtradata 1000 Monthly Bundle"
            },
            {
                "code": "7",
                "title": "MTN D-MFIN-5-Combo-91 for Xtradata 500 Weekly Bundle",
                "price": "500",
                "validity": "Xtradata 500 Weekly Bundle"
            },
            {
                "code": "8",
                "title": "MTN D-MFIN-5-Combo-89 for Xtratalk 20000 Monthly Bundle",
                "price": "20000",
                "validity": "Xtratalk 20000 Monthly Bundle"
            },
            {
                "code": "9",
                "title": "MTN D-MFIN-5-Combo-88 for Xtratalk 15000 Monthly Bundle",
                "price": "15000",
                "validity": "Xtratalk 15000 Monthly Bundle"
            },
            {
                "code": "10",
                "title": "MTN D-MFIN-5-Combo-87 for Xtratalk 10000 Monthly Bundle",
                "price": "10000",
                "validity": "Xtratalk 10000 Monthly Bundle"
            },
            {
                "code": "11",
                "title": "MTN D-MFIN-5-Combo-86 for Xtratalk 5000 Monthly Bundle",
                "price": "5000",
                "validity": "Xtratalk 5000 Monthly Bundle"
            },
            {
                "code": "12",
                "title": "MTN D-MFIN-5-Combo-85 for Xtratalk 2000 Monthly Bundle",
                "price": "2000",
                "validity": "Xtratalk 2000 Monthly Bundle"
            },
            {
                "code": "13",
                "title": "MTN D-MFIN-5-Combo-84 for Xtratalk 1000 Monthly Bundle",
                "price": "1000",
                "validity": "Xtratalk 1000 Monthly Bundle"
            },
            {
                "code": "14",
                "title": "MTN D-MFIN-5-Combo-83 for Xtratalk 500 Weekly Bundle",
                "price": "500",
                "validity": "Xtratalk 500 Weekly Bundle"
            },
            {
                "code": "15",
                "title": "MTN D-MFIN-5-Combo-73 for Xtratalk 300 Weekly Bundle\r\nXtratalk 300 Weekly Bundle",
                "price": "300",
                "validity": "Xtratalk 300 Weekly Bundle\r\nXtratalk 300 Weekly Bundle"
            },
            {
                "code": "16",
                "title": "MTN D-MFIN-5-Combo-1588 for Xtradata 300 Weekly Bundle",
                "price": "300",
                "validity": "Xtradata 300 Weekly Bundle"
            },
            {
                "code": "17",
                "title": "MTN D-MFIN-5-Combo-1587 for Xtratalk 200 3days Bundle\r\nXtratalk 200 3days Bundle",
                "price": "200",
                "validity": "Xtratalk 200 3days Bundle\r\nXtratalk 200 3days Bundle"
            },
            {
                "code": "18",
                "title": "MTN D-MFIN-5-7GB-A for 7GB Weekly Bundle",
                "price": "2000",
                "validity": "7GB Weekly Bundle"
            },
            {
                "code": "19",
                "title": "MTN D-MFIN-5-774 for 1TB SME 3-Months Plan",
                "price": "350000",
                "validity": "1TB SME 3-Months Plan"
            },
            {
                "code": "20",
                "title": "MTN D-MFIN-5-773 for 165GB SME 2-Months Plan",
                "price": "50000",
                "validity": "165GB SME 2-Months Plan"
            },
            {
                "code": "21",
                "title": "MTN D-MFIN-5-755 for 400GB Yearly Plan",
                "price": "120000",
                "validity": "400GB Yearly Plan"
            },
            {
                "code": "22",
                "title": "MTN D-MFIN-5-746 for 120GB Monthly Plan + 80mins.",
                "price": "22000",
                "validity": "120GB Monthly Plan + 80mins."
            },
            {
                "code": "23",
                "title": "MTN D-MFIN-5-745 for 10GB+2GB YouTube Night+300MB YouTube Music + 20mins.",
                "price": "3500",
                "validity": "10GB+2GB YouTube Night+300MB YouTube Music + 20mins."
            },
            {
                "code": "24",
                "title": "MTN D-MFIN-5-744 for 8GB+2GB YouTube Night+200MB YouTube Music + 15mins.",
                "price": "3000",
                "validity": "8GB+2GB YouTube Night+200MB YouTube Music + 15mins."
            },
            {
                "code": "25",
                "title": "MTN D-MFIN-5-743 for 5GB Weekly Plan",
                "price": "1500",
                "validity": "5GB Weekly Plan"
            },
            {
                "code": "26",
                "title": "MTN D-MFIN-5-742 for 1GB Weekly Plan + FREE 1GB for YouTube and 100MB for YouTube Music + 5mins.",
                "price": "600",
                "validity": "1GB Weekly Plan + FREE 1GB for YouTube and 100MB for YouTube Music + 5mins."
            },
            {
                "code": "27",
                "title": "MTN D-MFIN-5-600 for 2.5GB 2-Day Plan",
                "price": "600",
                "validity": "2.5GB 2-Day Plan"
            },
            {
                "code": "28",
                "title": "MTN D-MFIN-5-422 for 25GB SME Monthly Plan",
                "price": "10000",
                "validity": "25GB SME Monthly Plan"
            },
            {
                "code": "29",
                "title": "MTN D-MFIN-5-3GB-A for 3GB 2-Days Bundle",
                "price": "800",
                "validity": "3GB 2-Days Bundle"
            },
            {
                "code": "30",
                "title": "MTN D-MFIN-5-360GB for 360GB SME 3-Months Plan",
                "price": "100000",
                "validity": "360GB SME 3-Months Plan"
            },
            {
                "code": "31",
                "title": "MTN D-MFIN-5-307 for DataPlan 100MB Daily",
                "price": "100",
                "validity": "DataPlan 100MB Daily"
            },
            {
                "code": "32",
                "title": "MTN D-MFIN-5-278 for 75GB Monthly Plan + 40mins.",
                "price": "16000",
                "validity": "75GB Monthly Plan + 40mins."
            },
            {
                "code": "33",
                "title": "MTN D-MFIN-5-276 for 1GB Daily Plan + 3mins.",
                "price": "350",
                "validity": "1GB Daily Plan + 3mins."
            },
            {
                "code": "34",
                "title": "MTN D-MFIN-5-212 for 25GB+2GB YouTube Night + 25mins.",
                "price": "6500",
                "validity": "25GB+2GB YouTube Night + 25mins."
            },
            {
                "code": "35",
                "title": "MTN D-MFIN-5-211 for 3GB+2GB YouTube Night+200MB YouTube Music + 5mins.",
                "price": "1600",
                "validity": "3GB+2GB YouTube Night+200MB YouTube Music + 5mins."
            },
            {
                "code": "36",
                "title": "MTN D-MFIN-5-210 for 160GB 2-Month Plan",
                "price": "30000",
                "validity": "160GB 2-Month Plan"
            },
            {
                "code": "37",
                "title": "MTN D-MFIN-5-204 for 1-Year Plan",
                "price": "450000",
                "validity": "1-Year Plan"
            },
            {
                "code": "38",
                "title": "MTN D-MFIN-5-203 for 2.5TB Yearly Plan",
                "price": "250000",
                "validity": "2.5TB Yearly Plan"
            },
            {
                "code": "39",
                "title": "MTN D-MFIN-5-202 for 1 year Plan",
                "price": "100000",
                "validity": "1 year Plan"
            },
            {
                "code": "40",
                "title": "MTN D-MFIN-5-201 for 600GB 3-Month Plan",
                "price": "75000",
                "validity": "600GB 3-Month Plan"
            },
            {
                "code": "41",
                "title": "MTN D-MFIN-5-200 for 400GB 3-Month Plan",
                "price": "50000",
                "validity": "400GB 3-Month Plan"
            },
            {
                "code": "42",
                "title": "MTN D-MFIN-5-199 for 100GB 2-Month Plan",
                "price": "20000",
                "validity": "100GB 2-Month Plan"
            },
            {
                "code": "43",
                "title": "MTN D-MFIN-5-198 for 40GB Monthly Plan + 40mins.",
                "price": "11000",
                "validity": "40GB Monthly Plan + 40mins."
            },
            {
                "code": "44",
                "title": "MTN D-MFIN-5-197 for 20GB+2GB YouTube Night+300MB YouTube Music + 25mins.",
                "price": "5500",
                "validity": "20GB+2GB YouTube Night+300MB YouTube Music + 25mins."
            },
            {
                "code": "45",
                "title": "MTN D-MFIN-5-196 for 12GB+2GB YouTube Night + 25mins.",
                "price": "4000",
                "validity": "12GB+2GB YouTube Night + 25mins."
            },
            {
                "code": "46",
                "title": "MTN D-MFIN-5-195 for 4GB+2GB YouTube Night+200MB YouTube Music + 10mins.",
                "price": "2000",
                "validity": "4GB+2GB YouTube Night+200MB YouTube Music + 10mins."
            },
            {
                "code": "47",
                "title": "MTN D-MFIN-5-192 for Data Plan 200MB 3-Day Plan",
                "price": "200",
                "validity": "Data Plan 200MB 3-Day Plan"
            },
            {
                "code": "48",
                "title": "MTN D-MFIN-5-15AD for 1.2GB Monthly Plan + FREE 2GB for YouTube and 200MB for YouTube Music + 5mins.",
                "price": "1000",
                "validity": "1.2GB Monthly Plan + FREE 2GB for YouTube and 200MB for YouTube Music + 5mins."
            },
            {
                "code": "49",
                "title": "MTN D-MFIN-5-1596 for 27GB Monthly Plan + 25mins.",
                "price": "6500",
                "validity": "27GB Monthly Plan + 25mins."
            },
            {
                "code": "50",
                "title": "MTN D-MFIN-5-1595 for 22GB Monthly Plan + 25mins.",
                "price": "5500",
                "validity": "22GB Monthly Plan + 25mins."
            },
            {
                "code": "51",
                "title": "MTN D-MFIN-5-1594 for 13GB Monthly Plan + 25mins.",
                "price": "4000",
                "validity": "13GB Monthly Plan + 25mins."
            },
            {
                "code": "52",
                "title": "MTN D-MFIN-5-1593 for 11GB Monthly Plan + 20mins.",
                "price": "3500",
                "validity": "11GB Monthly Plan + 20mins."
            },
            {
                "code": "53",
                "title": "MTN D-MFIN-5-153 for 1.5GB+2.4GB YouTube Night+3hr-200MB-YouTube Weekly + 5mins.",
                "price": "1200",
                "validity": "1.5GB+2.4GB YouTube Night+3hr-200MB-YouTube Weekly + 5mins."
            },
            {
                "code": "54",
                "title": "MTN D-MFIN-5-13500 for 35GB SME Monthly Plan",
                "price": "13500",
                "validity": "35GB SME Monthly Plan"
            }
        ],
        GLO: [
            {
                "code": "111",
                "title": "Glo D-MFIN-6-DATA400 for Day Plan 1 days",
                "price": "50",
                "validity": "Day Plan 1 days"
            },
            {
                "code": "112",
                "title": "Glo D-MFIN-6-DATA401 for Day Plan 1 days",
                "price": "100",
                "validity": "Day Plan 1 days"
            },
            {
                "code": "113",
                "title": "Glo D-MFIN-6-DATA402 for Day Plan 2 days",
                "price": "200",
                "validity": "Day Plan 2 days"
            },
            {
                "code": "114",
                "title": "Glo D-MFIN-6-DATA403 for Weekly Plan 14 days",
                "price": "500",
                "validity": "Weekly Plan 14 days"
            },
            {
                "code": "115",
                "title": "Glo D-MFIN-6-DATA404 for Monthly Plan 30 days",
                "price": "1000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "116",
                "title": "Glo D-MFIN-6-DATA433 for Monthly Plan 30 days",
                "price": "1500",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "117",
                "title": "Glo D-MFIN-6-DATA405 for Monthly Plan 30 days",
                "price": "2000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "118",
                "title": "Glo D-MFIN-6-DATA406 for Monthly Plan 30 days",
                "price": "2500",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "119",
                "title": "Glo D-MFIN-6-DATA407 for Monthly Plan 30 days",
                "price": "3000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "120",
                "title": "Glo D-MFIN-6-DATA408 for Monthly Plan 30 days",
                "price": "4000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "121",
                "title": "Glo D-MFIN-6-DATA409 for Monthly Plan 30 days",
                "price": "5000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "122",
                "title": "Glo D-MFIN-6-DATA410 for Monthly Plan 30 days",
                "price": "8000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "123",
                "title": "Glo D-MFIN-6-DATA430 for Monthly Plan 30 days",
                "price": "10000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "124",
                "title": "Glo D-MFIN-6-DATA411 for Monthly Plan 30 days",
                "price": "15000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "125",
                "title": "Glo D-MFIN-6-DATA412 for Monthly Plan 30 days",
                "price": "18000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "126",
                "title": "Glo D-MFIN-6-DATA432 for Monthly Plan 30 days",
                "price": "20000",
                "validity": "Monthly Plan 30 days"
            },
            {
                "code": "127",
                "title": "Glo D-MFIN-6-DATA15 for Night Plan 1 days",
                "price": "25",
                "validity": "Night Plan 1 days"
            },
            {
                "code": "128",
                "title": "Glo D-MFIN-6-DATA30 for Night Plan 1 days",
                "price": "50",
                "validity": "Night Plan 1 days"
            },
            {
                "code": "129",
                "title": "Glo D-MFIN-6-DATA31 for Night Plan 5 days",
                "price": "100",
                "validity": "Night Plan 5 days"
            },
            {
                "code": "130",
                "title": "Glo D-MFIN-6-DATA35 for Special Plan 1 days",
                "price": "300",
                "validity": "Special Plan 1 days"
            },
            {
                "code": "131",
                "title": "Glo D-MFIN-6-DATA36 for Special Plan 2 days",
                "price": "500",
                "validity": "Special Plan 2 days"
            },
            {
                "code": "132",
                "title": "Glo D-MFIN-6-DATA24 for Special Plan 7 days",
                "price": "1500",
                "validity": "Special Plan 7 days"
            },
            {
                "code": "133",
                "title": "Glo D-MFIN-6-DATA14 for Weekend Plan 2 (Sat & Sun) days",
                "price": "500",
                "validity": "Weekend Plan 2 (Sat & Sun) days"
            },
            {
                "code": "134",
                "title": "Glo D-MFIN-6-DATA37 for Weekend Plan 1 (Sun) days",
                "price": "200",
                "validity": "Weekend Plan 1 (Sun) days"
            },
            {
                "code": "135",
                "title": "Glo D-MFIN-6-DATA434 for Mega Plan 30 days",
                "price": "30000",
                "validity": "Mega Plan 30 days"
            },
            {
                "code": "136",
                "title": "Glo D-MFIN-6-DATA435 for Mega Plan 30 days",
                "price": "36000",
                "validity": "Mega Plan 30 days"
            },
            {
                "code": "137",
                "title": "Glo D-MFIN-6-DATA436 for Mega Plan 90 days",
                "price": "50000",
                "validity": "Mega Plan 90 days"
            },
            {
                "code": "138",
                "title": "Glo D-MFIN-6-DATA437 for Mega Plan 120 days",
                "price": "60000",
                "validity": "Mega Plan 120 days"
            },
            {
                "code": "139",
                "title": "Glo D-MFIN-6-DATA438 for Mega Plan 120 days",
                "price": "75000",
                "validity": "Mega Plan 120 days"
            },
            {
                "code": "140",
                "title": "Glo D-MFIN-6-DATA439 for Mega Plan 365 days",
                "price": "100000",
                "validity": "Mega Plan 365 days"
            },
            {
                "code": "141",
                "title": "Glo D-MFIN-6-DATA780 for Glo TV 3 days",
                "price": "150",
                "validity": "Glo TV 3 days"
            },
            {
                "code": "142",
                "title": "Glo D-MFIN-6-DATA781 for Glo TV 7 days",
                "price": "450",
                "validity": "Glo TV 7 days"
            },
            {
                "code": "143",
                "title": "Glo D-MFIN-6-DATA782 for Glo TV 30 days",
                "price": "1400",
                "validity": "Glo TV 30 days"
            },
            {
                "code": "144",
                "title": "Glo D-MFIN-6-DATA783 for Glo TV 7 days",
                "price": "900",
                "validity": "Glo TV 7 days"
            },
            {
                "code": "145",
                "title": "Glo D-MFIN-6-DATA784 for Glo TV 30 days",
                "price": "3200",
                "validity": "Glo TV 30 days"
            },
            {
                "code": "146",
                "title": "Glo D-MFIN-6-DATA850 for Social Plan 1 days",
                "price": "25",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "147",
                "title": "Glo D-MFIN-6-DATA851 for Social Plan 7 days",
                "price": "50",
                "validity": "Social Plan 7 days"
            },
            {
                "code": "148",
                "title": "Glo D-MFIN-6-DATA852 for Social Plan 30 days",
                "price": "100",
                "validity": "Social Plan 30 days"
            },
            {
                "code": "149",
                "title": "Glo D-MFIN-6-DATA853 for Social Plan 1 days",
                "price": "25",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "150",
                "title": "Glo D-MFIN-6-DATA854 for Social Plan 7 days",
                "price": "50",
                "validity": "Social Plan 7 days"
            },
            {
                "code": "151",
                "title": "Glo D-MFIN-6-DATA855 for Social Plan 30 days",
                "price": "100",
                "validity": "Social Plan 30 days"
            },
            {
                "code": "152",
                "title": "Glo D-MFIN-6-DATA856 for Social Plan 1 days",
                "price": "25",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "153",
                "title": "Glo D-MFIN-6-DATA857 for Social Plan 7 days",
                "price": "50",
                "validity": "Social Plan 7 days"
            },
            {
                "code": "154",
                "title": "Glo D-MFIN-6-DATA858 for Social Plan 30 days",
                "price": "100",
                "validity": "Social Plan 30 days"
            },
            {
                "code": "155",
                "title": "Glo D-MFIN-6-DATA859 for Social Plan 1 days",
                "price": "25",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "156",
                "title": "Glo D-MFIN-6-DATA860 for Social Plan 7 days",
                "price": "50",
                "validity": "Social Plan 7 days"
            },
            {
                "code": "157",
                "title": "Glo D-MFIN-6-DATA861 for Social Plan 30 days",
                "price": "100",
                "validity": "Social Plan 30 days"
            },
            {
                "code": "158",
                "title": "Glo D-MFIN-6-DATA869 for Social Plan 7 days",
                "price": "50",
                "validity": "Social Plan 7 days"
            },
            {
                "code": "159",
                "title": "Glo D-MFIN-6-DATA871 for Social Plan 1 days",
                "price": "50",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "160",
                "title": "Glo D-MFIN-6-DATA872 for Social Plan 7 days",
                "price": "100",
                "validity": "Social Plan 7 days"
            },
            {
                "code": "161",
                "title": "Glo D-MFIN-6-DATA873 for Social Plan 30 days",
                "price": "250",
                "validity": "Social Plan 30 days"
            },
            {
                "code": "162",
                "title": "Glo D-MFIN-6-DATA874 for Social Plan 1 days",
                "price": "50",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "163",
                "title": "Glo D-MFIN-6-DATA875 for Social Plan 1 days",
                "price": "130",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "164",
                "title": "Glo D-MFIN-6-DATA876 for Social Plan 1 days",
                "price": "50",
                "validity": "Social Plan 1 days"
            },
            {
                "code": "165",
                "title": "Glo D-MFIN-6-DATA877 for Social Plan 7 days",
                "price": "200",
                "validity": "Social Plan 7 days"
            }
        ],
        AIRTEL: [
            {
                "code": "55",
                "title": "Airtel D-MFIN-1-40MB for 1 day",
                "price": "50",
                "validity": "1 day"
            },
            {
                "code": "56",
                "title": "Airtel D-MFIN-1-100MB for 1 day",
                "price": "99",
                "validity": "1 day"
            },
            {
                "code": "57",
                "title": "Airtel D-MFIN-1-200MB for 3 days",
                "price": "199",
                "validity": "3 days"
            },
            {
                "code": "58",
                "title": "Airtel D-MFIN-1-350MB for 7 days",
                "price": "349",
                "validity": "7 days"
            },
            {
                "code": "59",
                "title": "Airtel D-MFIN-1-750MB for 7 days",
                "price": "499",
                "validity": "7 days"
            },
            {
                "code": "60",
                "title": "Airtel D-MFIN-1-1.5GB for 30 days",
                "price": "999",
                "validity": "30 days"
            },
            {
                "code": "61",
                "title": "Airtel D-MFIN-1-3GB for 30 days",
                "price": "1499",
                "validity": "30 days"
            },
            {
                "code": "62",
                "title": "Airtel D-MFIN-1-6GB for 30 days",
                "price": "2499",
                "validity": "30 days"
            },
            {
                "code": "63",
                "title": "Airtel D-MFIN-1-11GB for 30 days",
                "price": "3999",
                "validity": "30 days"
            },
            {
                "code": "64",
                "title": "Airtel D-MFIN-1-20GB for 30 days",
                "price": "4999",
                "validity": "30 days"
            },
            {
                "code": "65",
                "title": "Airtel D-MFIN-1-40GB for 30 days",
                "price": "9999",
                "validity": "30 days"
            },
            {
                "code": "66",
                "title": "Airtel D-MFIN-1-75GB for 30 days",
                "price": "14999",
                "validity": "30 days"
            },
            {
                "code": "67",
                "title": "Airtel D-MFIN-1-8GB for 30 days",
                "price": "2999",
                "validity": "30 days"
            },
            {
                "code": "68",
                "title": "Airtel D-MFIN-1-120GB for 30 days",
                "price": "19999",
                "validity": "30 days"
            },
            {
                "code": "69",
                "title": "Airtel D-MFIN-1-1GB1D for 1 day",
                "price": "349",
                "validity": "1 day"
            },
            {
                "code": "70",
                "title": "Airtel D-MFIN-1-2GB1D for 1 day",
                "price": "499",
                "validity": "1 day"
            },
            {
                "code": "71",
                "title": "Airtel D-MFIN-1-6GB1W for 7 days",
                "price": "1499",
                "validity": "7 days"
            },
            {
                "code": "72",
                "title": "Airtel D-MFIN-1-2GB1M for 30 days",
                "price": "1199",
                "validity": "30 days"
            },
            {
                "code": "73",
                "title": "Airtel D-MFIN-1-4.5GB for 30 days",
                "price": "1999",
                "validity": "30 days"
            },
            {
                "code": "74",
                "title": "Airtel D-MFIN-1-25GB1M for 30 days",
                "price": "7999",
                "validity": "30 days"
            },
            {
                "code": "75",
                "title": "Airtel D-MFIN-1-200GB1M for 30 days",
                "price": "29999",
                "validity": "30 days"
            },
            {
                "code": "76",
                "title": "Airtel D-MFIN-1-280GB1M for 30 days",
                "price": "35999",
                "validity": "30 days"
            },
            {
                "code": "77",
                "title": "Airtel D-MFIN-1-400GB3M for 90 days",
                "price": "49999",
                "validity": "90 days"
            },
            {
                "code": "78",
                "title": "Airtel D-MFIN-1-500GB4M for 120 days",
                "price": "59999",
                "validity": "120 days"
            },
            {
                "code": "79",
                "title": "Airtel D-MFIN-1-1TB1Y for 365 days",
                "price": "99999",
                "validity": "365 days"
            },
            {
                "code": "80",
                "title": "Airtel D-MFIN-1-1GB for 14 day",
                "price": "599",
                "validity": "14 day"
            },
            {
                "code": "81",
                "title": "Airtel D-MFIN-1-15GB for 7 day",
                "price": "999",
                "validity": "7 day"
            },
            {
                "code": "82",
                "title": "Airtel D-MFIN-1-7GB for 7 day",
                "price": "1999",
                "validity": "7 day"
            },
            {
                "code": "83",
                "title": "Airtel D-MFIN-1-25GB for 7 day",
                "price": "4999",
                "validity": "7 day"
            },
            {
                "code": "84",
                "title": "Airtel D-MFIN-1-15MB for 1 day",
                "price": "399",
                "validity": "1 day"
            },
            {
                "code": "85",
                "title": "Airtel D-MFIN-1-35GB for 2 day",
                "price": "799",
                "validity": "2 day"
            },
            {
                "code": "86",
                "title": "Airtel D-MFIN-1-23GB for 30 day",
                "price": "5999",
                "validity": "30 day"
            },
            {
                "code": "87",
                "title": "Airtel D-MFIN-1-50MB for This Data plan gives 40MB for N50 valid for 1day (Social Plan)",
                "price": "50",
                "validity": "This Data plan gives 40MB for N50 valid for 1day (Social Plan)"
            },
            {
                "code": "88",
                "title": "Airtel D-MFIN-1-200MB2 for This Data plan gives 200MB for N100 valid for 5day (Social Plan)",
                "price": "100",
                "validity": "This Data plan gives 200MB for N100 valid for 5day (Social Plan)"
            },
            {
                "code": "89",
                "title": "Airtel D-MFIN-1-400MB for This Data plan gives 400MB for N100 valid for 3day (TikTok)",
                "price": "100",
                "validity": "This Data plan gives 400MB for N100 valid for 3day (TikTok)"
            },
            {
                "code": "90",
                "title": "Airtel D-MFIN-1-1024MB for This Data plan gives 1,024MB for N200 valid for 14day (Tik Tok)",
                "price": "200",
                "validity": "This Data plan gives 1,024MB for N200 valid for 14day (Tik Tok)"
            },
            {
                "code": "91",
                "title": "Airtel D-MFIN-1-2048MB for This Data plan gives 2,048MB for N200 valid for 1 hr",
                "price": "200",
                "validity": "This Data plan gives 2,048MB for N200 valid for 1 hr"
            },
            {
                "code": "92",
                "title": "Airtel D-MFIN-1-700MB for This Data plan gives 700MB for N300 valid for 25days (Social Plan)",
                "price": "300",
                "validity": "This Data plan gives 700MB for N300 valid for 25days (Social Plan)"
            }
        ],
        '9MOBILE': [
            {
                "code": "93",
                "title": "Etisalat D-MFIN-2-1.5GB for 30 days \t\r\n4.2GB (2GB+2.2GB Night)",
                "price": "1000",
                "validity": "30 days \t\r\n4.2GB (2GB+2.2GB Night)"
            },
            {
                "code": "94",
                "title": "Etisalat D-MFIN-2-2GB for 30 days 6.5GB (2.5GB+4GB Night)",
                "price": "1200",
                "validity": "30 days 6.5GB (2.5GB+4GB Night)"
            },
            {
                "code": "95",
                "title": "Etisalat D-MFIN-2-4.5GB for 30 days 9.5GB (5.5GB+4GB Night)",
                "price": "2000",
                "validity": "30 days 9.5GB (5.5GB+4GB Night)"
            },
            {
                "code": "96",
                "title": "Etisalat D-MFIN-2-40GB for 30 days",
                "price": "10000",
                "validity": "30 days"
            },
            {
                "code": "97",
                "title": "Etisalat D-MFIN-2-165GB for 1 days",
                "price": "300",
                "validity": "1 days"
            },
            {
                "code": "98",
                "title": "Etisalat D-MFIN-2-365GB for 30 days",
                "price": "3000",
                "validity": "30 days"
            },
            {
                "code": "99",
                "title": "Etisalat D-MFIN-2-11GB for 30 days 18.5GB (15GB+3.5GB Night)",
                "price": "4000",
                "validity": "30 days 18.5GB (15GB+3.5GB Night)"
            },
            {
                "code": "100",
                "title": "Etisalat D-MFIN-2-25MB for 1 day",
                "price": "50",
                "validity": "1 day"
            },
            {
                "code": "101",
                "title": "Etisalat D-MFIN-2-100MB for 1 day",
                "price": "100",
                "validity": "1 day"
            },
            {
                "code": "102",
                "title": "Etisalat D-MFIN-2-650MB for 1 day",
                "price": "200",
                "validity": "1 day"
            },
            {
                "code": "103",
                "title": "Etisalat D-MFIN-2-15GB for 30 days",
                "price": "5000",
                "validity": "30 days"
            },
            {
                "code": "104",
                "title": "Etisalat D-MFIN-2-100GB for 1 days",
                "price": "150",
                "validity": "1 days"
            },
            {
                "code": "105",
                "title": "Etisalat D-MFIN-2-7GB1W for 7 days",
                "price": "1500",
                "validity": "7 days"
            },
            {
                "code": "106",
                "title": "Etisalat D-MFIN-2-5M for 30 days",
                "price": "500",
                "validity": "30 days"
            },
            {
                "code": "107",
                "title": "Etisalat D-MFIN-2-75M30 for 30 days",
                "price": "15000",
                "validity": "30 days"
            },
            {
                "code": "108",
                "title": "Etisalat D-MFIN-2-75M for 30 days",
                "price": "20000",
                "validity": "30 days"
            },
            {
                "code": "109",
                "title": "Etisalat D-MFIN-2-2.5GB for 30 days \t11GB (7GB+ 4GB Night)",
                "price": "2500",
                "validity": "30 days \t11GB (7GB+ 4GB Night)"
            },
            {
                "code": "110",
                "title": "Etisalat D-MFIN-2-35GB for 30 days",
                "price": "7000",
                "validity": "30 days"
            }
        ]
    },
    BUYPOWERNG: {
        MTN: [
            { code: 'DATA-01', title: '100MB ', price: 100, validity: ' 1day' },
            {
                code: 'DATA-02',
                title: '200MB ',
                price: 200,
                validity: ' 3days'
            },
            {
                code: 'DATA-03',
                title: '350MB ',
                price: 300,
                validity: ' 7days'
            },
            {
                code: 'DATA-04',
                title: '750MB ',
                price: 500,
                validity: ' 14days'
            },
            {
                code: 'DATA-05',
                title: '2GB ',
                price: 1200,
                validity: ' 30days'
            },
            {
                code: 'DATA-06',
                title: '1.5GB ',
                price: 1000,
                validity: ' 30days'
            },
            { code: 'DATA-07', title: '1GB ', price: 300, validity: ' 1day' },
            {
                code: 'DATA-08',
                title: '3GB ',
                price: 1500,
                validity: ' 30days'
            },
            {
                code: 'DATA-10',
                title: '1500GB ',
                price: 450000,
                validity: ' 360days'
            },
            {
                code: 'DATA-11',
                title: '2.5GB ',
                price: 500,
                validity: ' 2days'
            },
            {
                code: 'DATA-12',
                title: '400GB ',
                price: 120000,
                validity: ' 360days'
            },
            {
                code: 'DATA-13',
                title: '75GB ',
                price: 20000,
                validity: ' 60days'
            },
            {
                code: 'DATA-14',
                title: '120GB ',
                price: 30000,
                validity: ' 60days'
            },
            {
                code: 'DATA-15',
                title: '150GB ',
                price: 50000,
                validity: ' 90days'
            },
            {
                code: 'DATA-16',
                title: '250GB ',
                price: 75000,
                validity: ' 90days'
            },
            {
                code: 'DATA-17',
                title: '25GB ',
                price: 6000,
                validity: ' 30days'
            },
            { code: 'DATA-18', title: '1GB ', price: 500, validity: ' 7days' },
            { code: 'DATA-19', title: '6GB ', price: 1500, validity: ' 7days' },
            {
                code: 'DATA-20',
                title: '6GB ',
                price: 2500,
                validity: ' 30days'
            },
            {
                code: 'DATA-21',
                title: '10GB ',
                price: 3000,
                validity: ' 30days'
            },
            {
                code: 'DATA-22',
                title: '110GB ',
                price: 20000,
                validity: ' 30days'
            },
            {
                code: 'DATA-23',
                title: '25GB ',
                price: 10000,
                validity: ' 30days'
            },
            {
                code: 'DATA-24',
                title: '165GB ',
                price: 50000,
                validity: ' 60days'
            },
            {
                code: 'DATA-25',
                title: '360GB ',
                price: 100000,
                validity: ' 90days'
            },
            {
                code: 'DATA-26',
                title: '1TB ',
                price: 250000,
                validity: ' 90days'
            },
            {
                code: 'DATA-27',
                title: '4.5GB ',
                price: 2000,
                validity: ' 30days'
            },
            {
                code: 'DATA-28',
                title: '12GB ',
                price: 3500,
                validity: ' 30days'
            },
            {
                code: 'DATA-29',
                title: '20GB ',
                price: 5000,
                validity: ' 30days'
            },
            {
                code: 'DATA-30',
                title: '40GB ',
                price: 10000,
                validity: ' 30days'
            },
            {
                code: 'DATA-31',
                title: '75GB ',
                price: 15000,
                validity: ' 30days'
            },
            {
                code: 'DATA-32',
                title: 'Xtratalk 200 ',
                price: 200,
                validity: ' 3days'
            },
            {
                code: 'DATA-33',
                title: 'Xtratalk 300 ',
                price: 300,
                validity: ' 7days'
            },
            {
                code: 'DATA-34',
                title: 'Xtratalk 500 ',
                price: 500,
                validity: ' 7days'
            },
            {
                code: 'DATA-35',
                title: 'Xtratalk 1000 ',
                price: 1000,
                validity: ' 30days'
            },
            {
                code: 'DATA-36',
                title: 'Xtratalk 2000 ',
                price: 2000,
                validity: ' 30days'
            },
            {
                code: 'DATA-37',
                title: 'Xtratalk 5000 ',
                price: 5000,
                validity: ' 30days'
            },
            {
                code: 'DATA-38',
                title: 'Xtratalk 10000 ',
                price: 10000,
                validity: ' 30days'
            },
            {
                code: 'DATA-39',
                title: 'Xtratalk 15000 ',
                price: 15000,
                validity: ' 30days'
            },
            {
                code: 'DATA-40',
                title: 'Xtratalk 20000 ',
                price: 20000,
                validity: ' 30days'
            },
            {
                code: 'DATA-41',
                title: 'Xtradata 200 ',
                price: 200,
                validity: ' 3days'
            },
            {
                code: 'DATA-42',
                title: 'Xtradata 300 ',
                price: 300,
                validity: ' 7days'
            },
            {
                code: 'DATA-43',
                title: 'Xtradata 500 ',
                price: 500,
                validity: ' 7days'
            },
            {
                code: 'DATA-44',
                title: 'Xtradata 1000 ',
                price: 1000,
                validity: ' 30days'
            },
            {
                code: 'DATA-45',
                title: 'Xtradata 2000 ',
                price: 2000,
                validity: ' 30days'
            },
            {
                code: 'DATA-46',
                title: 'Xtradata 5000 ',
                price: 5000,
                validity: ' 30days'
            },
            {
                code: 'DATA-47',
                title: 'Xtradata 10000 ',
                price: 10000,
                validity: ' 30days'
            },
            {
                code: 'DATA-48',
                title: 'Xtradata 15000 ',
                price: 15000,
                validity: ' 30days'
            },
            {
                code: 'DATA-49',
                title: 'Xtradata 20000 ',
                price: 20000,
                validity: ' 30days'
            },
            {
                code: 'DATA-50',
                title: '11GB ',
                price: 3000,
                validity: ' 30days'
            },
            {
                code: 'DATA-51',
                title: '13GB ',
                price: 3500,
                validity: ' 30days'
            },
            {
                code: 'DATA-52',
                title: '22GB ',
                price: 5000,
                validity: ' 30days'
            },
            {
                code: 'DATA-53',
                title: '27GB ',
                price: 6000,
                validity: ' 30days'
            },
            {
                code: 'DATA-54',
                title: '1TB ',
                price: 100000,
                validity: ' 360days'
            },
            {
                code: 'DATA-55',
                title: '2.5TB ',
                price: 250000,
                validity: ' 360days'
            }
        ],
        GLO: [
            { code: 'DATA-18', title: '50MB ', price: 50, validity: ' 1day' },
            { code: 'DATA-21', title: '150MB ', price: 100, validity: ' 1day' },
            {
                code: 'DATA-28',
                title: '350MB ',
                price: 200,
                validity: ' 2days'
            },
            {
                code: 'DATA-27',
                title: '1.35GB ',
                price: 500,
                validity: ' 14days'
            },
            {
                code: 'DATA-2',
                title: '2.9GB ',
                price: 1000,
                validity: ' 30days'
            },
            {
                code: 'DATA-16',
                title: '4.1GB ',
                price: 1500,
                validity: ' 30days'
            },
            {
                code: 'DATA-25',
                title: '5.8GB ',
                price: 2000,
                validity: ' 30days'
            },
            {
                code: 'DATA-19',
                title: '7.7GB ',
                price: 2500,
                validity: ' 30days'
            },
            {
                code: 'DATA-23',
                title: '10GB ',
                price: 3000,
                validity: ' 30days'
            },
            {
                code: 'DATA-12',
                title: '13.25GB ',
                price: 4000,
                validity: ' 30days'
            },
            {
                code: 'DATA-5',
                title: '18.25GB ',
                price: 5000,
                validity: ' 30days'
            },
            {
                code: 'DATA-4',
                title: '29.5GB ',
                price: 8000,
                validity: ' 30days'
            },
            {
                code: 'DATA-10',
                title: '50GB ',
                price: 10000,
                validity: ' 30days'
            },
            {
                code: 'DATA-11',
                title: '93GB ',
                price: 15000,
                validity: ' 30days'
            },
            {
                code: 'DATA-20',
                title: '119GB ',
                price: 18000,
                validity: ' 30days'
            },
            {
                code: 'DATA-33',
                title: '138GB ',
                price: 20000,
                validity: ' 30days'
            },
            {
                code: 'DATA-15',
                title: '250MB ',
                price: 25,
                validity: ' Night_1day'
            },
            {
                code: 'DATA-30',
                title: '500MB ',
                price: 50,
                validity: ' Night_1day'
            },
            {
                code: 'DATA-31',
                title: '1GB ',
                price: 100,
                validity: ' Night_5days'
            },
            {
                code: 'DATA-24',
                title: '7GB ',
                price: 1500,
                validity: ' Special_7days'
            },
            {
                code: 'DATA-37',
                title: '1.25GB ',
                price: 200,
                validity: ' Sunday_1day'
            }
        ],
        AIRTEL: [{
            code: 'DATA-49.99',
            title: '40MB ',
            price: 50,
            validity: ' 1day'
        },
        { code: 'DATA-99', title: '100MB ', price: 100, validity: ' 1day' },
        {
            code: 'DATA-199.03',
            title: '200MB ',
            price: 200,
            validity: ' 3days'
        },
        {
            code: 'DATA-299.02',
            title: '350MB ',
            price: 300,
            validity: ' 7days'
        },
        {
            code: 'DATA-499',
            title: '750MB ',
            price: 500,
            validity: ' 14days'
        },
        {
            code: 'DATA-299.03',
            title: '1GB ',
            price: 300,
            validity: ' 1day'
        },
        {
            code: 'DATA-499.03',
            title: '2GB ',
            price: 500,
            validity: ' 1day'
        },
        {
            code: 'DATA-1499.03',
            title: '6GB ',
            price: 1500,
            validity: ' 7days'
        },
        {
            code: 'DATA-999',
            title: '1.5GB ',
            price: 1000,
            validity: ' 30days'
        },
        {
            code: 'DATA-1199',
            title: '2GB ',
            price: 1200,
            validity: ' 30days'
        },
        {
            code: 'DATA-1499.01',
            title: '3GB ',
            price: 1500,
            validity: ' 30days'
        },
        {
            code: 'DATA-1999',
            title: '4.5GB ',
            price: 2000,
            validity: ' 30days'
        },
        {
            code: 'DATA-2499.01',
            title: '6GB ',
            price: 2500,
            validity: ' 30days'
        },
        {
            code: 'DATA-2999.02',
            title: '10GB ',
            price: 3000,
            validity: ' 30days'
        },
        {
            code: 'DATA-3999.01',
            title: '11GB ',
            price: 4000,
            validity: ' 30days'
        },
        {
            code: 'DATA-4999',
            title: '20GB ',
            price: 5000,
            validity: ' 30days'
        },
        {
            code: 'DATA-7999.02',
            title: '30GB ',
            price: 8000,
            validity: ' 30days'
        },
        {
            code: 'DATA-9999',
            title: '40GB ',
            price: 10000,
            validity: ' 30days'
        },
        {
            code: 'DATA-14999',
            title: '75GB ',
            price: 15000,
            validity: ' 30days'
        },
        {
            code: 'DATA-19999.02',
            title: '120GB ',
            price: 20000,
            validity: ' 30days'
        },
        {
            code: 'DATA-29999.02',
            title: '240GB ',
            price: 30000,
            validity: ' 30days'
        },
        {
            code: 'DATA-35999.02',
            title: '280GB ',
            price: 36000,
            validity: ' 30days'
        },
        {
            code: 'DATA-49999.02',
            title: '400GB ',
            price: 50000,
            validity: ' 90days'
        },
        {
            code: 'DATA-59999.02',
            title: '500GB ',
            price: 60000,
            validity: ' 120days'
        },
        {
            code: 'DATA-99999.02',
            title: '1TB ',
            price: 100000,
            validity: ' 365days'
        }
        ],
        '9MOBILE': [{
            code: '9MO-25MB-15',
            title: '50MB ',
            price: 50,
            validity: ' 1day'
        },
        {
            code: '9MO-100MB-1',
            title: '100MB+100MB ',
            price: 100,
            validity: ' 1day'
        },
        {
            code: '9MO-300MB-17',
            title: '300MB ',
            price: 150,
            validity: ' 1day'
        },
        {
            code: '9MO-650MB-2',
            title: '650MB ',
            price: 200,
            validity: ' 1day'
        },
        {
            code: '9MO-1GB-19',
            title: '1GB+100MB S ',
            price: 300,
            validity: ' 1day'
        },
        {
            code: '9MO-2GB-20',
            title: '2GB+100MB S ',
            price: 500,
            validity: ' 3days'
        },
        {
            code: '9MO-1.5GB-3',
            title: '1.5GB ',
            price: 1000,
            validity: ' 30days'
        },
        {
            code: '9MO-2GB-4',
            title: '2GB ',
            price: 1200,
            validity: ' 30days'
        },
        {
            code: '9MO-7GB-16',
            title: '7GB+100MB S ',
            price: 1500,
            validity: ' 7days'
        },
        {
            code: '9MO-4.5GB-5',
            title: '4.5GB ',
            price: 2000,
            validity: ' 30days'
        },
        {
            code: '9MO-12GB-23',
            title: '12GB ',
            price: 3000,
            validity: ' 30days'
        },
        {
            code: '9MO-11GB-7',
            title: '11GB ',
            price: 4000,
            validity: ' 30days'
        },
        {
            code: '9MO-15GB-6',
            title: '15GB ',
            price: 5000,
            validity: ' 30days'
        },
        {
            code: '9MO-40GB-9',
            title: '40GB ',
            price: 10000,
            validity: ' 30days'
        },
        {
            code: '9MO-75GB-10',
            title: '75GB ',
            price: 15000,
            validity: ' 30days'
        },
        {
            code: '9MO-125GB-24',
            title: '125GB ',
            price: 20000,
            validity: ' 30days'
        },
        {
            code: '9MO-165GB-12',
            title: '165GB ',
            price: 50000,
            validity: ' 180days'
        },
        {
            code: '9MO-100GB-13',
            title: '100GB ',
            price: 84992,
            validity: ' 100days'
        }
        ]
    },
    BAXI: {
        MTN: [
            {
                code: 100,
                title: '100MB Daily for Daily',
                price: 100,
                validity: '100MB Daily'
            },
            {
                code: 220,
                title: '200MB 3-Day Plan for Daily',
                price: 220,
                validity: '200MB 3-Day Plan'
            },
            {
                code: 300,
                title: '350MB for Weekly',
                price: 300,
                validity: '350MB'
            },
            {
                code: 550,
                title: '750MB 2-Week Plan for Weekly',
                price: 550,
                validity: '750MB 2-Week Plan'
            },
            {
                code: 1100,
                title: '1.5GB 1-Month Mobile for Monthly',
                price: 1100,
                validity: '1.5GB 1-Month Mobile'
            },
            {
                code: 1200,
                title: '2GB for Monthly',
                price: 1200,
                validity: '2GB'
            },
            {
                code: 1500,
                title: '6GB for Weekly',
                price: 1500,
                validity: '6GB'
            },
            {
                code: 2200,
                title: '4.5GB 1-Month All Day plan for Monthly',
                price: 2200,
                validity: '4.5GB 1-Month All Day plan'
            },
            {
                code: 2500,
                title: '6GB for Monthly',
                price: 2500,
                validity: '6GB'
            },
            {
                code: 3300,
                title: '10GB for Monthly',
                price: 3300,
                validity: '10GB'
            },
            {
                code: 3500,
                title: '12GB for Monthly',
                price: 3500,
                validity: '12GB'
            },
            {
                code: 5500,
                title: '20GB for Monthly',
                price: 5500,
                validity: '20GB'
            },
            {
                code: 15000,
                title: '75GB for Monthly',
                price: 15000,
                validity: '75GB'
            },
            {
                code: 20000,
                title: '75GB for 60Days',
                price: 20000,
                validity: '75GB'
            },
            {
                code: 30000,
                title: '120GB for 60Days',
                price: 30000,
                validity: '120GB'
            },
            {
                code: 50000,
                title: '150GB for 90Days',
                price: 50000,
                validity: '150GB'
            },
            {
                code: 75000,
                title: '250GB for 90Days',
                price: 75000,
                validity: '250GB'
            },
            {
                code: 100000,
                title: '325GB for 6-Months',
                price: 100000,
                validity: '325GB'
            },
            {
                code: 120000,
                title: '400GB for 1-Year',
                price: 120000,
                validity: '400GB'
            },
            {
                code: 300000,
                title: '1000GB for 1-Year',
                price: 300000,
                validity: '1000GB'
            },
            {
                code: 450000,
                title: '1500GB for 1-Year',
                price: 450000,
                validity: '1500GB'
            }
        ],
        GLO: [
            {
                code: 'DATA-32',
                title: '10MB for 1 day',
                price: 25,
                validity: '10MB'
            },
            {
                code: 'DATA-15',
                title: '250MB for 1 day',
                price: 25,
                validity: '250MB'
            },
            {
                code: 'DATA-18',
                title: '15MB for 1 day',
                price: 50,
                validity: '15MB'
            },
            {
                code: 'DATA-30',
                title: '500MB for 1 day',
                price: 50,
                validity: '500MB'
            },
            {
                code: 'DATA-21',
                title: '35MB for 1 day',
                price: 100,
                validity: '35MB'
            },
            {
                code: 'DATA-31',
                title: '1GB for 5 days',
                price: 100,
                validity: '1GB'
            },
            {
                code: 'DATA-28',
                title: '350MB for 5 days',
                price: 200,
                validity: '350MB'
            },
            {
                code: 'DATA-37',
                title: '1.25GB for 1 day',
                price: 200,
                validity: '1.25GB'
            },
            {
                code: 'DATA-27',
                title: '800MB for 7 days',
                price: 500,
                validity: '800MB'
            },
            {
                code: 'DATA-2',
                title: '1.6GB for 30 days',
                price: 1000,
                validity: '1.6GB'
            },
            {
                code: 'DATA-24',
                title: '7GB for 7 days',
                price: 1500,
                validity: '7GB'
            },
            {
                code: 'DATA-25',
                title: '5.8GB for 30 days',
                price: 2000,
                validity: '5.8GB'
            },
            {
                code: 'DATA-19',
                title: '7.7GB for 30 days',
                price: 2500,
                validity: '7.7GB'
            },
            {
                code: 'DATA-23',
                title: '10GB for 30 days',
                price: 3000,
                validity: '10GB'
            },
            {
                code: 'DATA-12',
                title: '13.25GB for 30 days',
                price: 4000,
                validity: '13.25GB'
            },
            {
                code: 'DATA-5',
                title: '18.25GB for 30 days',
                price: 5000,
                validity: '18.25GB'
            },
            {
                code: 'DATA-4',
                title: '29.5GB for 30 days',
                price: 8000,
                validity: '29.5GB'
            },
            {
                code: 'DATA-10',
                title: '50GB for 30 days',
                price: 10000,
                validity: '50GB'
            },
            {
                code: 'DATA-11',
                title: '93GB for 30 days',
                price: 15000,
                validity: '93GB'
            },
            {
                code: 'DATA-20',
                title: '119GB for 30 days',
                price: 18000,
                validity: '119GB'
            },
            {
                code: 'DATA-33',
                title: '138GB for 30 days',
                price: 20000,
                validity: '138GB'
            },
            {
                code: 'DATA-64',
                title: '225GB for 30 days',
                price: 30000,
                validity: '225GB'
            },
            {
                code: 'DATA-434',
                title: '225GB for 30 days',
                price: 30000,
                validity: '225GB'
            },
            {
                code: 'DATA-65',
                title: '300GB for 30 days',
                price: 36000,
                validity: '300GB'
            },
            {
                code: 'DATA-435',
                title: '300GB for 30 days',
                price: 36000,
                validity: '300GB'
            },
            {
                code: 'DATA-66',
                title: '425GB for 90 days',
                price: 50000,
                validity: '425GB'
            },
            {
                code: 'DATA-436',
                title: '425GB for 90 days',
                price: 50000,
                validity: '425GB'
            },
            {
                code: 'DATA-67',
                title: '525GB for 120 days',
                price: 60000,
                validity: '525GB'
            },
            {
                code: 'DATA-437',
                title: '525GB for 120 days',
                price: 60000,
                validity: '525GB'
            },
            {
                code: 'DATA-68',
                title: '675GB for 120 days',
                price: 75000,
                validity: '675GB'
            },
            {
                code: 'DATA-438',
                title: '675GB for 120 days',
                price: 75000,
                validity: '675GB'
            },
            {
                code: 'DATA-69',
                title: '1TB for 365 days',
                price: 100000,
                validity: '1TB'
            },
            {
                code: 'DATA-439',
                title: '1TB for 365 days',
                price: 100000,
                validity: '1TB'
            }
        ],
        AIRTEL: [
            {
                code: 49.99,
                title: '40MB for 1 Day',
                price: 50,
                validity: '40MB'
            },
            {
                code: 99,
                title: '100MB for 1 Day',
                price: 100,
                validity: '100MB'
            },
            {
                code: 199.03,
                title: '200MB for 3 Days',
                price: 200,
                validity: '200MB'
            },
            {
                code: 349.02,
                title: '350MB for 7 Days',
                price: 350,
                validity: '350MB'
            },
            {
                code: 349.03,
                title: '1GB for 1 Day',
                price: 350,
                validity: '1GB'
            },
            {
                code: 399,
                title: '1.5GB for 1 Day',
                price: 400,
                validity: '1.5GB'
            },
            {
                code: 499,
                title: '750MB for 7 Days',
                price: 500,
                validity: '750MB'
            },
            {
                code: 499.03,
                title: '2GB for 1 Day',
                price: 500,
                validity: '2GB'
            },
            {
                code: 599,
                title: '1GB for 14 Days',
                price: 600,
                validity: '1GB'
            },
            {
                code: 799,
                title: '3.5GB for 2 Days',
                price: 800,
                validity: '3.5GB'
            },
            {
                code: 999,
                title: '1.2GB for 30 Days',
                price: 1000,
                validity: '1.2GB'
            },
            {
                code: 999.01,
                title: '1.5GB for 7 Days',
                price: 1000,
                validity: '1.5GB'
            },
            {
                code: 1199,
                title: '1.5GB for 30 Days',
                price: 1200,
                validity: '1.5GB'
            },
            {
                code: 1499.03,
                title: '5GB for 7 Days',
                price: 1500,
                validity: '5GB'
            },
            {
                code: 1499.01,
                title: '3GB for 30 Days',
                price: 1500,
                validity: '3GB'
            },
            {
                code: 1999,
                title: '4.5GB for 30 Days',
                price: 2000,
                validity: '4.5GB'
            },
            {
                code: 1999.02,
                title: '7GB for 7 Days',
                price: 2000,
                validity: '7GB'
            },
            {
                code: 2499.01,
                title: '6GB for 30 Days',
                price: 2500,
                validity: '6GB'
            },
            {
                code: 2999.02,
                title: '10GB for 30 Days',
                price: 3000,
                validity: '10GB'
            },
            {
                code: 3999.01,
                title: '15GB for 30 Days',
                price: 4000,
                validity: '15GB'
            },
            {
                code: 4999,
                title: '18GB for 30 Days',
                price: 5000,
                validity: '18GB'
            },
            {
                code: 4999.01,
                title: '25GB for 7 Days',
                price: 5000,
                validity: '25GB'
            },
            {
                code: 5999,
                title: '23GB for 30 Days',
                price: 6000,
                validity: '23GB'
            },
            {
                code: 7999.02,
                title: '30GB for 30 Days',
                price: 8000,
                validity: '30GB'
            },
            {
                code: 9999,
                title: '40GB for 30 Days',
                price: 10000,
                validity: '40GB'
            },
            {
                code: 14999,
                title: '75GB for 30 Days',
                price: 15000,
                validity: '75GB'
            },
            {
                code: 19999.02,
                title: '120GB for 30 Days',
                price: 20000,
                validity: '120GB'
            },
            {
                code: 29999.02,
                title: '240GB for 30 Days',
                price: 30000,
                validity: '240GB'
            },
            {
                code: 35999.02,
                title: '280GB for 30 Days',
                price: 36000,
                validity: '280GB'
            },
            {
                code: 49999.02,
                title: '400GB for 90 Days',
                price: 50000,
                validity: '400GB'
            },
            {
                code: 59999.02,
                title: '500GB for 120 Days',
                price: 60000,
                validity: '500GB'
            },
            {
                code: 99999.02,
                title: '1TB for 365 Days',
                price: 100000,
                validity: '1TB'
            }
        ],
        '9MOBILE': [
            {
                code: 200,
                title: '200MB for 7 days',
                price: 200,
                validity: '200MB'
            },
            {
                code: 1000,
                title: '1GB for 30 days',
                price: 1000,
                validity: '1GB'
            },
            {
                code: 1200,
                title: '1.5GB for 30 days',
                price: 1200,
                validity: '1.5GB'
            },
            {
                code: 2000,
                title: '2.5GB for 30 days',
                price: 2000,
                validity: '2.5GB'
            },
            {
                code: 2500,
                title: '3.5GB for 30 days',
                price: 2500,
                validity: '3.5GB'
            },
            {
                code: 3500,
                title: '5GB for 30 days',
                price: 3500,
                validity: '5GB'
            },
            {
                code: 8000,
                title: '11.5GB for 30 days',
                price: 8000,
                validity: '11.5GB'
            },
            {
                code: 10000,
                title: '15GB for 30 days',
                price: 10000,
                validity: '15GB'
            },
            {
                code: 18000,
                title: '27.5GB for 30 days',
                price: 18000,
                validity: '27.5GB'
            },
            {
                code: 27500,
                title: '30GB for 90 days',
                price: 27500,
                validity: '30GB'
            },
            {
                code: 55000,
                title: '60GB for 180 days',
                price: 55000,
                validity: '60GB'
            },
            {
                code: 84992,
                title: '100GB for 100 days',
                price: 84992,
                validity: '100GB'
            },
            {
                code: 110000,
                title: '120GB for 365 days',
                price: 110000,
                validity: '120GB'
            }
        ]
    }
} as const

export const SEED_DATA_WITH_BUNDLE_FLOW = {
    '9MOBILE': [
        {
            "bundleCode": "9MOBILE001",
            "bundle": "9MOBILE 1000Naira  30 days 4.2GB (2GB+2.2GB Night) ",
            "amount": 1000,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE002",
            "bundle": "9MOBILE 1200Naira  30 days 6.5GB (2.5GB+4GB Night) ",
            "amount": 1200,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE003",
            "bundle": "9MOBILE 2000Naira  30 days 9.5GB (5.5GB+4GB Night) ",
            "amount": 2000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE004",
            "bundle": "9MOBILE 10000Naira  30 days ",
            "amount": 10000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE005",
            "bundle": "9MOBILE 300Naira  1 days ",
            "amount": 300,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE006",
            "bundle": "9MOBILE 3000Naira  30 days ",
            "amount": 3000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE007",
            "bundle": "9MOBILE 4000Naira  30 days 18.5GB (15GB+3.5GB Night) ",
            "amount": 4000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE008",
            "bundle": "9MOBILE 50Naira  1 day ",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE009",
            "bundle": "9MOBILE 100Naira  1 day ",
            "amount": 100,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE010",
            "bundle": "9MOBILE 200Naira  1 day ",
            "amount": 200,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE011",
            "bundle": "9MOBILE 5000Naira  30 days ",
            "amount": 5000,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE012",
            "bundle": "9MOBILE 150Naira  1 days ",
            "amount": 150,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE013",
            "bundle": "9MOBILE 1500Naira  7 days ",
            "amount": 1500,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE014",
            "bundle": "9MOBILE 500Naira  30 days ",
            "amount": 500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE015",
            "bundle": "9MOBILE 15000Naira  30 days ",
            "amount": 15000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE016",
            "bundle": "9MOBILE 20000Naira  30 days ",
            "amount": 20000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE017",
            "bundle": "9MOBILE 2500Naira  30 days 11GB (7GB+ 4GB Night) ",
            "amount": 2500,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE018",
            "bundle": "9MOBILE 7000Naira  30 days ",
            "amount": 7000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "9MOBILE019",
            "bundle": "9MOBILE 200Naira  200MB ",
            "amount": 200,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE020",
            "bundle": "9MOBILE 1000Naira  1GB ",
            "amount": 1000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE021",
            "bundle": "9MOBILE 2500Naira  3.5GB ",
            "amount": 2500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE022",
            "bundle": "9MOBILE 3500Naira  5GB ",
            "amount": 3500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE023",
            "bundle": "9MOBILE 8000Naira  11.5GB ",
            "amount": 8000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE024",
            "bundle": "9MOBILE 18000Naira  27.5GB ",
            "amount": 18000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE025",
            "bundle": "9MOBILE 27500Naira  30GB ",
            "amount": 27500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE026",
            "bundle": "9MOBILE 55000Naira  60GB ",
            "amount": 55000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE027",
            "bundle": "9MOBILE 84992Naira  100GB ",
            "amount": 84992,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE028",
            "bundle": "9MOBILE 110000Naira  120GB ",
            "amount": 110000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE029",
            "bundle": "9MOBILE 50Naira   1day ",
            "amount": 50,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE030",
            "bundle": "9MOBILE 150Naira   1day ",
            "amount": 150,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE031",
            "bundle": "9MOBILE 300Naira   1day ",
            "amount": 300,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE032",
            "bundle": "9MOBILE 500Naira   3days ",
            "amount": 500,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE033",
            "bundle": "9MOBILE 3000Naira   30days ",
            "amount": 3000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE034",
            "bundle": "9MOBILE 20000Naira   30days ",
            "amount": 20000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "9MOBILE035",
            "bundle": "9MOBILE 50000Naira   180days ",
            "amount": 50000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        }
    ],
    AIRTEL: [
        {
            "bundleCode": "AIRTEL001",
            "bundle": "AIRTEL 50Naira  1 day ",
            "amount": 50,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL002",
            "bundle": "AIRTEL 99Naira  1 day ",
            "amount": 99,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL003",
            "bundle": "AIRTEL 199Naira  3 days ",
            "amount": 199,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL004",
            "bundle": "AIRTEL 349Naira  7 days ",
            "amount": 349,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL005",
            "bundle": "AIRTEL 499Naira  7 days ",
            "amount": 499,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL006",
            "bundle": "AIRTEL 999Naira  30 days ",
            "amount": 999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL007",
            "bundle": "AIRTEL 1499Naira  30 days ",
            "amount": 1499,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL008",
            "bundle": "AIRTEL 2499Naira  30 days ",
            "amount": 2499,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL009",
            "bundle": "AIRTEL 3999Naira  30 days ",
            "amount": 3999,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL010",
            "bundle": "AIRTEL 4999Naira  30 days ",
            "amount": 4999,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL011",
            "bundle": "AIRTEL 9999Naira  30 days ",
            "amount": 9999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL012",
            "bundle": "AIRTEL 14999Naira  30 days ",
            "amount": 14999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL013",
            "bundle": "AIRTEL 2999Naira  30 days ",
            "amount": 2999,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL014",
            "bundle": "AIRTEL 19999Naira  30 days ",
            "amount": 19999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL015",
            "bundle": "AIRTEL 349Naira  1 day ",
            "amount": 349,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL016",
            "bundle": "AIRTEL 499Naira  1 day ",
            "amount": 499,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL017",
            "bundle": "AIRTEL 1499Naira  7 days ",
            "amount": 1499,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL018",
            "bundle": "AIRTEL 1199Naira  30 days ",
            "amount": 1199,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL019",
            "bundle": "AIRTEL 1999Naira  30 days ",
            "amount": 1999,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL020",
            "bundle": "AIRTEL 7999Naira  30 days ",
            "amount": 7999,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL021",
            "bundle": "AIRTEL 29999Naira  30 days ",
            "amount": 29999,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL022",
            "bundle": "AIRTEL 35999Naira  30 days ",
            "amount": 35999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL023",
            "bundle": "AIRTEL 49999Naira  90 days ",
            "amount": 49999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL024",
            "bundle": "AIRTEL 59999Naira  120 days ",
            "amount": 59999,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL025",
            "bundle": "AIRTEL 99999Naira  365 days ",
            "amount": 99999,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL026",
            "bundle": "AIRTEL 599Naira  14 day ",
            "amount": 599,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL027",
            "bundle": "AIRTEL 999Naira  7 day ",
            "amount": 999,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL028",
            "bundle": "AIRTEL 1999Naira  7 day ",
            "amount": 1999,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL029",
            "bundle": "AIRTEL 4999Naira  7 day ",
            "amount": 4999,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL030",
            "bundle": "AIRTEL 399Naira  1 day ",
            "amount": 399,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL031",
            "bundle": "AIRTEL 799Naira  2 day ",
            "amount": 799,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL032",
            "bundle": "AIRTEL 5999Naira  30 day ",
            "amount": 5999,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL033",
            "bundle": "AIRTEL 50Naira  This Data plan gives 40MB for N50 valid for 1day (Social Plan) ",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL034",
            "bundle": "AIRTEL 100Naira  This Data plan gives 200MB for N100 valid for 5day (Social Plan) ",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL035",
            "bundle": "AIRTEL 100Naira  This Data plan gives 400MB for N100 valid for 3day (TikTok) ",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL036",
            "bundle": "AIRTEL 200Naira  This Data plan gives 1,024MB for N200 valid for 14day (Tik Tok) ",
            "amount": 200,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL037",
            "bundle": "AIRTEL 200Naira  This Data plan gives 2,048MB for N200 valid for 1 hr ",
            "amount": 200,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL038",
            "bundle": "AIRTEL 300Naira  This Data plan gives 700MB for N300 valid for 25days (Social Plan) ",
            "amount": 300,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "AIRTEL039",
            "bundle": "AIRTEL 400Naira \"1.5GB\"",
            "amount": 400,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL040",
            "bundle": "AIRTEL 800Naira \"3.5GB\"",
            "amount": 800,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL041",
            "bundle": "AIRTEL 1000Naira \"1.2GB\"",
            "amount": 1000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL042",
            "bundle": "AIRTEL 1000Naira \"1.5GB\"",
            "amount": 1000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL043",
            "bundle": "AIRTEL 1500Naira \"5GB\"",
            "amount": 1500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL044",
            "bundle": "AIRTEL 3000Naira \"10GB\"",
            "amount": 3000,
            "vendors": [
                "BAXI",
                "BUYPOWER"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL045",
            "bundle": "AIRTEL 4000Naira \"15GB\"",
            "amount": 4000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL046",
            "bundle": "AIRTEL 5000Naira \"18GB\"",
            "amount": 5000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL047",
            "bundle": "AIRTEL 5000Naira \"25GB\"",
            "amount": 5000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL048",
            "bundle": "AIRTEL 8000Naira \"30GB\"",
            "amount": 8000,
            "vendors": [
                "BAXI",
                "BUYPOWER"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL049",
            "bundle": "AIRTEL 30000Naira \"240GB\"",
            "amount": 30000,
            "vendors": [
                "BAXI",
                "BUYPOWER"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL050",
            "bundle": "AIRTEL 500Naira \" 14days\"",
            "amount": 500,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "AIRTEL051",
            "bundle": "AIRTEL 1200Naira \" 30days\"",
            "amount": 1200,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        }
    ],
    GLO: [
        {
            "bundleCode": "GLO001",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO002",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO003",
            "amount": 200,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO004",
            "amount": 500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO005",
            "amount": 1000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO006",
            "amount": 1500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO007",
            "amount": 2000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO008",
            "amount": 2500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO009",
            "amount": 3000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO010",
            "amount": 4000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO011",
            "amount": 5000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO012",
            "amount": 8000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO013",
            "amount": 10000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO014",
            "amount": 15000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO015",
            "amount": 18000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO016",
            "amount": 20000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO017",
            "amount": 25,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO018",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO019",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO020",
            "amount": 300,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO021",
            "amount": 500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO022",
            "amount": 1500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO023",
            "amount": 500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO024",
            "amount": 200,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO025",
            "amount": 30000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO026",
            "amount": 36000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO027",
            "amount": 50000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO028",
            "amount": 60000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO029",
            "amount": 75000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO030",
            "amount": 100000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO031",
            "amount": 150,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO032",
            "amount": 450,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO033",
            "amount": 1400,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO034",
            "amount": 900,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO035",
            "amount": 3200,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO036",
            "amount": 25,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO037",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO038",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO039",
            "amount": 25,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO040",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO041",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO042",
            "amount": 25,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO043",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO044",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO045",
            "amount": 25,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO046",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO047",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO048",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO049",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO050",
            "amount": 100,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO051",
            "amount": 250,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO052",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO053",
            "amount": 130,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO054",
            "amount": 50,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO055",
            "amount": 200,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "GLO056",
            "amount": 25,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO057",
            "amount": 25,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO058",
            "amount": 50,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO059",
            "amount": 50,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO060",
            "amount": 100,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO061",
            "amount": 100,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO062",
            "amount": 200,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO063",
            "amount": 200,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO064",
            "amount": 500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO065",
            "amount": 1000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO066",
            "amount": 1500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO067",
            "amount": 2000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO068",
            "amount": 2500,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO069",
            "amount": 3000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO070",
            "amount": 4000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO071",
            "amount": 5000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO072",
            "amount": 8000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO073",
            "amount": 10000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO074",
            "amount": 15000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO075",
            "amount": 18000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO076",
            "amount": 20000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO077",
            "amount": 30000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO078",
            "amount": 36000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO079",
            "amount": 50000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO080",
            "amount": 60000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO081",
            "amount": 75000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO082",
            "amount": 100000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO083",
            "amount": 50,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO084",
            "amount": 100,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO085",
            "amount": 200,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO086",
            "amount": 500,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO087",
            "amount": 1000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO088",
            "amount": 1500,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO089",
            "amount": 50,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO090",
            "amount": 100,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO091",
            "amount": 200,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO092",
            "amount": 500,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO093",
            "amount": 1000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "GLO094",
            "amount": 1500,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        }
    ],
    MTN: [
        {
            "bundleCode": "MTN001",
            "bundle": "MTN 20000  Xtradata 20000 Monthly Bundle ",
            "amount": 20000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN002",
            "bundle": "MTN 15000  Xtradata 15000 Monthly Bundle ",
            "amount": 15000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN003",
            "bundle": "MTN 10000  Xtradata 10000 Monthly Bundle ",
            "amount": 10000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN004",
            "bundle": "MTN 5000  Xtradata 5000 Monthly Bundle ",
            "amount": 5000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN005",
            "bundle": "MTN 2000  Xtradata 2000 Monthly Bundle ",
            "amount": 2000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN006",
            "bundle": "MTN 1000  Xtradata 1000 Monthly Bundle ",
            "amount": 1000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN007",
            "bundle": "MTN 500  Xtradata 500 Weekly Bundle ",
            "amount": 500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN008",
            "bundle": "MTN 20000  Xtratalk 20000 Monthly Bundle ",
            "amount": 20000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN009",
            "bundle": "MTN 15000  Xtratalk 15000 Monthly Bundle ",
            "amount": 15000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN010",
            "bundle": "MTN 10000  Xtratalk 10000 Monthly Bundle ",
            "amount": 10000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN011",
            "bundle": "MTN 5000  Xtratalk 5000 Monthly Bundle ",
            "amount": 5000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN012",
            "bundle": "MTN 2000  Xtratalk 2000 Monthly Bundle ",
            "amount": 2000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN013",
            "bundle": "MTN 1000  Xtratalk 1000 Monthly Bundle ",
            "amount": 1000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN014",
            "bundle": "MTN 500  Xtratalk 500 Weekly Bundle ",
            "amount": 500,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN015",
            "bundle": "MTN 300  Xtratalk 300 Weekly Bundle\\r\\nXtratalk 300 Weekly Bundle ",
            "amount": 300,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN016",
            "bundle": "MTN 300  Xtradata 300 Weekly Bundle ",
            "amount": 300,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN017",
            "bundle": "MTN 200  Xtratalk 200 3days Bundle\\r\\nXtratalk 200 3days Bundle ",
            "amount": 200,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN018",
            "bundle": "MTN 2000  7GB Weekly Bundle ",
            "amount": 2000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN019",
            "bundle": "MTN 350000  1TB SME 3-Months Plan ",
            "amount": 350000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN020",
            "bundle": "MTN 50000  165GB SME 2-Months Plan ",
            "amount": 50000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN021",
            "bundle": "MTN 120000  400GB Yearly Plan ",
            "amount": 120000,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN022",
            "bundle": "MTN 22000  120GB Monthly Plan + 80mins. ",
            "amount": 22000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN023",
            "bundle": "MTN 3500  10GB+2GB YouTube Night+300MB YouTube Music + 20mins. ",
            "amount": 3500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN024",
            "bundle": "MTN 3000  8GB+2GB YouTube Night+200MB YouTube Music + 15mins. ",
            "amount": 3000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN025",
            "bundle": "MTN 1500  5GB Weekly Plan ",
            "amount": 1500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN026",
            "bundle": "MTN 600  1GB Weekly Plan + FREE 1GB for YouTube and 100MB for YouTube Music + 5mins. ",
            "amount": 600,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN027",
            "bundle": "MTN 600  2.5GB 2-Day Plan ",
            "amount": 600,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN028",
            "bundle": "MTN 10000  25GB SME Monthly Plan ",
            "amount": 10000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN029",
            "bundle": "MTN 800  3GB 2-Days Bundle ",
            "amount": 800,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN030",
            "bundle": "MTN 100000  360GB SME 3-Months Plan ",
            "amount": 100000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN031",
            "bundle": "MTN 100  DataPlan 100MB Daily ",
            "amount": 100,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN032",
            "bundle": "MTN 16000  75GB Monthly Plan + 40mins. ",
            "amount": 16000,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN033",
            "bundle": "MTN 350  1GB Daily Plan + 3mins. ",
            "amount": 350,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN034",
            "bundle": "MTN 6500  25GB+2GB YouTube Night + 25mins. ",
            "amount": 6500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN035",
            "bundle": "MTN 1600  3GB+2GB YouTube Night+200MB YouTube Music + 5mins. ",
            "amount": 1600,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN036",
            "bundle": "MTN 30000  160GB 2-Month Plan ",
            "amount": 30000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN037",
            "bundle": "MTN 450000  1-Year Plan ",
            "amount": 450000,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN038",
            "bundle": "MTN 250000  2.5TB Yearly Plan ",
            "amount": 250000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN039",
            "bundle": "MTN 100000  1 year Plan ",
            "amount": 100000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN040",
            "bundle": "MTN 75000  600GB 3-Month Plan ",
            "amount": 75000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN041",
            "bundle": "MTN 50000  400GB 3-Month Plan ",
            "amount": 50000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN042",
            "bundle": "MTN 20000  100GB 2-Month Plan ",
            "amount": 20000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN043",
            "bundle": "MTN 11000  40GB Monthly Plan + 40mins. ",
            "amount": 11000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN044",
            "bundle": "MTN 5500  20GB+2GB YouTube Night+300MB YouTube Music + 25mins. ",
            "amount": 5500,
            "vendors": [
                "IRECHARGE",
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN045",
            "bundle": "MTN 4000  12GB+2GB YouTube Night + 25mins. ",
            "amount": 4000,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN046",
            "bundle": "MTN 2000  4GB+2GB YouTube Night+200MB YouTube Music + 10mins. ",
            "amount": 2000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN047",
            "bundle": "MTN 200  Data Plan 200MB 3-Day Plan ",
            "amount": 200,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN048",
            "bundle": "MTN 1000  1.2GB Monthly Plan + FREE 2GB for YouTube and 200MB for YouTube Music + 5mins. ",
            "amount": 1000,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN049",
            "bundle": "MTN 6500  27GB Monthly Plan + 25mins. ",
            "amount": 6500,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN050",
            "bundle": "MTN 5500  22GB Monthly Plan + 25mins. ",
            "amount": 5500,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN051",
            "bundle": "MTN 4000  13GB Monthly Plan + 25mins. ",
            "amount": 4000,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN052",
            "bundle": "MTN 3500  11GB Monthly Plan + 20mins. ",
            "amount": 3500,
            "vendors": [
                "IRECHARGE",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN053",
            "bundle": "MTN 1200  1.5GB+2.4GB YouTube Night+3hr-200MB-YouTube Weekly + 5mins. ",
            "amount": 1200,
            "vendors": [
                "IRECHARGE",
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN054",
            "bundle": "MTN 13500  35GB SME Monthly Plan ",
            "amount": 13500,
            "vendors": [
                "IRECHARGE"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
            }
        },
        {
            "bundleCode": "MTN055",
            "bundle": "MTN 50000  150GB ",
            "amount": 50000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN056",
            "bundle": "MTN 2500  6GB ",
            "amount": 2500,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN057",
            "bundle": "MTN 3300  10GB ",
            "amount": 3300,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN058",
            "bundle": "MTN 100000  325GB ",
            "amount": 100000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN059",
            "bundle": "MTN 30000  120GB ",
            "amount": 30000,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN060",
            "bundle": "MTN 2200  4.5GB 1-Month All Day plan ",
            "amount": 2200,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN061",
            "bundle": "MTN 550  750MB 2-Week Plan ",
            "amount": 550,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN062",
            "bundle": "MTN 1500  6GB ",
            "amount": 1500,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN063",
            "bundle": "MTN 300  350MB ",
            "amount": 300,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN064",
            "bundle": "MTN 300000  1000GB ",
            "amount": 300000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN065",
            "bundle": "MTN 1200  2GB ",
            "amount": 1200,
            "vendors": [
                "BAXI",
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN066",
            "bundle": "MTN 75000  250GB ",
            "amount": 75000,
            "vendors": [
                "BAXI"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN067",
            "bundle": "MTN 450000   360days ",
            "amount": 450000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN068",
            "bundle": "MTN 20000   30days ",
            "amount": 20000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN069",
            "bundle": "MTN 5000   30days ",
            "amount": 5000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN070",
            "bundle": "MTN 5000   30days ",
            "amount": 5000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN071",
            "bundle": "MTN 250000   360days ",
            "amount": 250000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        },
        {
            "bundleCode": "MTN072",
            "bundle": "MTN 75000   90days ",
            "amount": 75000,
            "vendors": [
                "BUYPOWERNG"
            ],
            "dataCodes": {
                "IRECHARGE": "DATA-01",
                "BUYPOWERNG": "DATA-01",
                "BAXI": "",
            }
        }
    ]
}
export const DISCOS =['ABUJA', 'EKO', 'IKEJA', 'JOS', 'KADUNA', 'PORTHARCOURT', 'ENUGU', 'IBADAN', 'KANO']

export const HTTP_URL = {
    BUYPOWERNG: {
        AIRTIME: BUYPOWER_URL!,
        DATA: BUYPOWER_URL!,
        CABLE: BUYPOWER_URL!,
        ELECTRICITY: BUYPOWER_URL!,
    },
    IRECHARGE: {
        AIRTIME: "https://irecharge.com.ng/api/v2/bills",
        DATA: "https://irecharge.com.ng/api/v2/bills",
        CABLE: "https://irecharge.com.ng/api/v2/bills",
        ELECTRICITY: "https://irecharge.com.ng/api/v2/bills",
    },
    BAXI: {
        AIRTIME: BAXI_URL!,
        DATA: BAXI_URL!,
        CABLE: BAXI_URL!,
        ELECTRICITY: BAXI_URL!,
    },
}

interface Bundle {
    bundleCode: string;
    bundleName: string;
    bundle: string;
    amount: number;
    vendors: string[];
    dataCodes: { [key in 'IRECHARGE' | 'BAXI' | 'BUYPOWERNG']: string };
}
