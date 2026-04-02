import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RefreshCw } from 'lucide-react';

export const OfflineSupport: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [pendingActions, setPendingActions] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingActions = async () => {
    const pending = JSON.parse(localStorage.getItem('pendingActions') || '[]');
    
    for (const action of pending) {
      try {
        // Retry failed actions when back online
        await retryAction(action);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
    
    localStorage.removeItem('pendingActions');
    setPendingActions([]);
  };

  const retryAction = async (action: any) => {
    // Implementation would depend on action type
    switch (action.type) {
      case 'export':
        // Retry export
        break;
      case 'feedback':
        // Retry feedback submission
        break;
      default:
        break;
    }
  };

  const queueAction = (action: any) => {
    const pending = JSON.parse(localStorage.getItem('pendingActions') || '[]');
    pending.push({ ...action, timestamp: Date.now() });
    localStorage.setItem('pendingActions', JSON.stringify(pending));
    setPendingActions(pending);
  };

  if (!showOfflineMessage && isOnline) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline ? 'bg-green-600' : 'bg-orange-600'
    }`}>
      <div className="flex items-center gap-3 text-white">
        {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
        <div>
          <p className="font-medium">
            {isOnline ? 'Back Online' : 'You\'re Offline'}
          </p>
          <p className="text-sm opacity-90">
            {isOnline 
              ? 'Syncing pending changes...' 
              : 'Tools still work! Changes will sync when reconnected.'
            }
          </p>
        </div>
        {!isOnline && (
          <button
            onClick={() => setShowOfflineMessage(false)}
            className="text-white hover:text-gray-200"
          >
            ×
          </button>
        )}
      </div>
      
      {pendingActions.length > 0 && (
        <div className="mt-2 text-sm opacity-90">
          {pendingActions.length} action(s) pending sync
        </div>
      )}
    </div>
  );
};