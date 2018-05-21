import React, { Component } from 'react';
import { Icon, Button, Menu, Input } from 'semantic-ui-react';
import UserSession from './user/UserSession';
import AdminSession from './admin/AdminSession';
import io from 'socket.io-client';
import { hostURL } from '../../utils/constants';
import './Session.css';
import EmptyMonkeyIcon from '../../assets/EmptyMonkeyIcon.png'
import HiddenIcon from '../../assets/HiddenIcon.png'

class Session extends Component {

  state = {
    activeTab: 'Q & A',
    sessionInput: '',
    sessionName: 'Test Class',
    showCreatePoll: false
  }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  createPoll = () => {
    console.log("create a poll");
    this.setState({ showCreatePoll: true });
  }

  sessionInputChanged = (e, { value }) => {
    this.setState({ sessionInput: value });
  }

  onKeyPress = ({ key }) => {
    if (key === 'Enter') {
      this.setState({ sessionName: this.state.sessionInput });
    }
  }

  dismissCreatePoll = (val) => {
    this.setState({ showCreatePoll: val });
  }

  editQuestion = () => {
    console.log("edit question");
    // TODO: Show edit question options
  }

  endQuestion = () => {
    console.log("end question");
    // TODO: Call backend endpoint
  }

  leaveSession = () => {
    console.log("leave session");
    // TODO: End socket connection
  }

  render () {
    const { activeTab, sessionInput, sessionName, showCreatePoll } = this.state;

    // FIX: Dummy values for integrating UI
    var userType = 'admin';
    var code = 'ABCDEF';
    var polls = null;

    const emptyStateSection = (
      <div className={'empty-state' + (sessionName ?  '' : ' blur')}>
        <img src={EmptyMonkeyIcon} alt="No Polls"></img>
        <div className='empty-state-title'>Nothing to see here.</div>
        <div className='empty-state-subtitle'>You haven’t made any polls yet! Try it out above.</div>
      </div>
    );

    const pollNameSection = (
      <div className='poll-name-input'>
        <div className='bg-blur'></div>
        <Input
          placeholder='Give your poll a name...'
          value={sessionInput}
          onChange={this.sessionInputChanged}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );

    const createPollPopup = (
      <AdminSession socket={null} dismissCreatePoll={this.dismissCreatePoll} />
    );

    const sessionHeader = (
      <div className='session-header'>
        <Button
          className='go-home-button'
          content='Home'
          onClick={this.leaveSession}
          icon='chevron left'
        />
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
      </div>
    );

    const sessionFooter = (
      <div className='session-footer'>
        <div className='footer-bg'></div>
        <div className='session-info'>
          <div className='session-name'>{sessionName}</div>
          <div className='session-code'>{'Code: ' + code}</div>
        </div>
        <Button
          className='end-question-button'
          content='End Question'
          onClick={this.endQuestion}
        />
        <div className='time-counter'>0:00</div>
      </div>
    );

    return (
      <div className='session'>
        {sessionHeader}
        <div className='session-content'>
          {!polls && emptyStateSection}
          {!sessionName && pollNameSection}
          <div className='question-card'>
            <div className='question-card-header'>
              <div className='question-name'>What is the name of Saturn's largest moon?</div>
              <Button
                className='edit-question-button'
                onClick={this.editQuestion}
              />
            </div>
            <div className='question-instructor-info'>
              <img src={HiddenIcon}></img>
              <div className='hidden-text'>Only you can see results</div>
              <div className='question-votes'>32 votes</div>
            </div>
          </div>
        </div>
        {sessionFooter}
        {showCreatePoll && createPollPopup}
      </div>
    );
  }
}

export default Session;
