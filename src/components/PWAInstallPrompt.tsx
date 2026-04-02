import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed or prompt was dismissed recently
    const hasPromptBeenShown = localStorage.getItem('pwaPromptDismissed');
    const hasPromptBeenShownRecently = hasPromptBeenShown && 
      (Date.now() - parseInt(hasPromptBeenShown)) < (7 * 24 * 60 * 60 * 1000); // 7 days
    
    if (hasPromptBeenShownRecently) {
      return;
    }

    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // For Android/Chrome: Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS: Check if the app is not in standalone mode and show iOS instructions
    if (isIOSDevice && !window.matchMedia('(display-mode: standalone)').matches) {
      // Delay showing the prompt to avoid immediate dismissal
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    await installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 z-50 max-w-md mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-white mb-1">Install Tools We Need</h3>
          {isIOS ? (
            <p className="text-sm text-gray-300">
              Tap the share icon <span className="inline-block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </span> and then "Add to Home Screen" to install this app.
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Install this app on your device for quick access when you're offline.
            </p>
          )}
        </div>
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white ml-4"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {!isIOS && installPrompt && (
        <button
          onClick={handleInstall}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
      )}
    </div>
  );
};