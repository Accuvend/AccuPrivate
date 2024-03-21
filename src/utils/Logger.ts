import winston, { format } from "winston";
import SysLog, { LogType } from "../models/SysLog.model"; // Import your Sequelize model for logging
import { NODE_ENV } from "./Constants";
import util from "util";
import { randomUUID } from "crypto";

declare module "winston" {
    export class Transport {
        log(info: any, callback: Function): void;
    }
}

// Define a custom transport to write logs to PostgreSQL using Sequelize
class YourCustomPostgresTransport extends winston.Transport {
    log(info: any, callback: Function) {
        const { timestamp, level, message, meta } = info;
        SysLog.create({
            id: randomUUID(),
            timestamp,
            level,
            message,
            meta,
            logType: meta?.logType,
            transactionId: meta?.transactionId,
            createdAt: new Date(),
            description: meta?.description ?? {}
        })
            .then(() => {
                callback();
            })
            .catch((error: Error) => {
                callback(error);
            });
    }
}

const { combine, timestamp, printf, colorize } = format;
const logFormat = printf((info) => {
    let message = info.message;

    if (typeof message === "object") {
        message = util.inspect(message, { depth: null });
    }

    return info.meta
        ? `${info.timestamp} [${
              info.level
          }][${info.meta?.logType ?? "default"}]: ${message} | meta: ${JSON.stringify(info.meta)}`
        : `${info.timestamp} [${info.level}]: ${message}`;
});

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const fileTransports = [
    new winston.transports.File({
        filename: "error.log",
        level: "error",
        format: combine(timestamp(), logFormat, enumerateErrorFormat()),
    }),
    new winston.transports.File({
        filename: "combined.log",
        format: combine(timestamp(), logFormat, enumerateErrorFormat()),
    }),
    new winston.transports.File({
        filename: "debug.log",
        level: "debug",
        format: combine(timestamp(), logFormat, enumerateErrorFormat()),
    }),
    new winston.transports.File({
        filename: "warn.log",
        level: "warn",
        format: combine(timestamp(), logFormat, enumerateErrorFormat()),
    }),
    // info
    new winston.transports.File({
        filename: "info.log",
        level: "info",
        format: combine(timestamp(), logFormat, enumerateErrorFormat()),
    }),
];

const transports =
    NODE_ENV === "development"
        ? [
              new winston.transports.Console({
                  level: "info",
                  format: combine(
                      timestamp(),
                      colorize({
                          colors: { info: "cyan", error: "red" },
                      }),
                      logFormat,
                      enumerateErrorFormat(),
                  ),
              }),
              ...fileTransports,
              new YourCustomPostgresTransport(), // Replace this with your custom transport
          ]
        : [
              new winston.transports.Console({
                  level: "info",
                  format: combine(
                      timestamp(),
                      colorize({
                          colors: { info: "cyan", error: "red" },
                      }),
                      logFormat,
                      enumerateErrorFormat(),
                  ),
              }),
          ];

const productionLogger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        winston.format.simple(),
        enumerateErrorFormat(),
    ),
    transports: transports as any,
});

const logger = productionLogger;

class CustomLogger {
    logType: LogType;

    constructor(logType: LogType) {
        this.logType = logType;
    }

    info(message: string, meta?: any) {
        logger.info(message, {
            meta: { ...(meta ?? {}), logType: this.logType },
        });
    }

    error(message: string, meta?: any) {
        logger.error(message, {
            meta: { ...(meta ?? {}), logType: this.logType },
        });
    }

    debug(message: string, meta?: any) {
        logger.debug(message, {
            meta: { ...(meta ?? {}), logType: this.logType },
        });
    }

    warn(message: string, meta?: any) {
        logger.warn(message, {
            meta: { ...(meta ?? {}), logType: this.logType },
        });
    }
}

export class Logger {
    static apiResponse = new CustomLogger("apiResponse");
    static apiRequest = new CustomLogger("apiRequest");
    static kafkaPublisher = new CustomLogger("kafkaPublisher");
    static kafkaFailure = new CustomLogger("kafkaFailure");
    static kafkaMessageProcessing = new CustomLogger("kafkaMessageProcessing");
    static retries = new CustomLogger("retries");
    static cronJob = new CustomLogger("cronJob");
}

export default logger;
