import express, { Router } from "express";
import TransactionController from "../controllers/Public/Transaction.controller";
import { basicAuth, validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";
import VendorController from "../controllers/Public/VendorApi.controller/VendorApi.controller";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router();

router
    .get("/info", TransactionController.getTransactionInfo)
    .use(basicAuth("access"))
    .get(
        "/latest/:phoneNumber",
        basicAuth("access"),
        AuthenticatedController(TransactionController.getTransactionsLatest),
    )
    .get(
        "/api/latest/:phoneNumber",
        validateApiKey,
        AuthenticatedController(TransactionController.getTransactionsLatest),
    )
    .get(
        "/v2/all",
        basicAuth("access"),
        AuthenticatedController(TransactionController.getTransactionsFiltered),
    )
    .get(
        "/",
        basicAuth("access"),
        AuthenticatedController(TransactionController.getTransactions),
    )
    .get(
        "/kpi",
        AuthenticatedController(TransactionController.getTransactionsKPI),
    )
    .get(
        "/yesterday",
        AuthenticatedController(
            TransactionController.getYesterdaysTransactions,
        ),
    )
    .post(
        "/resend",
        basicAuth("access"),
        RBACMiddelware.validateRole([RoleEnum.Admin, RoleEnum.SuperAdmin]),
        AuthenticatedController(VendorController.resendToken),
    );
// .get(
//     "/requery-transaction",
//     AuthenticatedController(
//         TransactionController.requeryTimedOutTransaction,
//     ),
// );

export default router;
