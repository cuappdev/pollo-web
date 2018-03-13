import React, { Component } from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import MultipleChoice from '../MultipleChoice';

class AdminQuestion extends Component {
  render () {
    const { question, results, handleShare, handleEnd } = this.props;

    const questionContainer = question.type === 'MULTIPLE_CHOICE'
      ? (
        <div>
          <MultipleChoice options={question.options} results={results} selectionDisabled />
          <Divider />
          <Button color='blue' fluid onClick={handleShare}>Share Results</Button>
          <Divider hidden />
          <Button negative fluid onClick={handleEnd}>End Question</Button>
        </div>
      ) : (
        <p>Free response question</p>
      );

    return (
      <div>
        <Header>{question.text}</Header>
        <Divider hidden />
        {questionContainer}
      </div>
    );
  }
}

export default AdminQuestion;