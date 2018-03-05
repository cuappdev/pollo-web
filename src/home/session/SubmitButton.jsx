import React, { Component } from 'react';
import { Button, Transition } from 'semantic-ui-react';

class SubmitButton extends Component {
  render () {
    const { text, onSubmit, visible } = this.props;

    const submit =
      <Button
        fluid
        color='blue'
        size='large'
        onClick={onSubmit}
      >
        {text}
      </Button>;

    return (
      <Transition.Group animation='fade up' duration={200}>
        {visible && submit}
      </Transition.Group>
    );
  }
}

export default SubmitButton;