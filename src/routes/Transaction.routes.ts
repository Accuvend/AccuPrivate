import express, { Router } from "express";
import TransactionController from "../controllers/Public/Transaction.controller";
import { basicAuth, validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";

export const router: Router = express.Router();

router
    .use(basicAuth("access"))
    .get("/info", TransactionController.getTransactionInfo)
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
    .get(
        "/requery-transaction",
        AuthenticatedController(
            TransactionController.requeryTimedOutTransaction,
        ),
    );

export default router;
