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
import { StateEnum } from '../../models/StateEnum';
import { EventFormatEnum } from '../../models/EventFormatEnum';
import { EventModeEnum } from '../../models/EventModeEnum';
import ShareIcon from '@material-ui/icons/Share';
import { TagEnum } from '../../models/TagEnum';
import HistoryIcon from '@material-ui/icons/History';
import CheckIcon from '@material-ui/icons/Check';
import ScheduleIcon from '@material-ui/icons/Schedule';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

class Welcome extends React.Component<{ history: any, match: any }, {
  expanded: boolean, events: null | My.Event[]
}>{

  state = {
    expanded: false, events: [{
      id: '007',
      state: StateEnum.OK,
      format: EventFormatEnum.SIMPLE,
      mode: EventModeEnum.REMOTE_AND_PHYSICAL_CONF,
      createdAt: (new Date()).getTime(),
      scheduled: (new Date()).getTime() - 1000 * 3600 * 24 * 30,
      speaker: {
        firstname: 'Florent',
        lastname: 'FREMONT',
        email: 'ff.f@ff.fr',
        job: 'Fullstack developer'
      },
      duration: 60,
      image: 'https://res.cloudinary.com/dyuwlqafx/image/upload/v1615549320/app-niotweb/iStock-1029035836-e1575983057612.jpg',
      title: 'Quest ce que lIA?',
      tags: [TagEnum.IA],
      description: '...',
      allowMaxContributors: 20,
      contributors: [],
      youtubeLink:'https://...'
    }]
  };

  componentWillUnmount() {
  }

  componentDidMount() {
    historyService.on(window.location.pathname);

    this.loadData();
  }

  loadData() {
    /*const orders = [TicketStateEnum.TO_SELL, TicketStateEnum.TO_BUY, TicketStateEnum.WAIT, TicketStateEnum.PLANNED, TicketStateEnum.SOLD];
    Promise.all([ticketStore.load(), currencyStore.load()])
      .then((data: any) => {
        const tickets = data[0].map((t: Ticket) => {
          const state = ticketStore.stateOf(t, data[1]);
          return { ...t, state, order: orders.indexOf(state) }
        });
        tickets.sort(firstBy('order').thenBy('at', { direction: "desc" }))
        this.setState({ tickets, currencies: data[1] });
      });*/
  }

  typeOfEvent(event:My.Event){
    if(event.scheduled >= (new Date()).getTime() && event.state === StateEnum.OK){
      return 'OPEN';
    }else if(event.scheduled < (new Date()).getTime() && event.state === StateEnum.OK){
      return 'PAST'
    }else{
      return 'SCHEDULED';
    }
  }

  render() {

    return (<div className="tickets tickets-content">
      <MenuApp mode="home" history={this.props.history} onRefresh={() => this.loadData()} />



      {this.state.events === null && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}


      <SnackAdd />

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

        {(this.state.events || []).map(event => (<Card className="event" >
          <CardActionArea>
            <CardHeader
              avatar={
                ['OPEN','SCHEDULED', 'PAST'].filter(t => t === this.typeOfEvent(event)).map(t => (<Avatar className={t == 'OPEN' ? 'success-avatar': 'default'}>
                  {t === 'OPEN' && (<CheckIcon></CheckIcon>)}
                  {t === 'SCHEDULED' && (<ScheduleIcon></ScheduleIcon>)}
                  {t === 'PAST' && (<HistoryIcon></HistoryIcon>)}
                </Avatar>))
              }
              action={
                <IconButton aria-label="settings">
                  <ShareIcon />
                </IconButton>
              }
              title={event.title}
              subheader={(new Date(event.scheduled).toLocaleString())}
            />
            <CardMedia
              className="app-card-media"
              image={event.image}
              title="logo NW"
            />
            <CardContent className="app-card-content">
              <Typography variant="body2" color="textSecondary" component="p">
                <Chip className="app-chip-item" color="secondary" label={event.format === EventFormatEnum.SIMPLE ? 'Format du midi' : 'Format du soir'} /> {event.tags.map(t => (<Chip color="primary" label={t} />))}
              </Typography>
              <Typography className="description" variant="body2" color="textSecondary" component="p">
                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                across all continents except Antarctica
              </Typography>


            </CardContent>
            {( (this.typeOfEvent(event) === 'OPEN' ) && ((event.allowMaxContributors - event.contributors.length)>0) )&&(<CardActions>
              <Button>S'inscrire ({(event.allowMaxContributors - event.contributors.length) } place.s restante.s)</Button>
            </CardActions>)}

            {( (this.typeOfEvent(event) === 'OPEN' ) && ((event.allowMaxContributors - event.contributors.length)<=0) )&&(<CardActions>
              <Button disabled={true}>S'inscrire (complet)</Button>

              {event.youtubeLink && (<Button target="_blank" href={event.youtubeLink}>Live Youtube</Button>)}
            </CardActions>)}

            { (this.typeOfEvent(event) === 'PAST' ) &&( <CardActions>
              <Button startIcon={<NotificationsActiveIcon className="warn-icon" />}>Donner avis</Button>
              <Button>Accès résumé</Button>
              
            </CardActions>)}
          </CardActionArea>
        </Card>))}
      </div>

    </div>);
  }
}


export default Welcome;
