import React, { useState, useEffect } from 'react';
import { Eye, Type, Contrast, Volume2 } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  screenReader: boolean;
}

export const AccessibilityEnhancements: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    screenReader: false
  });
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Load saved accessibility preferences
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Detect system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }

    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, contrast: 'high' }));
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings
    const root = document.documentElement;
    
    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px'
    };
    root.style.fontSize = fontSizes[settings.fontSize];

    // High contrast
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Eye className="w-5 h-5" />
      </button>

      {/* Accessibility Panel */}
      {showPanel && (
        <div className="fixed bottom-20 left-4 bg-gray-800 rounded-lg shadow-xl p-4 z-50 w-80 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Accessibility</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close accessibility settings"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Type className="w-4 h-4 inline mr-2" />
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['small', 'medium', 'large', 'xl'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Contrast className="w-4 h-4 inline mr-2" />
                Contrast
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['normal', 'high'] as const).map(contrast => (
                  <button
                    key={contrast}
                    onClick={() => updateSetting('contrast', contrast)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      settings.contrast === contrast
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {contrast === 'normal' ? 'Normal' : 'High Contrast'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reduced Motion */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Reduce animations</span>
              </label>
            </div>

            {/* Screen Reader Support */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={(e) => updateSetting('screenReader', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Enhanced screen reader support</span>
              </label>
            </div>

            {/* Test Announcement */}
            <button
              onClick={() => announceToScreenReader('Accessibility settings updated successfully')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Test Screen Reader
            </button>
          </div>
        </div>
      )}

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
    </>
  );
};