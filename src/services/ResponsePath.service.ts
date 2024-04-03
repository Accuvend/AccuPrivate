// Import necessary types and the ResponsePath model
import { TOPICS } from "../kafka/Constants";
import { ICreateResponsePath, IResponsePath } from "../models/ResponsePath.model";
import ResponsePath from "../models/ResponsePath.model";
import Product from "../models/Product.model";
import Transaction from "../models/Transaction.model";
import VendorProduct from "../models/VendorProduct.model";
import logger from "../utils/Logger";
import Vendor from "../models/Vendor.model";

// ResponsePathService class for handling bundle-related operations
export default class ResponsePathService {
    // Method for adding a new bundle to the database
    static async addResponsePath(bundle: ICreateResponsePath): Promise<ResponsePath> {
        try {
            // Create a new bundle using the ResponsePath model
            // const newResponsePath: ResponsePath = await ResponsePath.create(bundle);
            const newResponsePath: ResponsePath = ResponsePath.build(bundle);

            await newResponsePath.save();
            return newResponsePath;
        } catch (err) {
            console.error(err);
            logger.info("Error Logging ResponsePath");
            throw err;
        }
    }

    static async viewResponsePathForValidation({
        requestType, vendor
    }: { requestType: string, vendor: string }): Promise<ResponsePath[] | void | null> {
        try {
            const bundle: ResponsePath[] | null = await ResponsePath.findAll({
                where: { requestType, vendor }
            });
            return bundle;
        } catch (err) {
            logger.info("Error reading ResponsePath");
            throw err
        }
    }

    // Method for viewing a single bundle by its UUID
    static async viewSingleResponsePathById(uuid: string, inclQuery?: { include: boolean }): Promise<ResponsePath | void | null> {
        try {
            // Find and retrieve an bundle by its UUID
            const bundle: ResponsePath | null = await ResponsePath.findOne({
                where: { id: uuid },
                include: inclQuery?.include ? [Vendor] : []
            });
            return bundle;
        } catch (err) {
            logger.info("Error reading ResponsePath");
            throw err

        }
    }

    static async viewAllResponsePaths(): Promise<ResponsePath[]> {
        try {
            // Find and retrieve an bundle by its UUID
            const bundle: ResponsePath[] = await ResponsePath.findAll();
            return bundle;
        } catch (err) {
            logger.info("Error reading ResponsePath");
            throw err
        }
    }

    static async updateResponsePath(
        bundleId: string,
        data: Partial<IResponsePath>,
    ): Promise<ResponsePath> {
        try {
            const bundle = await ResponsePath.findByPk(bundleId);
            if (!bundle) {
                throw new Error('ResponsePath not found');
            }

            await bundle.update(data);
            return bundle;
        } catch (err) {
            logger.info("Error updating ResponsePath");
            throw err
        }
    }
}
