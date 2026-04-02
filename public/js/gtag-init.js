// Google Analytics Initialization
// Moved from inline script to external file for CSP compliance

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Only initialize if we have a real tracking ID
const gtagScript = document.getElementById('gtag-script');
const trackingId = gtagScript?.src.match(/id=([^&]+)/)?.[1];

if (trackingId && trackingId !== 'G-XXXXXXXXXX') {
  gtag('js', new Date());
  gtag('config', trackingId, {
    'page_path': window.location.pathname,
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
}

// Track custom events
function trackEvent(category, action, label, value) {
  if (window.gtag) {
    gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }
}

// Track page views for SPA
document.addEventListener('DOMContentLoaded', function() {
  const originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    trackPageView();
  };
  
  window.addEventListener('popstate', trackPageView);
  
  function trackPageView() {
    if (window.gtag && trackingId && trackingId !== 'G-XXXXXXXXXX') {
      gtag('config', trackingId, {
        'page_path': window.location.pathname
      });
    }
  }
});

// Make trackEvent globally available
window.trackEvent = trackEvent;