import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class Home extends Component {
  render () {
    return (
      <div>
        <p>Welcome to the Clicker web app! We're excited to get started.</p>
        <Button primary>Join a Session</Button>
      </div>
    );
  }
}

export default Home;