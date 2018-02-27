import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import MultipleChoice from './MultipleChoice';

class Question extends Component {
  render () {
    const { question } = this.props;
    console.log('Question:', question);

    const responseContainer =
      question.type === 'MULTIPLE_CHOICE'
        ? <MultipleChoice options={question.options} onSubmit={this.props.onSubmit} />
        : 'FREE RESPONSE';

    return (
      <div>
        <Header>{question.text}</Header>
        {responseContainer}
      </div>
    );
  }
}

export default Question;