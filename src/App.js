import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Navigator from './components/Navigator';
import reducer from './reducer';

class App extends React.Component {
    store = createStore(reducer);

    render() {
        return (
            <Provider store={this.store}>
                <Navigator />
            </Provider>
        );
    }
}

export default App;
