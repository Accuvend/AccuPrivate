import axios, { AxiosError } from "axios";
import { ONESIGNAL_API_KEY, ONESIGNAL_APP_ID } from './Constants';
import logger from "./Logger";
import { INotification } from "./Interface";
import * as OneSignal from '@onesignal/node-onesignal'

/**
 * Login
 * Failed txn
 * New account
 */
class NotificationUtil {
    private static client = new OneSignal.DefaultApi(OneSignal.createConfiguration({
        appKey: ONESIGNAL_API_KEY,
        userKey: ONESIGNAL_APP_ID,
    }))

    static async sendNotificationToUser(userId: string, notification: INotification): Promise<'success' | null> {
        try {
            const oneSignalNotification = new OneSignal.Notification()
            oneSignalNotification.contents = { en: notification.message }
            oneSignalNotification.headings = { en: notification.heading || notification.title }
            oneSignalNotification.include_external_user_ids = [userId]
            oneSignalNotification.app_id = ONESIGNAL_APP_ID
            oneSignalNotification.included_segments = ['All']

            await this.client.createNotification(oneSignalNotification)
            return 'success'
        } catch (error: AxiosError | unknown) {
            logger.error('Error sending notification to users', { meta: { error: (error as Error).stack } })
            return null
        }
    }
}

export default NotificationUtil