import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { uuid } from './utils/functions';

import './semantic/semantic.min.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

if (!localStorage.getItem('deviceId')) {
  localStorage.setItem('deviceId', uuid());
}