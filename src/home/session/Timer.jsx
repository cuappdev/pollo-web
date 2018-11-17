import React, { Component } from 'react';
import moment from 'moment';

import './Timer.css';

class Timer extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      interval: setInterval(() => this.incrementTimer(), 1000),
      time: 0,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  incrementTimer() {
    this.setState({ time: this.state.time + 1 });
  }

  render () {
    const timeString = moment.utc(this.state.time*1000).format('mm:ss');
    return (
      <div className='time-counter'>
        {timeString}
      </div>
    );
  }
}

export default Timer;
