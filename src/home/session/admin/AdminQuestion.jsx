import React, { Component } from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import MultipleChoice from '../MultipleChoice';
import FreeResponseResults from '../FreeResponseResults';

class AdminQuestion extends Component {
  render () {
    const { question, results, handleShare, handleEnd, handleNew, ended } = this.props;

    const questionContainer = question.type === 'MULTIPLE_CHOICE'
      ? (
        <MultipleChoice options={question.options} results={results} selectionDisabled />
      ) : (
        <FreeResponseResults results={results} />
      );

    return (
      <div>
        <Header as='h1'>{question.text}</Header>
        <Divider hidden />
        <Header>Responses</Header>
        {questionContainer}
        <Divider />
        <Button primary fluid onClick={handleShare}>Share Results</Button>
        <Divider hidden />
        <Button negative fluid disabled={ended} onClick={handleEnd}>End Question</Button>
        <Divider hidden />
        {ended && <Button color='blue' fluid onClick={handleNew}>New Question</Button>}
      </div>
    );
  }
}

export default AdminQuestion;