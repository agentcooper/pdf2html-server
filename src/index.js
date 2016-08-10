import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './index.css';

import config from './config';

// debug
window.config = config;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
