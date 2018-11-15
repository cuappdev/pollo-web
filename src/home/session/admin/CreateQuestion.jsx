import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import MultipleChoiceInput from './MultipleChoiceInput';
import './CreateQuestion.css';

class CreateQuestion extends Component {

  state = this.props.initialQuestion || {
    id: null,
    text: '',
    type: 'MULTIPLE_CHOICE',
    options: ['', '']
  }

  handleTypeItemClick = (e, { name }) => {
    this.setState({ type: name });
    this.props.updateQuestion(this.state);
  }

  handleQuestionInputChange = (e, { value }) => {
    this.setState(
      { text: value },
      () => {
        this.props.updateQuestion(this.state);
      }
    );
  }

  handleOptionNew = () => {
    this.setState(
      { options: this.state.options.concat(['']) },
      () => {
        this.props.updateQuestion(this.state);
      }
    );
  }

  handleOptionChange = (value, i) => {
    let { options } = this.state;
    options[i] = value;
    this.setState(
      { options: options },
      () => {
        this.props.updateQuestion(this.state);
      }
    );
  }

  handleOptionDelete = (i) => {
    let { options } = this.state;
    if (options.length > 2) {
      options.splice(i, 1);
      this.setState({ options: options });
      this.props.updateQuestion(this.state);
    }
  }

  render () {
    const { text, type, options } = this.state;

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
