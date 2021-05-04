import React from 'react';
import './Welcome.scss';
import MenuApp from '../../shared/menu-app';
import historyService from '../../services/history.service';
import { Backdrop, Button, CardActions, Chip, CircularProgress } from '@material-ui/core';
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
import notifStore from '../../stores/notif';
import { firstBy } from 'thenby';
import conf from '../../confs';
import EventCard from '../../shared/event-card';
import Review from '../../shared/review';
import YoutubeLive from '../../shared/youtube-live';
import { Subscription } from 'rxjs';
import { NotifType } from '../../models/notif';

class Welcome extends React.Component<{ history: any, match: any }, {
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
  
        return e;
      })
      myEvents.sort(firstBy('typeOfEvent', { direction: "asc" }).thenBy('createdAt', { direction: "desc" }));

      this.setState({ events:myEvents });
    });

    eventStore.load()
    .then(() => {
      const id: string = this.props.match.params.id;
      if(id && (window.location.hash === '#donner-un-avis')){
        setTimeout(() => {
          if(authService.isAuth){
            this.setState({openReview:true, event: (this.state.events || []).find((e:any) => e.id === id) || null});
          }else{
            this.props.history.push('/login');
          }
        },1000);
      }
    });
  }

  componentWillUnmount(){
    if(this._subEvents) this._subEvents.unsubscribe();
  }

  componentDidUpdate() {
    const id: string = this.props.match.params.id;
    if (id && (window as any).document.getElementById(`${id}`))
      (window as any).document.getElementById(`${id}`).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  }

  onClickShare(event: My.Event) {
    if ((window as any).navigator.share) {
      (window as any).navigator.share({
        title: `NiortWeb - meetup "${event.title}"`,
        text: `Infos, inscription et résumé sur ${conf.baseURL}/evenements/${event.id}`,
      }); // partage l'URL de MDN
    }
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

  onRefresh(){
    eventStore.load();
  }

  onClipBoardCopy(evt:My.Event){
    const copyText:any = document.querySelector('#welcome_cp');
    if(copyText){
      copyText.value = `${evt.title} (${(new Date(evt.scheduled)).toLocaleString()}) \n\n${evt.description}`;
      copyText.select();
      document.execCommand("copy");
      notifStore.set({type:NotifType.MEMO, duration:3000, message:`Evénement copié dans le presse-papier`});
    }
    
  }

  render() {
    return (<div className="tickets tickets-content">
      <MenuApp mode="home" history={this.props.history} onRefresh={() => this.onRefresh()} />

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
        <Card className="main" >
          <CardActionArea>
            <CardMedia
              className="app-card-media"
              image={AppIcon}
              title="logo NW"
            />
            <CardActions disableSpacing>
              <Button>Qu'est-ce que NiortWeb ?</Button>

              <IconButton
                className={this.state.expanded ? 'expandOpen' : ''}
                onClick={() => this.setState({ expanded: !this.state.expanded })}
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent className="app-card-content">
                <Typography variant="body2" color="textSecondary" component="p">
                NiortWeb est un meetup collaboratif qui a pour objectif de faire découvrir et d’échanger autour de thématiques web. Le speaker / animateur partagera la moitier de son temps avec les participants afin de construire la fin du meetup sur la base des expériences de chacun.
              </Typography>

                <ul>
                  <li>
                    <Chip color="primary" label="Format le midi" /> De 12h30 à 13h30 en petit groupe, généralement 50% de présentation et 50% pour l'échange
                </li>
                  <li>
                    <Chip color="primary" label="Format le soir" /> De 18h à 19h30, présentation plus élaborée
                </li>
                </ul>
              </CardContent>
            </Collapse>
          </CardActionArea>
        </Card>

        {(this.state.events || []).map((evt: any) => (<EventCard 
        onLongPress={() => this.onClipBoardCopy(evt)}
        key={evt.id} 
        readonly={false} 
        onReview={() => this.onReview(evt)}
        onYoutubeLive={() => this.setState({openYoutubeLive:true, event: evt})}
        event={evt} 
        history={this.props.history} />))}
      </div>

      <textarea className="hide" id="welcome_cp"/>

    </div>);
  }
}


export default Welcome;
