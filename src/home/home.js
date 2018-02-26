import React, { Component } from 'react';
import { Button, Divider } from 'semantic-ui-react';
import JoinSessionContainer from './JoinSessionContainer';
import OpenSessionContainer from './OpenSessionContainer';
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
        this.setState({ session: session });
      })
      .catch((err) => {
        this.setState({ error: err.toString() });
      });
  }

  componentDidMount () {
    generateNewCode()
      .then((code) => {
        console.log('code:', code);
      })
      .catch((err) => {
        this.setState({ error: err.toString() });
      });
  }

  render () {
    const home = this.state.session === null
      ? (
        <div>
          <JoinSessionContainer
            error={this.state.error}
            loading={this.state.joinSessionLoading}
            onJoinSession={this.joinSession}
          />
          <Divider hidden />
          <Button content='Create New Session' size='big' primary fluid />
        </div>
      ) : (
        <OpenSessionContainer />
      );
    return home;
  }
}

export default Home;