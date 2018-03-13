import React, { Component } from 'react';
import CreateQuestion from './CreateQuestion';
import AdminQuestion from './AdminQuestion';

class AdminSession extends Component {
  socket = this.props.socket
  state = {
    question: null,
    results: null,
    editingQuestion: null
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
    this.socket.emit('server/question/start', question);
  }

  handleShareQuestion = () => {
    this.socket.emit('server/question/results');
  }

  handleEndQuestion = () => {
    this.socket.emit('server/question/end');
    this.setState({
      question: null,
      results: null
    });
  }

  render () {
    const { question, results, editingQuestion } = this.state;

    return question
      ? (
        <AdminQuestion
          question={question}
          results={results}
          handleShare={this.handleShareQuestion}
          handleEnd={this.handleEndQuestion}
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