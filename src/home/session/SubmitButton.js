import React, { Component } from 'react';
import { Button, Transition } from 'semantic-ui-react';

class SubmitButton extends Component {
  render () {
    const { submitted } = this.props;

    const submit =
      <Button
        fluid
        color='blue'
        size='large'
        disabled={submitted}
        onClick={this.props.onSubmit}
      >
        {submitted ? 'Submitted!' : 'Submit'}
      </Button>;

    return (
      <Transition.Group animation='fade up' duration={200}>
        {this.props.visible && submit}
      </Transition.Group>
    );
  }
}

export default SubmitButton;