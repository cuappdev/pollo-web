import React, { Component } from 'react';
import { Header, Input } from 'semantic-ui-react';
import ErrorMessage from './ErrorMessage';

class JoinSession extends Component {
  state = {
    sessionInput: ''
  }

  isInputValid () {
    const { loading } = this.props;
    const { sessionInput } = this.state;

    return sessionInput !== ''
      && sessionInput.length === 6
      && !loading;
  }

  sessionInputChanged = (e, { value }) => {
    this.setState({ sessionInput: value.toUpperCase() });
  }

  onKeyPress = ({ key }) => {
    if (key === 'Enter' && this.isInputValid()) {
      this.joinSession();
    }
  }

  joinSession = () => this.props.onJoin(this.state.sessionInput)

  render () {
    const { loading, error } = this.props;
    const { sessionInput } = this.state;

    return (
      <div>
        <Header size='tiny' color='grey'>Join a different session</Header>
        <ErrorMessage error={error} />
        <Input
          placeholder='Enter session code'
          size='large'
          disabled={loading}
          error={error !== null}
          action={{
            primary: this.isInputValid(),
            content: 'Join',
            disabled: !this.isInputValid(),
            loading: loading,
            onClick: this.joinSession
          }}
          value={sessionInput}
          onChange={this.sessionInputChanged}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

export default JoinSession;