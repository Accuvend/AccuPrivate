import express, { Router } from "express";
import TransactionController from "../controllers/Public/Transaction.controller";
import { basicAuth, validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";

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
        "/kpi",
        AuthenticatedController(TransactionController.getTransactionsKPI),
    )
    .get(
        "/yesterday",
        AuthenticatedController(
            TransactionController.getYesterdaysTransactions,
        ),
    )
// .get(
//     "/requery-transaction",
//     AuthenticatedController(
//         TransactionController.requeryTimedOutTransaction,
//     ),
// );

export default router;
