import { Notif } from "../models/notif";
import { Subject, Subscription } from "rxjs";
import { Store } from "./store";

class NotifStore implements Store<Notif>{

    private sub = new Subject<Notif>();

    public set(notif: Notif): void{
        this.sub.next(notif);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }
}

export default new NotifStore();