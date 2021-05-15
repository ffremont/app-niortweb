import { BehaviorSubject, Subscription } from 'rxjs';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { AxiosResponse } from 'axios';
import * as My from '../models/Event';

export class EventStore implements Store<My.Event[]>{
    private sub = new BehaviorSubject<My.Event[]>([]);

    public set(evts: My.Event[]): void {
        this.sub.next(evts);
    }

    public subscribe(func: any): Subscription {
        return this.sub.subscribe(func);
    }

    static async add(evt: My.Event) {
        const response: AxiosResponse<My.Event> = await httpClientService.axios.post(conf.API.events(), evt);

        return response.data;
    }

    static async update(evt: My.Event) {
        if (evt.id)
            await httpClientService.axios.put(conf.API.events(evt.id), evt);
        else
            await httpClientService.axios.post(conf.API.events(evt.id), evt);
    }

    static async remove(ticket: My.Event) {
        if (process.env.REACT_APP_STAGE === 'prod') {
            await httpClientService.axios.delete(conf.API.events(ticket.id));
        } else {
            console.log('delete ticket', ticket);
            await httpClientService.axios.get(conf.API.events());
        }
    }

    /**
     * 
     */
    public load(): Promise<My.Event[]> {
        return httpClientService.axios.get(conf.API.events())
            .then((response: AxiosResponse<My.Event[]>) => {
                this.set(response.data);
                return response.data;
            });
    }
}

export default new EventStore();