import express, { Router } from "express";
import TransactionController from "../controllers/Public/Transaction.controller";
import { basicAuth, validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";
import VendorController from "../controllers/Public/VendorApi.controller/VendorApi.controller";

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
    .post("/requery", AuthenticatedController(VendorController.cusRe));
// .get(
//     "/requery-transaction",
//     AuthenticatedController(
//         TransactionController.requeryTimedOutTransaction,
//     ),
// );

export default router;
