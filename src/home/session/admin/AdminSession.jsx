import React, { Component } from 'react';
import CreateQuestion from './CreateQuestion';
import AdminQuestion from './AdminQuestion';

class AdminSession extends Component {
  socket = this.props.socket
  state = {
    question: null,
    results: null,
    editingQuestion: null,
    ended: false
  }

  componentDidMount () {
    this.socket.on('admin/question/updateTally', (data) => {
      this.setState({
        results: data.results
      });
    });
  }

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

  render () {
    const { question, results, editingQuestion, ended } = this.state;

    return question
      ? (
        <AdminQuestion
          question={question}
          results={results}
          handleShare={this.handleShareQuestion}
          handleEnd={this.handleEndQuestion}
          handleNew={this.handleNewQuestion}
          ended={ended}
        />
      ) : (
        <CreateQuestion
          initialQuestion={editingQuestion}
          handleStart={this.handleStartQuestion}
        />
      );
  }
}

export default AdminSession;