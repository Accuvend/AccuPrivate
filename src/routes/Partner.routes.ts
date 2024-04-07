import express, { Router } from "express";
import { basicAuth } from "../middlewares/Auth";
import PartnerController from "../controllers/Public/Partner.controller";
import { AuthenticatedController } from "../utils/Interface";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

const router: Router = express.Router();

router
    .use(basicAuth('access'))
    .use(RBACMiddelware.validateRole([RoleEnum.SuperAdmin, RoleEnum.Admin]))
    .get('/info', AuthenticatedController(PartnerController.getPartnerInfo))
    .get('/all', AuthenticatedController(PartnerController.getAllPartners))
    .post('/invite', AuthenticatedController(PartnerController.invitePartner))
    .post('/invite/resend', AuthenticatedController(PartnerController.reSendPartnerPassword))

export default router 
