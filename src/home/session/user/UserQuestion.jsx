import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import MultipleChoice from '../MultipleChoice';
import FreeResponse from '../FreeResponse';

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
        : <FreeResponse
          results={results}
          onSubmit={onSubmit}
          open={open}
        />;

    return (
      <div>
        <Header as='h1'>{question.text}</Header>
        {responseContainer}
      </div>
    );
  }
}

export default UserQuestion;