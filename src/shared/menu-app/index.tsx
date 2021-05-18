import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShareIcon from '@material-ui/icons/Share';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MyIconTypoIcon from '../../assets/images/logo512.png';
import Button from '@material-ui/core/Button';

import './MenuApp.scss';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ClearIcon from '@material-ui/icons/Clear';
import { grey } from '@material-ui/core/colors';
import GetAppIcon from '@material-ui/icons/GetApp';
import LockIcon from '@material-ui/icons/Lock';
import myProfilStore from '../../stores/my-profil';
import pwaService from '../../services/pwa.service';
import authService from '../../services/auth.service';
import { User } from '../../models/User';
import historyService from '../../services/history.service';
import SendIcon from '@material-ui/icons/Send';
import ForumIcon from '@material-ui/icons/Forum';
import conf from '../../confs';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    firstButton: {
      marginRight: theme.spacing(2),
    },
    appBar: {
      color: theme.palette.grey[900],
      background: theme.palette.common.white
    },
    title: {
      flexGrow: 1,
      paddingRight: 0,
    },
    titleNoPadding: {
      paddingRight: 0
    },
    catalogTitleCanShare: {
      paddingLeft: 50
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    installBar: {
      color: theme.palette.common.white,
      backgroundColor: grey[500],
      marginBottom: 10,
      padding: '10px 10px'
    },
    getApp: {
      color: theme.palette.common.white,
      borderColor: theme.palette.common.white
    }
  }),
);

const MenuApp = (props: any) => {
  const classes = useStyles();
  const [mode, setMode] = useState('full');
  const [auth] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [organizer, setOrganizer] = useState(false);
  const [email, setEmail] = useState('');
  const [goBackPath, setGoBackPath] = useState('');
  const [open, setOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  React.useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);
  React.useEffect(() => {
    setGoBackPath(props.goBackPath);
  }, [props.goBackPath]);


  useEffect(() => {
    const subInstalled = pwaService.installed.subscribe((installed) => {
      if (installed)
        setShowInstall(false)
    });
    const subCancelled = pwaService.cancelled.subscribe((cancelled) => {
      if (cancelled)
        setShowInstall(false)
    });
    const subHistory = historyService.stack.subscribe(() => {
      setCanGoBack(historyService.canGoBack());
    });
    const subBeforeinstallprompt = pwaService.beforeinstallprompt.subscribe((beforeinstallprompt) => {
      if (beforeinstallprompt)
        setShowInstall(true)
    });
    const subMyProfil = myProfilStore.subscribe((user: User) => {
      if (user && user.email){
        setEmail(user.email.substr(0, user.email.indexOf('@')));
        setOrganizer( !!user.roles && (user.roles.indexOf('ORGANIZER') > -1));
      }
    })
    return () => {
      subHistory.unsubscribe();
      subMyProfil.unsubscribe();
      subInstalled.unsubscribe();
      subCancelled.unsubscribe();
      subBeforeinstallprompt.unsubscribe();
    };
  });

  const logout = () => {
    if (window.confirm('Voulez-vous déconnecter votre appareil de votre compte ?')) {
      authService.signout();
      window.location.reload();
    }
  }

   const onClickShare = () =>{
    if((window as any).navigator.share){
      (window as any).navigator.share({
        title: `NiortWeb - mon favori`,
        text: `Rendez-vous sur "${window.location.href}"`,
      }); // partage l'URL de MDN
    }
  }

  return (
    <div className={classes.root}>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List className="drawer-list">
          {!email && (<ListItem selected button key="login" onClick={() => props.history.push('/login')}>
            <ListItemIcon><LockIcon /></ListItemIcon>
            <ListItemText primary="Se connecter" />
          </ListItem>)}
          {email && (<ListItem selected button key="connected">
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Connecté" secondary={email} />
          </ListItem>)}

          <ListItem button key="soumettre" component="a" href={`mailto:${conf.email}?subject=[app.NiortWeb.fr] Soumettre une idée d'événement`}>
            <ListItemIcon><EmojiObjectsIcon /></ListItemIcon>
            <ListItemText primary="Soumettre un événement" secondary="" />
          </ListItem>
          <ListItem button key="contact"  component="a" href={`mailto:${conf.email}?subject=[app.NiortWeb.fr] Prise de contact`}>
            <ListItemIcon><SendIcon /></ListItemIcon>
            <ListItemText primary="Envoyer un message" secondary="" />
          </ListItem>
          <ListItem button key="slack" onClick={() => window.location.href = `${conf.slack}`}>
            <ListItemIcon><ForumIcon /></ListItemIcon>
            <ListItemText primary="Canal Slack" secondary="" />
          </ListItem>

          {email && (<ListItem button key="logout" onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Se déconnecter" secondary="Dissocier cet appareil" />
          </ListItem>)}
        </List>
      </Drawer>
      <AppBar position="fixed" className={`${classes.appBar} ${canGoBack ? 'canGoBack' : 'cantGoBack'}`}>
        <Toolbar>
          {((mode === 'home') || !canGoBack) && (
            <IconButton edge="start" className={`${classes.firstButton}`} onClick={() => setOpen(true)} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          {(mode !== 'home') && canGoBack && (
            <IconButton edge="start" className={classes.firstButton} onClick={() => goBackPath ? props.history.push(goBackPath) : props.history.push('/')} color="inherit" aria-label="précédent">
              <ArrowBackIosIcon />
            </IconButton>
          )}


          <Typography variant="h6" align="center" className={`${classes.title} ${canGoBack ? '' : classes.titleNoPadding} ${(window as any).navigator.share && mode === 'catalog' ? classes.catalogTitleCanShare : ''}`}>
            <img alt="icon ici drive" onClick={() => props.history.push('/')} className="my-icon" src={MyIconTypoIcon} />

          </Typography>



          <IconButton
                aria-label="sync"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={onClickShare}
                color="inherit"
              >
                <ShareIcon />
              </IconButton>
           
        </Toolbar>
      </AppBar>
      <div className="ghost-appbar"></div>

      {showInstall && (<div className={`install-bar ${classes.installBar}`}>
        <div className="install-close" onClick={() => pwaService.close()}>
          <ClearIcon />
        </div>
        <div className="install-content">
          <div className="install-icon">
            <img src={MyIconTypoIcon} alt="logo" />
          </div>
          <div className="install-title">
            NiortWeb Compagnon, actu, inscriptions et replay
          </div>
        </div>
        <div className="install-actions">

          <Button onClick={() => pwaService.install()} variant="outlined" startIcon={<GetAppIcon />} className={classes.getApp}>Installer</Button>
        </div>
      </div>)}




    </div>
  );
}

export default MenuApp;