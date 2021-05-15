import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Login from './views/login';
import PrivateRoute from './shared/private-route';
import NoMatch from './views/no-match';
import * as moment from 'moment';
import 'moment/locale/fr';
import Error from './views/error';
import historyService from './services/history.service';
import Welcome from './views/welcome';
import Register from './views/register';
import EmailCheck from './views/email-check';
import Widget from './views/widget';
import Event from './views/event';


// @see https://material-ui.com/customization/palette/
//const theme = createMuiTheme({ "palette": { "common": { "black": "#000", "white": "#fff" }, "background": { "paper": "#fff", "default": "#fafafa" }, "primary": { "light": "rgba(48, 49, 49, 0.84)", "main": "rgba(48, 49, 49, 1)", "dark": "rgba(38, 39, 39, 1)", "contrastText": "#fff" }, "secondary": { "light": "rgba(118, 143, 255, 1)", "main": "rgba(41, 98, 255, 1)", "dark": "rgba(0, 57, 203, 1)", "contrastText": "#fff" }, "error": { "light": "#e57373", "main": "#f44336", "dark": "#d32f2f", "contrastText": "#fff" }, "text": { "primary": "rgba(0, 0, 0, 0.87)", "secondary": "rgba(0, 0, 0, 0.54)", "disabled": "rgba(0, 0, 0, 0.38)", "hint": "rgba(0, 0, 0, 0.38)" } } });
const theme = createMuiTheme({"palette":{"common":{"black":"#000","white":"#fff"},"background":{"paper":"#fff","default":"#fafafa"},"primary":{"light":"rgba(74, 74, 74, 0.77)","main":"rgba(74, 74, 74, 1)","dark":"rgba(61, 61, 62, 1)","contrastText":"#fff"},"secondary":{"light":"rgba(255, 102, 0, 0.79)","main":"rgba(255, 102, 0, 1)","dark":"rgba(192, 77, 0, 1)","contrastText":"#fff"},"error":{"light":"#e57373","main":"#f44336","dark":"#d32f2f","contrastText":"#fff"},"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"}}});


class App extends React.Component<{}, {  }>{

  customHistory:any;

  componentDidMount() {
    historyService.onApp();
    moment.locale('fr');
  }

  render() {
    

    return (
      <MuiThemeProvider theme={theme}>

        <Router >
          <Switch>
            {/*<Route exact path="/" render={(routeProps) => <Makers {...routeProps} />} />*/}

            <Route path="/login" component={Login} />

            <Route path="/agenda" component={Widget} />
            
            <Route path="/email-check" component={EmailCheck} /> 
            
            <PrivateRoute exact path="/organisation/nouvel-evenement" component={Event} /> 
            <PrivateRoute exact path="/organisation/evenement/:id" component={Event} />       
            <PrivateRoute exact path="/" component={Welcome} />        
            <PrivateRoute exact path="/evenements" component={Welcome} />        
            <PrivateRoute exact path="/evenements/:id" component={Welcome} /> 
            <PrivateRoute exact path="/evenements/:id/inscription" component={Register} />        

            <Route path="/erreur" component={Error} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}
export default App;


// @see https://reacttraining.com/react-router/web/guides/primary-components


