//TODO: change question -> polls
//TODO: change to redux states
import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import Home from './home/Home';
import { googleClientId } from './utils/constants';
import { generateUserSession, setAuthHeader } from './utils/requests';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      setHeaders: false,
      user: localStorage.getItem('user'),
    };
  }

  async componentDidMount() {
    if (this.state.user) setAuthHeader(null);
    this.setState({ setHeaders: true });
  }

  handleResponse = async (response) => {
    if (response.error) {
      // TODO: Show error message in UI
    } else {
      // TODO: localstorage(pro: session persists even if you close the tab
      //                    con: can have only one account associated to entire browser
      //        OR
      //        sessionstorage(pro: account associated to each tab so multiple account can be hosted simultaneously
      //                       con: if you close the tab, you need to sign in again)
      localStorage.setItem('user', response.w3.ig);
      localStorage.setItem('googleId', response.googleId);
      await generateUserSession(response);
      this.setState({ user: response.w3.ig });
      this.forceUpdate();
    }
  }

  logout = () => {
    this.setState({ user: null });
    localStorage.clear();
  }

  render () {
    const { setHeaders, user } = this.state;

    const loginScreen = (
      <div className='login-screen'>
        <div className='login-title'>Pollo</div>
        <GoogleLogin
          className='google-login-button'
          clientId={googleClientId}
          buttonText="Google Login"
          onSuccess={this.handleResponse}
          onFailure={this.handleResponse}
        />
      </div>
    );

    const homeScreen = (
      <Router>
        <Route exact path='/' render={() => <Home logout={this.logout} />} />
      </Router>
    );

    const loadingScreen = (
      <div>
        <div className='app-header'/>
        <div className='app-content'/>
      </div>
    );

    if (!user) return loginScreen;
    if (user && !setHeaders) return loadingScreen;
    return homeScreen;
  }
}

export default App;
