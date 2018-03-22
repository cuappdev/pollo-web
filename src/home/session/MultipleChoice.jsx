import React, { Component } from 'react';
import SubmitButton from './SubmitButton';
import AnswerChoice from './AnswerChoice';
import { colName, colIndex } from '../../utils/functions';
import './MultipleChoice.css';

class MultipleChoice extends Component {
  state = {
    selected: null,
    submitted: null,
    open: this.props.open
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      this.setState({
        selected: null,
        submitted: null,
        open: false
      });
    }
  }

  onChoiceClick = (i) => {
    if (this.state.selected === i ) this.setState({ selected: null });
    else this.setState({ selected: i });
  }

  onSubmit = () => {
    if (this.state.selected !== null) {
      this.props.onSubmit({ 'choice': colName(this.state.selected) });
      this.setState({ submitted: this.state.selected });
    }
  }

  render () {
    const { options, results, selectionDisabled } = this.props;
    const { selected, submitted } = this.state;

    const reducer = (acc, curr) => acc + results[curr].count;
    const totalAnswers = results && Object.keys(results).reduce(reducer, 0);

    const rightSubtitle = (i) => {
      let subtitle = submitted === i ? 'Submitted' : '';

      if (results) {
        const result = results[colIndex(i)];
        const count = result ? result.count : 0;
        subtitle += submitted === i ? ' | ' : '';
        subtitle += `${count} ${count === 1 ? 'answer' : 'answers'}`;
      }

      return subtitle;
    };

    const width = (i) => {
      if (results) {
        const result = results[colIndex(i)];
        return result ? 100 * result.count / parseFloat(totalAnswers) : 0;
      } else {
        return 0;
      }
    };

    const selections = options.map((option, i) =>
      <AnswerChoice
        as='li'
        key={i}
        onClick={!selectionDisabled ? (() => this.onChoiceClick(i)) : undefined}
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
          text={ submitted !== null ? 'Change Submission' : 'Submit' } />
      </ol>
    );
  }
}

export default MultipleChoice;