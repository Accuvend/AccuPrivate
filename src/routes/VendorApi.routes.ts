import express, { Router } from "express";
import VendorController from "../controllers/Public/VendorApi.controller/VendorApi.controller";
import { basicAuth, validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";
import { AirtimeVendController } from "../controllers/Public/VendorApi.controller/Airtime.controller";
import { DataVendController } from "../controllers/Public/VendorApi.controller/Data.controller";
import RBACMiddelware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";
import VendorAdminController from "../controllers/Admin/VendorApi.controller";

const router: Router = express.Router()
const newrelic: any = require('newrelic')

router
    .post('/validate/meter', validateApiKey, VendorController.validateMeter)
    .get('/token', validateApiKey, VendorController.requestToken)
    .get('/discos/check', VendorController.checkDisco)
    .post('/confirm-payment', validateApiKey, AuthenticatedController(VendorController.confirmPayment))

    .post('/validate/airtime/phone', validateApiKey, AirtimeVendController.validateAirtimeRequest)
    .get('/airtime', validateApiKey, AirtimeVendController.requestAirtime)
    .get('/seed', AirtimeVendController.seedDataToDb)
    .get('/seed/data', AirtimeVendController.seedDataBundlesToDb)

    .post('/validate/data/phone', validateApiKey, DataVendController.validateDataRequest)
    .get('/data', validateApiKey, DataVendController.requestData)
    .post('/validate/meter/mock', validateApiKey, VendorController.validateMeterMock)
    .get('/data/bundles', validateApiKey, DataVendController.getDataBundles)

    .post('/intervene', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin, RoleEnum.Admin]), AuthenticatedController(VendorAdminController.initManualIntervention))
    .post('/requery', basicAuth('access'), RBACMiddelware.validateRole([RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Partner]), AuthenticatedController(VendorController.initManualRequeryTransaction))

export default router