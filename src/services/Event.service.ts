// Import necessary types and the Event model
import { TOPICS } from "../kafka/Constants";
import { ICreateEvent, IEvent, Status } from "../models/Event.model";
import Event from "../models/Event.model";
import Transaction from "../models/Transaction.model";
import logger from "../utils/Logger";
import TransactionEventService from "./TransactionEvent.service";

// EventService class for handling event-related operations
export default class EventService {
    // Method for adding a new event to the database
    static async addEvent(event: ICreateEvent): Promise<Event> {
        try {
            // Create a new event using the Event model
            // const newEvent: Event = await Event.create(event);
            const newEvent: Event = Event.build(event);

            logger.info("EventService.addEvent", {
                meta: { transactionId: event.transactionId, eventData: event },
            });
            await newEvent.save();
            return newEvent;
        } catch (err) {
            console.error(err);
            logger.info("Error Logging Event");
            throw err;
        }
    }

    // Method for viewing a single event by its UUID
    static async viewSingleEvent(uuid: string): Promise<Event | void | null> {
        try {
            // Find and retrieve an event by its UUID
            const event: Event | null = await Event.findOne({
                where: { id: uuid },
                include: [Transaction],
            });
            return event;
        } catch (err) {
            logger.info("Error reading Event");
        }
    }

    static async viewEventsForTransaction(
        transactionId: string,
    ): Promise<Event[] | void | null> {
        try {
            // Find and retrieve an event by its UUID
            const events: Event[] | null = await Event.findAll({
                where: { transactionId },
                include: [Transaction],
            });
            return events;
        } catch (err) {
            logger.info("Error reading Event");
        }
    }

    static async viewSingleEventByTransactionIdAndType(
        transactionId: string,
        eventType: IEvent["eventType"],
    ): Promise<Event | void | null> {
        const event: Event | null = await Event.findOne({
            where: { transactionId, eventType },
            include: [Transaction],
        });
        return event;
    }

    static transactionEventService = TransactionEventService;
}
