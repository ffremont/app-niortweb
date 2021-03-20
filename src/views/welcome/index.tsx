import React from 'react';
import './Welcome.scss';
import MenuApp from '../../shared/menu-app';
import historyService from '../../services/history.service';
import { Avatar, Backdrop, Button, CardActions, CardHeader, Chip, CircularProgress } from '@material-ui/core';
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
import eventStore from '../../stores/event';
import eventService from '../../services/event.service';
import { firstBy } from 'thenby';
import conf from '../../confs';
import EventCard from '../../shared/event-card';
import Review from '../../shared/review';
import YoutubeLive from '../../shared/youtube-live';

class Welcome extends React.Component<{ history: any, match: any }, {
  expanded: boolean, events: null | My.Event[], openReview:boolean,event:null|My.Event, openYoutubeLive:boolean
}>{

  state = {
    expanded: false, events: null,openReview: false, event: null, openYoutubeLive: false
  };

  componentDidMount() {
    historyService.on(window.location.pathname);
    this.loadData()
    .then(() => {
      const id: string = this.props.match.params.id;
      if(id && (window.location.hash === '#donner-un-avis')){
        console.log('componentDidMount loaded');
        setTimeout(() => this.setState({openReview:true, event: (this.state.events || []).find((e:any) => e.id === id) || null}),1000);
      }
    });


  }

  componentDidUpdate() {
    const id: string = this.props.match.params.id;
    if (id && (window as any).document.getElementById(`${id}`))
      (window as any).document.getElementById(`${id}`).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
  }

  loadData() {
    return eventStore.load()
      .then((events: My.Event[]) => {
        events.map((e: any) => {
          const et = eventService.typeOfEvent(e);
          e.typeOfEvent = ['OPEN', 'SCHEDULED', 'PAST'].findIndex((t: string) => t === et);
          return e;
        }).sort(firstBy('typeOfEvent').thenBy('createdAt', { direction: "desc" }));

        this.setState({ events });
      });
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
    console.log('on validate review please save !',event);
  }

  render() {

    return (<div className="tickets tickets-content">
      <MenuApp mode="home" history={this.props.history} onRefresh={() => this.loadData()} />



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
            </Collapse>
          </CardActionArea>
        </Card>

        {(this.state.events || []).map((evt: any) => (<EventCard 
        key={evt.id} 
        readonly={false} 
        onReview={() => this.setState({openReview:true, event: evt})}
        onYoutubeLive={() => this.setState({openYoutubeLive:true, event: evt})}
        event={evt} 
        history={this.props.history} />))}
      </div>

    </div>);
  }
}


export default Welcome;
