import React, { Component } from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import MultipleChoice from '../MultipleChoice';
import FreeResponseResults from '../FreeResponseResults';
import './AdminLiveQuestion.css';

class AdminLiveQuestion extends Component {

  render () {
    const { question, results, handleEnd } = this.props;

    const questionContainer = question.type === 'MULTIPLE_CHOICE'
      ? (
        <MultipleChoice options={question.options} results={results} selectionDisabled />
      ) : (
        <FreeResponseResults results={results} />
      );

    console.log('question:', this.props.question);

    //TODO:end question button styling
    return (
      <div>
        <div className='popup-content'>
          <Header as='h1'>{question.text}</Header>
          <Divider hidden />
          <Header>Responses</Header>
          {questionContainer}
          <Divider />
        </div>
        <div className='popup-footer'>
          <Button className='start-question popup-button' onClick={handleEnd}>End Question</Button>
        </div>
      </div>
    );
  }
}

export default AdminLiveQuestion;
