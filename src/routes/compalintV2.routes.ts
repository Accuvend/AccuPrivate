import express, { Router } from "express";
import { AuthenticatedController } from "../utils/Interface";
import { ComplaintController } from "../controllers/Admin/ComplaintV2.controller";
import FileUploadService from "../utils/FileUpload";
import { basicAuth, validateApiKey } from "../middlewares/Auth";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";
import multer from "multer";

const uploadsMulter = multer()


export const router: Router = express.Router();

router
.get('/admin/all', basicAuth('access') ,RBACMiddelware.validateRole([RoleEnum.SuperAdmin , RoleEnum.Admin]),AuthenticatedController(ComplaintController.getComplaintAdmin))
.post('/create',uploadsMulter.single('uploads'), basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.Partner]), AuthenticatedController(ComplaintController.createComplaint))
.post('/api/create', uploadsMulter.single('uploads'), validateApiKey, AuthenticatedController(ComplaintController.createComplaint))
.get('/partner/all', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.Partner]), AuthenticatedController(ComplaintController.getComplaintsPartner))


export default router