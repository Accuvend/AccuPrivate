import { Logger } from "../utils/Logger";
import DiscoUpCron from "./jobs/discoUp";

export default function startCrons() {
    Logger.cronJob.info("Starting crons");

    new DiscoUpCron().start();

    Logger.cronJob.info("Started crons");
}
