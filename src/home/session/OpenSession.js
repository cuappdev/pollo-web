import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';
import UserSession from './UserSession';
import io from 'socket.io-client';
import { hostURL } from '../../utils/constants';
import './OpenSession.css';

class OpenSession extends Component {
  socket = io(`http://localhost:${this.props.session.ports[0]}`, {
    query: {
      userType: this.props.session.userType
    }
  });

  componentDidMount () {
    this.socket.on('connect', () => {
      console.log('Connected to socket');
    });

    this.socket.on('disconnect', () => {
      this.props.onDisconnect();
    });
  }

  leaveSession = () => this.socket.disconnect();

  render () {
    const { userType } = this.props.session;

    return (
      <div>
        <Message
          attached
          size='tiny'
          color='green'
          header='Connected'
          content={'Session Code: ' + this.props.session.code}
        />
        <Button
          fluid
          basic
          attached='bottom'
          onClick={this.leaveSession}
        >
          Leave Session
        </Button>
        <div className='session-content'>
          {userType === 'user' ? <UserSession socket={this.socket} /> : null}
        </div>
      </div>
    );
  }
}

export default OpenSession;