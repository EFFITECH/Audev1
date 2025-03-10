import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Montage simple sans StrictMode pour éviter les doubles rendus qui pourraient causer des problèmes
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);