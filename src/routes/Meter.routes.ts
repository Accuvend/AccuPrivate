import express, { Router } from "express";
import MeterController from "../controllers/Public/Meter.controller";
import { validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";

export const router: Router = express.Router();

router
    .get("/info", AuthenticatedController(MeterController.getMeterInfo))
    .get("/", AuthenticatedController(MeterController.getMeters))
    .get("/user", AuthenticatedController(MeterController.getUserMeters));

export default router;

