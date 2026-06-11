import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/reset.css';
import './assets/styles/index.css';
import App from './App';

// Side-effect: auto-register all tools
import.meta.glob('./tools/**/index.ts', { eager: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
