import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import io from 'socket.io-client';
import { hostURL } from '../utils/constants';

class OpenSessionContainer extends Component {
  state = {

  }

  componentDidMount () {
    const socket = io(`http://localhost:${this.props.session.ports[0]}`, {
      query: {
        userType: this.props.session.userType
      }
    });

    socket.on('connect', () => {
      console.log('Connected to socket');
    });
  }

  render () {
    return (
      <div>
        <Header textAlign='center'>Session Code: {this.props.session.code}</Header>
      </div>
    );
  }
}

export default OpenSessionContainer;