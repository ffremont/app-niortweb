import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import { User } from '../models/User';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { AxiosResponse } from 'axios';
import { Ticket } from '../models/Ticket';
import { Currencies } from '../models/Currencies';
import { TicketStateEnum } from '../models/TicketStateEnum';
import { Currency } from '../models/Currency';
import { debug } from 'console';

export class TicketStore implements Store<Ticket[]>{
    private sub = new BehaviorSubject<Ticket[]>([]);
 
    public set(tickets: Ticket[]): void{
        this.sub.next(tickets);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    static async add(ticket: Ticket){
        const response: AxiosResponse<Ticket> = await httpClientService.axios.post(conf.API.tickets(), ticket);
        
        return response.data;
    }

    static async update(ticket: Ticket){
        await httpClientService.axios.put(conf.API.tickets(ticket.id), ticket);
    }

    static async remove(ticket: Ticket){
        if(process.env.REACT_APP_STAGE === 'prod'){
            await httpClientService.axios.delete(conf.API.tickets(ticket.id));
        }else{
            console.log('delete ticket',ticket);
            await httpClientService.axios.get(conf.API.tickets());
        }
    }

    /**
     * 
     */
    public load():Promise<Ticket[]>{
        return httpClientService.axios.get(conf.API.tickets())
        .then((response: AxiosResponse<Ticket[]>) => {
            this.set(response.data);
            return response.data;
        });
    }

    /**
     * Calcule état du ticket
     * @param t 
     * @param currencies 
     */
    stateOf(t:Ticket, currencies:Currencies): TicketStateEnum{
        if(t.sell) return TicketStateEnum.SOLD;

        const currencyOfCrypto =  currencies.data.find((c:Currency) => c.name == t.crypto);
        if(!currencyOfCrypto) throw `Crypto inconnue : ${t.crypto}`;

        if(t.buyFor){
            const currencyOfBuyFor =  currencies.data.find((c:Currency) => c.name == t.buyFor?.currency) || {price:1};
            // acheté mais pas vendu
            // doit-on vendre ?
            const priceAtBuy = (t.buyFor.amount*currencyOfBuyFor?.price) / (t.volume || 1);
           
            if(currencyOfCrypto.price > (priceAtBuy*(t.targetPerCent/100))){
                return TicketStateEnum.TO_SELL;
            }
        }else if(!t.buyFor){
            // pas acheté, ni vendu
            if(currencyOfCrypto.price < t.buyUnder){
                // on peut acheté
                return TicketStateEnum.TO_BUY;
            }
        }

        return t.buyFor ? TicketStateEnum.WAIT : TicketStateEnum.PLANNED;
    }
}

export default new TicketStore() ;