import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import SignupEmail from './components/signup_email';
import CodeVerification from './components/code_verification';
import SetProfile from './components/setProfile';
import SetPassword from './components/setPassword';
import LoginPage from './components/login';
import DashbaordMain from './components/dashboard_main';

const checkAuthClient =()=>{
  const token = sessionStorage.getItem("userToken")
  if(token){
    return true
  } else{
    return false
  }
}

export const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route {...rest}
    render={props =>
      checkAuthClient() ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);


class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Switch>              
              <Route exact path='/' component={SignupEmail} />
              <Route exact path='/code/verification' component={CodeVerification} />
              <Route exact path='/setting/up/profile' component={SetProfile} />
              <Route exact path='/setting/password' component={SetPassword} />
              <Route exact path='/login' component={LoginPage} />

              <PrivateRoute exact path='/home/dashboard' component={DashbaordMain} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
