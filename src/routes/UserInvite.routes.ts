import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import UserInviteController from "../controllers/Admin/UserInvite.controller";
import { basicAuth } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

export const router: Router = express.Router();

router
    .use(
        basicAuth("access"),
        RBACMiddelware.validateRole([RoleEnum.SuperAdmin, RoleEnum.Admin]),
    )
    .post("/new", AuthenticatedController(UserInviteController.addUserInvite))
    .post(
        "/cancel",
        AuthenticatedController(UserInviteController.cancelUserInvite),
    )
    .post(
        "/resend",
        AuthenticatedController(UserInviteController.resendUserInvite),
    )
    .get(
        "/info",
        AuthenticatedController(UserInviteController.viewSingleUserInvite),
    )
    .get("/", AuthenticatedController(UserInviteController.viewUserInvites));

export default router;

