import React, { Component } from 'react';
import AnswerChoice from './AnswerChoice';
import { Header } from 'semantic-ui-react';

class FreeResponseResults extends Component {
  render () {
    const { results, submitted } = this.props;

    const reducer = (acc, curr) => acc + results[curr].count;
    const totalAnswers = results && Object.keys(results).reduce(reducer, 0);

    const rightSubtitle = (response) => {
      let subtitle = submitted === response.text ? 'Submitted' : '';

      if (results) {
        const count = response.count;
        subtitle += submitted === response.text ? ' | ' : '';
        subtitle += `${count} ${count === 1 ? 'answer' : 'answers'}`;
      }

      return subtitle;
    };

    const width = (response) => {
      if (results) {
        return response ? 100 * response.count / parseFloat(totalAnswers) : 0;
      } else {
        return 0;
      }
    };

    const responses = Object.keys(results).map((result, i) => {
      const response = results[result];
      return (
        <AnswerChoice
          key={i}
          rightSubtitle={rightSubtitle(response)}
          tallyPercentage={width(response)}
          text={response.text}
        />
      );
    });

    return (
      <ol className='answer-choice-list'>
        {
          responses.length === 0
            ? <Header textAlign='center' color='grey'>No responses yet.</Header>
            : responses
        }
      </ol>
    );
  }
}

export default FreeResponseResults;