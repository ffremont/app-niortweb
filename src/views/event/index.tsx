import React, { RefObject } from 'react';
import historyService from '../../services/history.service';
import MenuApp from '../../shared/menu-app';
import EventCard from '../../shared/event-card';
import {EventStore} from '../../stores/event';
import eventStore from '../../stores/event';
import pwaService from '../../services/pwa.service';
import notifStore from '../../stores/notif';
import './Event.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import * as My from '../../models/Event';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Backdrop, Button, Checkbox, Chip, CircularProgress, Fab, FormControl, FormControlLabel, InputAdornment, TextField } from '@material-ui/core';
import { NotifType } from '../../models/notif';
import { InputLabel } from '@material-ui/core';
import { NativeSelect } from '@material-ui/core';

class Event extends React.Component<{ history: any, location: any, match: any }, { faceToFace:boolean, acceptRecord: boolean, event: any }> {

  // The component's Local state.
  state = {
    event: null,
    acceptRecord: false,
    faceToFace:false
  };

  myWidget: any;

  constructor(props:any){
    super(props);
    this.myWidget = null;
  }

  componentDidMount() {
    historyService.on(window.location.pathname);

    const id: string = this.props.match.params.id;
    eventStore.load()
      .then((events: My.Event[]) => {
        this.setState({ event: events.find(e => e.id === id) });
      });

      //televerser
      this.myWidget = ((window as any).cloudinary.createUploadWidget({
        cloudName: 'dyuwlqafx',
        uploadPreset: 'vrzpzttn'
      }, 
        (error:any, result:any) => { 
          if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info); 
          }
        }
      ) as any);
      
      /*document.getElementById("televerser").addEventListener("click", function(){
          myWidget.open();
        }, false);*/
  }

  onSubmit(e:any){
    e.preventDefault();

    const contributor:any = {};
    const whitelistAttr = ['email','iam','fullName','comment', 'faceToFace']
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
        pwaService.notify(
          `Inscription effectuée`,
          `✅ Rendez-vous le ${(new Date(event.scheduled)).toLocaleString()} pour "${event.title}"`
        )
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
    const e: any = this.state.event;
    return (<div className="register">
      <MenuApp mode="event" history={this.props.history} />


      {this.state.event === null && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}

      

      <form className="register-form" 
      onSubmit={(e:any) => this.onSubmit(e)} 
      onClick={this.onClickRegister}
>

      <div className="app-formcontrol app-formcontrol-btn">
      <Button id="televerser" variant="contained" color="primary">
        Téléverser une image
      </Button>
      </div>


        <div className="app-formcontrol">
          <TextField
            id="names"
            name="fullName"
            fullWidth
            label="Prénom et nom"
            placeholder="Pierre Azerty"
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
                checked={this.state.faceToFace}
                onChange={(e) => this.setState({ faceToFace: e.target.checked })}
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

export default Event;