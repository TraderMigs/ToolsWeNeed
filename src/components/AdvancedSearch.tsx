import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Tag, Calendar, TrendingUp } from 'lucide-react';
import { tools } from '../data/tools';

interface SearchFilters {
  category: string[];
  tags: string[];
  complexity: string[];
  timeToComplete: string[];
  exportFormats: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface AdvancedSearchProps {
  onResults: (results: any[]) => void;
  onClose: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResults, onClose }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    tags: [],
    complexity: [],
    timeToComplete: [],
    exportFormats: [],
    dateRange: { start: '', end: '' }
  });
  const [showFilters, setShowFilters] = useState(false);

  // Advanced search algorithm with fuzzy matching
  const searchResults = useMemo(() => {
    if (!query && Object.values(filters).every(f => 
      Array.isArray(f) ? f.length === 0 : !f.start && !f.end
    )) {
      return tools;
    }

    return tools.filter(tool => {
      // Text search with fuzzy matching
      const searchScore = calculateSearchScore(tool, query);
      if (query && searchScore < 0.3) return false;

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(tool.category)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const toolTags = tool.tags.toLowerCase().split(',');
        const hasMatchingTag = filters.tags.some(tag => 
          toolTags.some(toolTag => toolTag.includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by relevance score
      const scoreA = calculateSearchScore(a, query);
      const scoreB = calculateSearchScore(b, query);
      return scoreB - scoreA;
    });
  }, [query, filters]);

  const calculateSearchScore = (tool: any, searchQuery: string): number => {
    if (!searchQuery) return 1;
    
    const query = searchQuery.toLowerCase();
    const title = tool.title.toLowerCase();
    const description = tool.description.toLowerCase();
    const tags = tool.tags.toLowerCase();

    let score = 0;

    // Exact title match gets highest score
    if (title.includes(query)) score += 1;
    
    // Description match
    if (description.includes(query)) score += 0.7;
    
    // Tags match
    if (tags.includes(query)) score += 0.5;

    // Fuzzy matching for typos
    score += fuzzyMatch(title, query) * 0.3;
    score += fuzzyMatch(description, query) * 0.2;

    return Math.min(score, 1);
  };

  const fuzzyMatch = (text: string, pattern: string): number => {
    const textLen = text.length;
    const patternLen = pattern.length;
    
    if (patternLen === 0) return 1;
    if (textLen === 0) return 0;

    let score = 0;
    let patternIdx = 0;
    
    for (let i = 0; i < textLen && patternIdx < patternLen; i++) {
      if (text[i] === pattern[patternIdx]) {
        score++;
        patternIdx++;
      }
    }
    
    return score / patternLen;
  };

  useEffect(() => {
    onResults(searchResults);
  }, [searchResults, onResults]);

  const availableTags = useMemo(() => {
    const allTags = tools.flatMap(tool => tool.tags.split(',').map(tag => tag.trim()));
    return [...new Set(allTags)].sort();
  }, []);

  const toggleFilter = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType])
        ? (prev[filterType] as string[]).includes(value)
          ? (prev[filterType] as string[]).filter(item => item !== value)
          : [...(prev[filterType] as string[]), value]
        : prev[filterType]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools, features, or use cases..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            {showFilters ? <X className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          </button>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="space-y-6 mb-6 p-4 bg-gray-700 rounded-lg">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['financial', 'business', 'wellness', 'planning', 'trading', 'search'].map(category => (
                    <button
                      key={category}
                      onClick={() => toggleFilter('category', category)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.category.includes(category)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Popular Tags</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableTags.slice(0, 20).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleFilter('tags', tag)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-sm text-gray-400 mb-4">
            Found {searchResults.length} tools
            {query && ` matching "${query}"`}
          </div>

          {/* Quick Results Preview */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.slice(0, 10).map(tool => (
              <div key={tool.id} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded ${tool.color} flex items-center justify-center`}>
                    <tool.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{tool.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-1">{tool.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{tool.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};