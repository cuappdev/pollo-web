import React, { Component } from 'react';
import { Header, Input, Menu } from 'semantic-ui-react';
import MultipleChoiceInput from './MultipleChoiceInput';
import SubmitButton from '../SubmitButton';
import './CreateQuestion.css';

class CreateQuestion extends Component {

  state = this.props.initialQuestion || {
    text: '',
    type: 'MULTIPLE_CHOICE',
    options: ['', '']
  }

  handleTypeItemClick = (e, { name }) => {
    this.setState({ type: name });
  }

  handleQuestionInputChange = (e, { value }) => {
    this.setState({ text: value });
  }

  handleOptionNew = () => {
    this.setState({
      options: this.state.options.concat([''])
    });
  }

  handleOptionChange = (value, i) => {
    let { options } = this.state;
    options[i] = value;
    this.setState({
      options: options
    });
  }

  handleOptionDelete = (i) => {
    let { options } = this.state;
    if (options.length > 2) {
      options.splice(i, 1);
      this.setState({
        options: options
      });
    }
  }

  render () {
    const { text, type, options } = this.state;
    const { handleStart } = this.props;

    const body = (type === 'MULTIPLE_CHOICE') ? (
      <MultipleChoiceInput
        handleNew={this.handleOptionNew}
        handleChange={this.handleOptionChange}
        handleDelete={this.handleOptionDelete}
        options={options}
      />
    ) : (
      <div />
    );

    return (
      <div>
        <Input
          className='question-input'
          fluid
          placeholder='Ask a question...'
          value={text}
          onChange={this.handleQuestionInputChange}
        />
        {body}
      </div>
    );
  }
}

export default CreateQuestion;
