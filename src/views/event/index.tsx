import React from 'react';
import historyService from '../../services/history.service';
import MenuApp from '../../shared/menu-app';
import eventStore, { EventStore } from '../../stores/event';
import './Event.scss';
import * as My from '../../models/Event';
import DescriptionIcon from '@material-ui/icons/Description';
import { Backdrop, Button, Card, CardContent, Chip, CircularProgress, FormControl, Input, InputAdornment, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import TitleIcon from '@material-ui/icons/Title';
import EventIcon from '@material-ui/icons/Event';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { EventModeEnum } from '../../models/EventModeEnum';
import SubjectIcon from '@material-ui/icons/Subject';
import DuoIcon from '@material-ui/icons/Duo';
import BusinessIcon from '@material-ui/icons/Business';

import conf from '../../confs';
import moment from 'moment';
import pwaService from '../../services/pwa.service';


class Event extends React.Component<{ history: any, location: any, match: any }, {  event: any }> {

  // The component's Local state.
  state = {
    event: {
      id:null,
      duration: 60,
      mode: EventModeEnum.REMOTE_AND_PHYSICAL_CONF,
      where: 'NiortTech, 12 Avenue Jacques Bujault, 79000 Niort',
      webconfLink: `https://meet.jit.si/${Math.random().toString(36)}`,
      tags: [],
      title: '',
      speaker:{
        firstname:'',
        lastname:'',
        email:'',
        job:''
      }
    }
  };

  myWidget: any;
  currentImage: string = '';

  constructor(props: any) {
    super(props);
    this.myWidget = null;
  }

  componentDidMount() {
    historyService.on(window.location.pathname);

    const id: string = this.props.match.params.id;
    eventStore.load()
      .then((events: My.Event[]) => {
        const evt = events.find(e => e.id === id);
        if (evt)
          this.setState({ event: evt });

      });

    //televerser
    this.myWidget = ((window as any).cloudinary.createUploadWidget({
      cloudName: 'dyuwlqafx',
      uploadPreset: 'vrzpzttn'
    },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          this.currentImage = result.info.url;
        }

        if (!error && result && result.event === 'close' && this.currentImage) {
          this.setState({ event: { ...(this.state.event as any), image: this.currentImage } });
        }
      }
    ) as any);

    (window as any).document.getElementById("televerser").addEventListener("click", () => {
      this.myWidget.open();
    }, false);
  }

  onSubmit(e: any) {
    e.preventDefault();

    if(!(this.state.event as any).image){
      alert('Merci de définir une image');
      return;
    }

    if ((window as any).confirm(`Confirmez-vous la ${this.state.event.id ? 'modification':'création'} de l'événement ?`)) {
      EventStore.update(this.state.event as any)
        .then(() => {
          this.props.history.push('/');
          pwaService.notify(
            `Evenement enregistré`,
            `✅ C'est noté ! `
          )
        }).catch(() => {
          this.props.history.push('/erreur');
        });
    }
  }

  render() {
    const e: any = this.state.event;
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    return (<div className="register">
      <MenuApp mode="event" history={this.props.history} />

      {this.state.event === null && (<Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>)}



      {e && (<form className="register-form"
        onSubmit={(e: any) => this.onSubmit(e)}
      >

        <div className="app-formcontrol app-formcontrol-thumb">
          {e && e.image && (<img src={e.image} alt="thumb" className='thumb' />)}
        </div>
        <div className="app-formcontrol app-formcontrol-btn">
          <Button id="televerser" variant="contained" color="primary">
            Téléverser une image
      </Button>
        </div>

        <Card variant="outlined" className="card-controls">
          <CardContent>
            <Typography variant="h5" component="h2">
              Général
        </Typography>

            <div className="controls">
              <div className="app-formcontrol">
                <TextField
                  id="title"
                  name="title"
                  value={e.title}
                  onChange={(ev) => this.setState({ event: { ...e, title: ev.target.value } })}
                  fullWidth
                  placeholder="Titre principal de l'événement"
                  required
                  inputProps={{ maxLength: 512 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="app-formcontrol">
                <TextField
                  id="scheduled"
                  label="Date de l'événement"
                  fullWidth
                  required
                  value={e.scheduled ? moment(e.scheduled).format('yyyy-MM-DDTkk:mm') : null}
                  onChange={(ev) => this.setState({ event: { ...e, scheduled: (new Date(ev.target.value)).getTime() } })}
                  type="datetime-local"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="app-formcontrol">
                <TextField
                  id="duration"
                  name="duration"
                  type="number"
                  fullWidth
                  label="Durée en seconde"
                  value={e.duration}
                  onChange={(ev) => this.setState({ event: { ...e, duration: parseInt(ev.target.value) } })}
                  required
                  inputProps={{ max: 1000 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HourglassEmptyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="app-formcontrol">
                <FormControl fullWidth>
                  <InputLabel htmlFor="mode-native-simple">Mode</InputLabel>
                  <Select
                    native
                    required
                    fullWidth
                    value={e.mode}
                    onChange={(ev) => this.setState({ event: { ...e, mode: ev.target.value } })}
                    inputProps={{
                      name: 'mode',
                      id: 'mode-native-simple',
                    }}
                  >
                    <option value={'REMOTE_ONLY_CONF'}>Distanciel uniquement</option>
                    <option value={'REMOTE_AND_PHYSICAL_CONF'}>Distanciel et présentiel</option>
                    <option value={'PHYSICAL_CONF'}>Présentiel uniquement</option>
                  </Select>
                </FormControl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined" className="card-controls">
          <CardContent>
            <Typography variant="h5" component="h2">
              Contenu
        </Typography>

            <div className="controls">
              <div className="app-formcontrol">
                <TextField
                  id="description"
                  name="description"
                  label="Description complète"
                  multiline
                  value={e.description}
                  onChange={(ev) => this.setState({ event: { ...e, description: ev.target.value } })}
                  fullWidth
                  required
                  inputProps={{ maxLength: 5000 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SubjectIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>


              <div className="app-formcontrol">
                <FormControl className="select-formcontrol" fullWidth>
                  <InputLabel htmlFor="tags-multiple-chipe">Tags</InputLabel>
                  <Select
                    fullWidth
                    multiple
                    onChange={(ev: any) => {
                      this.setState({ event: { ...e, tags: ev.target.value } })
                    }}
                    value={e.tags}
                    input={<Input id="tags-multiple-chip" />}
                    renderValue={(selected: any) => (
                      <div className='chips'>
                        {selected.map((value: any) => (
                          <Chip key={value} label={value} className='chip' />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {conf.tags.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="app-formcontrol">
                <TextField
                  id="resumelink"
                  name="resumeLink"
                  type="url"
                  fullWidth
                  placeholder='https://niortweb.fr/evenements/mon-evenement'
                  label="Lien du résumé"
                  value={e.resumeLink}
                  onChange={(e) => this.setState({ event: { ...e, resumeLink: parseInt(e.target.value) } })}
                  inputProps={{ maxLength: 1024 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {e && (e.mode !== 'PHYSICAL_CONF') && (<Card variant="outlined" className="card-controls">
          <CardContent>
            <Typography variant="h5" component="h2">
              En distanciel
        </Typography>

            <div className="controls">
              <div className="app-formcontrol">
                <TextField
                  id="webconfLink"
                  name="webconfLink"
                  type="url"
                  fullWidth
                  required
                  placeholder='https://niortweb.fr/evenements/mon-evenement'
                  label="Lien de la webconf"
                  value={e.webconfLink}
                  onChange={(e) => this.setState({ event: { ...e, webconfLink: parseInt(e.target.value) } })}
                  inputProps={{ maxLength: 1024 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DuoIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>)}

        {e && (e.mode === 'PHYSICAL_CONF') && (<Card variant="outlined" className="card-controls">
          <CardContent>
            <Typography variant="h5" component="h2">
              En Présentiel
        </Typography>

            <div className="controls">
              <div className="app-formcontrol">
                <TextField
                  id="where"
                  name="where"
                  required
                  type="text"
                  fullWidth
                  label="Adresse du lien"
                  value={e.where}
                  onChange={(e) => this.setState({ event: { ...e, where: parseInt(e.target.value) } })}
                  inputProps={{ maxLength: 1024 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>)}

        <Card variant="outlined" className="card-controls">
          <CardContent>
            <Typography variant="h5" component="h2">
              Animateur.s
        </Typography>

            <div className="controls">
              <div className="app-formcontrol">
                <TextField
                  id="speaker.firstname"
                  name="speaker.firstname"
                  type="text"
                  fullWidth
                  label="Prénom·s"
                  value={e.speaker.firstname}
                  onChange={(ev) => this.setState({ event: { ...e, speaker: { ...e.speaker, firstname: ev.target.value} } })}
                  inputProps={{ maxLength: 1024 }}
                  
                />
              </div>
              <div className="app-formcontrol">
                <TextField
                  id="speaker.lastname"
                  name="speaker.lastname"
                  type="text"
                  fullWidth
                  label="Nom·s"
                  value={e.speaker.lastname}
                  onChange={(ev) => this.setState({ event: { ...e, speaker: { ...e.speaker, lastname: ev.target.value} } })}
                  inputProps={{ maxLength: 1024 }}
                />
              </div>
              <div className="app-formcontrol">
                <TextField
                  id="speaker.email"
                  name="speaker.email"
                  type="email"
                  fullWidth
                  required
                  label="Email·s"
                  value={e.speaker.email}
                  onChange={(ev) => this.setState({ event: { ...e, speaker: { ...e.speaker, email: ev.target.value} } })}
                  inputProps={{ maxLength: 1024 }}
                />
              </div>
              <div className="app-formcontrol">
                <TextField
                  id="speaker.job"
                  name="speaker.job"
                  type="text"
                  fullWidth
                  required
                  label="Job"
                  value={e.speaker.job}
                  onChange={(ev) => this.setState({ event: { ...e, speaker: { ...e.speaker, job: ev.target.value} } })}
                  inputProps={{ maxLength: 1024 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="register-footer">
          <Button type="submit"
            className="register-action"
            size="large"
            variant="contained"
            color="secondary">{e.id ? `Modifier l'événement`: `Créer l'événement`}</Button>
        </div>

      </form>)}

    </div>


    );

  }
}

export default Event;