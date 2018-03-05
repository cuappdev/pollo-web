import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';
import UserSession from './UserSession';
import AdminSession from './AdminSession';
import io from 'socket.io-client';
import { hostURL } from '../../utils/constants';
import './Session.css';

class Session extends Component {
  socket = io(`${hostURL}/${this.props.session.id}`, {
    query: {
      userType: this.props.session.userType
    }
  });

  componentDidMount () {
    this.socket.on('connect', () => {
    });

    this.socket.on('disconnect', () => {
      this.props.onDisconnect();
    });
  }

  componentWillUnmount () {
    this.socket.close();
  }

  leaveSession = () => this.socket.disconnect();

  render () {
    const { userType, code } = this.props.session;

    return (
      <div>
        <Message
          attached
          size='tiny'
          color='green'
          header='Connected'
          content={'Session Code: ' + code}
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
          {userType === 'user'
            ? <UserSession socket={this.socket} />
            : <AdminSession socket={this.socket} />
          }
        </div>
      </div>
    );
  }
}

export default Session;