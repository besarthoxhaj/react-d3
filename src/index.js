import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import './main.css';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render((<App />), document.getElementById('reactMountPoint'));
});
