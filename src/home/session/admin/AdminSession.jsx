import React, { Component } from 'react';
import CreateQuestion from './CreateQuestion';

class AdminSession extends Component {
  socket = this.props.socket
  state = {
    question: null
  }

  componentDidMount () {
    this.socket.on('admin/question/updateTally', (data) => {
      console.log(data);
    });
  }

  handleStartQuestion = (question) => {
    this.setState({ question: question });
    this.socket.emit('server/question/start', question);
  }

  render () {
    const { question } = this.state;

    return question
      ? <p>Question started</p>
      : (
        <CreateQuestion
          handleStart={this.handleStartQuestion}
        />
      );
  }
}

export default AdminSession;