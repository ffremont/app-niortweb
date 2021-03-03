

interface APIS{
    tickets?:any;
    myProfil?:any,
    currencies?:any
}

export interface Configuration{
    API: APIS,
    soutenir:string;
    email: string;
    support:string;
    baseURL:string;
    fcmPublicVapidKey:string;
    coinlib:any;
    coinmarketcap:any;

}