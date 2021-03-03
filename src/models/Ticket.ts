import { AmountOf } from "./AmountOf";
import { TicketStateEnum } from "./TicketStateEnum";

export interface Ticket{
    /**
     * 
     */
    id:string;
    
    /**
     * Crypto à acheter / revendre
     * ex: on veut acheter des bitcoins BTC
     */
    crypto: string;

    /**
     * Date de création du ticket
     */
    at:number;

    /**
     * 
     */
    state:TicketStateEnum;

    /**
     * Marge à appliquer avant de revendre
     */
    targetPerCent: number;

    /**
     * Active la notification si le cours est en dessus de la valeur
     */
    buyUnder: number;

    /**
     * Propriétaire du ticket (email)
     */
    owner:string;

    /**
     * Volume de Crypto acheté, à revendre !
     */
    volume: number;

    /**
     * On veut acheter pour X EURO 
     */
    wantBuyFor:{amount:number, currency: string},

    /**
     * Achat pour X EURO / USDC / ...
     * ex: 40 USDC
     */
    buyFor?:AmountOf,

    /**
     * La vente de fait dans la même crypto que pour l'achat
     * ex: 45.3 USDC
     */
    sell?:AmountOf,

    /**
     * Indique si on veut garder le ticket le plus longtemps possible
     */
    keep?:boolean,


    fcmLastNotificationFlag:number;
    emailLastNotificationFlag:number;
}