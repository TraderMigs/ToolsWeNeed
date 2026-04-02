import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ToolCard } from './ToolCard';
import { getTrendingTools } from '../utils/analytics';
import { tools } from '../data/tools';

interface TrendingToolsSectionProps {
  onSelectTool: (tool: any) => void;
  limit?: number;
}

export const TrendingToolsSection: React.FC<TrendingToolsSectionProps> = ({ 
  onSelectTool,
  limit = 6
}) => {
  const [trendingTools, setTrendingTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTools = async () => {
      setIsLoading(true);
      try {
        // Get trending tools from the API with error handling
        const trendingData = await getTrendingTools(7, limit, 'view');
        
        // Map trending data to actual tool objects
        const mappedTools = trendingData
          .map(item => {
            const tool = tools.find(t => t.id === item.tool_id);
            return tool ? { ...tool, usageCount: item.count } : null;
          })
          .filter(Boolean);
        
        // If we don't have enough trending tools, fill with popular tools
        if (mappedTools.length < limit) {
          const popularTools = tools
            .sort((a, b) => b.sortWeight - a.sortWeight)
            .filter(tool => !mappedTools.some(t => t.id === tool.id))
            .slice(0, limit - mappedTools.length);
          
          setTrendingTools([...mappedTools, ...popularTools]);
        } else {
          setTrendingTools(mappedTools);
        }
      } catch (error) {
        console.warn('Error fetching trending tools, using fallback:', error.message || error);
        // Fallback to sortWeight-based popular tools
        setTrendingTools(
          tools.sort((a, b) => b.sortWeight - a.sortWeight).slice(0, limit)
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTools();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold">Trending Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse h-40"
            />
          ))}
        </div>
      </div>
    );
  }

  if (trendingTools.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold">Trending Tools</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {trendingTools.map((tool) => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onClick={() => onSelectTool(tool)}
            isTrending={true}
          />
        ))}
      </div>
    </div>
  );
};