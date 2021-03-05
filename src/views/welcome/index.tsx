import React from 'react';
import './Welcome.scss';
import MenuApp from '../../shared/menu-app';
import historyService from '../../services/history.service';
import ticketStore from '../../stores/ticket';
import currencyStore from '../../stores/currency';
import { Chip, CircularProgress } from '@material-ui/core';
import { Ticket } from '../../models/Ticket';
import { Currencies } from '../../models/Currencies';
import { TicketStateEnum } from '../../models/TicketStateEnum';
import { Currency } from '../../models/Currency';
import { firstBy } from "thenby";
import SnackAdd from '../../shared/snack-add';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import AppIcon from '../../assets/images/banner-logo.png';

class Welcome extends React.Component<{ history: any, match: any }, {
  tickets: Ticket[],
  currencies: Currencies | null,
  openCrypto: boolean,
  currentCrypto: string,
  openBalance: boolean
}>{

  state = { tickets: [], currencies: null, openCrypto: false, currentCrypto: '', openBalance: false };

  componentWillUnmount() {
  }

  componentDidMount() {
    historyService.on(window.location.pathname);

    this.loadData();
  }

  loadData() {
    const orders = [TicketStateEnum.TO_SELL, TicketStateEnum.TO_BUY, TicketStateEnum.WAIT, TicketStateEnum.PLANNED, TicketStateEnum.SOLD];
    Promise.all([ticketStore.load(), currencyStore.load()])
      .then((data: any) => {
        const tickets = data[0].map((t: Ticket) => {
          const state = ticketStore.stateOf(t, data[1]);
          return { ...t, state, order: orders.indexOf(state) }
        });
        tickets.sort(firstBy('order').thenBy('at', { direction: "desc" }))
        this.setState({ tickets, currencies: data[1] });
      });
  }

  //groupBy(pets, pet => pet.type), grouped.get("Dog")
  groupBy(list: any, keyGetter: any) {
    const map = new Map();
    list.forEach((item: any) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  render() {
    const currencies = (this.state.currencies || { data: [] }) as any;
    const cryptoPurchases: { currency: string, amount: number }[] = [];
    if (this.state.tickets) {
      this.state.tickets.forEach((t: Ticket) => {
        const wantBuyForEuro = (currencies as any).data.find((c: Currency) => c.name === t.wantBuyFor.currency).price * t.wantBuyFor.amount
        cryptoPurchases.push({ currency: t.crypto, amount: t.buyFor ? t.buyFor.euroAmount : wantBuyForEuro })
      });
    }
    const groupedByCurrencyCryptoPurchases = this.groupBy(cryptoPurchases, (c: any) => c.currency);
    const groupedByCryptoTickets = this.groupBy(this.state.tickets || [], (t: Ticket) => t.crypto);

    return (<div className="tickets tickets-content">
      <MenuApp mode="home" history={this.props.history} onRefresh={() => this.loadData()} />


      {(!this.state.tickets || !this.state.currencies) && (<div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      ><CircularProgress className="wait-auth" /></div>)}


      <SnackAdd />

      <div className="events">
        <Card className="main" >
          <CardActionArea>
            <CardMedia
              className="app-card-media"
              image={AppIcon}
              title="logo NW"
            />
            <CardContent className="app-card-content">
              <Typography gutterBottom variant="h5" component="h2">
                Qu'est-ce que NiortWeb ?
              </Typography>

              <Typography variant="body2" color="textSecondary" component="p">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                across all continents except Antarctica
              </Typography>

              <ul>
                <li>
                  <Chip color="primary" label="Format le midi" /> Sed rutrum id est et pellentesque. Sed sed fermentum magna, quis venenatis nunc. Nullam luctus, nibh nec egestas volutpat, tellus mauris placerat mauris.
                </li>
                <li>
                  <Chip color="primary" label="Format le soir" /> Sed rutrum id est et pellentesque. Sed sed fermentum magna, quis venenatis nunc. Nullam luctus, nibh nec egestas volutpat, tellus mauris placerat mauris.
                </li>
              </ul>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>

    </div>);
  }
}


export default Welcome;
