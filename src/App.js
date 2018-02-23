import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Container, Header, Menu } from 'semantic-ui-react';
import Home from './home/Home';
import './App.css';

class App extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render () {
    const { activeItem } = this.state;
    return (
      <Router>
        <Container>
          <Header as='h1' style={{ paddingTop: '30%' }}>Clicker Web App</Header>
          <Menu pointing secondary>
            <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
            <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
            <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
          </Menu>
          <Route exact path='/' component={Home} />
        </Container>
      </Router>
    );
  }
}

export default App;
