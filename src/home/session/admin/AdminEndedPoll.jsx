import React, { Component } from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import MultipleChoice from '../MultipleChoice';
import FreeResponseResults from '../FreeResponseResults';
import './AdminEndedPoll.css';

class AdminEndedPoll extends Component {
  render () {
    const { question, results, handleShare, handleDismiss } = this.props;

    const questionContainer = question.type === 'MULTIPLE_CHOICE'
      ? (
        <MultipleChoice options={question.options} results={results} selectionDisabled />
      ) : (
        <FreeResponseResults results={results} />
      );

    //TODO:share question button styling
    //TODO:send router to share & create a new poll and save to db

    return (
      <div>
        <div className='popup-header'>
          <Button
            className='dismiss-button'
            onClick={handleDismiss}
          />
        </div>
        <div className='popup-content'>
          <Header as='h1'>{question.text}</Header>
          <Divider hidden />
          <Header>Responses</Header>
          {questionContainer}
          <Divider />
        </div>
        <div className='popup-footer'>
          <Button fluid onClick={handleShare}>Share Results</Button>
          <Divider hidden />
        </div>
      </div>
    );
  }
}

export default AdminEndedPoll;
