import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock, Users } from 'lucide-react';
import { tools } from '../data/tools';
import { getToolUsageData } from '../data/tools';
import { getRelatedTools, calculateContextualSimilarity } from '../data/toolRelationships';

interface ToolRecommendationsProps {
  currentTool?: any;
  userHistory?: string[];
  onSelectTool: (tool: any) => void;
}

export const ToolRecommendations: React.FC<ToolRecommendationsProps> = ({
  currentTool,
  userHistory = [],
  onSelectTool
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recommendationType, setRecommendationType] = useState<'related' | 'popular' | 'workflow'>('related');

  useEffect(() => {
    generateRecommendations();
  }, [currentTool, userHistory, recommendationType]);

  const generateRecommendations = () => {
    let recs: any[] = [];

    switch (recommendationType) {
      case 'related':
        recs = getRelatedRecommendations();
        break;
      case 'popular':
        recs = getPopularRecommendations();
        break;
      case 'workflow':
        recs = getWorkflowRecommendations();
        break;
    }

    setRecommendations(recs.slice(0, 6));
  };

  const getRelatedRecommendations = () => {
    if (!currentTool) return [];

    const relatedToolIds = getRelatedTools(currentTool.id);
    const relatedTools = relatedToolIds
      .map(id => tools.find(tool => tool.id === id))
      .filter(Boolean);

    // Add similarity-based recommendations
    const similarTools = tools
      .filter(tool => tool.id !== currentTool.id && !relatedToolIds.includes(tool.id))
      .map(tool => ({
        ...tool,
        similarity: calculateContextualSimilarity(currentTool.id, tool.id)
      }))
      .filter(tool => tool.similarity > 5)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    return [...relatedTools, ...similarTools];
  };

  const getPopularRecommendations = () => {
    const usageData = getToolUsageData('view');
    return tools
      .filter(tool => currentTool ? tool.id !== currentTool.id : true)
      .sort((a, b) => (usageData[b.id] || 0) - (usageData[a.id] || 0))
      .slice(0, 6);
  };

  const getWorkflowRecommendations = () => {
    if (userHistory.length === 0) return getPopularRecommendations();

    // Analyze user workflow patterns
    const workflowPatterns = analyzeWorkflowPatterns(userHistory);
    
    return tools
      .filter(tool => currentTool ? tool.id !== currentTool.id : true)
      .filter(tool => !userHistory.includes(tool.id))
      .map(tool => ({
        ...tool,
        workflowScore: calculateWorkflowScore(tool, workflowPatterns)
      }))
      .sort((a, b) => b.workflowScore - a.workflowScore)
      .slice(0, 6);
  };

  const analyzeWorkflowPatterns = (history: string[]) => {
    const categories = history.map(toolId => {
      const tool = tools.find(t => t.id === toolId);
      return tool?.category;
    }).filter(Boolean);

    const categoryFrequency = categories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      preferredCategories: Object.entries(categoryFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category),
      sessionLength: history.length,
      diversity: new Set(categories).size / categories.length
    };
  };

  const calculateWorkflowScore = (tool: any, patterns: any) => {
    let score = 0;

    // Category preference
    if (patterns.preferredCategories.includes(tool.category)) {
      score += 3;
    }

    // Complexity matching
    if (patterns.sessionLength > 5) {
      // User seems engaged, recommend more complex tools
      score += tool.sortWeight > 500 ? 2 : 0;
    } else {
      // New user, recommend simpler tools
      score += tool.sortWeight > 800 ? 2 : 0;
    }

    return score;
  };

  const getRecommendationReason = (tool: any) => {
    switch (recommendationType) {
      case 'related':
        return currentTool ? `Works well with ${currentTool.title}` : 'Popular choice';
      case 'popular':
        return 'Trending this week';
      case 'workflow':
        return 'Matches your usage pattern';
      default:
        return 'Recommended for you';
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
        </div>
        
        <div className="flex gap-2">
          {[
            { id: 'related', label: 'Related', icon: ArrowRight },
            { id: 'popular', label: 'Popular', icon: Users },
            { id: 'workflow', label: 'Workflow', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRecommendationType(id as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                recommendationType === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-3 h-3 inline mr-1" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{tool.title}</h4>
                <p className="text-xs text-gray-400">{getRecommendationReason(tool)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 line-clamp-2">{tool.description}</p>
            
            {tool.similarity && (
              <div className="mt-2 text-xs text-blue-400">
                {Math.round(tool.similarity * 10)}% similarity match
              </div>
            )}
            
            {tool.workflowScore && (
              <div className="mt-2 text-xs text-green-400">
                Workflow score: {tool.workflowScore}/10
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};