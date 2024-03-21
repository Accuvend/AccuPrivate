import express, { Router } from "express";
import VendorRatesController from "../controllers/Admin/VendorRates.controller";
import ProductController from "../controllers/Admin/ProductCode.controller";
import { basicAuth } from "../middlewares/Auth";
import { AuthenticatedController } from "../utils/Interface";
import RBACMiddleware from "../middlewares/Rbac";
import { RoleEnum } from "../models/Role.model";

const router: Router = express.Router();

// ProductCode-related routes
router
    .post('/new', basicAuth('access'), RBACMiddleware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(ProductController.createProductCode))
    .patch('/', basicAuth('access'), RBACMiddleware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(ProductController.updateProductCode))
    .get('/', AuthenticatedController(ProductController.getAllProductCodes))
    .get('/info', AuthenticatedController(ProductController.getInfoForProductCode));


// VendorRates-related routes
router
    .post('/vendorrate/new', basicAuth('access'), RBACMiddleware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(VendorRatesController.createVendorRate))
    .patch('/vendorrate', basicAuth('access'), RBACMiddleware.validateRole([RoleEnum.SuperAdmin]), AuthenticatedController(VendorRatesController.updateVendorRate))
    .get('/vendorrate', AuthenticatedController(VendorRatesController.getAllVendorRates))
    .get('/vendorrate/info', AuthenticatedController(VendorRatesController.getInfoForVendorRate));

export default router;