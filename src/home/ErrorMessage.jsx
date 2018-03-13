import React from 'react';
import { Message } from 'semantic-ui-react';

const ErrorMessage = (props) => {
  if (!props.error) return null;
  return (
    <Message negative size='tiny'>
      <p>{props.error}</p>
    </Message>
  );
};

export default ErrorMessage;