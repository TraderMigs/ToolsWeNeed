import React, { useState } from 'react';
import { ChevronDown, TrendingUp, Clock, AlignLeft } from 'lucide-react';

interface SortingDropdownProps {
  onSort: (sortBy: 'popular' | 'recent' | 'alphabetical') => void;
  currentSort: 'popular' | 'recent' | 'alphabetical';
}

export const SortingDropdown: React.FC<SortingDropdownProps> = ({ 
  onSort,
  currentSort
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const sortOptions = [
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'recent', label: 'Recently Added', icon: Clock },
    { id: 'alphabetical', label: 'Alphabetical', icon: AlignLeft }
  ];
  
  const currentOption = sortOptions.find(option => option.id === currentSort);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
      >
        {currentOption && <currentOption.icon className="w-4 h-4" />}
        <span>Sort: {currentOption?.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-700">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => {
                onSort(option.id as 'popular' | 'recent' | 'alphabetical');
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition-colors text-left text-sm ${
                currentSort === option.id ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
              }`}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};