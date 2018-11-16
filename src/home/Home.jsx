import React, { Component } from 'react';
import { Header, Menu, Button } from 'semantic-ui-react';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';
import Session from './session/Session';
import {
  generateNewCode,
  createNewSession,
  getAllSessions,
  deleteSession,
  joinSession,
} from '../utils/requests';
import './Home.css';

class Home extends Component {
  state = {
    activeTab: 'CREATED',
    session: null,
    joinLoading: false,
    joinError: null,
    createLoading: false,
    createError: null,
    userSession: null,
    createdSessions: null,
    joinedSessions: null
  }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  // TODO: need to check fo invalid code
  // TODO: joining doesn't work
  joinSession = (code) => {
    this.setState({
      joinLoading: true
    });

    joinSession(code)
      .then((session) => {
        this.setState({
          session: session,
          joinLoading: false,
          joinError: null
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          session: null,
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

  goToSession = (i) => {
    const { activeTab, createdSessions, joinedSessions } = this.state;
    const loadedSessions = (activeTab === 'CREATED') ? createdSessions : joinedSessions;

    this.setState({ session: loadedSessions[i] });
  }

  // TODO: session deletes when ‘…’ clicked;
  //       Show more session options than just delete
  deleteSession = (i) => {
    const { activeTab, createdSessions, joinedSessions } = this.state;
    const loadedSessions = (activeTab === 'CREATED') ? createdSessions : joinedSessions;

    // Delete session
    deleteSession(loadedSessions[i].id)
      .then((data) => {
        loadedSessions.splice(i, 1);

        if (activeTab === 'CREATED') {
          this.setState({ createdSessions: loadedSessions });
        } else {
          this.setState({ joinedSessions: loadedSessions });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  leaveSession = () => {
    this.setState({
      session: null,
      createdSessions: null,
      joinedSessions: null
    });
  }

  logout = () => {
    this.setState({ userSession: null });
    this.props.logout(null);
    localStorage.clear();
  }

  render () {
    const {
      activeTab,
      createError,
      createLoading,
      createdSessions,
      joinError,
      joinLoading,
      joinedSessions,
      session,
    } = this.state;

    // Get all sessions user created
    if (!createdSessions) {
      getAllSessions('admin')
        .then((sessions) => {
          this.setState({ createdSessions: sessions });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // Get all sessions user joined
    if (!joinedSessions) {
      getAllSessions('member')
        .then((sessions) => {
          this.setState({ joinedSessions: sessions });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // Go to session screen if new session created or old session loaded
    if (session) {
      return (
        <Session
          session={session}
          leaveSession={this.leaveSession}
        />
      );
    }

    // FIX: Dummy data for integrating UI
    var loadedSessions = (activeTab === 'CREATED') ? createdSessions : joinedSessions;

    const sessionCells = (loadedSessions && loadedSessions.map((loadedSession, i) =>
      <li className='session-cell' key={i}>
        <Button className='session-cell-info' onClick={() => this.goToSession(i)}>
          <div className='session-title'>{loadedSession.name ? loadedSession.name : 'Untitled'}</div>
          <div className='session-activity'>{`Session code: ${loadedSession.code}`}</div>
        </Button>
        <Button
          className='session-options-button'
          onClick={() => this.deleteSession(i)}
        />
      </li>
    ));

    const contentSection = (activeTab === 'CREATED') ? (
      <ul className='created-section'>
        {sessionCells}
      </ul>
    ) : (
      <ul className='joined-section'></ul>
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
          {contentSection}
        </div>
      </div>
    );
  }
}

export default Home;
