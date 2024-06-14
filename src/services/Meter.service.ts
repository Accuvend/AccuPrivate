import { Transaction } from "sequelize";
import Meter from "../models/Meter.model";
import { IMeter, ICreateMeter } from "../models/Meter.model";
import logger from "../utils/Logger";
export default class MeterService {
    static async addMeter(
        meter: ICreateMeter,
        transaction: Transaction,
    ): Promise<Meter> {
        const newMeter: Meter = Meter.build(meter);
        const _meter = transaction
            ? await newMeter.save({ transaction })
            : await newMeter.save();
        return _meter;
    }

    static async viewMeters(): Promise<Meter[] | void> {
        const meters: Meter[] = await Meter.findAll();
        return meters;
    }

    static async viewSingleMeter(uuid: string): Promise<Meter | null> {
        const meter: Meter | null = await Meter.findByPk(uuid);
        return meter;
    }

    static async viewExistingMeterForUserVend({
        userId,
        meterNumber,
        disco,
    }: {
        userId: string;
        meterNumber: string;
        disco: string;
    }): Promise<Meter | null> {
        const meter: Meter | null = await Meter.findOne({
            where: { userId, meterNumber, disco },
        });
        return meter;
    }
    static async viewSingleMeterByMeterNumber(
        meterNumber: string,
    ): Promise<Meter | null> {
        const meter: Meter | null = await Meter.findOne({
            where: { meterNumber },
        });
        return meter;
    }

    static async viewSingleMeterByMeterNumberDisco({
        meterNumber,
        disco,
    }: {
        meterNumber: string,
        disco: string,
    }): Promise<Meter | null> {
        const meter: Meter | null = await Meter.findOne({
            where: { meterNumber, disco },
        });
        return meter;
    }

    static async viewMetersWithCustomQuery(query: any): Promise<Meter[]> {
        const meters: Meter[] = await Meter.findAll(query);
        return meters;
    }

    static async updateMeterInPlace({
        meter,
        meterData,
        transaction,
    }: {
        meter: Meter;
        meterData: IUpdateMeter;
        transaction: Transaction;
    }) {
        transaction
            ? await meter.update(meterData, { transaction })
            : await meter.update(meterData);

        const updatedMeter = transaction
            ? await Meter.findByPk(meter.id, { transaction })
            : await Meter.findByPk(meter.id);
        return updatedMeter;
    }
}
