import React, { Component } from 'react';
import moment from 'moment';

import './Timer.css';

class Timer extends Component {
  state = { time: 0 };

  async componentDidMount() {
    await this.setState({ time: 0 });
    var interval = setInterval(() => this.incrementTimer(), 1000);
    this.setState({ interval });
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
