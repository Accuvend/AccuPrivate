import UserInvite, {
    ICreateUserInvite,
    IUpdateUserInvite,
} from "../models/UserInvite.model";
import Role from "../models/Role.model";
import logger from "../utils/Logger";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "sequelize";

/**
 * Service class for handling operations related to userInvites and their replies.
 */
export default class UserInviteService {
    /**
     * Adds a new userInvite.
     * @param userInvite The userInvite data to be added.
     * @returns A Promise resolving to the added userInvite or void if an error occurs.
     */
    static async addUserInvite(
        userInvite: ICreateUserInvite,
    ): Promise<UserInvite | void> {
        try {
            const newUserInvite: UserInvite = UserInvite.build({
                id: uuidv4(),
                ...userInvite,
                email: userInvite.email.toLowerCase(),
            });
            await newUserInvite.save();
            return newUserInvite;
        } catch (err) {
            logger.error("Error Logging Event");
            throw err;
        }
    }

    /**
     * Retrieves a single userInvite by its UUID.
     * @param uuid The UUID of the userInvite to be retrieved.
     * @returns A Promise resolving to the userInvite or void if an error occurs.
     */
    static async viewSingleUserInvite(
        uuid: string,
    ): Promise<UserInvite | void | null> {
        try {
            const userInvite: UserInvite | null = await UserInvite.findOne({
                where: { id: uuid },
                include: [Role],
            });
            return userInvite;
        } catch (err) {
            logger.error("Error Reading UserInvite");
            throw err;
        }
    }

    static async viewAllUserInvites(): Promise<UserInvite[] | void> {
        try {
            const userInvites: UserInvite[] = await UserInvite.findAll({
                include: [Role],
            });
            return userInvites;
        } catch (err) {
            logger.error("Error Reading UserInvites");
            throw err;
        }
    }

    static async viewUserInvitesByStatus(
        status: string,
    ): Promise<UserInvite[] | void> {
        try {
            const userInvites: UserInvite[] = await UserInvite.findAll({
                where: { status },
                include: [Role],
            });
            return userInvites;
        } catch (err) {
            logger.error("Error Reading UserInvites");
            throw err;
        }
    }

    static async viewUserInviteByEmail(
        email: string,
    ): Promise<UserInvite | void | null> {
        try {
            const userInvite: UserInvite | null = await UserInvite.findOne({
                where: { email: email.toLowerCase() },
                include: [Role],
            });
            return userInvite;
        } catch (err) {
            logger.error("Error Reading UserInvite");
            throw err;
        }
    }
    /**
     * Retrieves a paginated and filtered list of userInvites.
     * @param limit The maximum number of userInvites to retrieve.
     * @param offset The number of userInvites to skip.
     * @param entityId The ID of the entity related to the userInvites.
     * @param status The status of the userInvites to filter by.
     * @returns A Promise resolving to an object containing the userInvites and pagination info, or void if an error occurs.
     */

    /**
     * Updates a userInvite by its UUID.
     * @param uuid The UUID of the userInvite to be updated.
     * @param userInvite The updated userInvite data.
     * @returns A Promise resolving to an object containing the update result and the updated userInvite, or void if an error occurs.
     */
    static async updateAUserInvite(
        uuid: string,
        userInvite: IUpdateUserInvite,
        transaction?: Transaction,
    ) {
        try {
            const userInvite = await UserInvite.findOne({
                where: { id: uuid },
            });

            if (!userInvite) {
                return null;
            }

            transaction
                ? await userInvite.update(userInvite, { transaction })
                : await userInvite.update(userInvite);

            const updatedUserInvite = transaction
                ? await UserInvite.findOne({
                      where: { id: uuid },
                      transaction,
                  })
                : await UserInvite.findByPk(uuid);

            return updatedUserInvite;
        } catch (error) {
            logger.error("Error Reading UserInvites");
            throw error;
        }
    }
}
