import Meter from "../models/Meter.model";
import { IMeter, ICreateMeter } from "../models/Meter.model";
import logger from "../utils/Logger";
require('newrelic');

export default class MeterService {
    static async addMeter(meter: ICreateMeter): Promise<Meter> {
        const newMeter: Meter = Meter.build(meter)
        await newMeter.save()
        return newMeter
    }

    static async viewMeters(): Promise<Meter[] | void> {
        const meters: Meter[] = await Meter.findAll()
        return meters
    }

    static async viewSingleMeter(uuid: string): Promise<Meter | null> {
        const meter: Meter | null = await Meter.findByPk(uuid)
        return meter
    }

    static async viewSingleMeterByMeterNumber(meterNumber: string): Promise<Meter | null> {
        const meter: Meter | null = await Meter.findOne({ where: { meterNumber } })
        return meter
    }

    static async viewMetersWithCustomQuery(query: any): Promise<Meter[]> {
        const meters: Meter[] = await Meter.findAll(query)
        return meters
    }

    static async updateSingleMeter() {

    }
}