import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import { User } from '../models/User';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { AxiosResponse } from 'axios';



export class MyProfilStore implements Store<User>{
    private sub = new BehaviorSubject<User>({email:''});

    public set(user: User): void{
        this.sub.next(user);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    static async update(user: User){
        if(process.env.REACT_APP_STAGE === 'prod'){
            await httpClientService.axios.put(conf.API.myProfil(), user);
        }else{
            console.log('update user',user);
            await httpClientService.axios.get(conf.API.myProfil());
        }
        
    }

    /**
     * 
     */
    public load():Promise<User>{
        return httpClientService.axios.get(conf.API.myProfil())
        .then((response: AxiosResponse<User>) => {
            this.set(response.data);
            return response.data;
        });
    }
}

export default new MyProfilStore() ;