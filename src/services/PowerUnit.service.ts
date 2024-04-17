import PowerUnit from "../models/PowerUnit.model";
import { ICreatePowerUnit } from "../models/PowerUnit.model";
import logger from "../utils/Logger";
export default class PowerUnitService {

    static async addPowerUnit(powerUnit: ICreatePowerUnit): Promise<PowerUnit> {
        logger.info('Adding PowerUnit', {
            meta: {
                transactionId: powerUnit.transactionId
            }
        })
        const newPowerUnit: PowerUnit = PowerUnit.build(powerUnit)
        await newPowerUnit.save()
        return newPowerUnit
    }

    static async viewPowerUnitByToken(token: string): Promise<PowerUnit | null> {
        const powerUnit: PowerUnit | null = await PowerUnit.findOne({ where: { token } })
        return powerUnit
    }

    static async viewPowerUnitsWithCustomQuery(query: any): Promise<PowerUnit[]> {
        const powerUnits: PowerUnit[] = await PowerUnit.findAll(query)
        return powerUnits
    }

    static async viewPowerUnits(): Promise<PowerUnit[] | void> {
        const PowerUnits: PowerUnit[] = await PowerUnit.findAll()
        return PowerUnits
    }

    static async viewSinglePowerUnit(uuid: string): Promise<PowerUnit | void | null> {
        const powerUnit: PowerUnit | null = await PowerUnit.findByPk(uuid)
        return powerUnit
    }

    static async viewSinglePowerUnitByTransactionId(transactionId: string): Promise<PowerUnit | void | null> {
        const powerUnit: PowerUnit | null = await PowerUnit.findOne({ where: { transactionId } })
        return powerUnit
    }

    static async updateSinglePowerUnit(powerUnitId: string, update: Partial<ICreatePowerUnit>): Promise<PowerUnit> {
        const powerUnit: PowerUnit | null = await PowerUnit.findByPk(powerUnitId)
        if (!powerUnit) throw new Error('PowerUnit not found')
        await powerUnit.update(update)

        const updatedPowerUnit: PowerUnit | null = await PowerUnit.findByPk(powerUnitId)
        if (!updatedPowerUnit) throw new Error('PowerUnit not found')

        return updatedPowerUnit
    }
}