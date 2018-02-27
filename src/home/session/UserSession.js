import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Question from './Question';

class UserSession extends Component {
  state = {
    question: null
  }

  socket = this.props.socket

  componentDidMount () {
    this.socket.on('user/question/start', (data) => {
      this.setState({ question: data.question });
    });

    this.socket.on('user/question/end', (data) => {
      this.setState({ question: null });
    });
  }

  sendAnswer = (answer) => {
    this.socket.emit('server/question/tally', {
      deviceId: localStorage.getItem('deviceId'),
      question: this.state.question.id,
      data: answer
    });
  }

  render () {
    return this.state.question === null
      ? (<Header textAlign='center' color='grey'>Please wait for the instructor.</Header>)
      : (<Question question={this.state.question} onSubmit={this.sendAnswer}></Question>);
  }
}

export default UserSession;