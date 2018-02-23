import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';

class Home extends Component {

  state = { sessionInput: '' }

  sessionInputChanged = (e, { value }) => {
    this.setState({ sessionInput: value });
  }

  onKeyPress = ({ key }) => {
    if (key === 'Enter') {
      console.log('enterPressed');
    }
  }

  render () {
    return (
      <div>
        <p>Welcome to the Clicker web app! We're excited to get started.</p>
        <Input
          size='large'
          action={{ primary: true, content: 'Join' }}
          placeholder='Enter a Session Code'
          onChange={this.sessionInputChanged}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

export default Home;