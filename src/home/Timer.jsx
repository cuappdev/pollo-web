import React, { Component } from 'react';
import './Timer.css';

class Timer extends Component {
  state = {
    time : null
  }

  async componentDidMount() {
    await this.setState({ time : 0 });
    var interval = setInterval(() => this.timer(), 1000);
    this.setState({ interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  timer() {
    this.setState({ time: this.state.time + 1 });
    console.log('TIMER', this.state.time);
  }

  render () {
    return (
      <div className='time-counter'>
        {this.state.time < 60 ? '0' : `${Math.floor(this.state.timer/60)}`} :
        {(this.state.time%60) < 10 ? `0${this.state.time%60}` : `${this.state.time%60}`}
      </div>
    );
  }
}


export default Timer;
