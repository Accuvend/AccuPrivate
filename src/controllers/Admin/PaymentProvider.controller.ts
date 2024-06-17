import { NextFunction, Response, Request } from "express";
import { AuthenticatedRequest } from "../../utils/Interface";
import DiscoStatusService from "../../services/DiscoStatus.service";
import PaymentProvider from "../../models/PaymentProvider.model";
import PaymentProviderService from "../../services/PaymentProvider.service";
import { BadRequestError, NotFoundError } from "../../utils/Errors";

export default class PaymentProviderController {
    static async getPaymentProviders(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const paymentProviders =
            await PaymentProviderService.viewAllPaymentProviders();

        res.status(200).send({
            status: "success",
            message: "PaymentProviders retrieved successfully.",
            data: { paymentProviders },
        });
    }

    static async getPaymentProvider(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const { providerId } = req.query as Record<string, string>;
        const paymentProvider =
            await PaymentProviderService.viewSinglePaymentProvider(providerId);

        if (!paymentProvider) {
            throw new NotFoundError("PaymentProvider not found.");
        }

        res.status(200).send({
            status: "success",
            message: "PaymentProvider retrieved successfully.",
            data: { paymentProvider },
        });
    }

    static async createPaymentProvider(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) {
        console.log({ body: req.body });
        const { name } = req.body;

        const existingPaymentProvider =
            await PaymentProviderService.viewPaymentProviderByName(name);
        if (existingPaymentProvider) {
            throw new BadRequestError("PaymentProvider already exists.");
        }

        const newPaymentProvider =
            await PaymentProviderService.addPaymentProvider({
                name,
            });

        console.log({ newPaymentProvider });

        res.status(201).send({
            status: "success",
            message: "PaymentProvider created successfully.",
            data: { paymentProvider: newPaymentProvider },
        });
    }
}
