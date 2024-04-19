
// Import required modules, types, and models
import DiscoStatus from "../models/DiscoStatus.model";
import { IDiscoStatus } from "../models/DiscoStatus.model";

// Define the DiscoStatusService class for handling disco status-related operations
export default class DiscoStatusService {
    // Static method for adding a new disco status
    static async addDiscoStatus(discoStatus: IDiscoStatus): Promise<DiscoStatus> {
        // Build a new disco status object
        const newDiscoStatus: DiscoStatus = DiscoStatus.build(discoStatus);
        // Save the new disco status to the database
        await newDiscoStatus.save();
        return newDiscoStatus;
    }

    // Static method for viewing all disco statuses
    static async viewDiscoStatuses(): Promise<DiscoStatus[]> {
        // Retrieve all disco statuses from the database
        const discoStatuses: DiscoStatus[] = await DiscoStatus.findAll();
        return discoStatuses;
    }

    static async viewSingleDiscoStatusByDiscoName(disco: string): Promise<DiscoStatus | null> {
        // Retrieve a single disco status by its name
        const discoStatus: DiscoStatus | null = await DiscoStatus.findOne({
            where: { disco: disco },
        });
        return discoStatus;
    }

    // Static method for viewing a single disco status by ID
    static async viewSingleDiscoStatus(id: string): Promise<DiscoStatus | null> {
        // Retrieve a single disco status by its ID
        const discoStatus: DiscoStatus | null = await DiscoStatus.findByPk(id);
        return discoStatus;
    }

    // Static method for updating a single disco status by ID
    static async updateSingleDiscoStatus(id: string, status: IDiscoStatus['status'] ): Promise<DiscoStatus | null> {
        // Update the disco status in the database
        const updateResult: [number] = await DiscoStatus.update({status}, {
            where: { id: id },
        });
        // Retrieve the updated disco status by its ID
        const updatedDiscoStatus: DiscoStatus | null = await DiscoStatus.findByPk(id);
        return updatedDiscoStatus;
    }

    // Static method for deleting a single disco status by ID
    static async deleteSingleDiscoStatus(id: string): Promise<boolean> {
        // Delete the disco status from the database
        const deleteResult: number = await DiscoStatus.destroy({
            where: { id: id },
        });
        // Return true if the disco status was successfully deleted, otherwise false
        return deleteResult > 0;
    }
}
