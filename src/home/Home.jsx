import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import JoinSession from './JoinSession';
import OpenSession from './session/OpenSession';
import { generateNewCode, joinPoll } from '../utils/requests';

class Home extends Component {
  state = {
    session: null,
    error: null,
    joinSessionLoading: false
  }

  joinSession = (code) => {
    joinPoll([code])
      .then((session) => {
        this.setState({
          session: session,
          error: null,
          joinSessionLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          error: err.toString(),
          session: null,
          joinSessionLoading: false
        });
      });
  }

  leaveSession = () => {
    this.setState({
      session: null
    });
  }

  componentDidMount () {
    generateNewCode()
      .then((code) => {
        console.log('code:', code);
      })
      .catch((err) => {
        this.setState({
          error: err.toString(),
          joinSessionLoading: false
        });
      });
  }

  render () {
    if (this.state.session) {
      return (
        <OpenSession
          session={this.state.session}
          onDisconnect={this.leaveSession}
        />
      );
    }

    return (
      <div>
        <JoinSession
          error={this.state.error}
          loading={this.state.joinSessionLoading}
          onJoinSession={this.joinSession}
        />
        <Divider hidden />
        <Button content='Create New Session' size='big' primary fluid />
      </div>
    );
  }
}

export default Home;