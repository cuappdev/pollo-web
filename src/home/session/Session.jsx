import React, { Component } from 'react';
import { Icon, Button, Menu } from 'semantic-ui-react';
import UserSession from './user/UserSession';
import AdminSession from './admin/AdminSession';
import io from 'socket.io-client';
import { hostURL } from '../../utils/constants';
import './Session.css';
import empty_monkey_icon from '../../assets/empty_monkey_icon.png'

class Session extends Component {

  state = { activeTab: 'Q & A' }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  createPoll = () => {

  }

  render () {
    const { activeTab } = this.state;

    // FIX: Dummy values for integrating UI
    var userType = 'admin';
    var code = 'ABCDEF';
    var polls = null;

    const emptyStateSection = (
      <div className='empty-state'>
        <img src={empty_monkey_icon} alt="No Polls"></img>
        <div className='empty-state-title'>Nothing to see here.</div>
        <div className='empty-state-subtitle'>You haven’t made any polls yet! Try it out above.</div>
      </div>
    );

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
        <div className='session-content'>
          {!polls && emptyStateSection}
        </div>
        <div className='session-info'>
          <div className='session-name'>Test Class</div>
          <div className='session-code'>{'Code: ' + code}</div>
        </div>
      </div>
    );
  }
}

export default Session;
