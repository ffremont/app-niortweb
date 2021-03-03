export interface Notif{
    type:NotifType;
    message:string;
    duration?:number;
}

export enum NotifType{
    MEMO
}