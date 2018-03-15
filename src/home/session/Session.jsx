import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import UserSession from './user/UserSession';
import AdminSession from './admin/AdminSession';
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
        <div className='session-status'>
          {'Session Code: ' + code}
          <button
            onClick={this.leaveSession}
            id='session-leave'
          >
            <Icon name='close' />
            {userType === 'user' ? 'Leave Session' : 'End Session'}
          </button>
        </div>
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