import React, { Component } from 'react';
import { Icon, Button, Menu, Input } from 'semantic-ui-react';
import UserSession from './user/UserSession';
import AdminSession from './admin/AdminSession';
import io from 'socket.io-client';
import './Session.css';
import EmptyMonkeyIcon from '../../assets/EmptyMonkeyIcon.png'
import HiddenIcon from '../../assets/HiddenIcon.png'
import { updateSession } from '../../utils/requests';
import { hostURL } from '../../utils/constants';

class Session extends Component {
  socket = io(`${hostURL}/${this.props.session.id}`);

  state = {
    session: this.props.session,
    activeTab: 'Q & A',
    sessionInput: '',
    showCreatePoll: false,
    question: null,
    results: null,
    editingQuestion: null,
    ended: false
  }

  componentDidMount () {
    this.socket.on('disconnect', () => {
      this.props.onDisconnect();
    });
  }

  componentWillUnmount () {
    this.socket.close();
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
    // TODO: Add data validation for empty names
    if (key === 'Enter') {
      const { id, code } = this.state.session;
      const newSessionName = this.state.sessionInput;

      updateSession(id, newSessionName, code)
      .then((newSession) => {
        this.setState({ session: newSession });
      })
      .catch((err) => {
        console.log(err);
      });
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
    this.props.leaveSession();
    this.socket.disconnect();
  }

  render () {
    const { session, activeTab, sessionInput, showCreatePoll, question, results, editingQuestion, ended } = this.state;
    const { id, name, code } = session;

    // FIX: Dummy values for integrating UI
    var userType = 'admin';
    var polls = null;

    console.log(this.socket);

    const emptyStateSection = (
      <div className={`empty-state ${name ?  '' : 'blur'}`}>
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
      <div>
        <div className='screen-darken'></div>
        <AdminSession socket={this.socket} dismissCreatePoll={this.dismissCreatePoll} />
      </div>
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

    const questionCard = (
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
    );

    const sessionFooter = (
      <div className='session-footer'>
        <div className='footer-bg'></div>
        <div className='session-info'>
          <div className='session-name'>{name ? name : 'Untitled'}</div>
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
          {!name && pollNameSection}
          {polls && questionCard}
        </div>
        {sessionFooter}
        {showCreatePoll && createPollPopup}
      </div>
    );
  }
}

export default Session;
