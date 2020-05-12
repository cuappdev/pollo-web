import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PollingApp from '../PollingApp';

const Navigator: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PollingApp} />
            </Switch>
        </BrowserRouter>
    );
};

export default Navigator;
