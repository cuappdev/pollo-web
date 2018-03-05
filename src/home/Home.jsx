import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';
import Session from './session/Session';
import {
  generateNewCode,
  joinPoll,
  createPoll,
  startPoll
} from '../utils/requests';

class Home extends Component {
  state = {
    session: null,
    joinError: null,
    joinLoading: false,
    createError: null,
    createLoading: false
  }

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
        console.log('Code:', code);
        return createPoll(null, code);
      })
      .then((poll) => {
        return startPoll(poll);
      })
      .then((poll) => {
        console.log('Started poll:', poll);
        this.setState({
          session: poll,
          createError: null,
          createLoading: false
        });
      })
      .catch((err) => {
        console.log('Creation session failed:', err);
        this.setState({
          createError: err.toString(),
          createLoading: false
        });
      });
  }

  render () {
    const {
      session,
      joinError,
      createError,
      joinLoading,
      createLoading
    } = this.state;

    if (session) {
      return (
        <Session
          session={session}
          onDisconnect={this.leaveSession}
        />
      );
    }

    return (
      <div>
        <JoinSession
          error={joinError}
          loading={joinLoading}
          onJoin={this.joinSession}
        />
        <Divider hidden />
        <CreateSession
          error={createError}
          loading={createLoading}
          onCreate={this.createSession}
        />
      </div>
    );
  }
}

export default Home;