import { Transaction } from "sequelize"
import Entity, { IEntity, IUpdateEntity } from "../../models/Entity/Entity.model"
import TeamMemberProfile from "../../models/Entity/Profiles/TeamMemberProfile.model"
import PartnerProfile from "../../models/Entity/Profiles/PartnerProfile.model"
import RoleService from "../Role.service"
import Role, { RoleEnum } from "../../models/Role.model"

export default class EntityService {
    static async addEntity(entityData: Omit<IEntity, 'roleId'> & { role: RoleEnum }, transaction?: Transaction): Promise<Entity> {
        const role = await RoleService.viewRoleByName(entityData.role)
        if (!role) {
            throw new Error('Role not found')
        }

        const entity: Entity = Entity.build({ ...entityData, roleId: role.id })
        const _transaction = transaction ? await entity.save({ transaction }) : await entity.save()

        return _transaction
    }

    static async viewEntity(): Promise<Entity[] | void> {
        const entity: Entity[] = await Entity.findAll()
        return entity
    }

    static async viewSingleEntity(id: string): Promise<Entity | null> {
        const entity: Entity | null = await Entity.findByPk(id)

        if (!entity) {
            throw new Error('Entity not found')
        }

        return entity
    }

    static async viewSingleEntityByEmail(email: string): Promise<Entity | null> {
        const entity: Entity | null = await Entity.findOne({ where: { email }, include: [Role] })

        if (!entity) {
            return null
        }

        return entity
    }

    static async viewSingleEntityByPhoneNumber(phoneNumber: string): Promise<Entity | null> {
        const entity: Entity | null = await Entity.findOne({ where: { phoneNumber }, include: [Role] })

        if (!entity) {
            return null
        }

        return entity
    }

    static async updateEntity(entity: Entity, dataToUpdate: IUpdateEntity): Promise<Entity> {
        await entity.update(dataToUpdate)

        const updatedEntity = await Entity.findOne({ where: { id: entity.id } })
        if (!updatedEntity) {
            throw new Error('Entity not found')
        }

        return updatedEntity
    }

    static async viewEntityWithCustomQuery(query: any): Promise<Entity[]> {
        const entity: Entity[] = await Entity.findAll(query)
        return entity
    }

    static async getAssociatedProfile(entity: Entity): Promise<PartnerProfile | TeamMemberProfile | null> {
        const partnerProfile = await entity.$get('partnerProfile')
        const teamMemberProfile = await entity.$get('teamMemberProfile')

        return partnerProfile || teamMemberProfile
    }

    static async viewEntityByTeamMemberProfileId(teamMemberProfileId: string): Promise<Entity | null> {
        const entity: Entity | null = await Entity.findOne({ where: { teamMemberProfileId } })

        if (!entity) {
            return null
        }

        return entity
    }

    static async deleteEntity(entity: Entity, transaction?: Transaction): Promise<void> {
        transaction ? await entity.destroy({ transaction }) : await entity.destroy()
    }
}