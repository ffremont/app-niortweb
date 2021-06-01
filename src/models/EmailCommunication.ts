import { Event } from "./Event";

export interface EmailCommunication {
    eventId: string,
    subject: string, 
    title: string, 
    subTitle: string, 
    templateName?: string,
    testEmail:string,
    event?:Event
}