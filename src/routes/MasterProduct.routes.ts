import express, { Router } from "express";
import VendorController from "../controllers/Admin/Vendor.controller";
import VendorProductController from "../controllers/Admin/VendorProduct.controller";
import ProductController from "../controllers/Admin/Product.controller";
import { AuthenticatedController } from "../utils/Interface";
import { basicAuth } from "../middlewares/Auth";
import rbac from "../middlewares/Rbac";

import { RoleEnum } from "../models/Role.model";

const router: Router = express.Router();

// Vendor routes
router
    .post(
        "/vendor/create",
        basicAuth("access"),
        rbac.validateRole([RoleEnum.SuperAdmin]),
        AuthenticatedController(VendorController.createVendor),
    )
    .patch(
        "/vendor",
        basicAuth("access"),
        rbac.validateRole([RoleEnum.SuperAdmin]),
        AuthenticatedController(VendorController.updateVendor),
    )
    .get(
        "/vendor",
        basicAuth("access"),
        AuthenticatedController(VendorController.getAllVendors),
    )
    .get(
        "/vendor/info",
        basicAuth("access"),
        AuthenticatedController(VendorController.getVendorInfo),
    );

// VendorProduct routes
router
    .post(
        "/vendor-product/create",
        basicAuth("access"),
        rbac.validateRole([RoleEnum.SuperAdmin]),
        AuthenticatedController(VendorProductController.createVendorProduct),
    )
    .patch(
        "/vendor-product",
        basicAuth("access"),
        rbac.validateRole([RoleEnum.SuperAdmin]),
        AuthenticatedController(VendorProductController.updateVendorProduct),
    )
    .get(
        "/vendor-product",
        AuthenticatedController(VendorProductController.getAllVendorProducts),
    )
    .get(
        "/vendor-product/info",
        AuthenticatedController(VendorProductController.getVendorProductInfo),
    );

// Product routes
router
    .post(
        "/product/create",
        basicAuth("access"),
        rbac.validateRole([RoleEnum.SuperAdmin]),
        AuthenticatedController(ProductController.createProduct),
    )
    .patch(
        "/product",
        rbac.validateRole([RoleEnum.SuperAdmin]),
        AuthenticatedController(ProductController.updateProduct),
    )
    .get("/product", AuthenticatedController(ProductController.getAllProducts))
    .get(
        "/product/info",
        AuthenticatedController(ProductController.getProductInfo),
    );

export default router;
