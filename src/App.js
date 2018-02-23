import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import Home from './home/Home';
import './App.css';

const App = () => (
  <Router>
    <div>
      <Menu pointing secondary>
        <Menu.Item name='home' />
        <Menu.Item name='messages' />
        <Menu.Item name='friends' />
      </Menu>
      <Route exact path='/' component={Home} />
    </div>
  </Router>
)

export default App;
