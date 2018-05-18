import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';
import Home from './home/Home';
import JoinSession from './home/JoinSession';
import './App.css';
import {
  generateNewCode,
  joinPoll,
} from './utils/requests';

class App extends Component {
  state = {
    session: null,
    activeTab: 'CREATED',
    joinError: null,
    joinLoading: false
  }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  joinSession = (code) => {
    joinPoll([code])
      .then((session) => {
        this.setState({
          session: session,
          joinError: null,
          joinLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          session: null,
          joinError: err.toString(),
          joinLoading: false
        });
      });
  }

  render () {
    const {
      activeTab,
      session,
      joinError,
      joinLoading,
    } = this.state;

    const contentSection = (activeTab == 'CREATED') ? (
      <div className='created-section'></div>
    ) : (
      <div className='joined-section'></div>
    );

    return (
      <Router>
        <div className='app'>
          <div className='app-header'>
            <div className='header-section'>
              <Header as='h1' className='header-title'>Polls</Header>
              <div className='header-content'>
                <div className='navbar'>
                  <Menu pointing secondary className='navbar-menu'>
                    <Menu.Item
                      content='Created'
                      name='CREATED'
                      active={activeTab == 'CREATED'}
                      onClick={this.handleNavbarTabClick}
                    />
                    <Menu.Item
                      content='Joined'
                      name='JOINED'
                      active={activeTab == 'JOINED'}
                      onClick={this.handleNavbarTabClick}
                    />
                  </Menu>
                </div>
                {
                  <JoinSession
                    error={joinError}
                    loading={joinLoading}
                    onJoin={this.joinSession}
                  />
                }
              </div>
            </div>
          </div>
          <div className='app-content'>
            {contentSection}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
