import React, { useEffect, useRef } from 'react';
import './EventCard.scss';
import Button from '@material-ui/core/Button';
import historyService from '../../services/history.service';
import { Avatar, Card, CardActionArea, CardActions, CardHeader, Chip, Menu, MenuItem, Typography } from '@material-ui/core';
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
import eventStore, { EventStore } from '../../stores/event';
import pwaService from '../../services/pwa.service';
import { google } from "calendar-link";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { User } from '../../models/User';

function EventCard(props: any) {
  historyService.on(window.location.pathname);

  const [event, setEvent] = React.useState<any>(props.event);
  const [compact, setCompact] = React.useState<boolean>(props.compact);
  const [email, setEmail] = React.useState<any>(null);
  const [isRegistered, setIsRegistered] = React.useState<boolean>(false);
  const [organizer, setOrganizer] = React.useState<boolean>(false);
  const [readonly, setReadonly] = React.useState<any>(props.readonly);
  const pressTimer = useRef<any>(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    setEvent({contributors:[], ...props.event});
    setIsRegistered((props.event.contributors || []).findIndex((c: Contributor) => c.email === email) > -1);
  }, [props.event]);


  React.useEffect(() => {
    setCompact(props.compact);
  }, [props.compact]);

  React.useEffect(() => {
    setReadonly(props.readonly);
  }, [props.readonly]);

  useEffect(() => {
    const subMyProfil = myProfilStore.subscribe((user: User) => {
      if (user && user.email)
        setEmail(user.email);
      setIsRegistered(event ? (event.contributors||[]).findIndex((c: Contributor) => c.email === email) > -1 : false);
      setOrganizer(!!user.roles && (user.roles.indexOf('ORGANIZER') > -1));
    });
    return () => {
      subMyProfil.unsubscribe();
    };
  });

  const labelOfMode = (mode: string) => {
    if (mode === 'REMOTE_ONLY_CONF') {
      return 'Distance uniquement';
    } else if (mode === 'REMOTE_AND_PHYSICAL_CONF') {
      return 'Distance et présentiel'
    } else if (mode === 'PHYSICAL_CONF') {
      return 'Présentiel uniquement'
    } else {
      return null;
    }
  }

  const unregister = (event: Event) => {
    if (window.confirm(`Confirmez-vous votre désinscription à '${event.title}' ?`)) {
      event.contributors = event.contributors.filter(c => c.email !== email);
      EventStore.update(event)
        .then(() => {
          eventStore.load();
          pwaService.notify(
            `Désinscription effectuée`,
            `✅ Vous vous êtes bien désinscrits : "${event.title}"`
          )
        }).catch(() => {
          props.history.push('/erreur');
        })
    }
  }

  const ondown = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      if (props.onLongPress) props.onLongPress();
    }, 2000);
  }, onup = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const inviteEmail = () => {
    const email = window.prompt(`Quel email souhaitez-vous inscrire ?`);
    if(email){
      EventStore.registerEmail(event.id, {
        email, faceToFace:true
      })
        .then(() => {
          eventStore.load();
          pwaService.notify(
            `Email inscrit`,
            `😎 ${email} est ajouté aux participants`
          )
        }).catch(() => {
          props.history.push('/erreur');
        })
      handleClose();
    }
  }

  const deleteEvent = () =>{
    if(window.confirm(`Confirmez-vous la suppression de l'événement ?`)){
      EventStore.remove(event)
        .then(() => {
          eventStore.load();
          pwaService.notify(
            `Suppression effectuée`,
            `🧽 Evénement "${event.title}" supprimé`
          )
        }).catch(() => {
          props.history.push('/erreur');
        })
    }
  }

  return (
    <Card onTouchStart={ondown} onTouchEnd={onup} onMouseDown={ondown} onMouseUp={onup} className="event" key={'ec' + event.id} id={event.id} onClick={() => props.onClick ? props.onClick() : null} >
      <CardActionArea>
        <CardHeader key={'ec' + event.id}
          avatar={
            ['OPEN', 'SCHEDULED', 'PAST'].filter(t => t === eventService.typeOfEvent(event)).map(t => (<Avatar key={t} className={t === 'OPEN' ? 'success-avatar' : 'default'}>
              {t === 'OPEN' && (<CheckIcon></CheckIcon>)}
              {t === 'SCHEDULED' && (<ScheduleIcon></ScheduleIcon>)}
              {t === 'PAST' && (<HistoryIcon></HistoryIcon>)}
            </Avatar>))
          }
          action={
            organizer && !compact ? (<IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>) : (<IconButton>
              {(event.mode !== 'PHYSICAL_CONF') && (<DuoIcon />)}
              {(event.mode !== 'REMOTE_ONLY_CONF') && (<PeopleIcon />)}
            </IconButton>)
          }
          title={`${isRegistered ? '[INSCRIT.E] ' : ''}${event.title}`}
          subheader={(new Date(event.scheduled).toLocaleString())}
        />
        <CardMedia
          className="app-card-media"
          image={event.image}
          title="logo NW"
        />
        {!compact &&(<CardContent className="app-card-content">
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => props.history.push('/organisation/plus-sur-evenement/'+event.id)}>Participants &amp; Feedbacks</MenuItem>
            <MenuItem onClick={inviteEmail}>Inscrire via un email</MenuItem>
            
            <MenuItem onClick={() => props.history.push('/organisation/evenement/'+event.id)}>Editer l'événement</MenuItem>
            {(event.state == 'DRAFT') && (<MenuItem onClick={deleteEvent}>Supprimer l'événement</MenuItem>)}
          </Menu>

          <Typography className="tags" variant="body2" color="textSecondary" component="p">
            <Chip className="app-chip-item" color="secondary" label={event.format === EventFormatEnum.SIMPLE ? 'Format du midi' : 'Format du soir'} />
            {(labelOfMode(event.mode) !== null) && (<Chip color="primary" className="app-chip-item" label={labelOfMode(event.mode)} />)}
            {event.tags.map((t: any) => (<Chip key={t} color="primary" className="app-chip-item" label={t} />))}
          </Typography>
          <Typography className="event-description description" variant="body2" color="textSecondary" component="p">
            {event.description}
          </Typography>

          {event.where && (<Typography className="description speaker" variant="body2" color="textSecondary" component="p">
            Lieu / comment : {event.where}
          </Typography>)}
          <Typography className="description speaker" variant="body2" color="textSecondary" component="p">
            Animation : {event.speaker.firstname} {event.speaker.lastname} {event.speaker.job}
          </Typography>


        </CardContent>)}

        {!isRegistered && !readonly && ((eventService.typeOfEvent(event) === 'OPEN') && ((event.allowMaxContributors - event.contributors.length) > 0)) && (<CardActions>
          <Button onClick={() => props.history.push(`/evenements/${event.id}/inscription`)}>S'inscrire ({(event.allowMaxContributors - event.contributors.length)} place.s restante.s)</Button>
        </CardActions>)}
        {!isRegistered && !readonly && ((eventService.typeOfEvent(event) === 'OPEN') && (event.allowMaxContributors === -1)) && (<CardActions>
          <Button onClick={() => props.history.push(`/evenements/${event.id}/inscription`)}>S'inscrire</Button>
        </CardActions>)}
        {!isRegistered && !readonly && ((eventService.typeOfEvent(event) === 'OPEN') && (event.allowMaxContributors !== -1) && ((event.allowMaxContributors - event.contributors.length) <= 0)) && (<CardActions>
          <Button disabled={true}>S'inscrire (complet)</Button>

          {event.youtubeLink && (<Button onClick={() => props.onYoutubeLive ? props.onYoutubeLive(event) : null}>Live Youtube</Button>)}
        </CardActions>)}
        {isRegistered && !readonly && (eventService.typeOfEvent(event) === 'OPEN') && (<CardActions className="registered-card-actions">
          <Button onClick={() => unregister(event)}>Se désinscrire</Button>
          <Button target="_blank" href={google({
            title: event.title,
            description: event.description,
            start: event.scheduled,
            duration: [1, "hour"],
          })}>+ Agenda</Button>
        </CardActions>)}



        {!readonly && (eventService.typeOfEvent(event) === 'PAST') && (<CardActions>
          <Button
            disabled={!!(event.reviews || []).find((r: any) => r.email === email)}
            onClick={() => props.onReview ? props.onReview(event) : null} startIcon={<NotificationsActiveIcon className="warn-icon" />}>
            Avis
              </Button>
          <Button disabled={!event.resumeLink} href={event.resumeLink} target="_blank">Résumé</Button>
          {event.youtubeLink && (<Button href={event.youtubeLink} target="_blank">Replay</Button>)}

        </CardActions>)}
      </CardActionArea>
    </Card>
  );
}

export default EventCard;
