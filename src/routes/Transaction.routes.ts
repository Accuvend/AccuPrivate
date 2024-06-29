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
    .get("/api/latest/:phoneNumber",validateApiKey,AuthenticatedController(TransactionController.getTransactionsLatest))
    .use(basicAuth("access"))
    .get("/latest/:phoneNumber" ,basicAuth("access"), AuthenticatedController(TransactionController.getTransactionsLatest))
    .get("/v2/all",basicAuth("access"),AuthenticatedController(TransactionController.getTransactionsFiltered))
    .get(
        "/",
        basicAuth("access"),
        AuthenticatedController(TransactionController.getTransactions),
    )
    .get(
        "/v2/all/api",
        validateApiKey,
        AuthenticatedController(TransactionController.getTransactionsFiltered),
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
    )
    .post(
        "/requery",
        AuthenticatedController(VendorController.initManualRequeryTransaction),
    )
    .post(
        "/retry",
        AuthenticatedController(VendorController.initManualRetryTransaction),
    );
// .get(
//     "/requery-transaction",
//     AuthenticatedController(
//         TransactionController.requeryTimedOutTransaction,
//     ),
// );

export default router;
