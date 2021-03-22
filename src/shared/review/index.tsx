
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import { Box, FormControl, InputAdornment, InputLabel, NativeSelect, Select, TextField, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating/Rating';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import myProfilStore from '../../stores/my-profil';
import * as R from '../../models/Review';

const Review = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [event, setEvent] = React.useState<any>(null);
  const [rate, setRate] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [findOutMore, setFindOutMore] = React.useState('n');

  React.useEffect(() => {
    setOpen(props.open);
    setRate(null);
    setComment('');
    setFindOutMore('n');
  }, [props.open]);

  React.useEffect(() => {
    setEvent(props.event);
  }, [props.event]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  useEffect(() => {
    const subMyProfil = myProfilStore.subscribe((user: any) => {
      if (user && user.email)
        setEmail(user.email);
    });
    return () => {
      subMyProfil.unsubscribe();
    };
  });
  

  const onValidate = () => {
    if((event !== null) && props.onValidate && email){
      event.reviews = event.reviews || [];

      event.reviews.push({
        comment : comment || '',
        email : email || '',
        note: rate || 0,
        findOutMore : findOutMore === 'y'
      } as R.Review);

      props.onValidate(event);
      handleClose();
    }
  }

  return (
    <Dialog
      className="app-dialog"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">Donner son avis</DialogTitle>
      <DialogContent className="app-dialog-content">
        <div className="icon-area">
          <HowToVoteIcon className="icon" />
        </div>
        {event && (<DialogContentText className="title-dialog-content-text" align="center">
          {event.title}
          </DialogContentText>)}
        <DialogContentText id="alert-dialog-description" align="center">
          Pour offrir un contenu de qualité, merci de bien vouloir vous exprimer ci-dessous 🙂
          </DialogContentText>
        <div className="app-formcontrol centered">
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">Note générale*</Typography>
            <Rating className="app-rating" name="pristine" value={rate} onChange={(e: any, nv: any) => setRate(nv)} />
          </Box>
        </div>

        <div className="app-formcontrol ">
          <FormControl fullWidth>
            <InputLabel htmlFor="age-native-simple">Approfondir le sujet (format plus long)</InputLabel>
            <NativeSelect
              fullWidth
              value={findOutMore}
              onChange={(e: any) => setFindOutMore(e.target.value) }
              inputProps={{
                name: 'findOutMore',
                id: 'age-native-simple',
              }}
              
            >
              <option key="fomy" value={'y'}>Oui</option>
              <option key="fomn" value={'n'}>Non</option>
            </NativeSelect>
          </FormControl>
        </div>

        <div className="app-formcontrol">
        <TextField
            fullWidth
            name="comment"
            label="Commentaire et idée de sujet"
            placeholder="La mise en application des chatbots"
            value={comment}
            onChange={(e:any) => setComment(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmojiObjectsIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Fermer
          </Button>
          <Button  color="secondary" onClick={onValidate} disabled={rate === null}>
          Valider
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Review;