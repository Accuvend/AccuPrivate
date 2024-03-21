import express, { Router } from "express";
import PublicAuthController from "../controllers/Public/Auth.controller";
import AdminAuthController from "../controllers/Admin/Auth.controller";
import { basicAuth } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

const router: Router = express.Router()

router
    .post('/signup', PublicAuthController.signup)
    .post('/signup/acc', PublicAuthController.otherSignup)
    .post('/verifyemail', basicAuth('emailverification'), AuthenticatedController(PublicAuthController.verifyEmail))
    .get('/verifyemail', PublicAuthController.resendVerificationEmail)
    .post('/forgotpassword', PublicAuthController.forgotPassword)
    .post('/resetpassword', basicAuth('passwordreset'), AuthenticatedController(PublicAuthController.resetPassword))
    .post('/changepassword', basicAuth('access'), AuthenticatedController(PublicAuthController.changePassword))
    .post('/login', PublicAuthController.login)
    .post('/login/confirm', basicAuth('otp'), AuthenticatedController(PublicAuthController.completeLogin))
    .post('/login/admin', PublicAuthController.login)
    .post('/login/customer', PublicAuthController.login)
    .patch('/login/otp-req', basicAuth('access'), AuthenticatedController(PublicAuthController.updateLoginOTPRequirement))
    .post('/deactivate', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(AdminAuthController.deactivatePartner))
    .post('/activate', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(AdminAuthController.activatePartner))
    .post('/logout', basicAuth('access'), AuthenticatedController(PublicAuthController.logout))
    .get('/loggeduser', basicAuth('access'), AuthenticatedController(PublicAuthController.getLoggedUserData))


    .post('/su/activate/req', AdminAuthController.requestSuperAdminActivation)
    .post('/su/activate', basicAuth('su_activation'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(AdminAuthController.completeSuperAdminActivationRequest))
    .post('/su/deactivate/req', AdminAuthController.requestSuperAdminDeActivation)
    .post('/su/deactivate', basicAuth('su_activation'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(AdminAuthController.completeSuperAdminDeActivationRequest))

export default router

