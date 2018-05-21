import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import ErrorMessage from './ErrorMessage';
import './CreateSession.css';

class CreateSession extends Component {
  render () {
    const { error, loading, onCreate } = this.props;
    return (
      <div className='create-session-container'>
        <ErrorMessage error={error} />
        <Button
          className='create-session-button'
          content='Create New Session'
          onClick={onCreate}
          loading={loading}
        />
      </div>
    );
  }
}

export default CreateSession;
