import React, { Component } from 'react';
import SubmitButton from '../SubmitButton';
import AnswerChoice from '../AnswerChoice';
import { colName, colIndex } from '../../../utils/functions';
import './MultipleChoice.css';

class MultipleChoice extends Component {
  state = {
    selected: null,
    submitted: null
  }

  onChoiceClick = (i) => {
    if (!this.props.results) {
      if (this.state.selected === i ) this.setState({ selected: null, submitted: null });
      else this.setState({ selected: i });
    }
  }

  onSubmit = () => {
    if (this.state.selected !== null) {
      this.props.onSubmit(this.state.selected);
      this.setState({ submitted: this.state.selected });
    }
  }

  render () {
    const { options, results } = this.props;
    const { selected, submitted } = this.state;

    const reducer = (acc, curr) => acc + results[curr];
    const totalAnswers = results && Object.keys(results).reduce(reducer, 0);

    const rightSubtitle = (i) => {
      if (results) {
        const count = results[colIndex(i)] || 0;
        return `${count} ${count === 1 ? 'answer' : 'answers'}`;
      } else if (submitted === i) {
        return 'Submitted!';
      } else {
        return '';
      }
    };

    const width = (i) => {
      if (results) {
        return 100 * results[colIndex(i)] / parseFloat(totalAnswers);
      } else {
        return 0;
      }
    };

    const selections = options.map((option, i) =>
      <AnswerChoice
        as='li'
        key={i}
        onClick={() => this.onChoiceClick(i)}
        selected={selected === i}
        className='answer-choice'
        letter={colName(i)}
        rightSubtitle={rightSubtitle(i)}
        tallyPercentage={width(i)}
        text={option}
      />
    );

    return (
      <ol className='answer-choice-list'>
        {selections}
        <SubmitButton
          visible={selected !== null && selected !== submitted}
          onSubmit={this.onSubmit}
          text={ submitted ? 'Change Submission' : 'Submit' } />
      </ol>
    );
  }
}

export default MultipleChoice;