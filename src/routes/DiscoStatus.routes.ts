import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import discoStatusController from "../controllers/Admin/DiscoStatus.controller";
import RBACMiddelware from "../middlewares/Rbac";
import Role, { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router();

router.get("/", discoStatusController.getDiscoStatus);

export default router;
