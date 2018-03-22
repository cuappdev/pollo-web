import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import UserQuestion from './UserQuestion';

class UserSession extends Component {
  state = {
    question: null,
    results: null,
    open: null
  }

  socket = this.props.socket

  componentDidMount () {
    this.socket.on('user/question/start', (data) => {
      this.setState({ question: data.question, results: null, open: true });
    });

    this.socket.on('user/question/results', (data) => {
      this.setState({ results: data.results });
    });

    this.socket.on('user/question/end', () => {
      this.setState({ open: false });
    });
  }

  sendAnswer = (answer) => {
    this.socket.emit('server/question/tally', {
      ...answer,
      deviceId: localStorage.getItem('deviceId'),
      question: this.state.question.id
    });
  }

  render () {
    const { question, results, open } = this.state;

    return question
      ? (
        <UserQuestion
          question={question}
          results={results}
          onSubmit={this.sendAnswer}
          open={open}
        />
      ) : (<Header textAlign='center' color='grey'>Please wait for the instructor.</Header>
      );
  }
}

export default UserSession;