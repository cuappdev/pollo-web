import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import Home from './home/Home';
import './App.css';

class App extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render () {
    const { activeItem } = this.state;
    return (
      <Router>
        <div className='app'>
          <div className='app-header'>
            <Container text className='navbar'>
              <Menu text>
                <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
                <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
                <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
              </Menu>
            </Container>
          </div>
          <Container text className='app-content'>
            <Route exact path='/' component={Home} />
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
