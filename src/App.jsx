import React, { Component, createContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';
import Home from './home/Home';
import Session from './home/session/Session';
import './App.css';
import GoogleLogin from 'react-google-login';
import { googleClientId } from './utils/constants';

class App extends Component {

  state = { user: null };

  handleResponse = (response) => {
    if (response.error) {
      // TODO: Show error message in UI
      console.log(response.error);
      console.log(response.details);
    } else {
      this.setState({ user: response });
    }
  }

  logout = (val) => {
    this.setState({ user: val });
  }

  render () {
    const { user } = this.state;

    // If user not logged in, go to login screen
    if (!user) {
      return (
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
    }

    // If user logged in, go to home screen
    return (
      <Router>
        <Route exact path='/' render={() => <Home user={user} logout={this.logout} />} />
      </Router>
    );
  }
}

export default App;
