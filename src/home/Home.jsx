import React, { Component } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';
import Session from './session/Session';
import {
  generateNewCode,
  joinPoll,
  createPoll,
  startPoll
} from '../utils/requests';
import './Home.css';

class Home extends Component {
  state = {
    activeTab: 'CREATED',
    session: null,
    joinLoading: false,
    joinError: null,
    createLoading: false,
    createError: null
  }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  joinSession = (code) => {
    joinPoll([code])
      .then((session) => {
        this.setState({
          session: session,
          joinLoading: false,
          joinError: null
        });
      })
      .catch((err) => {
        this.setState({
          session: null,
          joinLoading: false,
          joinError: err.toString()
        });
      });
  }

  leaveSession = () => {
    this.setState({
      session: null
    });
  }

  createSession = () => {
    this.setState({
      createLoading: true
    });

    generateNewCode()
      .then((code) => {
        return createPoll(null, code);
      })
      .then((poll) => {
        return startPoll(poll);
      })
      .then((poll) => {
        this.setState({
          session: poll,
          createLoading: false,
          createError: null
        });
      })
      .catch((err) => {
        this.setState({
          createLoading: false,
          createError: err.toString()
        });
      });
  }

  render () {
    const {
      activeTab,
      session,
      joinLoading,
      joinError,
      createLoading,
      createError
    } = this.state;

    const contentSection = (activeTab == 'CREATED') ? (
      <div className='created-section'></div>
    ) : (
      <div className='joined-section'></div>
    );

    return (
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
              <div className='session-buttons'>
                <CreateSession
                  className='create-session-button'
                  error={createError}
                  loading={createLoading}
                  onCreate={this.createSession}
                />
                <div className='buttons-divider'></div>
                <JoinSession
                  error={joinError}
                  loading={joinLoading}
                  onJoin={this.joinSession}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='app-content'>
          {contentSection}
        </div>
      </div>
    );
  }
}

export default Home;
