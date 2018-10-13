import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'semantic-ui-react';
import CreateQuestion from './CreateQuestion';
import AdminLiveQuestion from './AdminLiveQuestion';
import AdminEndedPoll from './AdminEndedPoll';
import Timer from '../../Timer';
import './AdminSession.css';
import {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
  createPoll
} from '../../../utils/requests';
import { colName } from '../../../utils/functions';

class AdminSession extends Component {
  socket = this.props.socket
  state = {
    question: null,
    results: null,
    editingQuestion: null,
    ended: false,
    type: 'MULTIPLE_CHOICE', // TODO: replace with question.type
    drafts: null,
    shared: false,
    showCreatePoll: true,
    showDrafts: false,
    showLiveQuestion: false,
    showEndedPoll: false,
  }

  // componentDidMount () {
  //   this.socket.on('admin/poll/updateTally', (data) => {
  //     this.setState({
  //       results: data.results
  //     });
  //   });
  //   console.log('results', this.state.results);
  // }

  /* Socket Functions */

  handleStartQuestion(question) {
    var poll = question;
    if (poll === null) {
      poll = {
        id: null,
        text: '',
        type: 'MULTIPLE_CHOICE',
        options: ['', '']
      };
    }
    poll.options.map((item, i) => !item ? colName(i) : item);
    this.setState({ question: poll,
      results: {},
      editingQuestion: poll,
      showCreatePoll: false,
      showLiveQuestion: true,
    });

    const questionData = poll.type === 'MULTIPLE_CHOICE' ? poll : {
      ...poll,
      options: undefined
    };

    console.log('start question');
    console.log('this.state.question', this.state.question);
    console.log('poll', poll);

    this.socket.emit('server/poll/start', questionData);
  }

  handleShareQuestion = () => {
    this.socket.emit('server/poll/results');
    this.setState({shared:true});
  }

  handleEndQuestion = () => {
    this.socket.emit('server/poll/end');
    this.setState({
      ended: true,
      showLiveQuestion: false,
      showEndedPoll: true,
    });
    createPoll(this.props.session, this.state.question.text, this.state.results,
      this.state.type, this.state.shared)
      .then(data => console.log(data));
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
    console.log('start question');
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
        this.setState({ drafts: drafts });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveDraft = () => {
    const { id, text, options } = this.state.question;

    if (id) { // Update old draft
      updateDraft(id, text, options)
        .then((draft) => {
        // TODO: Show UI message that draft was saved
          this.updateDrafts();
        })
        .catch((err) => {
          console.log(err);
        });
    } else { // Create new draft
      createDraft(text, options)
        .then((draft) => {
        // TODO: Show UI message that draft was created
          this.updateDrafts();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  selectDraft = (i) => {
    const { id, text, options } = this.state.drafts[i];
    const type = 'MULTIPLE_CHOICE'; // TODO: Handle free response

    this.setState({ question: { id: id, text: text, type: type, options: options } });
    this.hideDrafts();
  }

  // TODO: Show more options than just deleting draft
  deleteDraft = (i) => {
    const { question } = this.state;
    const draftId = this.state.drafts[i].id;
    deleteDraft(draftId)
      .then((data) => {
        if (question && draftId == question.id) {
          this.setState({ question: null });
        }
        this.updateDrafts();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render () {
    const { question, results, editingQuestion, ended, type,
      drafts, showCreatePoll, showDrafts, showLiveQuestion, showEndedPoll } = this.state;

    const questionTypes = [
      { value: 'MULTIPLE_CHOICE', text: 'Multiple Choice' },
      { value: 'FREE_RESPONSE', text: 'Free Response' }
    ];

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
                initialQuestion={question}
                updateQuestion={this.updateQuestion}
              />
            </div>
            <div className='popup-footer'>
              <Button className='save-draft popup-button' onClick={this.saveDraft}>Save as draft</Button>
              <Button className='start-question popup-button' onClick={() => this.handleStartQuestion(question)}>Start question</Button>
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
        { showLiveQuestion &&
          <div>
            <div className='poll popup'>
              <AdminLiveQuestion
                question={this.state.question}
                results={this.state.results}
                handleShare={this.handleShareQuestion}
                handleEnd={this.handleEndQuestion}
                handleNew={this.handleNewQuestion}
                startTimer={this.startTimer}
                ended={this.state.ended} />
            </div>
            <Timer />
          </div>
        }
        { showEndedPoll &&
          <div className='poll popup'>
            <AdminEndedPoll
              question={this.state.question}
              results={this.state.results}
              handleShare={this.handleShareQuestion}
              handleNew={this.handleNewQuestion}
              handleDismiss={this.dismissCreatePoll}
            />
          </div>
        }
      </div>
    );
  }
}

export default AdminSession;
