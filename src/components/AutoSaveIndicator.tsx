import React from 'react';
import { Save, Trash2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
  toolName: string;
  hasData: boolean;
  onClearData: () => void;
  lastSaved?: Date;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  toolName,
  hasData,
  onClearData,
  lastSaved
}) => {
  if (!hasData) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Save className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-300">
            Previous data restored
            {lastSaved && (
              <span className="text-gray-500 ml-1">
                (saved {lastSaved.toLocaleDateString()})
              </span>
            )}
          </span>
        </div>
        <button
          onClick={onClearData}
          className="flex items-center gap-1 px-2 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors min-h-[36px] ml-2"
        >
          <Trash2 className="w-3 h-3 flex-shrink-0" />
          Clear Saved Data
        </button>
      </div>
    </div>
  );
};