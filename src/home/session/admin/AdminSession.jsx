import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import CreateQuestion from './CreateQuestion';
import AdminQuestion from './AdminQuestion';
import './AdminSession.css';
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft
} from '../../../utils/requests';

class AdminSession extends Component {
  socket = this.props.socket
  state = {
    question: null,
    results: null,
    editingQuestion: null,
    ended: false,
    type: 'MULTIPLE_CHOICE', // TODO: replace with question.type
    drafts: null,
    showCreatePoll: true,
    showDrafts: false
  }

  componentDidMount () {
    this.socket.on('admin/poll/updateTally', (data) => {
      this.setState({
        results: data.results
      });
    });
  }

  /* Socket Functions */

  handleStartQuestion = (question) => {
    this.setState({ question: question, results: {}, editingQuestion: question });

    const questionData = question.type === 'MULTIPLE_CHOICE' ? question : {
      ...question,
      options: undefined
    };

    this.socket.emit('server/poll/start', questionData);
  }

  handleShareQuestion = () => {
    this.socket.emit('server/poll/results');
  }

  handleEndQuestion = () => {
    this.socket.emit('server/poll/end');
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

  startQuestion = () => {
    console.log("start question");
    console.log(this.state.question);
  }

  updateQuestion = (question) => {
    this.setState({ question: question });
  }

  dismissCreatePoll = () => {
    this.props.dismissCreatePoll(false);
  }

  /* Draft Functions */

  showDrafts = () => {
    this.setState({ showDrafts: true });
    this.setState({ showCreatePoll: false });
  }

  hideDrafts = () => {
    this.setState({ showDrafts: false });
    this.setState({ showCreatePoll: true });
  }

  updateDrafts = () => {
    getDrafts()
    .then((drafts) => {
      console.log(drafts);
      this.setState({ drafts: drafts });
      console.log("Drafts");
      console.log(this.state.drafts);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  saveDraft = () => {
    const { text, options } = this.state.question;

    // Create new draft or update old draft
    createDraft(text, options)
    .then((draft) => {
      // TODO: Show UI message that draft was saved
      console.log("draft saved");
      this.updateDrafts();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  selectDraft = (i) => {
    console.log("select draft " + i);
    // TODO: Populate old draft
  }

  // TODO: Show more options than just deleting draft
  deleteDraft = (i) => {
    deleteDraft(this.state.drafts[i].id)
    .then((data) => {
      this.updateDrafts();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render () {
    const { question, results, editingQuestion, ended, type, drafts, showCreatePoll, showDrafts } = this.state;

    const questionTypes = [
      { value: 'MULTIPLE_CHOICE', text: 'Multiple Choice' },
      { value: 'FREE_RESPONSE', text: 'Free Response' }
    ]

    if (!drafts) {
      this.updateDrafts();
    }

    const numDrafts = drafts ? drafts.length : 0;
    const draftElements = drafts ? (drafts.map((draft, i) =>
      <li className='draft-cell' key={i}>
        <Button
          content={(draft.text == '') ? 'Untitled' : draft.text}
          className='select-draft-button'
          onClick={() => this.selectDraft(i)}
        />
        <Button
          className='draft-button'
          onClick={() => this.deleteDraft(i)}
        />
      </li>
    )) : (
      <div />
    );

    return (
      <div className='popup-section'>
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
                content={`Drafts (${numDrafts})`}
                onClick={this.showDrafts}
              />
            </div>
            <div className='popup-content'>
              <CreateQuestion
                initialQuestion={editingQuestion}
                updateQuestion={this.updateQuestion}
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
            <div className='bg-overlay'></div>
            <div className='drafts-popup-header'>
              <Button
                className='drafts-back-button'
                onClick={this.hideDrafts}
              />
              <div className='drafts-title'>Drafts</div>
            </div>
            <ul className='drafts-popup-content'>{draftElements}</ul>
          </div>
        }
      </div>
    )
  }
}

export default AdminSession;
