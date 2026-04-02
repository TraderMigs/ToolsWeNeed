import React from 'react';
import { toolCategories } from '../data/tools';

interface CategoryFilterProps {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          }`}
        >
          All Tools
        </button>
        
        {Object.entries(toolCategories).map(([id, category]) => (
          <button
            key={id}
            onClick={() => onSelectCategory(id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === id
                ? `${category.color} text-white`
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};