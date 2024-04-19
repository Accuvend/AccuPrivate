import { CronJob } from "cron";
import { DISCOS } from "../../utils/Constants";
import DiscoStatusService from "../../services/DiscoStatus.service";
import VendorService from "../../services/VendorApi.service";
import DiscoStatus from "../../models/DiscoStatus.model";
import { Logger } from "../../utils/Logger";
import { info } from "console";
import { randomUUID } from "crypto";

export default class DiscoUpCron {
    private cron: CronJob;

    constructor(schedule?: string) {
        // Schedule to run at 5 mins interval
        const scheduleForEveryFiveMinutes = "*/5 * * * *";
        this.cron = new CronJob(schedule ?? scheduleForEveryFiveMinutes, () => {
            this.start();
        });
        this.cron.start();
        return this;
    }

    async start() {
        try {
            for (const disco of DISCOS) {
                const discoIsUp =
                    await VendorService.buyPowerCheckDiscoUp(disco);

                const status = discoIsUp
                    ? ("available" as const)
                    : ("unavailable" as const);

                await DiscoStatusService.addDiscoStatus({
                    disco: disco,
                    id: randomUUID(),
                    status,
                    createdAt: new Date()
                });

            }
        } catch (error) {
            Logger.cronJob.error(
                `Error checking if disco is up: ${(error as Error).message}`,
            );
        }
    }
}
