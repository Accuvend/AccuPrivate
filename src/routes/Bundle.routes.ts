import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import BundleController from "../controllers/Public/Bundle.controller";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router();

router
    .get("/", BundleController.getDataBundlesAsUser)
    .use(
        basicAuth("access"),
        RBACMiddelware.validateRole([RoleEnum.SuperAdmin, RoleEnum.Admin]),
    )
    .get(
        "/private/info",
        AuthenticatedController(BundleController.getSingleDataBundle),
    )
    .get(
        "/private",
        AuthenticatedController(BundleController.getDataBundlesAsAdmin),
    )
    .post("/create", AuthenticatedController(BundleController.addNewBundle))
    .patch("/", AuthenticatedController(BundleController.addNewBundle));

export default router;

