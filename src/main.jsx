// Import necessary libraries
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap for styling
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Import the main App component
import './index.css'; // Import custom CSS if needed

// Render the App component into the root element
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
