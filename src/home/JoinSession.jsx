import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import './JoinSession.css';

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
      <div className='join-session-container'>
        <Input
          className='join-session-input'
          placeholder='Enter a code'
          disabled={loading}
          error={error !== null}
          action={{
            content: 'Join',
            disabled: !this.isInputValid(),
            loading: loading,
            onClick: this.joinSession
          }}
          value={sessionInput}
          onChange={this.sessionInputChanged}
          onKeyPress={this.onKeyPress}
        />
        {/* TODO: Add error message if error occurs when joining session */}
      </div>
    );
  }
}

export default JoinSession;
