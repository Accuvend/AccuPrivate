// Import necessary types and the Bundle model
import { TOPICS } from "../kafka/Constants";
import { ICreateBundle, IBundle } from "../models/Bundle.model";
import Bundle from "../models/Bundle.model";
import Product from "../models/Product.model";
import Transaction from "../models/Transaction.model";
import VendorProduct from "../models/VendorProduct.model";
import logger from "../utils/Logger";

// BundleService class for handling bundle-related operations
export default class BundleService {
    // Method for adding a new bundle to the database
    static async addBundle(bundle: ICreateBundle): Promise<Bundle> {
        try {
            // Create a new bundle using the Bundle model
            // const newBundle: Bundle = await Bundle.create(bundle);
            const newBundle: Bundle = Bundle.build(bundle);

            await newBundle.save();
            return newBundle;
        } catch (err) {
            console.error(err);
            logger.info("Error Logging Bundle");
            throw err;
        }
    }

    // Method for viewing a single bundle by its UUID
    static async viewSingleBundleById(uuid: string): Promise<Bundle | void | null> {
        try {
            // Find and retrieve an bundle by its UUID
            const bundle: Bundle | null = await Bundle.findOne({
                where: { id: uuid },
                include: [Product, VendorProduct]
            });
            return bundle;
        } catch (err) {
            logger.info("Error reading Bundle");
            throw err

        }
    }

    static async viewSingleBundleByBundleCode(
        bundleCode: string,
    ): Promise<Bundle | void | null> {
        try {
            // Find and retrieve an bundle by its UUID
            const bundle: Bundle | null = await Bundle.findOne({
                where: { bundleCode },
                include: [Product, VendorProduct]
            });
            return bundle;
        } catch (err) {
            logger.info("Error reading Bundle");
            throw err

        }
    }

    static async viewAllBundles(): Promise<Bundle[]> {
        try {
            // Find and retrieve an bundle by its UUID
            const bundle: Bundle[] = await Bundle.findAll();
            return bundle;
        } catch (err) {
            logger.info("Error reading Bundle");
            throw err
        }
    }

    static async viewBundlesByProductId(productId: string): Promise<Bundle[]> {
        try {
            // Find and retrieve an bundle by its UUID
            const bundle: Bundle[] = await Bundle.findAll({
                where: { productId },
                include: [Product, VendorProduct]
            });
            return bundle;
        } catch (err) {
            logger.info("Error reading Bundle");
            throw err
        }
    }

    static async updateBundle(
        bundleId: string,
        data: Partial<IBundle>,
    ): Promise<Bundle> {
        try {
            const bundle = await Bundle.findByPk(bundleId);
            if (!bundle) {
                throw new Error('Bundle not found');
            }

            await bundle.update(data);
            return bundle;
        } catch (err) {
            logger.info("Error updating Bundle");
            throw err
        }
    }
}
