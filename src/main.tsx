import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initSecurityShield } from './services/securityShield';
import { pwaService } from './services/pwaService';

// Initialize proprietary anti-tampering and security shield
initSecurityShield();

// Register offline PWA Service Worker
pwaService.registerServiceWorker();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
