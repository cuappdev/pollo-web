import React, { Component } from 'react';
import { Header, Menu, Button } from 'semantic-ui-react';

import CreateSession from './CreateSession';
import JoinSession from './JoinSession';
import SessionPage from './session/SessionPage';
import {
  createNewSession,
  deleteSession,
  generateNewCode,
  getAllSessions,
  joinSession,
  leaveSession,
} from '../utils/requests';

import './Home.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'CREATED',
      session: null,
      joinLoading: false,
      joinError: null,
      createLoading: false,
      createError: null,
      userSession: null,
      adminSessions: null,
      memberSessions: null
    };

    this.fetchSessions();
  }

  fetchSessions = () => {
    // Get all sessions user created
    getAllSessions()
      .then((data) => {
        this.setState({ 
          adminSessions: data.adminSessions, 
          memberSessions: data.memberSessions,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  // TODO: need to check for invalid code
  joinSession = (code: string) => {
    this.setState({
      joinLoading: true
    });

    joinSession(code)
      .then((session) => {
        console.log(session);
        this.setState({
          activeTab: 'JOINED',
          session: session,
          joinLoading: false,
          joinError: null
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          joinLoading: false,
          joinError: err.toString()
        });
      });
  }

  //TODO: save session to DB when name is given (not when ‘create session' button is clicked
  createSession = () => {
    this.setState({
      createLoading: true
    });

    generateNewCode()
      .then((code) => {
        return createNewSession(code);
      })
      .then((session) => {
        this.setState({
          session: session,
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

  sessionAction = (i: number, action: string) => {
    const { activeTab, adminSessions, memberSessions } = this.state;
    const currentSessions = (activeTab === 'CREATED') ? adminSessions : memberSessions;

    if (action === 'NAVIGATE') {
      this.setState({ session: currentSessions[i] });
    } else if (action === 'REMOVE' && activeTab === 'CREATED') { 
      deleteSession(currentSessions[i].id);
      currentSessions.splice(i, 1);
      this.setState({ adminSessions: currentSessions });
    } else if (action === 'REMOVE' && activeTab === 'JOINED') { 
      leaveSession(currentSessions[i].id);
      currentSessions.splice(i, 1);
      this.setState({ memberSessions: currentSessions });
    }
  }

  leaveSession = () => {
    this.setState({ session: null });
    this.fetchSessions();
  }

  logout = () => {
    this.setState({ userSession: null });
    this.props.logout();
  }

  render () {
    const {
      activeTab,
      createError,
      createLoading,
      adminSessions,
      joinError,
      joinLoading,
      memberSessions,
      session,
    } = this.state;

    // Go to session page if session non-null
    if (session) {
      return (
        <SessionPage
          adminSession={activeTab === 'CREATED'}
          leaveSession={this.leaveSession} 
          session={session} />
      );
    }

    // FIX: Dummy data for integrating UI
    var loadedSessions = (activeTab === 'CREATED') ? adminSessions : memberSessions;

    const sessionCells = loadedSessions && loadedSessions.map((loadedSession, i) =>
      <li className='session-cell' key={i}>
        <Button className='session-cell-info' onClick={() => this.sessionAction(i, 'NAVIGATE')}>
          <div className='session-title'>{loadedSession.name}</div>
          <div className='session-activity'>{`Session code: ${loadedSession.code}`}</div>
        </Button>
        <Button
          className='session-options-button'
          onClick={() => this.sessionAction(i, 'REMOVE')}
        />
      </li>
    );

    return (
      <div className='app'>
        <div className='app-header'>
          <Button
            className='logout-button'
            content='Logout'
            onClick={this.logout}
          />
          <div className='header-section'>
            <div className='header-content'>
              <Header as='h1' className='header-title'>Polls</Header>
              <div className='navbar'>
                <Menu pointing secondary className='navbar-menu'>
                  <Menu.Item
                    content='Created'
                    name='CREATED'
                    active={activeTab === 'CREATED'}
                    onClick={this.handleNavbarTabClick}
                  />
                  <Menu.Item
                    content='Joined'
                    name='JOINED'
                    active={activeTab === 'JOINED'}
                    onClick={this.handleNavbarTabClick}
                  />
                </Menu>
              </div>
              <div className='session-buttons'>
                <CreateSession
                  error={createError}
                  loading={createLoading}
                  onCreate={() => this.createSession()}
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
          <ul className='sessions-section'>
            {sessionCells}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
