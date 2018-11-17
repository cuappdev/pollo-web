import React, { Component } from 'react';
import { Button, Menu, Input } from 'semantic-ui-react';
import io from 'socket.io-client';

import AdminSession from './admin/AdminSession';
import MemberSession from './member/MemberSession';
import EmptyStateSection from './EmptyStateSection';
import HiddenIcon from '../../assets/HiddenIcon.png';
import { hostURL } from '../../utils/constants';
import { getPollsForSession, updateSession } from '../../utils/requests';

import './SessionPage.css';

//TODO: restrict screen size (if minimize screen a lot, the icons overlap)

interface Props {
  isAdminSession: boolean, // whether or not the session is an admin one
  leaveSession: any,
  session: any,
}

interface State {
  isAdminSession: boolean, // whether or not the session is an admin one
  leaveSession: any,
  session: any,
}

class SessionPage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const userType = props.isAdminSession ? 'admin' : 'member';
    this.socket = io(
      `${hostURL}/${this.props.session.id}`,
      {
        'query': {
          'googleId': localStorage.getItem('googleId'),
          'userType': userType, 
        }
      }
    );

    this.state = {
      activeTab: 'Q & A', // TODO: active tab?
      editingQuestion: null,
      ended: false,
      polls: null,
      pollsDate: [],
      question: null,
      results: null,
      selectedDate: null,
      session: props.session,
      sessionInput: '',
      showCreatePoll: false,
    };
  }

  componentDidMount() {
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

  componentWillUnmount() {
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

  handleDateClick = (e, val) => {
    e.preventDefault();
    this.setState({ selectedDate : val.name });
  }

  leaveSession = () => {
    this.props.leaveSession();
    this.socket.disconnect();
  }

  render () {
    const { isAdminSession } = this.props;
    const { 
      activeTab, 
      polls, 
      pollsDate, 
      results,
      selectedDate,
      session, 
      sessionInput, 
      showCreatePoll, 
    } = this.state;
    const { code, name } = session;

    // TODO: fix dummy values for integrating UI
    console.log(this.socket);

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
        <AdminSession 
          dismissCreatePoll={this.dismissCreatePoll} 
          session={this.state.session.id} 
          socket={this.socket} 
        />
      </div>
    );

    const sessionHeader = (
      <div className='session-header'>
        <Button
          className='go-home-button'
          content='Home'
          icon='chevron left'
          onClick={this.leaveSession}
        />
        <div className='session-navbar'>
          <Menu className='navbar-menu' pointing secondary>
            <Menu.Item
              active={activeTab === 'Q & A'}
              content='Q & A'
              name='Q & A'
              onClick={this.handleNavbarTabClick}
            />
            <Menu.Item
              active={activeTab === 'REVIEW'}
              content='Review'
              name='REVIEW'
              onClick={this.handleNavbarTabClick}
            />
          </Menu>
        </div>
        {isAdminSession && 
            <Button className='create-poll-button' primary onClick={this.createPoll}>Create a poll</Button>}
      </div>
    );

    const pollCard = (
      <div className='poll-card-continer'>
        <div className='poll-card-dates'>
          {pollsDate.map(date => {
            return (
              <Button 
                className={(date===selectedDate ? 'poll-card-dates-button-disabled' : 'poll-card-dates-button')} 
                key={date} 
                name={date} 
                onClick={this.handleDateClick}
              >
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
            {polls && pollsDate.length === 0 && 
                <EmptyStateSection isAdminSession={isAdminSession} />
            }
            {polls && pollsDate.length !== 0 && pollCard}
          </div>
          {sessionFooter}
          {showCreatePoll && createPollPopup}
          {!isAdminSession && 
            <MemberSession
              dismissCreatePoll={this.dismissCreatePoll} 
              results={results} 
              socket={this.socket} 
            />
          }
        </div>)
    );
  }
}

export default SessionPage;
