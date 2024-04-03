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
        const scheduleForEveryOneMinute = "* * * * *";
        this.cron = new CronJob(schedule ?? scheduleForEveryOneMinute, () => {
            this.start();
        });
        this.cron.start();
        return this;
    }

    async start() {
        Logger.cronJob.info("Running cron job for checking if disco is up");
        try {
            for (const disco of DISCOS) {
                Logger.cronJob.info(`Checking if ${disco} is up`);
                const discoIsUp =
                    await VendorService.buyPowerCheckDiscoUp(disco);

                Logger.cronJob.info(
                    `Disco ${disco} is ${discoIsUp ? "up" : "down"}`,
                );
                const status = discoIsUp
                    ? ("available" as const)
                    : ("unavailable" as const);

                Logger.cronJob.info(
                    `Logging status for ${disco} to ${status}`,
                );
                await DiscoStatusService.addDiscoStatus({
                    disco: disco,
                    id: randomUUID(),
                    status
                });

                Logger.cronJob.info(`Logged status for ${disco} to ${status}`);
            }
        } catch (error) {
            Logger.cronJob.error(
                `Error checking if disco is up: ${(error as Error).message}`,
            );
        }
    }
}
