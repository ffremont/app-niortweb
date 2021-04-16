import React from 'react';
import './Widget.scss';
import historyService from '../../services/history.service';
import {  Backdrop, Button, CardActions, CardHeader, Chip, CircularProgress } from '@material-ui/core';
import SnackAdd from '../../shared/snack-add';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import AppIcon from '../../assets/images/banner-logo.png';
import * as My from '../../models/Event';
import eventStore, {EventStore} from '../../stores/event';
import eventService from '../../services/event.service';
import authService from '../../services/auth.service';
import pwaService from '../../services/pwa.service';
import { firstBy } from 'thenby';
import EventCard from '../../shared/event-card';
import Review from '../../shared/review';
import YoutubeLive from '../../shared/youtube-live';
import { Subscription } from 'rxjs';

class Widget extends React.Component<{ history: any, match: any }, {
  expanded: boolean, events: null | My.Event[], openReview:boolean,event:null|My.Event, openYoutubeLive:boolean
}>{

  state = {
    expanded: false, events: null,openReview: false, event: null, openYoutubeLive: false
  };

  private _subEvents :Subscription|null = null;

  componentDidMount() {
    historyService.on(window.location.pathname);
    this._subEvents = eventStore.subscribe((events: any) => {
      const myEvents = events.map((e: any) => {
        const et = eventService.typeOfEvent(e);
        e.typeOfEvent = ['OPEN', 'SCHEDULED', 'PAST'].findIndex((t: string) => t === et);
        console.log('componentDidMount eventStore',{ e, et});
        return e;
      })
      myEvents.sort(firstBy('typeOfEvent', { direction: "asc" }).thenBy('createdAt', { direction: "desc" }));

      this.setState({ events:myEvents });
    });

    eventStore.load();
  }

  componentWillUnmount(){
    if(this._subEvents) this._subEvents.unsubscribe();
  }

  /**
   * Validation lorsqu'on donne l'avis
   * @param event 
   */
  onValidateReview(event: My.Event){
    EventStore.update(event)
    .then(() => {
      pwaService.notify(
        `Avis donné !`,
        `🗳🙏 Je vote, tu votes, nous progressons, merci de votre participation.`
      );
    })
    .catch(() => {
      pwaService.notify(
        `⚠ Une erreur est survenue`,
        `Oups ! Votre n'avis n'a pu être donné, veuillez réitérer ultérieurement, merci de votre compréhension.`
      );
    })
  }

  onReview(evt:My.Event){
    if(authService.isAuth){
      this.setState({openReview:true, event: evt})
    }else{
      this.props.history.push('/login');
    }
  }

  render() {
    return (<div className="tickets tickets-content">

      {this.state.events === null && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}

      <Review 
      event={this.state.event} 
      open={this.state.openReview} 
      onClose={() => {
        (window as any).location.hash='';
        this.setState({openReview : false});
        
      }}
      onValidate={(e:any) => this.onValidateReview(e)} />
      <SnackAdd />

      <YoutubeLive 
      event={this.state.event} 
      open={this.state.openYoutubeLive} 
      onClose={() => this.setState({openYoutubeLive : false})}
      />

      <div className="events">
        {(this.state.events || []).map((evt: any) => (<EventCard 
        key={evt.id} 
        readonly={true} 
        onReview={() => this.onReview(evt)}
        onYoutubeLive={() => this.setState({openYoutubeLive:true, event: evt})}
        event={evt} 
        onClick={() => this.props.history.push(`/evenements/${evt.id}`)}
        history={this.props.history} />))}
      </div>

    </div>);
  }
}


export default Widget;
