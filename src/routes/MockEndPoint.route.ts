import express, { Router } from "express";
import MockExternalControllerAPI from "../controllers/mock/MockExternalAPI.controller";

export const router: Router = express.Router()

router
    .post('/electricity/request', MockExternalControllerAPI.vendPowerBaxi)
    .get('/vend_power.php', MockExternalControllerAPI.vendPowerIrecharge)
    .post('/vend', MockExternalControllerAPI.vendPowerBuyPower)
    .post('/electricity/verify',MockExternalControllerAPI.validateMeterBaxi)
    .get('/get_meter_info.php',MockExternalControllerAPI.validateMeterIrecharge )
    .get('/check/meter',MockExternalControllerAPI.validateMeterBuyPower )
    .get('/discos/status', MockExternalControllerAPI.checkDiscoUpBuyPower)
    .get('/electricity/billers' , MockExternalControllerAPI.checkDiscoUpBaxi)
    .get('/transaction',MockExternalControllerAPI.requeryBuyPower)
    .get('/superagent/transaction/requery',MockExternalControllerAPI.requeryBaxi)
    .get('/vend_status.php',MockExternalControllerAPI.requeryIrecharge)
    export default router