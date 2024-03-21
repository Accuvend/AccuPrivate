import moment from 'moment-timezone'

export class NigerianDate {
    private readonly timeZone: string;

    constructor() {
        // Nigeria is in the West Africa Time (WAT) zone
        this.timeZone = 'Africa/Lagos';
    }

    public getCurrentNigerianDate(): Date {
        const currentDate = new Date();
        const nigerianDate = this.convertToTimeZone(currentDate, this.timeZone);
        return nigerianDate;
    }

    private convertToTimeZone(date: Date, targetTimeZone: string): Date {
        const targetDate = moment.tz(date, targetTimeZone).tz(targetTimeZone).format()

        return targetDate as unknown as Date;
    }
}
