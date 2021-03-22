import React, { useEffect } from 'react';
import './EventCard.scss';
import Button from '@material-ui/core/Button';
import historyService from '../../services/history.service';
import { Avatar, Card, CardActionArea, CardActions, CardHeader, Chip, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { EventFormatEnum } from '../../models/EventFormatEnum';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import HistoryIcon from '@material-ui/icons/History';
import CheckIcon from '@material-ui/icons/Check';
import ScheduleIcon from '@material-ui/icons/Schedule';
import eventService from '../../services/event.service';
import DuoIcon from '@material-ui/icons/Duo';
import PeopleIcon from '@material-ui/icons/People';
import myProfilStore from '../../stores/my-profil';
import { Contributor } from '../../models/Contributor';
import { Event } from '../../models/Event';

function EventCard(props: any) {
  historyService.on(window.location.pathname);

  const [event, setEvent] = React.useState<any>(props.event);
  const [email, setEmail] = React.useState<any>(null);
  const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
  const [readonly, setReadonly] = React.useState<any>(props.readonly);


  React.useEffect(() => {
    console.log(props.event);
      setEvent(props.event);
      setIsRegistered(props.event.contributors.findIndex((c:Contributor) => c.email === email) > -1);
  }, [props.event]);


  React.useEffect(() => {
    setReadonly(props.readonly);
  }, [props.readonly]);

  useEffect(() => {
    const subMyProfil = myProfilStore.subscribe((user: any) => {
      if (user && user.email)
        setEmail(user.email);
        setIsRegistered(event ? event.contributors.findIndex((c:Contributor) => c.email === email) > -1 : false);
    });
    return () => {
      subMyProfil.unsubscribe();
    };
  }); 

  const labelOfMode = (mode:string) =>{
    if(mode === 'REMOTE_ONLY_CONF'){
      return 'A distance uniquement';
    }else if(mode === 'REMOTE_AND_PHYSICAL_CONF'){
      return 'A distance et présentiel'
    }else if(mode === 'PHYSICAL_CONF'){
      return 'En présentiel uniquement'
    }else{
      return null;
    }
  }

  const unregister = (event: Event) => {
    if(window.confirm(`Cofirmez-vous votre désinscription à '${event.title}' ?`)){
        // todo unregister
    }
  }

  return (
    <Card className="event" key={'ec'+event.id} id={event.id} >
          <CardActionArea>
            <CardHeader key={'ec'+event.id}
              avatar={
                ['OPEN','SCHEDULED', 'PAST'].filter(t => t === eventService.typeOfEvent(event)).map(t => (<Avatar key={t} className={t === 'OPEN' ? 'success-avatar': 'default'}>
                  {t === 'OPEN' && (<CheckIcon></CheckIcon>)}
                  {t === 'SCHEDULED' && (<ScheduleIcon></ScheduleIcon>)}
                  {t === 'PAST' && (<HistoryIcon></HistoryIcon>)}
                </Avatar>))
              }
              action={
                <IconButton>
                  {(event.mode !== 'PHYSICAL_CONF') && (<DuoIcon />)}
                  {(event.mode !== 'REMOTE_ONLY_CONF') && (<PeopleIcon />)}
                </IconButton>
              }
              title={`${isRegistered ? '[INSCRIT.E] ': ''}${event.title}`}
              subheader={(new Date(event.scheduled).toLocaleString())}
            />
            <CardMedia
              className="app-card-media"
              image={event.image}
              title="logo NW"
            />
            <CardContent className="app-card-content">
              <Typography className="tags" variant="body2" color="textSecondary" component="p">
                <Chip className="app-chip-item" color="secondary" label={event.format === EventFormatEnum.SIMPLE ? 'Format du midi' : 'Format du soir'} /> 
                {(labelOfMode(event.mode) !== null) && (<Chip color="primary" className="app-chip-item" label={labelOfMode(event.mode)} />)}
                {event.tags.map((t:any) => (<Chip key={t} color="primary" className="app-chip-item" label={t} />))}
              </Typography>
              <Typography className="description" variant="body2" color="textSecondary" component="p">
                {event.description}
              </Typography>
              <Typography className="description speaker" variant="body2" color="textSecondary" component="p">
                Animation : {event.speaker.firstname} {event.speaker.lastname} {event.speaker.job}
              </Typography>


            </CardContent>
            
            {!isRegistered && !readonly && ( (eventService.typeOfEvent(event) === 'OPEN' ) && ((event.allowMaxContributors - event.contributors.length)>0) )&&(<CardActions>
              <Button onClick={() => props.history.push(`/evenements/${event.id}/inscription`)}>S'inscrire ({(event.allowMaxContributors - event.contributors.length) } place.s restante.s)</Button>
            </CardActions>)}
            {!isRegistered && !readonly && ( (eventService.typeOfEvent(event) === 'OPEN' ) && (event.allowMaxContributors === -1 ))&& (<CardActions>
              <Button onClick={() => props.history.push(`/evenements/${event.id}/inscription`)}>S'inscrire</Button>
            </CardActions>)}
            {!isRegistered && !readonly && ( (eventService.typeOfEvent(event) === 'OPEN' ) && (event.allowMaxContributors !== -1 ) && ((event.allowMaxContributors - event.contributors.length)<=0) )&&(<CardActions>
              <Button disabled={true}>S'inscrire (complet)</Button>

              {event.youtubeLink && (<Button onClick={() => props.onYoutubeLive ? props.onYoutubeLive(event) : null}>Live Youtube</Button>)}
            </CardActions>)}
            {isRegistered && !readonly &&  (eventService.typeOfEvent(event) === 'OPEN' ) && (<CardActions className="registered-card-actions">
              <Button onClick={() => unregister(event)}>Se désinscrire</Button>
            </CardActions>)}


            {!readonly &&  (eventService.typeOfEvent(event) === 'PAST' ) &&( <CardActions>
              <Button
                disabled={ !!(event.reviews || []).find((r:any) => r.email === email) } 
                onClick={() => props.onReview ? props.onReview(event) : null} startIcon={<NotificationsActiveIcon className="warn-icon" />}>
                  Donner avis
              </Button>
              <Button disabled={!event.resumeLink} href={event.resumeLink} target="_blank">Accès résumé</Button>
              
            </CardActions>)}
          </CardActionArea>
        </Card>
  );
}

export default EventCard;