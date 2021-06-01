import axios, {AxiosRequestConfig} from 'axios';
import { Subscription, Subject } from 'rxjs';
import { HttpCall } from '../models/httpcall';
import authService from './auth.service';


class HttpClientService{
    private subRequest = new Subject<HttpCall>();
    private subResponse = new Subject<HttpCall>();

    private config: AxiosRequestConfig;

    public axios:any;

    constructor(){
        this.config = {
            responseType: 'json',
            timeout: 40000,
            
            transformResponse: [(data:any, headers:any)=>{
                this.subResponse.next({data, headers});
                return data;
            }]
        };
        this.axios = axios.create(this.config);

        this.axios.interceptors.request.use(async (config:any) => {
            config.headers['Content-Type'] = 'application/json';
            const token = await authService.getToken();
            if(token !== null){
                config.headers.Authorization = `Bearer ${token}`;
            }
            this.subRequest.next({data : config.data, headers: config.headers});
            config.data = JSON.stringify(config.data);
            return config;
          });
    }

    public subOnRequest(func:any): Subscription{
        return this.subRequest.subscribe(func);
    }

    public subOnResponse(func:any): Subscription{
        return this.subResponse.subscribe(func);
    }
}

export default new HttpClientService() ;