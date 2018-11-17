import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import MemberQuestion from './MemberQuestion';

interface Props {
  socket: any,
}

interface State {
  question: null,
  results: null,
  open: null,
}

class MemberSession extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.socket = props.socket;
    this.state = {
      question: null,
      results: null,
      open: null
    };
  }

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
    console.log(answer);
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
        <MemberQuestion
          question={question}
          results={results}
          onSubmit={this.sendAnswer}
          open={open}
        />
      ) : (
        <Header textAlign='center' color='grey'>
          Please wait for the instructor.
        </Header>
      );
  }
}

export default MemberSession;
