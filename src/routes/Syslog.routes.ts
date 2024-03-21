import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import SyslogsController from "../controllers/Admin/Syslogs.controller";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router()

router
    .get('/info', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(SyslogsController.getSystemLogInfo))
    .get('/', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(SyslogsController.getSystemLogs))

export default router