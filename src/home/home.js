import React, { Component } from 'react';
import { Button, Divider, Header, Input } from 'semantic-ui-react';

class Home extends Component {

  state = { sessionInput: '' }

  sessionInputChanged = (e, { value }) => {
    this.setState({ sessionInput: value });
  }

  onKeyPress = ({ key }) => {
    if (key === 'Enter') {
      this.joinSession();
    }
  }

  render () {
    return (
      <div>
        <Header size='tiny' color='grey'>Join a different session</Header>
        <Input
          placeholder='Enter a Session Code'
          size='large'
          action={{
            primary: this.state.sessionInput !== '',
            content: 'Join',
            disabled: this.state.sessionInput === ''
          }}
          onChange={this.sessionInputChanged}
          onKeyPress={this.onKeyPress}
        />
        <Divider hidden />
        <Button content='Create New Session' size='big' primary fluid />
      </div>
    );
  }
}

export default Home;