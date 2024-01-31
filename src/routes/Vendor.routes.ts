import express, { Router } from "express";
import VendorController from "../controllers/Public/Vendor.controller/Vendor.controller";
import { validateApiKey } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";
import { AirtimeVendController } from "../controllers/Public/Vendor.controller/Airtime.controller";
import { DataVendController } from "../controllers/Public/Vendor.controller/Data.controller";

const router: Router = express.Router()

router
    .post('/validate/meter', validateApiKey, VendorController.validateMeter)
    .get('/token', validateApiKey, VendorController.requestToken)
    .get('/discos', VendorController.getDiscos)
    .get('/discos/check', VendorController.checkDisco)
    .post('/confirm-payment', validateApiKey, AuthenticatedController(VendorController.confirmPayment))

    .post('/validate/airtime/phone', validateApiKey, AirtimeVendController.validateAirtimeRequest)
    .get('/airtime', validateApiKey, AirtimeVendController.requestAirtime)
    
    .post('/validate/data/phone', validateApiKey, DataVendController.validateDataRequest)
    .get('/data', validateApiKey, DataVendController.requestData)

    

export default router

