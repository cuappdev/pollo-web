import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import SubmitButton from './SubmitButton';
import { colName } from '../../utils/functions';
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
      this.props.onSubmit(this.props.options[this.state.selected]);
      this.setState({ submitted: this.state.selected });
    }
  }

  render () {
    const { options } = this.props;
    const { selected, submitted } = this.state;

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
      </Segment>
    );

    return (
      <ol className='answer-choice-list'>
        {selections}
        <SubmitButton
          visible={selected !== null}
          onSubmit={this.onSubmit}
          submitted={selected === submitted && submitted !== null} />
      </ol>
    );
  }
}

export default MultipleChoice;