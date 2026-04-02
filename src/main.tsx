import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { validateEnv, env, debugEnvironment } from './utils/env';
import './index.css';

// Validate environment variables
if (!validateEnv()) {
  console.error('Application started with missing environment variables');
}

// Debug environment in development
debugEnvironment();

// Initialize Google Analytics with the correct tracking ID
if (env.GA_TRACKING_ID && env.GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
  const gtagScript = document.getElementById('gtag-script');
  if (gtagScript) {
    gtagScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${env.GA_TRACKING_ID}`);
  }
  
  // Update the tracking ID in the gtag config
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', env.GA_TRACKING_ID, {
    'page_path': window.location.pathname,
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
