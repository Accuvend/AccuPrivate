// Import necessary types and the Event model
import { ICreateEvent, IEvent } from "../models/Event.model";
import Event from "../models/Event.model";

// EventService class for handling event-related operations
export default class EventService {
    
    // Method for adding a new event to the database
    async addEvent(event: ICreateEvent): Promise<Event | void> {
        try {
            // Create a new event using the Event model
            // const newEvent: Event = await Event.create(event);
            const newEvent: Event = await Event.build(event);
            newEvent.save();
            return newEvent;
        } catch (err) {
            console.log('Error Logging Event');
        }
    }

    // Method for viewing a single event by its UUID
    async veiwSingleEvent(uuid: string): Promise<Event | void | null> {
        try {
            // Find and retrieve an event by its UUID
            const event: Event | null = await Event.findByPk(uuid);
            return event;
        } catch (err) {
            console.log('Error reading Event');
        }
    }

   // async updateSingleEvent(uuid: string , event: IEvent): Promise<Event>{

    // }

    // async veiwEvents(): Promise<Array<IEvent>>{

    // }
}
