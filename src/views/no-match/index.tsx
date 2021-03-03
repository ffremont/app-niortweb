import React from 'react';
import './NoMatch.scss';
import MenuApp from '../../shared/menu-app';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import historyService from '../../services/history.service';

function NoMatch(props: any) {
  historyService.on(window.location.pathname);
  return (
    <div className="no-match">
      <MenuApp mode="light" history={props.history} />

      <div className="area">
        <ErrorOutlineIcon />
        <Typography variant="h4">Page introuvable</Typography>

      </div>
    </div>
  );
}

export default NoMatch;
