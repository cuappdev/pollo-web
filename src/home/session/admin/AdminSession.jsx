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
    drafts: [],
    showCreatePoll: true,
    showDrafts: false
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
    this.setState({ showDrafts: true });
    this.setState({ showCreatePoll: false });
  }

  hideDrafts = () => {
    this.setState({ showDrafts: false });
    this.setState({ showCreatePoll: true });
  }

  saveDraft = () => {
    console.log("save draft");
  }

  startQuestion = () => {
    console.log("start question");
  }

  dismissCreatePoll = () => {
    this.props.dismissCreatePoll(false);
  }

  render () {
    const { question, results, editingQuestion, ended, type, drafts, showCreatePoll, showDrafts } = this.state;

    const questionTypes = [
      { value: 'MULTIPLE_CHOICE', text: 'Multiple Choice' },
      { value: 'FREE_RESPONSE', text: 'Free Response' }
    ]

    return (
      <div className='popup-section'>
        <div className='bg-overlay'></div>
        { showCreatePoll &&
          <div className='create-poll popup'>
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
            <div className='popup-content'>
              <CreateQuestion
                initialQuestion={editingQuestion}
                handleStart={this.handleStartQuestion}
              />
            </div>
            <div className='popup-footer'>
              <Button className='save-draft popup-button' onClick={this.saveDraft}>Save as draft</Button>
              <Button className='start-question popup-button' onClick={this.startQuestion}>Start question</Button>
            </div>
          </div>
        }
        { showDrafts &&
          <div className='drafts popup'>
            <div className='drafts-popup-header'>
              <Button
                className='drafts-back-button'
                onClick={this.hideDrafts}
              />
              <div className='drafts-title'>Drafts</div>
            </div>
            <div className='drafts-popup-content'></div>
          </div>
        }
      </div>
    )
  }
}

export default AdminSession;
