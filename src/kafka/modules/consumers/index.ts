import AirtimeConsumer from "./Airtime";
import CrmConsumer from "./Crm";
import InventoryConsumer from "./Inventory";
import NotificationConsumer from "./Notification";
import PartnerConsumer from "./Partner";
import TokenConsumer from "./Token";
import TransactionConsumer from "./Transaction";
import UserConsumer from "./User";
import VendorConsumer from "./Vendor";
import WebhookConsumer from "./Webhook";
import DataConsumer from "./Data";
require('newrelic');

export default class ConsumerRouter {
    static async init() {
        new CrmConsumer().startBatchConsumer();
        new InventoryConsumer().startBatchConsumer();
        new NotificationConsumer().startBatchConsumer();
        new PartnerConsumer().startBatchConsumer();
        new TokenConsumer().startBatchConsumer();
        new TransactionConsumer().startBatchConsumer();
        new UserConsumer().startBatchConsumer();
        new VendorConsumer().startBatchConsumer();
        new WebhookConsumer().startBatchConsumer();
        new AirtimeConsumer().startBatchConsumer();
        new DataConsumer().startBatchConsumer();
    }
}

