
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { InputAdornment, LinearProgress, TextField } from '@material-ui/core';
import myProfilStore from '../../stores/my-profil';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import './Communication.scss';
import EmailIcon from '@material-ui/icons/Email';
import { Alert } from '@material-ui/lab';
import { EventStore } from '../../stores/event';
import pwaService from '../../services/pwa.service';
import { RestoreFromTrashTwoTone } from '@material-ui/icons';

const Communication = (props: any) => {
  const [open, setOpen] = React.useState(false);

  const [tested, setTested] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [event, setEvent] = React.useState();
  const [email, setEmail] = React.useState();
  const [subject, setSubject] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [subTitle, setSubTitle] = React.useState('');

  React.useEffect(() => {
    setOpen(props.open);
    setLoading(false);
    setTested(false);
  }, [props.open]);

  React.useEffect(() => {
    setEvent(props.event);
    if(props.event){
      const scheduled = new Date(props.event.scheduled);
      setSubject(`🗨 NiortWeb 🚀 le ${scheduled.getDate() + '/' + (scheduled.getMonth() + 1)} prochain meetup sur "${props.event.title}"`);
      setTitle(`${props.event.title}`);
      setSubTitle('Prochain meetup');
    }
  }, [props.event]);

  useEffect(() => {
    const subMyProfil = myProfilStore.subscribe((user: any) => {
      if (user && user.email)
        setEmail(user.email);
    });
    return () => {
      subMyProfil.unsubscribe();
    };
  });

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  /**
   * Renvoi le mail pour tester le rendu
   */
  const retestMail = () => {
    setLoading(true);
    EventStore.sendComm({
      eventId: (event || {id:''}).id,
      subject, 
      title,
      subTitle,
      testEmail: email
    } as any)
    .then(() =>{
      setTested(true);
      pwaService.notify(
        `Assistant comm'`,
        `🚦❗ Veuillez vérifier le mail et confirmer l'envoi`
      )
    })
    .finally(() => {
      setLoading(false);
    });
  }
  /**
   * 
   * @param e 
   */
  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    if(tested){
      EventStore.sendComm({
        eventId: (event || {id:''}).id,
        subject, 
        title,
        subTitle,
        testEmail: null
      } as any)
      .finally(() =>{
        setLoading(false);
        pwaService.notify(
          `Assistant comm'`,
          `🎉 🚀 Communication envoyée !`
        );
        handleClose();
      });
    }else{
      EventStore.sendComm({
        eventId: (event || {id:''}).id,
        subject, 
        title,
        subTitle,
        testEmail: email
      } as any)
      .then(() =>{
        setTested(true);
        pwaService.notify(
          `Assistant comm'`,
          `🚦❗ Veuillez vérifier le mail et confirmer l'envoi`
        )
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }

  return (
    <Dialog
      className="app-dialog"
      open={open}
      onClose={handleClose}
    ><form onSubmit={(e: any) => onSubmit(e)}>
      <DialogTitle id="alert-dialog-title">Assistant comm'</DialogTitle>
      <DialogContent className="app-dialog-content register-form">
        {loading && (<LinearProgress className="loading-bar" color="secondary" />)}
        <DialogContentText id="alert-dialog-description-comm" align="center">
          📧 Permet l'envoi d'un email d'information sur l'événement 
        </DialogContentText>

        <div className="app-formcontrol">
          <TextField
            fullWidth
            name="subject"
            multiline
            label="Sujet du mail"
            inputProps={{ maxLength: 512 }} 
            value={subject}
            onChange={(e: any) => setSubject(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="app-formcontrol">
          <TextField
            fullWidth
            name="title"
            multiline
            inputProps={{ maxLength: 512 }} 
            label="Titre"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
        </div>
        <div className="app-formcontrol">
          <TextField
            fullWidth
            name="subTitle"
            multiline
            inputProps={{ maxLength: 512 }} 
            label="Sous titre"
            value={subTitle}
            onChange={(e: any) => setSubTitle(e.target.value)}
          />
        </div>
        <div className="app-formcontrol">
          <TextField
            fullWidth
            name="email"
            multiline
            inputProps={{ maxLength: 512 }} 
            label="Email pour confirmer"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VerifiedUserIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {tested && (<div className="app-formcontrol">
        <Alert severity="info">Prototype de message envoyé sur "{email}". </Alert>
        </div>)}

        
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} type="button" color="primary" autoFocus>
          Fermer
          </Button>
        {tested && (<Button onClick={() => retestMail()} type="button" color="primary">
            Retester
        </Button>)}

        <Button disabled={loading} type="submit" color="secondary">
          {tested ? 'Envoyer maintenant': 'Tester le rendu'}
          </Button>
      </DialogActions></form>
    </Dialog>
  );
}

export default Communication;