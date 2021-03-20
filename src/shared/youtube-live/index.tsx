
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import YouTubeIcon from '@material-ui/icons/YouTube';

const YoutubeLive = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [event, setEvent] = React.useState<any>(null);

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  React.useEffect(() => {
    setEvent(props.event);
  }, [props.event]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
    <Dialog
      className="app-dialog"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">Youtube Live</DialogTitle>
      <DialogContent>
        <div className="icon-area">
          <YouTubeIcon className="icon youtube-icon" />
        </div>
        <DialogContentText id="alert-dialog-description" align="center">
          Pour suivre en direct l'événement, rendez-vous sur le lien ci-dessous.
          </DialogContentText>
       
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Fermer
          </Button>
          <Button  color="secondary" target="_blank" href={event?.youtubeLink} >
          Accès au direct
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default YoutubeLive;