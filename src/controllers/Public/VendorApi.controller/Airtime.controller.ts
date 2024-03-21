import { NextFunction, Request, Response } from "express";
import TransactionService from "../../../services/Transaction.service";
import Transaction, {
    PaymentType,
    Status,
    TransactionType,
} from "../../../models/Transaction.model";
import { v4 as uuidv4 } from "uuid";
import UserService from "../../../services/User.service";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../../../utils/Errors";
import { VendorPublisher } from "../../../kafka/modules/publishers/Vendor";
import { CRMPublisher } from "../../../kafka/modules/publishers/Crm";
import { AirtimeTransactionEventService } from "../../../services/TransactionEvent.service";
import { Database } from "../../../models";
import ProductService from "../../../services/Product.service";
import Vendor from "../../../models/Vendor.model";
import VendorProduct, { VendorProductSchemaData } from "../../../models/VendorProduct.model";
import { TokenHandlerUtil } from "../../../kafka/modules/consumers/Token";
import { BAXI_AGENT_ID, HTTP_URL, SCHEMADATA, SEED, SEED_DATA, SEED_DATA_WITH_BUNDLE_FLOW } from "../../../utils/Constants";
import Product, { IProduct } from "../../../models/Product.model";
import { randomUUID } from "crypto";
import VendorService from "../../../services/Vendor.service";
import VendorProductService from "../../../services/VendorProduct.service";
import { generateRandomString, generateRandonNumbers } from "../../../utils/Helper";
import logger from "../../../utils/Logger";
import ResponseTrimmer from "../../../utils/ResponseTrimmer";
import BundleService from "../../../services/Bundle.service";
import { IBundle } from "../../../models/Bundle.model";


class AirtimeValidator {
    static validatePhoneNumber(phoneNumber: string) {
        if (phoneNumber.length !== 11) {
            throw new BadRequestError("Invalid phone number");
        }

        if (phoneNumber[0] !== "0") {
            throw new BadRequestError("Invalid phone number");
        }

        const regex = new RegExp("^[0-9]+$");
        if (!regex.test(phoneNumber)) {
            throw new BadRequestError("Invalid phone number");
        }
    }

    static async validateAirtimeRequest({ phoneNumber, amount, disco }: { phoneNumber: string, amount: string, disco: string }) {
        AirtimeValidator.validatePhoneNumber(phoneNumber);
        // Check if amount is a number
        if (isNaN(Number(amount))) {
            throw new BadRequestError("Invalid amount");
        }

        if (parseFloat(amount) < 50) {
            throw new BadRequestError("Amount must be greater than 50");
        }

        const productCode = await ProductService.viewSingleProductByMasterProductCode(disco)
        if (!productCode) {
            throw new InternalServerError('Product code not found')
        }
    }

    static async requestAirtime({ transactionId, bankRefId, bankComment }: { transactionId: string, bankRefId: string, bankComment: string }) {
        if (!transactionId || !bankRefId || !bankComment) {
            throw new BadRequestError("Transaction ID, bank reference ID, and bank comment are required");
        }

        const transactionRecord = await TransactionService.viewSingleTransaction(transactionId);
        if (!transactionRecord) {
            throw new NotFoundError("Transaction not found");
        }
    }


}

