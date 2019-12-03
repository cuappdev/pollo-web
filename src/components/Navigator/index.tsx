import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomeView from '../HomeView';

const Navigator: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={HomeView} />
                <Route exact path="/export" component={HomeView} />
            </Switch>
        </BrowserRouter>
    );
};

export default Navigator;
