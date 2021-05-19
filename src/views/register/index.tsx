import React from 'react';
import historyService from '../../services/history.service';
import MenuApp from '../../shared/menu-app';
import EventCard from '../../shared/event-card';
import {EventStore} from '../../stores/event';
import eventStore from '../../stores/event';
import pwaService from '../../services/pwa.service';
import './Register.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import * as My from '../../models/Event';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, InputAdornment, TextField } from '@material-ui/core';
import { Contributor } from '../../models/Contributor';

class Register extends React.Component<{ history: any, location: any, match: any }, { loading: boolean,contributor: Contributor, acceptRecord: boolean, event: any }> {

  // The component's Local state.
  state = {
    event: null,
    loading:false,
    acceptRecord: false,
    contributor: {
      email:'',
      iam:'',
      fullName: '',
      faceToFace: false,
      comment: ''
    }
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

    if((window as any).confirm(`Confirmez-vous votre inscription ?`)){
      this.setState({loading:true});
      const event = {...(this.state.event as any)};
      event.contributors.push(this.state.contributor);
      EventStore.update(event)
      .then(() => {
        this.props.history.push('/');
        pwaService.notify(
          `Inscription effectuée`,
          `✅ Rendez-vous le ${(new Date(event.scheduled)).toLocaleString()} pour "${event.title}"`
        )
      }).catch(() => {
        this.props.history.push('/erreur');
      }).finally(() => this.setState({loading:false}));
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
    const e: any = this.state.event;
    return (<div className="register">
      <MenuApp mode="register" history={this.props.history} />


      {(this.state.event === null  || this.state.loading)&& (<Backdrop className="backdrop" open={true}>
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
            placeholder="Pierre Azerty"
            value={this.state.contributor.fullName}
            onChange={(e) => this.setState({contributor: {...this.state.contributor, fullName: e.target.value}})}
            required
            inputProps={{ maxLength: 256 }} 
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
            inputProps={{ maxLength: 256 }} 
            value={this.state.contributor.email}
            onChange={(e) => this.setState({contributor: {...this.state.contributor, email: e.target.value}})}
            name="email"
            type="email"
            placeholder="pierre.azerty@any.com"
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
            inputProps={{ maxLength: 128 }} 
            placeholder="Développeur 'fullstack'"
            value={this.state.contributor.iam}
            onChange={(e) => this.setState({contributor: {...this.state.contributor, iam: e.target.value}})}
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
            inputProps={{ maxLength: 256 }} 
            value={this.state.contributor.comment}
            onChange={(e) => this.setState({contributor: {...this.state.contributor, comment: e.target.value}})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ChatBubbleOutlineIcon />
                </InputAdornment>
              ),
            }}
          /></div>

      {e && (e.mode === 'REMOTE_AND_PHYSICAL_CONF') && (<div className="app-formcontrol">
          <FormControlLabel
          id="faceToFace"
            control={
              <Checkbox
                checked={this.state.contributor.faceToFace}
                onChange={(e) => this.setState({contributor: {...this.state.contributor, faceToFace: e.target.checked}})}

                name="faceToFace"
                color="primary"
              />
            }
            label="Je viendrai physiquement à NiortTech"
          />
        </div>)}

        <div className="app-formcontrol end">
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
            label="J'accepte de participer à un événement enregistré*"
          />
        </div>

        <div className="register-footer">
          <Button type="submit"
            className="register-action"
            size="large"
            variant="contained"
            color="secondary">S'inscrire</Button>
        </div>

      </form>

    </div>


    );

  }
}

export default Register;