export class AirtimeVendController {
    static async validateAirtimeRequest(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { phoneNumber, amount, email, networkProvider, channel } = req.body;
        let disco = networkProvider

        const existingProductCodeForDisco = await ProductService.viewProductCodeByProductName(disco)
        if (!existingProductCodeForDisco) {
            throw new NotFoundError('Product code not found for disco')
        }

        disco = existingProductCodeForDisco.masterProductCode

        // TODO: Add request type for request authenticated by API keys
        const partnerId = (req as any).key

        // TODO: I'm using this for now to allow the schema validation since product code hasn't been created for airtime
        if (existingProductCodeForDisco.category !== 'AIRTIME') {
            throw new BadRequestError('Invalid product code for airtime')
        }

        const reference = generateRandomString(10)

        const superAgent = await TokenHandlerUtil.getBestVendorForPurchase(existingProductCodeForDisco.id, 1000);
        const transaction: Transaction =
            await TransactionService.addTransactionWithoutValidatingUserRelationship({
                id: uuidv4(),
                amount: amount,
                status: Status.PENDING,
                disco: disco,
                superagent: superAgent,
                paymentType: PaymentType.PAYMENT,
                transactionTimestamp: new Date(),
                partnerId: partnerId,
                reference,
                networkProvider: networkProvider,
                productType: existingProductCodeForDisco.category,
                vendorReferenceId: superAgent === 'IRECHARGE' ? generateRandonNumbers(10) : reference,
                transactionType: TransactionType.AIRTIME,
                productCodeId: existingProductCodeForDisco.id,
                previousVendors: [superAgent],
                retryRecord: [],
                channel
            });

        const transactionEventService = new AirtimeTransactionEventService(transaction, superAgent, partnerId, phoneNumber);
        await transactionEventService.addPhoneNumberValidationRequestedEvent()

        await AirtimeValidator.validateAirtimeRequest({ phoneNumber, amount, disco });
        await transactionEventService.addPhoneNumberValidationRequestedEvent()

        const userInfo = {
            id: uuidv4(),
            phoneNumber: phoneNumber,
            amount: amount,
            email: email,
        }
        await transactionEventService.addCRMUserInitiatedEvent({ user: userInfo })
        CRMPublisher.publishEventForInitiatedUser({ user: userInfo, transactionId: transaction.id })

        const sequelizeTransaction = await Database.transaction()
        try {
            const user = await UserService.addUserIfNotExists({
                id: userInfo.id,
                email: email,
                phoneNumber: phoneNumber,
            }, sequelizeTransaction);
            console.log('pre update')
            await transaction.update({ userId: user.id }, { transaction: sequelizeTransaction })
            console.log('post update')
            await sequelizeTransaction.commit()
        } catch (error) {
            await sequelizeTransaction.rollback()
            throw error
        }

        res.status(200).json({
            message: "Request validated successfully",
            data: {
                transaction: {
                    transactionId: transaction.id,
                    status: transaction.status,
                },
            },
        })
    }

    static async seedDataToDb(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        console.log('Start seeding data to the database...');

        const productCategories = ['POSTPAID', 'PREPAID'] as const;
        const vendors = ['IRECHARGE', 'BUYPOWERNG', 'BAXI'] as const;
        const productTypes = Object.keys(SEED);

        const vendorDoc = {} as {
            BUYPOWERNG: Vendor,
            IRECHARGE: Vendor,
            BAXI: Vendor,
        };

        // Create vendors
        for (let i = 0; i < vendors.length; i++) {
            const vendorName = vendors[i] as typeof vendors[number];
            console.log(`Creating vendor: ${vendorName}`);
            const existingVendor = await VendorService.viewSingleVendorByName(vendorName);
            const vendor = existingVendor ?? await VendorService.addVendor({
                name: vendorName,
                id: randomUUID(),
                schemaData: SCHEMADATA[vendorName],
            });

            vendorDoc[vendorName] = vendor;
            console.log(`Vendor ${vendorName} created with ID ${vendor.id}`);
        }

        // Create vendor products
        for (let j = 0; j < productTypes.length; j++) {
            const productType = productTypes[j] as keyof typeof SEED;
            console.log(`Creating products for type: ${productType}`);
            const productCodeData = SEED[productType];
            const productNames = Object.keys(productCodeData);

            for (let k = 0; k < productNames.length; k++) {
                const productCode = productNames[k];
                console.log(`Creating product: ${productCode}`);
                const productInfo = productCodeData[productCode as keyof typeof productCodeData] as unknown as typeof SEED.ELECTRICITY.ECABEPS;

                const productData = {
                    masterProductCode: productCode,
                    category: productType,
                    type: productInfo.type as 'PREPAID' | 'POSTPAID',
                    productName: productInfo.productName,
                    id: randomUUID(),
                } as any

                if (productType === 'AIRTIME') {
                    delete productData.type;
                }
                // Create product
                const product = await ProductService.addProduct(productData);

                console.log(`Product ${productCode} created with ID ${product.id}`);

                // Get the vendors in productInfo and create a vendorProduct using the vendor and product
                const vendors = Object.keys(productInfo.vendors);
                for (let l = 0; l < vendors.length; l++) {
                    const vendorName = vendors[l] as keyof typeof productInfo.vendors;
                    const vendor = vendorDoc[vendorName];

                    console.log(`Adding VendorProduct for vendor ${vendorName} and product ${productCode}`);
                    await VendorProductService.addVendorProduct({
                        id: randomUUID(),
                        vendorId: vendor.id,
                        productId: product.id,
                        commission: productInfo.vendors[vendorName].commission,
                        bonus: productInfo.vendors[vendorName].bonus,
                        productCode: product.masterProductCode,
                        schemaData: {
                            code: productInfo.vendors[vendorName].discoCode,
                        },
                        vendorCode: productInfo.vendors[vendorName].discoCode,
                        vendorName: vendorName,
                        vendorHttpUrl: HTTP_URL[vendorName][productType],
                    });

                    console.log(`VendorProduct added for vendor ${vendorName} and product ${productCode}`);
                }
            }
        }

        console.log('Data seeding completed.');
    }

