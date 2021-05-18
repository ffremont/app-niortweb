import React from 'react';
import './More.scss';
import historyService from '../../services/history.service';
import { Backdrop, Box, Card, CardContent, Chip, CircularProgress, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import * as My from '../../models/Event';
import eventStore from '../../stores/event';
import EventCard from '../../shared/event-card';
import MenuApp from '../../shared/menu-app';
import { Rating } from '@material-ui/lab';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NotifType } from '../../models/notif';
import notifStore from '../../stores/notif';
import SnackAdd from '../../shared/snack-add';


class More extends React.Component<{ history: any, match: any }, { event: any }>{

  state = {
    event: null
  };


  componentDidMount() {
    historyService.on(window.location.pathname);

    const id: string = this.props.match.params.id;
    eventStore.load()
      .then((events: My.Event[]) => {
        const evt = events.find(e => e.id === id);
        if (evt){
          evt.reviews = evt.reviews || [];

          this.setState({ event: evt });
        }
      });
    window.scrollTo(0, 0);
  }

  onClipBoardCopy(email: string) {
    const copyText: any = document.querySelector('#more_cp');
    
    if (copyText) {
      copyText.value = email;
      copyText.select();
      document.execCommand("copy");
      notifStore.set({ type: NotifType.MEMO, duration: 3000, message: `Email copié dans le presse-papier` });
    }

  }

  render() {
    const e: My.Event = this.state.event as any;
    const average = (list: any) => list.reduce((prev: any, curr: any) => prev + curr, 0) / list.length;

    return (<div className="more">

      <MenuApp mode="more" history={this.props.history} />

      {this.state.event === null && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}
      <SnackAdd />


      {e && (<div className="event-card more-card">
        <EventCard
          key={e.id}
          compact={true}
          readonly={true}
          event={e}x
          history={this.props.history} />
      </div>)}

      {e && (<Card className='contributors-card more-card'>
        <CardContent>

          <Typography variant="h5" component="h2">
            Participants ({e.contributors.length})
        </Typography>

          <List component="nav">
            {e.contributors.map(c => <ListItem button>
              <ListItemText primary={`${c.faceToFace? '🏫': '💻'} ${c.fullName || '😎'}, ${c.email}`} onDoubleClick={() => this.onClipBoardCopy(c.email)} secondary={`${c.iam || ''} ${c.comment || ''}`}/>
            </ListItem>)}
          </List>


        </CardContent>
      </Card>)}

      {e  && e.reviews && e.reviews.length > 0 && (<Card className='note-card'>
        <CardContent>

          <Typography variant="h5" component="h2">
            Feedback
        </Typography>
          <div className="area-note">
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">{average(e.reviews.map(r => r.note))}/5 ({e.reviews.length} avis)</Typography>
              <Rating name="read-only" value={average(e.reviews.map(r => r.note))} readOnly />
            </Box>
          </div>

          {e.reviews.map(r => <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>{r.email}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {r.findOutMore && (<Chip label='Format + long' />)} {r.comment ? r.comment : 'Aucun commentaire'}
            </AccordionDetails>
          </Accordion>)}

        </CardContent>
      </Card>)}

      <textarea className="hide" id="more_cp" />



    </div>);
  }
}


export default More;
