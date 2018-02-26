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

class JoinSessionContainer extends Component {
  state = {
    sessionInput: ''
  }

  sessionInputChanged = (e, { value }) => {
    this.setState({ sessionInput: value });
  }

  onKeyPress = ({ key }) => {
    if (key === 'Enter') {
      this.joinSession();
    }
  }

  joinSession = () => this.props.onJoinSession(this.state.sessionInput)

  render () {
    return (
      <div>
        <Header size='tiny' color='grey'>Join a different session</Header>
        <ErrorMessage error={this.props.error} />
        <Input
          placeholder='Enter session code'
          size='large'
          disabled={this.props.loading}
          error={this.props.error !== null}
          action={{
            primary: this.state.sessionInput !== '',
            content: 'Join',
            disabled: this.state.sessionInput === '' || this.props.loading,
            loading: this.props.loading,
            onClick: this.joinSession
          }}
          onChange={this.sessionInputChanged}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

export default JoinSessionContainer;