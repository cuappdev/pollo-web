import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import SubmitButton from './SubmitButton';
import { colName, colIndex } from '../../utils/functions';
import './MultipleChoice.css';

class MultipleChoice extends Component {
  state = {
    selected: null,
    submitted: null
  }

  onChoiceClick = (i) => {
    if (this.state.selected === i ) this.setState({ selected: null, submitted: null });
    else this.setState({ selected: i });
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
        const count = results[colIndex(i)];
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
      <Segment
        as='li'
        key={i}
        onClick={() => this.onChoiceClick(i)}
        color={selected === i ? 'blue' : null}
        className='answer-choice'
      >
        <Header
          color={selected === i ? 'blue' : 'grey'}
          floated='left'
          size='small'
          className='answer-choice-letter'
        >
          {colName(i)}
        </Header>
        {option}
        <Header
          color={selected === i ? 'blue' : 'grey'}
          floated='right'
          size='small'
        >
          {rightSubtitle(i)}
        </Header>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${width(i)}%`, backgroundColor: 'rgba(66, 133, 244, 0.2)' }} />
      </Segment>
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