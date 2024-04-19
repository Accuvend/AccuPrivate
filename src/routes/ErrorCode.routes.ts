import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";
import ErrorCodeController from "../controllers/Admin/ErrorCodes.controller";

export const router: Router = express.Router()

router
    .use(basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]))
    .post('/seed', AuthenticatedController(ErrorCodeController.seedResponsePatsh))
    .get('/info', AuthenticatedController(ErrorCodeController.getErrorCodeById))
    .get('/', AuthenticatedController(ErrorCodeController.getAllErrorCodes))
    .post('/new', AuthenticatedController(ErrorCodeController.createErrorCode))
    .patch('/', AuthenticatedController(ErrorCodeController.updateErrorCode))


export default router