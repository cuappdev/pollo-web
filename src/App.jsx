import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';
import Home from './home/Home';
import './App.css';

class App extends Component {

  render () {
    return (
      <Router>
        <Route exact path='/' component={Home} />
      </Router>
    );
  }
}

export default App;
