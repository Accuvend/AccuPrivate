import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import PaymentProviderController from "../controllers/Admin/PaymentProvider.controller";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router();

router
    .get("/info", PaymentProviderController.getPaymentProvider)
    .get("/", PaymentProviderController.getPaymentProviders)
    .post(
        "/create",
        basicAuth("access"),
        RBACMiddelware.validateRole([RoleEnum.SuperAdmin, RoleEnum.Admin]),
        AuthenticatedController(
            PaymentProviderController.createPaymentProvider,
        ),
    );

export default router;
