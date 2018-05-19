import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import ErrorMessage from './ErrorMessage';
import './CreateSession.css';

class CreateSession extends Component {
  render () {
    const { error, loading, onCreate } = this.props;
    return (
      <div>
        <ErrorMessage error={error} />
        <Button primary
          content='Create New Session'
          size='small'
          onClick={onCreate}
          loading={loading}
        />
      </div>
    );
  }
}

export default CreateSession;
