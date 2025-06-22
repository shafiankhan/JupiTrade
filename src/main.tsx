import { Buffer } from 'buffer';
// Polyfill Buffer for browser
if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
