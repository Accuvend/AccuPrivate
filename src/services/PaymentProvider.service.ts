import PaymentProvider, {
    ICreatePaymentProvider,
    IUpdatePaymentProvider,
} from "../models/PaymentProvider.model";
import Entity from "../models/Entity/Entity.model";
import logger from "../utils/Logger";
import { v4 as uuidv4 } from "uuid";
import { randomUUID } from "crypto";

/**
 * Service class for handling operations related to paymentProviders and their replies.
 */
export default class PaymentProviderService {
    /**
     * Adds a new paymentProvider.
     * @param paymentProvider The paymentProvider data to be added.
     * @returns A Promise resolving to the added paymentProvider or void if an error occurs.
     */
    static async addPaymentProvider(
        paymentProvider: ICreatePaymentProvider,
    ): Promise<PaymentProvider | void> {
        try {
            const newPaymentProvider: PaymentProvider = PaymentProvider.build({
                id: uuidv4(),
                ...paymentProvider,
                name: paymentProvider.name.toUpperCase(),
            });
            await newPaymentProvider.save();
            return newPaymentProvider;
        } catch (err) {
            logger.error("Error Logging Event");
            throw err;
        }
    }

    /**
     * Retrieves a single paymentProvider by its UUID.
     * @param uuid The UUID of the paymentProvider to be retrieved.
     * @returns A Promise resolving to the paymentProvider or void if an error occurs.
     */
    static async viewSinglePaymentProvider(
        uuid: string,
    ): Promise<PaymentProvider | void | null> {
        try {
            const paymentProvider: PaymentProvider | null =
                await PaymentProvider.findOne({
                    where: { id: uuid },
                });
            return paymentProvider;
        } catch (err) {
            logger.error("Error Reading PaymentProvider");
            throw err;
        }
    }

    static async viewSinglePaymentProviderByName(
        name: string,
    ): Promise<PaymentProvider | void | null> {
        try {
            const paymentProvider: PaymentProvider | null =
                await PaymentProvider.findOne({
                    where: { name },
                });
            return paymentProvider;
        } catch (err) {
            logger.error("Error Reading PaymentProvider");
            throw err;
        }
    }

    static async viewPaymentProviderByName(
        name: string,
    ): Promise<PaymentProvider | null> {
        try {
            const paymentProvider: PaymentProvider | null =
                await PaymentProvider.findOne({
                    where: { name: name.toUpperCase() },
                });
            return paymentProvider;
        } catch (err) {
            logger.error("Error Reading PaymentProvider");
            throw err;
        }
    }

    static async upsertPaymentProvider(
        paymentProvider: string,
    ): Promise<PaymentProvider | void> {
        try {
            const _paymentProvider: PaymentProvider | null =
                await this.viewPaymentProviderByName(paymentProvider);
            if (_paymentProvider) {
                return _paymentProvider;
            }

            return await this.addPaymentProvider({
                id: randomUUID(),
                name: paymentProvider,
            });
        } catch (err) {
            logger.error("Error Logging Event");
            throw err;
        }
    }

    static async viewAllPaymentProviders(): Promise<PaymentProvider[] | void> {
        try {
            const paymentProviders: PaymentProvider[] =
                await PaymentProvider.findAll();
            return paymentProviders;
        } catch (err) {
            logger.error("Error Reading PaymentProviders");
            throw err;
        }
    }

    /**
     * Updates a paymentProvider by its UUID.
     * @param uuid The UUID of the paymentProvider to be updated.
     * @param paymentProvider The updated paymentProvider data.
     * @returns A Promise resolving to an object containing the update result and the updated paymentProvider, or void if an error occurs.
     */
    static async updateAPaymentProvider(
        uuid: string,
        paymentProvider: IUpdatePaymentProvider,
    ) {
        try {
            const result: [number] = await PaymentProvider.update(
                paymentProvider,
                {
                    where: { id: uuid },
                },
            );
            let _paymentProvider: PaymentProvider | null = null;
            if (result[0] > 1)
                _paymentProvider = await PaymentProvider.findByPk(uuid);
            return {
                result,
                _paymentProvider,
            };
        } catch (error) {
            logger.error("Error Reading PaymentProviders");
            throw error;
        }
    }
}
