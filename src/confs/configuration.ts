

interface APIS{
    events?:any;
    myProfil?:any
}

export interface Configuration{
    API: APIS,
    soutenir:string;
    email: string;
    slack: string;
    support:string;
    baseURL:string;
    fcmPublicVapidKey:string;

}