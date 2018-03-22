import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import MultipleChoice from '../MultipleChoice';

class UserQuestion extends Component {
  render () {
    const { question, results, onSubmit, open } = this.props;

    const responseContainer =
      question.type === 'MULTIPLE_CHOICE'
        ? <MultipleChoice
          results={results}
          options={question.options}
          onSubmit={onSubmit}
          selectionDisabled={!open}
          open={open}
        />
        : 'FREE RESPONSE';

    return (
      <div>
        <Header>{question.text}</Header>
        {responseContainer}
      </div>
    );
  }
}

export default UserQuestion;