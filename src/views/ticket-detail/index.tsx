import React from 'react';
import './TicketDetail.scss';
import MenuApp from '../../shared/menu-app';
import historyService from '../../services/history.service';
import ticketStore, { TicketStore } from '../../stores/ticket';
import currencyStore from '../../stores/currency';
import { Currencies } from '../../models/Currencies';
import CheckIcon from '@material-ui/icons/Check';
import { Chip, CircularProgress, Fab, FormControl, FormControlLabel, InputAdornment, InputLabel, Select, Slider, TextField, Typography } from '@material-ui/core';
import { Ticket } from '../../models/Ticket';
import { Currency } from '../../models/Currency';
import { TicketStateEnum } from '../../models/TicketStateEnum';
import notifStore from '../../stores/notif';
import DeleteIcon from '@material-ui/icons/Delete';
import { NotifType } from '../../models/notif';
import { TicketService } from '../../services/ticket.service';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'; // à vendre
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import BarChartIcon from '@material-ui/icons/BarChart';
import CryptoGraph from '../../shared/cryptograph';
import conf from '../../confs';
import Checkbox from '@material-ui/core/Checkbox';

class TicketDetail extends React.Component<{ history: any, match: any }, {
  ticket: Ticket | null,
  currencies: Currencies | null,
  openCrypto: boolean
}>{
  state = { ticket: null, currencies: null, openCrypto: false };

  componentWillUnmount() {
  }

  wantVolume(ticket: Ticket, forceCurrencies: any = null) {
    const currencies = forceCurrencies ? forceCurrencies.data : (this.state.currencies as any).data;
    const priceCryptoInEuro = currencies.find((c: any) => c.name === ticket.crypto).price;
    const priceBuyWithInEuro = currencies.find((c: any) => c.name === ticket.wantBuyFor.currency).price;

    const wantBuyInEuro = priceBuyWithInEuro * ticket.wantBuyFor.amount;
    return parseFloat((wantBuyInEuro / priceCryptoInEuro).toFixed(5));
  }

  componentDidMount() {
    historyService.on(window.location.pathname);

    const id: string = this.props.match.params.id || null;

    Promise.all([ticketStore.load(), currencyStore.load()])
      .then((data: any) => {
        const tickets = data[0].map((t: any) => {
          const state = ticketStore.stateOf(t, data[1]);
          return { ...t, state }
        });

        const ticketFound: any = tickets.find((t: Ticket) => t.id === id);
        this.setState({
          ticket: ticketFound ? { ...ticketFound, volume: ticketFound.volume || this.wantVolume(ticketFound, data[1]) } : {
            wantBuyFor: { amount: 40, currency: 'EUR' },
            crypto: 'BTC',
            state: TicketStateEnum.PLANNED,
            buyUnder: 7000,
            targetPerCent: 130
          }, currencies: data[1]
        });
      });
  }

  render() {
    const t: Ticket = this.state.ticket as any;
    const currencies = this.state.currencies ? (this.state.currencies as any).data : [];

    const winLose = this.state.ticket && this.state.currencies ? TicketService.winEuro(t, this.state.currencies as any) : '';
    const remove = () => {
      if (window.confirm(`Confirmez-vous la suppression ?`)) {
        TicketStore.remove(this.state.ticket as any)
          .then(() => {
            setTimeout(() => notifStore.set({ type: NotifType.MEMO, message: 'Ticket supprimé', duration: 1000 }), 100)
            this.props.history.push('/tickets');
          }).catch(() => this.props.history.push('/error'));
      }
    }

    const sell = () => {
      if (window.confirm(`Confirmez-vous la vente de ${t.volume} ${t.crypto} ?`))
        TicketStore.update({
          ...t,
          at: (new Date()).getTime(),
          state: TicketStateEnum.SOLD,
          sell: {
            amount: t.volume,
            currency: t.crypto,
            euroAmount: (currencies as any).find((c: Currency) => c.name === t.crypto).price * t.volume
          }
        }).then(() => {
          setTimeout(() => notifStore.set({ type: NotifType.MEMO, message: 'Ticket vendu', duration: 1000 }), 100)
          this.props.history.push('/tickets');
        }).catch(() => this.props.history.push('/error'));
    };

    const buy = () => {
      if (window.confirm(`Confirmez-vous l'achat de ${t.volume} ${t.crypto} pour ${t.wantBuyFor.amount} ${t.wantBuyFor.currency} ?`))
        TicketStore.update({
          ...t,
          at: (new Date()).getTime(),
          state: TicketStateEnum.WAIT,
          buyFor: {
            amount: t.wantBuyFor.amount,
            currency: t.wantBuyFor.currency,
            euroAmount: (currencies as any).find((c: Currency) => c.name === t.wantBuyFor.currency).price * t.wantBuyFor.amount
          }
        }).then(() => {
          setTimeout(() => notifStore.set({ type: NotifType.MEMO, message: 'Ticket acheté', duration: 1000 }), 100)
          this.props.history.push('/tickets');
        }).catch(() => this.props.history.push('/error'));
    };

    const onSubmit = (e: any) => {
      e.preventDefault();

      let p: any = null;
      const t: Ticket = this.state.ticket as any;

      if (t.id)
        p = TicketStore.update(this.state.ticket as any);
      else
        p = TicketStore.add(this.state.ticket as any);


      if (p) {
        p.then((newT:any) => {
          setTimeout(() => notifStore.set({ type: NotifType.MEMO, message: 'Ticket enregistré', duration: 1000 }), 100);
          this.props.history.push(`/tickets/${newT && newT.id ? newT.id : this.props.match.params.id}`);
          window.location.reload();
        }).catch(() => this.props.history.push('/error'));
      }
    }

    return (<div className="ticket">
      <MenuApp history={this.props.history} />

      <CryptoGraph crypto={t ? t.crypto : ''} open={this.state.openCrypto} onClose={() => this.setState({ openCrypto: false })} />

      {(!this.state.ticket || !this.state.currencies) && (<div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      ><CircularProgress className="wait-auth" /></div>)}


      {t && (<div className="area">
        <div className="vulgarisation">
          achat / vente de {t.crypto} pour {t.wantBuyFor.amount}<sup>{t.wantBuyFor.currency}</sup> où <br />1 {t.crypto} &lt; {t.buyUnder}€
        </div>
        <div className="state-area">
          {(t.state === TicketStateEnum.TO_BUY) && (<Chip color="secondary" size="small" label="Acheter" />)}
          {(t.state === TicketStateEnum.TO_SELL) && (<Chip color="secondary" size="small" label="Vendre" />)}
          {(t.state === TicketStateEnum.WAIT) && (<Chip size="small" label="Traiding..." />)}
          {(t.state === TicketStateEnum.PLANNED) && (t.id) && (<Chip size="small" label="Planifié" />)}
          {(t.state === TicketStateEnum.SOLD) && (<Chip size="small" label="Vendu" />)}
        </div>
        <form onSubmit={(e) => onSubmit(e)}>
          {([TicketStateEnum.WAIT, TicketStateEnum.TO_SELL].indexOf(t.state) === -1) && (<FormControl className="app-formcontrol" fullWidth={true}>
            <InputLabel htmlFor="crypto-simple">Crypto*</InputLabel>
            <Select
              native
              required
              value={t.crypto}
              onChange={(e: any) => { this.setState({ ticket: { ...t, crypto: e.target.value } }) }}
              inputProps={{
                name: 'crypto',
                id: 'crypto-simple',
              }}
            >
              {currencies.map((c: Currency) => (<option key={`crypto_${c.name}`} value={c.name}>{c.name}</option>))}

            </Select>
          </FormControl>)}



          {([TicketStateEnum.PLANNED, TicketStateEnum.TO_BUY].indexOf(t.state) > -1) && (<div key={'buyunder' + t.state} className="app-formcontrol">
            <TextField label="Limite MAX à l'achat" required helperText="Prix max d'achat du jeton de la crypto" InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  €
                </InputAdornment>
              )
            }} inputProps={{ min: '0', step: '0.001' }} defaultValue={t.buyUnder} onChange={(e: any) => this.setState({ ticket: { ...t, buyUnder: parseFloat(e.target.value) } })} fullWidth={true} type="number" />
          </div>)}

          {/* mode création */}
          {([TicketStateEnum.PLANNED].indexOf(t.state) > -1) && (<div key={'qty' + t.state} className="app-formcontrol volume">
            <div className="qty">
              <TextField
                required
                helperText="Montant de l'achat fiat ou crypto"
                label="En acheter pour"
                defaultValue={t.wantBuyFor.amount}
                value={t.wantBuyFor.amount}
                inputProps={{ min: '0', step: '0.001' }}
                onChange={(e: any) => this.setState({ ticket: { ...t, wantBuyFor: { ...t.wantBuyFor, amount: parseFloat(e.target.value) } } })} fullWidth={true} type="number" />
            </div>
            <div className="unit">
              <FormControl className="app-formcontrol" fullWidth={true}>
                <Select
                  native
                  required
                  value={t.wantBuyFor.currency}
                  onChange={(e: any) => this.setState({ ticket: { ...t, wantBuyFor: { ...t.wantBuyFor, currency: e.target.value } } })}
                  inputProps={{
                    name: 'wantBuyFor',
                    id: 'wantBuyFor-simple',
                  }}
                >
                  {currencies.map((c: Currency) => (<option key={`wantBuyFor_${c.name}`} value={c.name}>{c.name}</option>))}

                </Select>
              </FormControl>
            </div>
          </div>)}
          {/* mode achat */}
          {([TicketStateEnum.TO_BUY].indexOf(t.state) > -1) && (<div className="app-formcontrol volume important">
            <div className="qty">
              <TextField
                required
                helperText="Montant de l'achat fiat ou crypto"
                label="En acheter pour" defaultValue={t.wantBuyFor.amount}
                value={t.wantBuyFor.amount}
                inputProps={{ min: '0', step: '0.001' }}
                onChange={(e: any) => {
                  const newT = { ...t, wantBuyFor: { ...t.wantBuyFor, amount: parseFloat(e.target.value) } };
                  this.setState({ ticket: { ...newT, volume: this.wantVolume(newT) } });
                }}
                fullWidth={true}
                type="number"

              />
            </div>
            <div className="unit">
              <FormControl className="app-formcontrol" fullWidth={true}>
                <Select
                  native
                  required
                  value={t.wantBuyFor.currency}
                  onChange={(e: any) => {
                    const newT = { ...t, wantBuyFor: { ...t.wantBuyFor, currency: e.target.value } };
                    this.setState({ ticket: { ...newT, volume: this.wantVolume(newT) } })
                  }}
                  inputProps={{
                    name: 'wantBuyFor',
                    id: 'wantBuyFor-simple',
                  }}
                >
                  {currencies.map((c: Currency) => (<option key={`wantBuyFor_${c.name}`} value={c.name}>{c.name}</option>))}

                </Select>
              </FormControl>
            </div>
          </div>)}

          {([TicketStateEnum.TO_BUY].indexOf(t.state) > -1) && (
            <div className="app-formcontrol">
              <TextField
                type="number"
                label={`Volume à acheter`}
                fullWidth={true} color="secondary"
                defaultValue={t.volume || this.wantVolume(t)}
                value={t.volume}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {t.crypto}
                    </InputAdornment>
                  ),
                }}
                onChange={(e: any) => this.setState({ ticket: { ...t, volume: parseFloat(e.target.value) } })} variant="outlined" />
            </div>
          )}

          {([TicketStateEnum.TO_SELL].indexOf(t.state) > -1) && (
            <div className={`app-formcontrol win-lose ${parseFloat(winLose) >= 0 ? 'win' : 'lose'} `}>
              <TextField
                type="text"
                label={`Estimation du gain / perte`}
                fullWidth={true} color="secondary"
                defaultValue={winLose}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      €
                    </InputAdornment>
                  ),
                }}
                variant="outlined" />
            </div>
          )}
          {([TicketStateEnum.TO_SELL].indexOf(t.state) > -1) && (
            <div className={`app-formcontrol`}>
              <TextField
                type="text"
                label={`Volume à la vente`}
                fullWidth={true} color="secondary"
                defaultValue={t.volume}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      {t.crypto}
                    </InputAdornment>
                  ),
                }}
                variant="outlined" />
            </div>
          )}



          <div className="app-formcontrol">
            <FormControlLabel
              control={
                <Checkbox
                  checked={t.keep}
                  onChange={(e: any) => this.setState({ ticket: { ...t, keep: e.target.checked, targetPerCent:100000 } })}
                  name="keep"
                  color="primary"
                />
              }
              label="Conserver le plus lontemps"
            />
          </div>
          <div className="app-formcontrol">
            <TextField label="Objectif de rendement" required InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  %
                </InputAdornment>
              ),
            }} value={t.targetPerCent} onChange={(e: any) => this.setState({ ticket: { ...t, targetPerCent: parseInt(e.target.value) } })} fullWidth={true} type="number" />
          </div>


          {[TicketStateEnum.TO_SELL, TicketStateEnum.TO_BUY].indexOf(t.state) === -1 && (<div key="toselltobuy">
            <Fab key="check" color="secondary" aria-label="edit" type="submit" className="t-check">
              <CheckIcon />
            </Fab>
            {(t.id) && (<Fab key="remove" color="primary" aria-label="edit" className="t-delete" onClick={remove}>
              <DeleteIcon />
            </Fab>)}
          </div>)}

          {[TicketStateEnum.TO_SELL].indexOf(t.state) > -1 && (<div key="tosell">
            <Fab key="sell" color="secondary" aria-label="edit" className="t-first" onClick={sell}>
              <ExitToAppIcon />
            </Fab>
            <Fab key="save-sell" color="primary" type="submit" aria-label="edit" className="t-second" >
              <CheckIcon />
            </Fab>
            <Fab key="remove-sell" color="primary" aria-label="edit" className="t-third" onClick={remove}>
              <DeleteIcon />
            </Fab>
          </div>)}

          {[TicketStateEnum.TO_BUY].indexOf(t.state) > -1 && (<div key="tobuy">
            <Fab key="buy" color="secondary" aria-label="edit" className="t-first" onClick={buy}>
              <AddShoppingCartIcon />
            </Fab>
            <Fab key="save-buy" color="primary" type="submit" aria-label="edit" className="t-second" >
              <CheckIcon />
            </Fab>
            <Fab key="remove-buy" color="primary" aria-label="edit" className="t-third" onClick={remove}>
              <DeleteIcon />
            </Fab>
          </div>)}

          {(conf.coinlib[t.crypto]) && (<Fab key="histo" color="primary" aria-label="edit" className="t-histo" onClick={() => this.setState({ openCrypto: true })}>
            <BarChartIcon />
          </Fab>)}
          {!(conf.coinlib[t.crypto]) && (conf.coinmarketcap[t.crypto]) && (<Fab key="histo" color="primary" aria-label="edit" className="t-histo" onClick={() => window.location.href=conf.coinmarketcap[t.crypto]}>
            <BarChartIcon />
          </Fab>)}

        </form>
      </div>)}
    </div>)
  }

}
export default TicketDetail;
