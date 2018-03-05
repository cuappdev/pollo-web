import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

class AnswerChoice extends Component {
  render () {
    const {
      letter,
      onClick,
      rightSubtitle,
      selected,
      tallyPercentage,
      text
    } = this.props;

    return (
      <Segment
        as='li'
        color={selected ? 'blue' : null}
        className='answer-choice'
        onClick={onClick}
      >
        <Header
          color={selected ? 'blue' : 'grey'}
          floated='left'
          size='small'
          className='answer-choice-letter'
        >
          {letter}
        </Header>
        {text}
        <Header
          color={selected ? 'blue' : 'grey'}
          floated='right'
          size='small'
        >
          {rightSubtitle}
        </Header>
        <div className='tallyBar'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: tallyPercentage + '%',
            backgroundColor: 'rgba(66, 133, 244, 0.2)'
          }}
        />
      </Segment>
    )
  }
}

export default AnswerChoice;