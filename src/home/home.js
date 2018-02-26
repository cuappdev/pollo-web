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
        console.log(session);
        this.setState({
          session: session,
          joinSessionLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          error: err.toString(),
          joinSessionLoading: false
        });
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
      return <OpenSessionContainer session={this.state.session} />;
    }

    return (
      <div>
        <JoinSessionContainer
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