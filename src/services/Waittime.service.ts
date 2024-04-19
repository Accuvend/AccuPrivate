import { redisClient } from "../models"

export default class WaitTimeService {
    static async setRetryTime(timesToRetry: number[]) {
        await redisClient.set('waitTime', JSON.stringify(timesToRetry))
        return timesToRetry
    }

    static async getWaitTime(): Promise<number[] | null> {
        const value = await redisClient.get('waitTime')
        if (!value) return null

        return JSON.parse(value) as number[]
    }
}