import React from 'react';
import './Tickets.scss';
import MenuApp from '../../shared/menu-app';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import TimerIcon from '@material-ui/icons/Timer';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'; // vendu
import historyService from '../../services/history.service';
import AddIcon from '@material-ui/icons/Add';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'; // à vendre
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ticketStore from '../../stores/ticket';
import currencyStore from '../../stores/currency';
import { Chip, CircularProgress, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { Ticket } from '../../models/Ticket';
import { Currencies } from '../../models/Currencies';
import { TicketStateEnum } from '../../models/TicketStateEnum';
import { Currency } from '../../models/Currency';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { firstBy } from "thenby";
import SnackAdd from '../../shared/snack-add';
import EuroCoinIcon from '../../assets/images/euro-coin.svg';
import { TicketService } from '../../services/ticket.service';
import CryptoGraph from '../../shared/cryptograph';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Balance from '../../shared/balance';
import NumberFormat from 'react-number-format';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import conf from '../../confs';

class Tickets extends React.Component<{ history: any, match: any }, {
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

      {this.state.tickets && this.state.currencies && (<Balance currencies={this.state.currencies} tickets={this.state.tickets} open={this.state.openBalance} onClose={() => this.setState({ openBalance: false })} />)}
      <CryptoGraph crypto={this.state.currentCrypto} open={this.state.openCrypto} onClose={() => this.setState({ openCrypto: false })} />

      {(!this.state.tickets || !this.state.currencies) && (<div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      ><CircularProgress className="wait-auth" /></div>)}

      <div className="currencies">
        {currencies.data.map((c: Currency) => (
          <div className="my-currency" key={`myc_${c.name}`}>
            {(c.name !== 'EUR') && (<Chip className=""
              onClick={() =>  conf.coinlib[c.name] ? this.setState({ currentCrypto: c.name, openCrypto: true }) : window.location.href=conf.coinmarketcap[c.name]}
              avatar={<Avatar src={c.logoUrl ? c.logoUrl : EuroCoinIcon} />}
              label={<NumberFormat value={c.price} displayType={'text'} decimalScale={3} thousandSeparator={' '} />}
              variant="outlined"
            />)}
          </div>
        ))}
      </div>
      <SnackAdd />
      <div className="tickets-grouped">

        {currencies.data
          .filter((c: Currency) => cryptoPurchases.some((cp: any) => cp.currency === c.name))
          .map((c: Currency) => {
            return {
              currency: c,
              amount: (groupedByCurrencyCryptoPurchases.get(c.name) || []).map((cp: any) => cp.amount).reduce((a: any, b: any) => a + b, 0)
            }
          })
          .map((cryptoResume: any) => (
            <Accordion key={`cr_${cryptoResume.currency.name}`}>
              <AccordionSummary
                className="acc-sum"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>
                  <div className="cr-area">
                    <div className="cr-avatar">
                      <Avatar className="small-avatar cryptoresume-avatar" alt={cryptoResume.currency.name} src={cryptoResume.currency.logoUrl} />
                    </div>
                    <div className="cr-titles">
                      <div className="cr-title">

                      &asymp; <NumberFormat value={cryptoResume.amount} displayType={'text'} decimalScale={0} thousandSeparator={' '} suffix="€" />
                      </div>
                      <div className="cr-subtitle">
                        <div className="cr-crypto-name">
                          {cryptoResume.currency.name}
                        </div>
                      </div>

                    </div>
                  </div>

                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className="list-tickets">
                  {groupedByCryptoTickets.get(cryptoResume.currency.name).map((t: Ticket) => (
                    <ListItem className="ticket-item" key={'list_' + t.id}>
                      <ListItemAvatar>
                        <Avatar className={`app-avatar avatar-state-${t.state}`}>
                          {(t.state.toString() === TicketStateEnum.PLANNED) && (<NotificationsIcon />)}
                          {(t.state.toString() === TicketStateEnum.SOLD) && (<CheckCircleIcon />)}
                          {(t.state.toString() === TicketStateEnum.TO_BUY) && (<AddShoppingCartIcon />)}
                          {(t.state.toString() === TicketStateEnum.TO_SELL) && (<ExitToAppIcon />)}
                          {(t.state.toString() === TicketStateEnum.WAIT) && (<TimerIcon />)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="h6"
                            color="textPrimary"
                          >
                            {(t.buyFor) && !t.sell && (<span>{t.volume.toFixed(4)} {t.crypto}</span>)}

                            {!t.buyFor && !t.sell && (<span className=""> {t.wantBuyFor.amount.toFixed(1)}<sup>{t.wantBuyFor.currency}</sup> de {t.crypto}
                            </span>)}

                          </Typography>

                          {/*([TicketStateEnum.PLANNED, TicketStateEnum.TO_BUY].indexOf(t.state) > -1) && (<span className="sub"> cours à {priceOf(t.crypto)}€</span>)*/}
                          {t.buyFor && (<Chip className="win-chip" label={TicketService.winEuro(t, currencies) + '€'} variant="outlined" />)}
                        </React.Fragment>
                      } secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {(t.state.toString() === TicketStateEnum.PLANNED) && ("Planifié")}
                            {(t.state.toString() === TicketStateEnum.SOLD) && ("Vendu")}
                            {(t.state.toString() === TicketStateEnum.TO_BUY) && ("ACHETER !")}
                            {(t.state.toString() === TicketStateEnum.TO_SELL) && ("VENDRE !")}
                            {(t.state.toString() === TicketStateEnum.WAIT) && ("Trading en cours...")}
                          </Typography>
                          
                          {(t.state.toString() === TicketStateEnum.PLANNED) && (`, ${t.crypto} à ${t.buyUnder}€`)}
                          {(t.state.toString() === TicketStateEnum.WAIT) && (<span> rendement {t.keep ? '∞' :t.targetPerCent+'%'} </span>)}
                        </React.Fragment>
                      } />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="plus" onClick={() => this.props.history.push(`/tickets/${t.id}`)}>
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}

      </div>

      <Fab className="fab-add" color="secondary" onClick={() => this.props.history.push('/tickets/new')} aria-label="edit">
        <AddIcon />
      </Fab>

      <Fab className="fab-balance" color="primary" onClick={() => this.setState({ openBalance: true })} aria-label="edit">
        <AccountBalanceIcon />
      </Fab>
    </div>);
  }
}


export default Tickets;
