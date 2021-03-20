import React from 'react';
import {
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import authService from '../../services/auth.service';
//import authService from '../../services/auth.service';


const PrivateRoute = (props: RouteProps) => {
  const {children, component, ...rest} = props;
  const realCmp:any = props.component;
  return (
    <Route
    {...rest}
    render={({ location, history, match }) =>
        authService.isAuth ? (
          /*React.Children.map(children, (child:any) =>
            React.createElement(child, {history,location})
          ) */
          React.createElement(realCmp, {location, history, match})
        ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { fromPathname: `${location.pathname}${location.hash}` }
                    }}
                />
            )
    }
/>
  );
};


export default PrivateRoute;
