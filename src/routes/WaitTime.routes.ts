import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import { WaitTimeController } from "../controllers/Admin/WaitTime.controller";

export const router: Router = express.Router()

router
    .put('/update', AuthenticatedController(WaitTimeController.setWaittimeForSwitchingToNewVendor))
    .get('/', AuthenticatedController(WaitTimeController.getWaittimeForSwitchingToNewVendor))

export default router