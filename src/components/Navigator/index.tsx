import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ExportApp from '../ExportApp';
import PollingApp from '../PollingApp';

const Navigator: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PollingApp} />
                <Route exact path="/export" component={ExportApp} />
            </Switch>
        </BrowserRouter>
    );
};

export default Navigator;
