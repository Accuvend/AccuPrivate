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
    DEFAULT_DATA_PROVIDER,
    DEFAULT_ELECTRICITY_PROVIDER,
    VENDOR_URL,
} from "../../../utils/Constants";
import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "../../../utils/Errors";
import { VendorPublisher } from "../../../kafka/modules/publishers/Vendor";
import { CRMPublisher } from "../../../kafka/modules/publishers/Crm";
import { DataTransactionEventService } from "../../../services/TransactionEvent.service";
import { Database } from "../../../models";
import ProductService from "../../../services/Product.service";
import VendorProduct from "../../../models/VendorProduct.model";
import VendorProductService from "../../../services/VendorProduct.service";
import { DataHandlerUtil } from "../../../kafka/modules/consumers/Data";
import {
    generateRandomString,
    generateRandonNumbers,
    generateVendorReference,
} from "../../../utils/Helper";
import ResponseTrimmer from "../../../utils/ResponseTrimmer";
import BundleService from "../../../services/Bundle.service";
import PaymentProviderService from "../../../services/PaymentProvider.service";
require("newrelic");

class DataValidator {
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

    static async validateDataRequest({
        phoneNumber,
        amount,
    }: {
        phoneNumber: string;
        amount: string;
    }) {
        DataValidator.validatePhoneNumber(phoneNumber);
        // Check if amount is a number
        if (isNaN(Number(amount))) {
            throw new BadRequestError("Invalid amount");
        }

        if (parseFloat(amount) < 50) {
            throw new BadRequestError("Amount must be greater than 50");
        }
    }

    static async requestData({
        transactionId,
        bankRefId,
        bankComment,
    }: {
        transactionId: string;
        bankRefId: string;
        bankComment: string;
    }) {
        if (!transactionId || !bankRefId || !bankComment) {
            throw new BadRequestError(
                "Transaction ID, bank reference ID, and bank comment are required",
            );
        }

        const transactionRecord =
            await TransactionService.viewSingleTransaction(transactionId);
        if (!transactionRecord) {
            throw new NotFoundError("Transaction not found");
        }
    }
}

export class DataVendController {
    static async requestData(req: Request, res: Response, next: NextFunction) {
        const {
            bankRefId,
            bankComment,
            phoneNumber,
            email,
            bundleCode,
            channel,
            paymentProviderId,
        } = req.query as Record<string, string>;
        // TODO: Add request type for request authenticated by API keys
        const partnerId = (req as any).key;

        let disco = req.body.networkProvider;
        // TODO: I'm using this for now to allow the schema validation since product code hasn't been created for airtime
        const dataBundle =
            await BundleService.viewSingleBundleByBundleCode(bundleCode);
        if (!dataBundle) {
            throw new NotFoundError("Bundle not found");
        }

        const existingProductCodeForDisco = await dataBundle.$get("product");
        if (!existingProductCodeForDisco) {
            throw new InternalServerError(
                "Product record not found for already validated request",
            );
        }

        disco = existingProductCodeForDisco.masterProductCode;

        if (existingProductCodeForDisco.category !== "DATA") {
            throw new BadRequestError("Invalid product code for data");
        }

        const existingPaymentProvider =
            await PaymentProviderService.viewSinglePaymentProvider(
                paymentProviderId,
            );
        if (!existingPaymentProvider) {
            throw new NotFoundError("Payment provider not found");
        }

        const amount = dataBundle.bundleAmount.toString();
        const superAgent = await DataHandlerUtil.getBestVendorForPurchase(
            dataBundle.id,
            dataBundle.bundleAmount,
        );

        console.log({ vendors: dataBundle.vendors });

        const transactionId = uuidv4();
        const transaction: Transaction =
            await TransactionService.addTransactionWithoutValidatingUserRelationship(
                {
                    id: transactionId,
                    amount: amount,
                    paymentProviderId,
                    status: Status.PENDING,
                    disco: disco,
                    bundleId: dataBundle.id,
                    superagent: superAgent,
                    paymentType: PaymentType.PAYMENT,
                    transactionTimestamp: new Date(),
                    partnerId: partnerId,
                    transactionType: TransactionType.DATA,
                    productCodeId: existingProductCodeForDisco.id,
                    previousVendors: [superAgent],
                    networkProvider: existingProductCodeForDisco.productName,
                    reference: transactionId,
                    productType: "DATA",
                    vendorReferenceId: await generateVendorReference(),
                    retryRecord: [],
                    channel: channel as Transaction["channel"],
                },
            );

        const transactionEventService = new DataTransactionEventService(
            transaction,
            superAgent,
            partnerId,
            phoneNumber,
        );
        await transactionEventService.addPhoneNumberValidationRequestedEvent();

        await DataValidator.validateDataRequest({ phoneNumber, amount });
        const vendorProduct = await dataBundle.$get("vendorProducts");
        vendorProduct.forEach((p) => console.log({ p: p.dataValues }));
        await transactionEventService.addPhoneNumberValidationRequestedEvent();

        const userInfo = {
            id: uuidv4(),
            phoneNumber: phoneNumber,
            amount: amount,
            email: email,
        };
        await transactionEventService.addCRMUserInitiatedEvent({
            user: userInfo,
        });
        CRMPublisher.publishEventForInitiatedUser({
            user: userInfo,
            transactionId: transaction.id,
        });

        const sequelizeTransaction = await Database.transaction();
        try {
            const user = await UserService.addUserIfNotExists(
                {
                    id: userInfo.id,
                    email: email,
                    phoneNumber: phoneNumber,
                },
                sequelizeTransaction,
            );

            await transaction.update(
                {
                    userId: user.id,
                    networkProvider: existingProductCodeForDisco.productName,
                },
                { transaction: sequelizeTransaction },
            );
            await sequelizeTransaction.commit();
        } catch (error) {
            await sequelizeTransaction.rollback();
            throw error;
        }

        console.log("data ");
        const user = await transaction.$get("user");
        if (!user) {
            throw new InternalServerError(
                "User record not found for already validated request",
            );
        }

        const partner = await transaction.$get("partner");
        if (!partner) {
            throw new InternalServerError(
                "Partner record not found for already validated request",
            );
        }

        // Check if transaction is already completed
        if (transaction.status === Status.COMPLETE) {
            throw new BadRequestError("Transaction already completed");
        }

        await TransactionService.updateSingleTransaction(transactionId, {
            status: Status.INPROGRESS,
            bankRefId: bankRefId,
            bankComment: bankComment,
        }).catch((e) => {
            if (e.name === "SequelizeUniqueConstraintError") {
                // Check if the key is the bankRefId
                if (e.errors[0].message.includes("bankRefId")) {
                    throw new BadRequestError(
                        "BankRefId should be a unique id",
                    );
                }
            }

            throw e;
        });

        console.log({
            transaction: transaction.dataValues,
        });
        if (!transaction.bundleId) {
            throw new BadRequestError("Bundle code is required");
        }

        await VendorPublisher.publshEventForDataPurchaseInitiate({
            transactionId: transactionId,
            phone: {
                phoneNumber: user.phoneNumber,
                amount: parseFloat(transaction.amount),
            },
            superAgent: transaction.superagent,
            partner: partner,
            user: user,
            bundle: dataBundle.dataValues,
            vendorRetryRecord: {
                retryCount: 1,
            },
        });

        res.status(200).json({
            message: "Data request sent successfully",
            data: {
                // transaction,
                // removed to allow proper mapping
                transaction: {
                    amount: transaction.dataValues?.amount,
                    transactionId: transaction.dataValues?.id,
                    id: transaction.dataValues?.id,
                    productType: transaction.dataValues?.productType,
                    transactionTimestamp:
                        transaction.dataValues?.transactionTimestamp,
                    networkProvider: transaction.dataValues?.networkProvider,
                },
            },
        });
    }

