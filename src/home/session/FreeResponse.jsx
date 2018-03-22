import React, { Component } from 'react';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import SubmitButton from './SubmitButton';
import FreeResponseResults from './FreeResponseResults';

class FreeResponse extends Component {
  state = {
    text: '',
    submitted: null,
    open: this.props.open
  }

  onTextChange = (e, { value }) => {
    this.setState({
      text: value
    });
  }

  onSubmit = () => {
    this.props.onSubmit({ choice: this.state.text, text: this.state.text });
    this.setState({ submitted: this.state.text });
  }

  render () {
    const { results, open } = this.props;
    const { text, submitted } = this.state;

    return (
      <div>
        <Input
          fluid
          placeholder='Enter response...'
          value={this.state.text}
          onChange={this.onTextChange}
        />
        <Divider hidden />
        <SubmitButton
          text='Submit'
          onSubmit={this.onSubmit}
          visible
          disabled={!open || !text || text === submitted}
        />
        <Divider hidden />
        {
          results && (
            <div>
              <Header>Responses</Header>
              <FreeResponseResults results={results} submitted={submitted} />
            </div>
          )
        }
      </div>
    );
  }
}

export default FreeResponse;