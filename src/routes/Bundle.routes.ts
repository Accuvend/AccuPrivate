import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import BundleController from "../controllers/Public/Bundle.controller";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router()

router
    .get('/info', BundleController.getSingleDataBundle)
    .get('/', BundleController.getDataBundles)
    .post('/create', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(BundleController.addNewBundle))
    .patch('/', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(BundleController.addNewBundle))

export default router