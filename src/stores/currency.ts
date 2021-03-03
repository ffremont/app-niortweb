import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { AxiosResponse } from 'axios';
import { Currencies } from '../models/Currencies';

export class CurrencyStore implements Store<Currencies>{
    private sub = new BehaviorSubject<Currencies|null>(null);
 
    public set(currencies:Currencies): void{
        this.sub.next(currencies);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    /**
     * 
     */
    public load():Promise<Currencies>{
        return httpClientService.axios.get(conf.API.currencies())
        .then((response: AxiosResponse<Currencies>) => {
            this.set(response.data);
            return response.data;
        });
    }
}

export default new CurrencyStore() ;