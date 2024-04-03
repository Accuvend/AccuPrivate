import { Transaction } from "sequelize";
import { Database } from "../models";
import MockEndpointData from "../models/MockAPI.model";
import { IMockEndpointData } from "../models/MockAPI.model";

// Interface for specifying optional filters when retrieving mock data based on vendor and endpoint
interface getAllMockDataVendorEndpointWhereClause {
    apiType?: string;
    vendorName?: string;
}

export default class MockApiService {

    /**
     * Retrieves mock data based on specified conditions.
     * @param where Specifies conditions for retrieving mock data.
     * @returns Promise resolving to MockEndpointData or void if no data found.
     */
    static async getMockData(where: any): Promise<MockEndpointData | void> {
        try {
            const data: MockEndpointData | null = await MockEndpointData.findOne({ where });
            if (data === null) throw Error('No item found');
            return data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieves all mock data for a specific vendor and endpoint.
     * @param vendor Name of the vendor for which mock data is requested.
     * @param endpoint Type of endpoint for which mock data is requested.
     * @returns Promise resolving to an array of MockEndpointData.
     */
    static async getAllMockDataVendorEndpoint(vendor: string | null, endpoint: string | null) {
        try {
            const whereClause: getAllMockDataVendorEndpointWhereClause = {};
            if (endpoint) whereClause.apiType = endpoint;
            if (vendor) whereClause.vendorName = vendor;

            const data: MockEndpointData[] = await MockEndpointData.findAll({ where: { ...whereClause } });

            if (data.length === 0) throw Error('No items found');
            return data;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Sets a mock endpoint as active.
     * @param id ID of the mock endpoint.
     * @param vendor Name of the vendor for which the endpoint belongs.
     * @param endpoint Type of the endpoint.
     */
    static async setMockEndpointActive(id: string, vendor: string | null, endpoint: string | null) {
        if (!id) throw Error('Id is required');
        if (!vendor) throw Error('Vendor is required');
        if (!endpoint) throw Error('Endpoint is required');
        
        // if(endpoint && ![].includes(endpoint)) throw Error('Endpoint doesnt exist')
        if(!['BAXI', 'BUYPOWER' , 'IRECHARGE'].includes(vendor)) throw Error('vendor doesnt exist')
        try {
            await Database.transaction(async (tran: Transaction) => {
                const currentTrueItem = await MockEndpointData.findOne({
                    where: { vendorName: vendor, apiType: endpoint, activated: true }
                });

                // If currentItem exists, set activated to false
                if (currentTrueItem) {
                    await MockEndpointData.update({ activated: false }, { where: { id: currentTrueItem.id } });
                }
                
                // Set the selected item's activated status to true
                await MockEndpointData.update({ activated: true }, { where: { id } });
            }).catch(err => console.log(err));
        } catch (err) {
            throw err;
        }
    }

    // Method to update mock data - Currently not implemented
    static async updateMockData() {
        // Implementation pending
    }

    /**
     * Maps MockEndpointData object to a response object.
     * @param mockdata MockEndpointData object to be mapped.
     * @returns Mapped response object.
     */
    static mapDataToResponse(mockdata: MockEndpointData): any {
        // Implementation pending
    }
}
