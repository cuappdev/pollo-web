import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';
import Home from './home/Home';
import './App.css';

class App extends Component {
  state = { activeTab: 'CREATED' }

  handleNavbarTabClick = (e, { name }) => this.setState({ activeTab: name })

  render () {
    const { activeTab } = this.state;
    return (
      <Router>
        <div className='app'>
          <div className='app-header'>
            <div className='header-section'>
              <Header as='h1' className='header-title'>Polls</Header>
              <div className='header-content'>
                <div className='navbar'>
                  <Menu pointing secondary className='navbar-menu'>
                    <Menu.Item
                      content='Created'
                      name='CREATED'
                      active={activeTab == 'CREATED'}
                      onClick={this.handleNavbarTabClick}
                    />
                    <Menu.Item
                      content='Joined'
                      name='JOINED'
                      active={activeTab == 'JOINED'}
                      onClick={this.handleNavbarTabClick}
                    />
                  </Menu>
                </div>
                {/* TODO: Add Join Session */}
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
