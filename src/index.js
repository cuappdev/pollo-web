import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './semantic/semantic.min.css';
import './index.css';

dotenv.config();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
