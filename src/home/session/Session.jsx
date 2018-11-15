import React, { Component } from 'react';
import { Button, Menu, Input } from 'semantic-ui-react';
import AdminSession from './admin/AdminSession';
import io from 'socket.io-client';
import './Session.css';
import EmptyMonkeyIcon from '../../assets/EmptyMonkeyIcon.png';
import HiddenIcon from '../../assets/HiddenIcon.png';
import { updateSession, getPollsForSession } from '../../utils/requests';
import { hostURL } from '../../utils/constants';

//TODO: restrict screen size (if minimize screen a lot, the icons overlap)

class Session extends Component {
  socket = io(`${hostURL}/${this.props.session.id}`);

  state = {
    session: this.props.session,
    activeTab: 'Q & A',//TODO:active tab?
    sessionInput: '',
    showCreatePoll: false,
    question: null,
    results: null,
    editingQuestion: null,
    ended: false,
    polls: null,
    pollsDate: [],
    selectedDate: null
  }

  componentDidMount () {
    this.socket.on('disconnect', () => {
      this.props.leaveSession();
    });
    getPollsForSession(this.props.session.id)
      .then(data => {
        console.log('set pollsdate', Object.getOwnPropertyNames(data));
        this.setState({
          polls: data,
          pollsDate: Object.getOwnPropertyNames(data)
        });
      });
  }

  componentWillUnmount () {
    this.socket.close();
  }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  createPoll = () => {
    console.log('create a poll');
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
    console.log('edit question');
    // TODO: Show edit question options
  }

  endQuestion = () => {
    console.log('end question');
    // TODO: Call backend endpoint
  }

  handleDateClick = (e, val) => {
    e.preventDefault();
    this.setState({ selectedDate : val.name });
  }

  leaveSession = () => {
    this.props.leaveSession();
    this.socket.disconnect();
  }

  render () {
    const { session, activeTab, sessionInput, showCreatePoll, polls, pollsDate, selectedDate } = this.state;
    const { name, code } = session;

    // TODO: fix dummy values for integrating UI
    console.log(this.socket);

    const emptyStateSection = (
      <div className={`empty-state ${name ?  '' : 'blur'}`}>
        <img src={EmptyMonkeyIcon} alt="No Polls"></img>
        <div className='empty-state-title'>Nothing to see here.</div>
        <div className='empty-state-subtitle'>You haven’t made any polls yet! Try it out above.</div>
      </div>
    );

    // TODO:enable closing out of naming to cancel creating session
    // TODO:implement button to click on to name session? (not super intuitive to press enter)
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
        <AdminSession socket={this.socket} session={this.state.session.id} dismissCreatePoll={this.dismissCreatePoll} />
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
              active={activeTab === 'Q & A'}
              onClick={this.handleNavbarTabClick}
            />
            <Menu.Item
              content='Review'
              name='REVIEW'
              active={activeTab === 'REVIEW'}
              onClick={this.handleNavbarTabClick}
            />
          </Menu>
        </div>
        <Button className='create-poll-button' primary onClick={this.createPoll}>Create a poll</Button>
      </div>
    );

    const pollCard = (
      <div className='poll-card-continer'>
        <div className='poll-card-dates'>
          {pollsDate.map(date => {
            return (
              <Button key={date} name={date} className={(date===selectedDate ? 'poll-card-dates-button-disabled' : 'poll-card-dates-button')} onClick={this.handleDateClick}>
                <div className='poll-card-dates-date'>
                  {date}
                </div>
                <div className='poll-card-dates-count'>
                  {polls[date].length} Questions
                </div>
              </Button>
            );
          })}
        </div>
        <div className='poll-card-polls'>
          {selectedDate && (
            polls[selectedDate].map(question => {
              return (
                <div className='question-card'>
                  <div className='question-card-header'>
                    <div className='question-name'>{question.text}</div>
                    <Button
                      className='edit-question-button'
                      onClick={this.editQuestion}
                    />
                  </div>
                  <div className='question-instructor-info'>
                    <img alt='' src={HiddenIcon}></img>
                    <div className='hidden-text'>Only you can see results</div>
                  </div>
                  <div className='question-card-content'>
                    {Object.keys(question.results)}
                  </div>
                </div>
              );
            })
          )}
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
      </div>
    );

    return (
      !name ?
        (<div className='session'>
          {pollNameSection}
        </div>)
        :
        (<div className='session'>
          {sessionHeader}
          <div className='session-content'>
            {polls && pollsDate.length === 0 && emptyStateSection}
            {polls && pollsDate.length !== 0 && pollCard}
          </div>
          {sessionFooter}
          {showCreatePoll && createPollPopup}
        </div>)
    );
  }
}

export default Session;
