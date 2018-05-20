import React, { Component } from 'react';
import { Button, Icon, Input } from 'semantic-ui-react';
import { colName } from '../../../utils/functions';
import './MultipleChoiceInput.css';

class MultipleChoiceInput extends Component {

  render () {
    const { handleNew, handleChange, handleDelete, options } = this.props;
    const optionSegments = options.map((option, i) =>
      <Input
        fluid
        key={i}
        as='li'
        placeholder={'Option ' + colName(i)}
        value={option}
        onChange={(e, { value}) => handleChange(value, i)}
        action={
          options.length > 2
          && { icon: 'trash outline', onClick: () => handleDelete(i) }
        }
        className='multiple-choice-input'
      />
    );

    optionSegments.push(
      <Button
        className='add-option-button'
        fluid
        as='li'
        key={optionSegments.length}
        onClick={handleNew}
      >
        + Add Option
      </Button>
    );

    return (
      <ul className='multiple-choice-input-list'>
        {optionSegments}
      </ul>
    );
  }
}

export default MultipleChoiceInput;
