import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// No necesitas importar auth aquí si no lo usas directamente.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);