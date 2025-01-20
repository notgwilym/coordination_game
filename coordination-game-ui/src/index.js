import React from 'react';
import ReactDOM from 'react-dom';
import './App.css'; // Import global styles
import App from './components/App'; // Main app component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);