/* Accessibility enhancements */

/* High contrast mode */
.high-contrast {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --border-color: #ffffff;
  --link-color: #00ffff;
  --button-bg: #ffffff;
  --button-text: #000000;
}

.high-contrast .bg-gray-900 { background-color: var(--bg-primary) !important; }
.high-contrast .bg-gray-800 { background-color: var(--bg-secondary) !important; }
.high-contrast .text-white { color: var(--text-primary) !important; }
.high-contrast .text-gray-400 { color: var(--text-secondary) !important; }
.high-contrast .border-gray-700 { border-color: var(--border-color) !important; }

/* Reduced motion */
.reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Focus indicators */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Ensure minimum touch targets */
button, a, input, select, textarea {
  min-height: 44px;
  min-width: 44px;
}

/* High contrast focus indicators */
.high-contrast *:focus {
  outline: 3px solid #00ffff;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
  
  .bg-gray-800, .bg-gray-900 {
    background: white !important;
    color: black !important;
    border: 1px solid black !important;
  }
}