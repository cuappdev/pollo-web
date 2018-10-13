//TODO: connect with server
//TODO: change question -> polls
//TODO: change to redux states
import React, { Component, createContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';
import Home from './home/Home';
// import Session from './home/session/Session';
import './App.css';
import GoogleLogin from 'react-google-login';
import { googleClientId } from './utils/constants';
import { generateUserSession, setAuthHeader } from './utils/requests';


class App extends Component {

  state = {
    user: localStorage.getItem('user'),
    setHeaders: false
  };

  async componentDidMount() {
    if (this.state.user) setAuthHeader(null);
    this.setState({ setHeaders: true });
  }

  handleResponse = async (response) => {
    if (response.error) {
      // TODO: Show error message in UI
      console.log(response.error);
      console.log(response.details);
    } else {
      // TODO: localstorage(pro: session persists even if you close the tab
      //                    con: can have only one account associated to entire browser
      //        OR
      //        sessionstorage(pro: account associated to each tab so multiple account can be hosted simultaneously
      //                       con: if you close the tab, you need to sign in again)
      localStorage.setItem('user', response.w3.ig);
      await generateUserSession(response);
      this.setState({ user: response.w3.ig });
    }
  }

  logout = (val) => {
    this.setState({ user: val });
    localStorage.clear();
  }

  render () {
    const { user, setHeaders } = this.state;

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

    if (!user) { // If user not logged in, render sign in page
      return loginScreen;
    } else if (user && !setHeaders) { // Middle-state: user is logged in but authentication header is being set up
      return loadingScreen;
    } else { // If user logged in, render home page
      return homeScreen;
    }
  }
}

export default App;
