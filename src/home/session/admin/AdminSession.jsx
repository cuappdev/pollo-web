import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import CreateQuestion from './CreateQuestion';
import AdminQuestion from './AdminQuestion';
import './AdminSession.css';

class AdminSession extends Component {
  socket = this.props.socket
  state = {
    question: null,
    results: null,
    editingQuestion: null,
    ended: false,
    type: 'MULTIPLE_CHOICE', // TODO: replace with question.type
    drafts: []
  }

  // componentDidMount () {
  //   this.socket.on('admin/question/updateTally', (data) => {
  //     this.setState({
  //       results: data.results
  //     });
  //   });
  // }

  handleStartQuestion = (question) => {
    this.setState({ question: question, results: {}, editingQuestion: question });

    const questionData = question.type === 'MULTIPLE_CHOICE' ? question : {
      ...question,
      options: undefined
    };

    this.socket.emit('server/question/start', questionData);
  }

  handleShareQuestion = () => {
    this.socket.emit('server/question/results');
  }

  handleEndQuestion = () => {
    this.socket.emit('server/question/end');
    this.setState({
      ended: true
    });
  }

  handleNewQuestion = () => {
    this.setState({
      question: null,
      results: null,
      ended: false
    });
  }

  handleQuestionTypeClick = (e, { val }) => this.setState({ type: val })

  showDrafts = () => {
    console.log("show drafts");
  }

  dismissCreatePoll = () => {
    this.props.dismissCreatePoll(false);
  }

  render () {
    const { question, results, editingQuestion, ended, type, drafts } = this.state;

    const questionTypes = [
      { value: 'MULTIPLE_CHOICE', text: 'Multiple Choice' },
      { value: 'FREE_RESPONSE', text: 'Free Response' }
    ]

    return (
      <div className='create-poll-section'>
        <div className='bg-overlay'></div>
        <div className='create-poll-popup'>
          <div className='popup-header'>
            <Button
              className='dismiss-button'
              onClick={this.dismissCreatePoll}
            />
            <Dropdown
              className='question-dropdown'
              onChange={this.handleQuestionTypeClick}
              options={questionTypes}
              selection
              value={type}
            />
            <Button
              className='drafts-button'
              onClick={this.showDrafts}
            >{'Drafts (' + drafts.length + ')'}</Button>
          </div>
          <div className='popup-content'></div>
          <div className='popup-footer'></div>
        </div>
      </div>
    )
  }
}

export default AdminSession;