    static async confirmPayment(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { transactionId, bankRefId, bankComment } = req.body;

        const transaction: Transaction | null =
            await TransactionService.viewSingleTransaction(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaction not found");
        }

        const user = await transaction.$get("user");
        if (!user) {
            throw new InternalServerError(
                "User record not found for already validated request",
            );
        }

        const partner = await transaction.$get("partner");
        if (!partner) {
            throw new InternalServerError(
                "Partner record not found for already validated request",
            );
        }

        const transactionEventService = new DataTransactionEventService(
            transaction,
            transaction.superagent,
            transaction.partnerId,
            user.phoneNumber,
        );
        await transactionEventService.addDataPurchaseConfirmedEvent();

        await TransactionService.updateSingleTransaction(transactionId, {
            status: Status.COMPLETE,
            bankRefId: bankRefId,
            bankComment: bankComment,
        });

        await VendorPublisher.publishEventForDataPurchaseComplete({
            transactionId: transactionId,
            phone: {
                phoneNumber: user.phoneNumber,
                amount: parseFloat(transaction.amount),
            },
            superAgent: transaction.superagent,
            partner: partner,
            user: user,
        });

        res.status(200).json({
            message: "Data payment confirmed successfully",
            data: {
                transaction: {
                    transactionId: transaction.id,
                    status: transaction.status,
                },
            },
        });
    }

    /**
     * Retrieves data bundles based on the specified network provider.
     * @param {Request} req - The request object containing query parameters.
     * @param {Response} res - The response object used to send HTTP responses.
     * @param {NextFunction} next - The next function in the middleware chain.
     * @returns {Promise<void>} A promise that resolves when the data bundles are successfully retrieved and sent as a JSON response. Throws a 500 error if there's a server failure.
     */
    static async getDataBundles(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const { networkProvider } = req.query as Record<string, string>;

        try {
            // Retrieve data bundles based on the specified network provider
            const dataBundles =
                await VendorProductService.getVendorProductsBasedOnProvider(
                    networkProvider,
                );
            // Send a successful response with the retrieved data bundles
            res.status(200).json({
                status: "success",
                message: "Data successfully retrieved",
                data: dataBundles,
            });
        } catch (error) {
            // Send a 500 error response if there's a server failure
            res.status(500).json({
                message: "Server Failure",
            });
        }
    }
}
