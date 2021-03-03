
import React, { useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import './Balance.scss';

import { Ticket } from '../../models/Ticket';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EuroCoinIcon from '../../assets/images/euro-coin.svg';

interface CryptoBalance {
  currency: string, amount: number
}

const Balance = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const [balances, setBalances] = React.useState<{ planned: CryptoBalance[], purchases: CryptoBalance[], sales: CryptoBalance[], inProgress: CryptoBalance[] }>({ planned: [], purchases: [], sales: [], inProgress: [] });

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    setTickets(props.tickets);
    console.log(props.currencies);
    setCurrencies(props.currencies);

    const newBalances = { purchases: [], sales: [], inProgress: [], planned: [] };
    for (let i in props.tickets) {
      const ticket: Ticket = props.tickets[i];
      
      if (ticket.buyFor) {
        if (!newBalances.purchases.some((p: CryptoBalance) => p.currency === ticket.buyFor?.currency)) {
          (newBalances.purchases as any).push({ currency: ticket.buyFor.currency, amount: 0 });
        }
        const purchase: any = newBalances.purchases.find((p: CryptoBalance) => p.currency === ticket.buyFor?.currency);
        purchase.amount += ticket.buyFor.amount;
      }
      if (ticket.sell) {
        if (!newBalances.sales.some((p: CryptoBalance) => p.currency === ticket.sell?.currency)) {
          (newBalances.sales as any).push({ currency: ticket.sell.currency, amount: 0 });
        }
        const sale: any = newBalances.sales.find((p: CryptoBalance) => p.currency === ticket.sell?.currency);
        sale.amount += ticket.sell.amount;
      }

      if (ticket.buyFor && !ticket.sell) {
        if (!newBalances.inProgress.some((p: CryptoBalance) => p.currency === ticket.buyFor?.currency)) {
          (newBalances.inProgress as any).push({ currency: ticket.buyFor.currency, amount: 0 });
        }
        const inP: any = newBalances.inProgress.find((p: CryptoBalance) => p.currency === ticket.buyFor?.currency);
        inP.amount += ticket.buyFor.amount;
      }

      if (!ticket.buyFor && !ticket.sell) {
        if (!newBalances.planned.some((p: CryptoBalance) => p.currency === ticket.wantBuyFor?.currency)) {
          (newBalances.planned as any).push({ currency: ticket.wantBuyFor.currency, amount: 0 });
        }
        const p: any = newBalances.planned.find((p: CryptoBalance) => p.currency === ticket.wantBuyFor?.currency);
        p.amount += ticket.wantBuyFor.amount;
      }
    }
    console.log(newBalances)
    setBalances(newBalances);
  }, [props.tickets, props.currencies]);


  const handleClose = () => {
    setOpen(false);

    if (props.onClose) props.onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Balance</DialogTitle>
      <DialogContent>
        {/* Achats */}
        {/* BTC : 123 */}
        {/* En cours */}
        {/* Ventes */}

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Planifié ({balances.planned.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
              {balances.planned.map(p => {
                const logo = (currencies as any).data.find((c:any) => c.name === p.currency).logoUrl;
                return (<Chip key={`p_${p.amount}`}
                  avatar={<Avatar src={logo || EuroCoinIcon}>€</Avatar>}
                  label={`${p.amount} ${p.currency}`}
                />);
              })}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography >En cours ({balances.inProgress.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
          {balances.inProgress.map(p => {
                const logo = (currencies as any).data.find((c:any) => c.name === p.currency).logoUrl;
                return (<Chip key={`p_${p.amount}`}
                  avatar={<Avatar src={logo || EuroCoinIcon}>€</Avatar>}
                  label={`${p.amount} ${p.currency}`}
                />);
              })}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography >Achats ({balances.purchases.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
          {balances.purchases.map(p => {
                const logo = (currencies as any).data.find((c:any) => c.name === p.currency).logoUrl;
                return (<Chip key={`p_${p.amount}`}
                  avatar={<Avatar src={logo || EuroCoinIcon}>€</Avatar>}
                  label={`${p.amount} ${p.currency}`}
                />);
              })}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography >Ventes ({balances.sales.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
          {balances.sales.map(p => {
                const logo = (currencies as any).data.find((c:any) => c.name === p.currency).logoUrl;
                return (<Chip key={`p_${p.amount}`}
                  avatar={<Avatar src={logo || EuroCoinIcon}>€</Avatar>}
                  label={`${p.amount} ${p.currency}`}
                />);
              })}
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fermer
          </Button>

      </DialogActions>
    </Dialog>
  );
}

export default Balance;