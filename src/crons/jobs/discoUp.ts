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
                let discoStatus: DiscoStatus | null =
                    await DiscoStatusService.viewSingleDiscoStatusByDiscoName(
                        disco,
                    );

                if (!discoStatus) {
                    Logger.cronJob.info(
                        `No status for ${disco} found, adding new status`,
                    );
                    discoStatus = await DiscoStatusService.addDiscoStatus({
                        disco,
                        status: "unavailable",
                        id: randomUUID(),
                    });
                    Logger.cronJob.info(`Added new status for ${disco}`);
                }

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
                    `Updating status for ${disco} to ${status}`,
                );
                await DiscoStatusService.updateSingleDiscoStatus(
                    discoStatus.id,
                    status,
                );
                Logger.cronJob.info(`Updated status for ${disco} to ${status}`);
            }
        } catch (error) {
            Logger.cronJob.error(
                `Error checking if disco is up: ${(error as Error).message}`,
            );
        }
    }
}
