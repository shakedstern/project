import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the 'client' import
import App from './App'; // Your App component
import { BrowserRouter as Router } from 'react-router-dom'; // Import the Router

// Create the root and render your app inside it
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Router>
    <App />
  </Router>
);
