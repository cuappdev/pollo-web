import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Question from './Question';
import { colName } from '../../utils/functions';

class UserSession extends Component {
  state = {
    question: null,
    results: null
  }

  socket = this.props.socket

  componentDidMount () {
    this.socket.on('user/question/start', (data) => {
      this.setState({ question: data.question });
    });

    this.socket.on('user/question/results', (data) => {
      this.setState({ results: data.results });
    });

    this.socket.on('user/question/end', (data) => {
      this.setState({ question: null, results: null });
    });
  }

  sendAnswer = (answer) => {
    this.socket.emit('server/question/tally', {
      deviceId: localStorage.getItem('deviceId'),
      question: this.state.question.id,
      data: colName(answer)
    });
  }

  render () {
    const { question, results } = this.state;
    return question
      ? (<Question question={question} results={results} onSubmit={this.sendAnswer} />)
      : (<Header textAlign='center' color='grey'>Please wait for the instructor.</Header>
      );
  }
}

export default UserSession;