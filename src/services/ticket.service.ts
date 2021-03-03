import { Currencies } from "../models/Currencies";
import { Currency } from "../models/Currency";
import { Ticket } from "../models/Ticket";
import { TicketStateEnum } from "../models/TicketStateEnum";

export class TicketService{
    static winEuro(t: Ticket, currencies:Currencies) {
        if (currencies && (t.state.toString() !== TicketStateEnum.PLANNED)) {
          const currencyOfCrypto = (currencies as any).data.find((c: Currency) => c.name == t.crypto);
          const currencyOfWantFor = (currencies as any).data.find((c: Currency) => c.name == t.wantBuyFor.currency);
          if (!currencyOfCrypto) return '';
  
          const buyForEuro =  t.buyFor ? (t.buyFor as any).euroAmount : t.wantBuyFor.amount * currencyOfWantFor.price;
          let delta = (t.volume as any) * currencyOfCrypto.price - buyForEuro;
          if (currencies && (t.state.toString() === TicketStateEnum.SOLD)) {
            delta = (t.sell as any).euroAmount - buyForEuro;
          }
  
          return `${delta >= 0 ? '+' + delta.toFixed(1) : delta.toFixed(1)}`;
        }
  
        return '';
      };
}