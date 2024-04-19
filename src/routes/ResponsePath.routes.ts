import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import ResponsePathController from "../controllers/Admin/ResponsePath.controller";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router()

router
    // .use(basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]))
    .get('/info', AuthenticatedController(ResponsePathController.getResponsePathInfo))
    .get('/', AuthenticatedController(ResponsePathController.getResponsePaths))
    .post('/new', AuthenticatedController(ResponsePathController.createResponsePath))
    .patch('/', AuthenticatedController(ResponsePathController.updateResponsePath))
    .post('/seed', AuthenticatedController(ResponsePathController.seedResponsePatsh))

export default router