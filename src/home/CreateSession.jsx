import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import ErrorMessage from './ErrorMessage';

class CreateSession extends Component {
  render () {
    const { error, loading, onCreate } = this.props;
    return (
      <div>
        <ErrorMessage error={error} />
        <Button primary fluid
          content='Create New Session'
          size='big'
          onClick={onCreate}
          loading={loading}
        />
      </div>
    );
  }
}

export default CreateSession;