    static async seedDataBundlesToDb(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        console.log('Start seeding data to the database...');

        const vendors = ['IRECHARGE', 'BUYPOWERNG', 'BAXI'] as const;

        const vendorDoc = {} as {
            BUYPOWERNG: Vendor,
            IRECHARGE: Vendor,
            BAXI: Vendor,
        };

        // Drop products, bundles, vendor, vendorp  roducts

        const vendorAndRates = {
            '9MOBILE': {
                BUYPOWERNG: {
                    commission: 0.0,
                    bonus: 0,
                },
                IRECHARGE: {
                    commission: 3.5,
                    bonus: 10,
                },
                BAXI: {
                    commission: 3.0,
                    bonus: 0,
                },
            },
            'MTN': {
                BUYPOWERNG: {
                    commission: 0.0,
                    bonus: 10,
                },
                IRECHARGE: {
                    commission: 2.5,
                    bonus: 10,
                },
                BAXI: {
                    commission: 2.0,
                    bonus: 10,
                },
            },
            'GLO': {
                BUYPOWERNG: {
                    commission: 0.0,
                    bonus: 10,
                },
                IRECHARGE: {
                    commission: 4.0,
                    bonus: 10,
                },
                BAXI: {
                    commission: 3.5,
                    bonus: 10,
                },
            },
            'AIRTEL': {
                BUYPOWERNG: {
                    commission: 0.0,
                    bonus: 10,
                },
                IRECHARGE: {
                    commission: 3.0,
                    bonus: 10,
                },
                BAXI: {
                    commission: 2.0,
                    bonus: 10,
                },
            },
        }

        const vendorAndProduct = {
            '9MOBILE': {
                productCode: 'TC9MBVD',
                bundles: [
                    {
                        bundleCode: '9MOBILE001',
                        bundleName: 'Etisalat D-MFIN-2-1.5GB for 30days 4.2 gb',
                        bundle: '9MOBILE 1000Naira  30 days 4.2GB (2GB+2.2GB Night) ',
                        amount: 1000,
                        vendors: ['IRECHARGE', 'BUYPOWERNG', 'BAXI'],
                        dataCodes: {
                            IRECHARGE: 'DATA-01',
                            BUYPOWERNG: '',
                            BAXI: '9MOBILE',
                        }
                    }
                ]
            },
            'AIRTEL': {
                productCode: 'TCATLVD',
                bundles: [
                    {
                        bundleCode: 'AIRTEL001',
                        bundleName: 'Etisalat D-MFIN-2-1.5GB for 30days 4.2 gb',
                        bundle: '9MOBILE 1000Naira  30 days 4.2GB (2GB+2.2GB Night) ',
                        amount: 1000,
                        vendors: ['IRECHARGE', 'BUYPOWERNG', 'BAXI'],
                    }
                ]
            },
            'MTN': {
                productCode: 'TCMTNVD',
                bundles: [
                    {
                        bundleCode: 'MTN001',
                        bundleName: 'Etisalat D-MFIN-2-1.5GB for 30days 4.2 gb',
                        bundle: '9MOBILE 1000Naira  30 days 4.2GB (2GB+2.2GB Night) ',
                        amount: 1000,
                        vendors: ['IRECHARGE', 'BUYPOWERNG', 'BAXI'],
                    }
                ]
            },
            'GLO': {
                productCode: 'TCGLOVD',
                bundles: [
                    {
                        bundleCode: 'GLO001',
                        bundleName: 'Etisalat D-MFIN-2-1.5GB for 30days 4.2 gb',
                        bundle: '9MOBILE 1000Naira  30 days 4.2GB (2GB+2.2GB Night) ',
                        amount: 1000,
                        vendors: ['IRECHARGE', 'BUYPOWERNG', 'BAXI'],
                    }
                ]
            },
        }

        // const commissions = {
        //     IRECHARGE: {
        //         MTN: 0.025,
        //         AIRTEL: 0.03,
        //         '9MOBILE': 0.035,
        //         GLO: 0.04,
        //     },
        //     BUYPOWERNG: {
        //         MTN: 0.00,
        //         AIRTEL: 0.00,
        //         '9MOBILE': 0.00,
        //         GLO: 0.00,
        //     },
        //     BAXI: {
        //         MTN: 0.02,
        //         AIRTEL: 0.02,
        //         '9MOBILE': 0.03,
        //         GLO: 0.035,
        //     },
        // }

        const IRECHARGEDATACODE = {
            'MTN': 'MTN',
            'AIRTEL': 'Airtel',
            'GLO': 'Glo',
            '9MOBILE': 'Etisalat'
        }

        const networkProviders = ['9MOBILE', 'MTN', 'GLO', 'AIRTEL'] as const;

        // Check if the vendors exist
        for (let i = 0; i < vendors.length; i++) {
            const vendorName = vendors[i] as typeof vendors[number];
            const existingVendor = await VendorService.viewSingleVendorByName(vendorName);
            if (!existingVendor) {
                throw new NotFoundError(`Vendor ${vendorName} not found`);
            }
            vendorDoc[vendorName] = existingVendor;
        }

        //  Create products
        for (let i = 0; i < networkProviders.length; i++) {
            const networkProvider = networkProviders[i] as typeof networkProviders[number];
            console.log(`Creating products for network provider: ${networkProvider}`);
            const productCodes ={
                AIRTEL: 'TCATLVD',
                MTN: 'TCMTNVD',
                GLO: 'TCGLOVD',
                '9MOBILE': 'TC9MBVD',
            }
            const networkProviderBundleData = { bundles: SEED_DATA_WITH_BUNDLE_FLOW[networkProvider], productCode: productCodes[networkProvider]}
            const networkProviderBundles = networkProviderBundleData.bundles;

            const productInfo: IProduct = {
                id: randomUUID(),
                masterProductCode: networkProviderBundleData.productCode,
                category: 'DATA',
                productName: networkProvider,
            }

            const product = await ProductService.addProduct(productInfo);
            console.log(`Product ${networkProvider} created with ID ${product.id}`);

            // Create bundles
            for (let j = 0; j < networkProviderBundles.length; j++) {
                const bundleInfo = networkProviderBundles[j];
                const bundleCode = bundleInfo.bundleCode;
                const vendors = bundleInfo.vendors as ['IRECHARGE' | 'BUYPOWERNG' | 'BAXI']
                console.log(`Creating bundle: ${bundleCode}`);

                // Use regex to match days or day or month or months or years or year in the bundle name and get the number
                const days = (bundleInfo as any).bundle.match(/(\d+)\s*days?/i);
                const months = (bundleInfo as any).bundle.match(/(\d+)\s*months?/i);
                const years = (bundleInfo as any).bundle.match(/(\d+)\s*years?/i);
                const _validity = days ? days[1] : months ? months[1] : years ? years[1] : 0;
                const validity = `${_validity} ${days ? 'days' : months ? 'months' : years ? 'years' : 'days'}`;

                const bundleData = {
                    id: randomUUID(),
                    productId: product.id,
                    bundleCode: bundleCode,
                    bundleName: (bundleInfo as any).bundle,
                    bundleAmount: bundleInfo.amount,
                    validity,
                    vendorIds: vendors.map(vendor => vendorDoc[vendor].id),
                } as IBundle

                // Create bundle
                const bundle = await BundleService.addBundle(bundleData);
                console.log(`Bundle ${bundleCode} created with ID ${bundle.id}`);

                // Create vendor product
                for (let k = 0; k < vendors.length; k++) {
                    const vendorName = vendors[k] as typeof vendors[number];
                    console.log(`Adding VendorProduct for vendor ${vendorName} and bundle ${bundleCode}`);
                    await VendorProductService.addVendorProduct({
                        id: randomUUID(),
                        vendorId: vendorDoc[vendorName].id,
                        productId: product.id,
                        commission: vendorAndRates[networkProvider][vendorName].commission, // TODO: Change commission to the actual commission from API    
                        bonus: vendorAndRates[networkProvider][vendorName].bonus,   // TODO: Change bonus to the actual bonus from API
                        productCode: product.masterProductCode,
                        schemaData: {
                            bundleName: (bundleInfo as any).bundle,
                            code: vendorName === 'IRECHARGE' ? IRECHARGEDATACODE[networkProvider] : networkProvider,
                            datacode: bundleInfo.dataCodes[vendorName],
                        },
                        bundleCode: bundleInfo.bundleCode,
                        bundleName: (bundleInfo as any).bundle,
                        bundleAmount: bundleInfo.amount,
                        bundleId: bundleData.id,
                        vendorHttpUrl: HTTP_URL[vendorName]['DATA'],
                        vendorName: vendorName,
                        vendorCode: bundleInfo.bundleCode, // TODO: Change vendor code to the actual vendor code from API
                    });

                    console.log(`VendorProduct added for vendor ${vendorName} and bundle ${bundleCode}`);
                }
            }

        }
        console.log('Data seeding completed.');
    }

