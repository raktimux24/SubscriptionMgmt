import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/firebase/config';  // Initialize Firebase

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);