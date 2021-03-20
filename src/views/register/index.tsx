import React from 'react';
import historyService from '../../services/history.service';
import MenuApp from '../../shared/menu-app';
import EventCard from '../../shared/event-card';
import {EventStore} from '../../stores/event';
import eventStore from '../../stores/event';
import notifStore from '../../stores/notif';
import './Register.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import * as My from '../../models/Event';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Backdrop, Button, Checkbox, CircularProgress, Fab, FormControlLabel, InputAdornment, TextField } from '@material-ui/core';
import { NotifType } from '../../models/notif';

class Register extends React.Component<{ history: any, location: any, match: any }, { acceptRecord: boolean, event: any }> {

  // The component's Local state.
  state = {
    event: null,
    acceptRecord: false
  };


  componentDidMount() {
    historyService.on(window.location.pathname);

    const id: string = this.props.match.params.id;
    eventStore.load()
      .then((events: My.Event[]) => {
        this.setState({ event: events.find(e => e.id === id) });
      });
  }

  onSubmit(e:any){
    e.preventDefault();

    const contributor:any = {};
    const whitelistAttr = ['email','iam','fullName','comment']
    const data:any = new FormData(e.target);
    for (const [name,value] of data) {
      if(whitelistAttr.indexOf(name) === -1) continue;
      contributor[name] = value;
    }

    if((window as any).confirm(`Confirmez-vous votre inscription ?`)){
      const event = {...(this.state.event as any)};
      event.contributors.push(contributor);
      EventStore.update(event)
      .then(() => {
        this.props.history.push('/');
        notifStore.set({message:'Vous êtes inscrit.e', type:NotifType.MEMO});
      }).catch(() => {
        this.props.history.push('/erreur');
      })
      
    }
  }

  onClickRegister(e:any){
    const whitelist = ['BUTTON']
    if(whitelist.indexOf(e.target.tagName) > -1 || whitelist.indexOf(e.target.parentElement.nodeName) > -1){
      if((window as any).document.getElementById('names') )
        (window as any).document.getElementById('names').scrollIntoView({block:'end', behavior: 'smooth'})
    }
  }

  render() {

    return (<div className="register">
      <MenuApp mode="register" history={this.props.history} />


      {this.state.event === null && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}

      {(this.state.event !== null) && (<div className="register-content">
        <EventCard readonly={true} event={this.state.event} history={this.props.history} />
      </div>)}

      <form className="register-form" 
      onSubmit={(e:any) => this.onSubmit(e)} 
      onClick={this.onClickRegister}
//      onClick={() => (window as any).document.getElementById('names') ?(window as any).document.getElementById('names').scrollView({block:'center', behavior: 'smooth'}): null}
>
        <div className="app-formcontrol">
          <TextField
            id="names"
            name="fullName"
            fullWidth
            label="Prénom et nom"
            placeholder="John Smith"
            required

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="app-formcontrol">
          <TextField
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            placeholder="john.smith@any.com"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon />
                </InputAdornment>
              ),
            }}
          /></div>
        <div className="app-formcontrol">
          <TextField
            fullWidth
            name="iam"
            label="Qui suis-je en quelques mots"
            placeholder="Développeur 'fullstack'"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HelpOutlineIcon />
                </InputAdornment>
              ),
            }}
          /></div>

        <div className="app-formcontrol">
          <TextField
            fullWidth
            name="comment"
            label="Commentaire"
            placeholder=""
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ChatBubbleOutlineIcon />
                </InputAdornment>
              ),
            }}
          /></div>

        <div className="app-formcontrol">
          <FormControlLabel
          id="acceptRecord"
            control={
              <Checkbox
                checked={this.state.acceptRecord}
                required
                onChange={(e) => this.setState({ acceptRecord: e.target.checked })}
                name="acceptRecord"
                color="primary"
              />
            }
            label="J'accepte de participer à un événemenet enregistré"
          />
        </div>

        <div className="register-footer">
          <Button type="submit"
            className="register-action"
            size="large"
            variant="outlined"
            color="secondary">S'inscrire</Button>
        </div>

      </form>

    </div>


    );

  }
}

export default Register;