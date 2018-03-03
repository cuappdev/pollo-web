import React, { Component } from 'react';
import { Header, Message, Input } from 'semantic-ui-react';

function ErrorMessage (props) {
  if (!props.error) return null;
  return (
    <Message negative size='tiny'>
      <p>{props.error}</p>
    </Message>
  );
}

class JoinSession extends Component {
  state = {
    sessionInput: ''
  }

  sessionInputChanged = (e, { value }) => {
    this.setState({ sessionInput: value.toUpperCase() });
  }

  onKeyPress = ({ key }) => {
    if (key === 'Enter') {
      this.joinSession();
    }
  }

  joinSession = () => this.props.onJoinSession(this.state.sessionInput)

  render () {
    const { loading, error } = this.props;
    const { sessionInput } = this.state;

    const actionDisabled = sessionInput === ''
      || sessionInput.length !== 6
      || loading;

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
            primary: !actionDisabled,
            content: 'Join',
            disabled: actionDisabled,
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