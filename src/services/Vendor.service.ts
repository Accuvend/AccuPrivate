// Import necessary types and the models
import { Transaction } from "sequelize";
import Vendor, { IVendor } from "../models/Vendor.model";
import VendorProduct from "../models/VendorProduct.model";
import { NotFoundError } from "../utils/Errors";
import Bundle from "../models/Bundle.model";

// VendorService class for handling vendor-related operations
export default class VendorService {
    // Method for adding a new vendor to the database
    static async addVendor(data: IVendor, transaction?: Transaction): Promise<Vendor> {
        const vendor = Vendor.build(data);
        transaction ? await vendor.save({ transaction }) : await vendor.save();
        return vendor;
    }

    // Method for updating an existing vendor
    static async updateVendor(vendorId: string, data: Partial<IVendor>, transaction?: Transaction): Promise<Vendor> {
        const vendor = await Vendor.findByPk(vendorId);
        if (!vendor) {
            throw new NotFoundError('Vendor not found');
        }

        transaction ? await vendor.update(data, { transaction }) : await vendor.update(data);
        return vendor;
    }

    // Method for viewing a single vendor
    static async viewSingleVendor(vendorId: string): Promise<Vendor | null> {
        const vendor = await Vendor.findByPk(vendorId, { include: [VendorProduct, Bundle] });
        return vendor;
    }

    // View Vendor by name
    static async viewSingleVendorByName(name: string): Promise<Vendor | null> {
        const vendor = await Vendor.findOne({ where: { name }, include: [VendorProduct, Bundle] });
        return vendor;
    }

    // Method for retrieving all vendors
    static async getAllVendors(): Promise<Vendor[]> {
        const vendors = await Vendor.findAll();
        return vendors;
    }
}