    // Create vendor products
    static async requestAirtime(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { transactionId, bankRefId, bankComment } = req.query as Record<string, string>;

        const transaction: Transaction | null =
            await TransactionService.viewSingleTransaction(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        const user = await transaction.$get('user')
        if (!user) {
            throw new InternalServerError('User record not found for already validated request')
        }

        const partner = await transaction.$get('partner')
        if (!partner) {
            throw new InternalServerError('Partner record not found for already validated request')
        }

        // Check if transaction is already completed    
        if (transaction.status === Status.COMPLETE) {
            throw new BadRequestError("Transaction already completed");
        }

        // Check if reference has been used before
        const existingTransaction: Transaction | null = await TransactionService.viewSingleTransactionByBankRefID(bankRefId);
        if (existingTransaction) {
            throw new BadRequestError("Duplicate reference");
        }

        const transactionEventService = new AirtimeTransactionEventService(transaction, transaction.superagent, transaction.partnerId, user.phoneNumber);
        await transactionEventService.addAirtimePurchaseInitiatedEvent({ amount: transaction.amount })

        await TransactionService.updateSingleTransaction(transactionId, {
            status: Status.PENDING,
            bankRefId: bankRefId,
            bankComment: bankComment,
        });

        await VendorPublisher.publshEventForAirtimePurchaseInitiate({
            transactionId: transactionId,
            phone: {
                phoneNumber: user.phoneNumber,
                amount: parseFloat(transaction.amount),
            },
            superAgent: transaction.superagent,
            partner: partner,
            user: user,
        })

        res.status(200).json({
            message: "Airtime request sent successfully",
            data: {
                transaction: {
                    // ...transaction.dataValues, 
                    // removed to add proper mapping
                    "amount": transaction.dataValues?.amount,
                    "transactionId": transaction.dataValues?.id,
                    "id": transaction.dataValues?.id,
                    "productType": transaction.dataValues?.productType,
                    "transactionTimestamp": transaction.dataValues?.transactionTimestamp,
                    "networkProvider": transaction.dataValues?.networkProvider,
                    // disco: undefined 
                }
            },
        })
    }

    static async confirmPayment(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { transactionId, bankRefId, bankComment } = req.body;

        const transaction: Transaction | null =
            await TransactionService.viewSingleTransaction(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        const user = await transaction.$get('user')
        if (!user) {
            throw new InternalServerError('User record not found for already validated request')
        }

        const partner = await transaction.$get('partner')
        if (!partner) {
            throw new InternalServerError('Partner record not found for already validated request')
        }

        const transactionEventService = new AirtimeTransactionEventService(transaction, transaction.superagent, transaction.partnerId, user.phoneNumber);
        await transactionEventService.addAirtimePurchaseConfirmedEvent()

        await TransactionService.updateSingleTransaction(transactionId, {
            status: Status.COMPLETE,
            bankRefId: bankRefId,
            bankComment: bankComment,
        });

        await VendorPublisher.publishEventForAirtimePurchaseComplete({
            transactionId: transactionId,
            phone: {
                phoneNumber: user.phoneNumber,
                amount: parseFloat(transaction.amount),
            },
            superAgent: transaction.superagent,
            partner: partner,
            user: user,
        })

        res.status(200).json({
            message: "Airtime payment confirmed successfully",
            data: {
                transaction: {
                    transactionId: transaction.id,
                    status: transaction.status,
                },
            },
        })
    }
}