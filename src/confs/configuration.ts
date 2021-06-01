

interface APIS{
    events?:any;
    myProfil?:any,
    registerEmail?:any,
    emails?:any
}

export interface Configuration{
    API: APIS,
    soutenir:string;
    email: string;
    slack: string;
    tags:string[],
    support:string;
    baseURL:string;
    fcmPublicVapidKey:string;

}