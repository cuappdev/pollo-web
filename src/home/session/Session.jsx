import React, { Component } from 'react';
import { Icon, Button, Menu } from 'semantic-ui-react';
import UserSession from './user/UserSession';
import AdminSession from './admin/AdminSession';
import io from 'socket.io-client';
import { hostURL } from '../../utils/constants';
import './Session.css';

class Session extends Component {

  state = { activeTab: 'Q & A' }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  createPoll = () => {

  }

  render () {
    const { activeTab } = this.state;

    // FIX: Dummy values for integrating UI
    var userType = 'admin';
    var code = 'ABCDEF'

    return (
      <div className='session'>
        <div className='session-navbar'>
          <Menu pointing secondary className='navbar-menu'>
            <Menu.Item
              content='Q & A'
              name='Q & A'
              active={activeTab == 'Q & A'}
              onClick={this.handleNavbarTabClick}
            />
            <Menu.Item
              content='Review'
              name='REVIEW'
              active={activeTab == 'REVIEW'}
              onClick={this.handleNavbarTabClick}
            />
          </Menu>
        </div>
        <Button className='create-poll-button' primary onClick={this.createPoll}>Create a poll</Button>
        <div className='session-content'></div>
        <div className='session-info'>
          <div className='session-name'>Test Class</div>
          <div className='session-code'>{'Code: ' + code}</div>
        </div>
      </div>
    );
  }
}

export default Session;
