import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock, Users, Brain, TrendingUp, Target, Zap } from 'lucide-react';
import { tools } from '../data/tools';
import { getToolUsageData } from '../data/tools';
import { getRelatedTools, calculateContextualSimilarity, toolContextMap } from '../data/toolRelationships';
import { loadToolData } from '../utils/storageUtils';

interface EnhancedRecommendation {
  tool: any;
  reason: string;
  confidence: number;
  category: 'workflow' | 'complementary' | 'popular' | 'contextual' | 'completion';
  icon: React.ComponentType<any>;
  actionText: string;
}

interface EnhancedToolRecommendationsProps {
  currentTool?: any;
  userHistory?: string[];
  onSelectTool: (tool: any) => void;
  maxRecommendations?: number;
}

export const EnhancedToolRecommendations: React.FC<EnhancedToolRecommendationsProps> = ({
  currentTool,
  userHistory = [],
  onSelectTool,
  maxRecommendations = 6
}) => {
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    generateEnhancedRecommendations();
  }, [currentTool, userHistory]);

  const generateEnhancedRecommendations = () => {
    const recs: EnhancedRecommendation[] = [];

    // 1. Workflow-based recommendations (if current tool exists)
    if (currentTool) {
      const relatedToolIds = getRelatedTools(currentTool.id);
      relatedToolIds.forEach(toolId => {
        const tool = tools.find(t => t.id === toolId);
        if (tool && !userHistory.includes(tool.id)) {
          recs.push({
            tool,
            reason: `Commonly used together with ${currentTool.title}`,
            confidence: 90,
            category: 'workflow',
            icon: ArrowRight,
            actionText: 'Continue workflow'
          });
        }
      });

      // Contextual similarity recommendations
      tools
        .filter(tool => tool.id !== currentTool.id && !relatedToolIds.includes(tool.id))
        .forEach(tool => {
          const similarity = calculateContextualSimilarity(currentTool.id, tool.id);
          if (similarity > 6) {
            recs.push({
              tool,
              reason: `Similar goals and use cases to ${currentTool.title}`,
              confidence: Math.min(similarity * 10, 85),
              category: 'contextual',
              icon: Brain,
              actionText: 'Explore similar tool'
            });
          }
        });
    }

    // 2. Completion-based recommendations (based on user's saved data)
    const completionRecs = generateCompletionRecommendations();
    recs.push(...completionRecs);

    // 3. Popular tools (fallback)
    const usageData = getToolUsageData('view');
    const popularTools = tools
      .filter(tool => currentTool ? tool.id !== currentTool.id : true)
      .filter(tool => !userHistory.includes(tool.id))
      .sort((a, b) => (usageData[b.id] || 0) - (usageData[a.id] || 0))
      .slice(0, 3);

    popularTools.forEach(tool => {
      recs.push({
        tool,
        reason: 'Popular choice among users',
        confidence: 70,
        category: 'popular',
        icon: TrendingUp,
        actionText: 'Try popular tool'
      });
    });

    // 4. Smart workflow suggestions based on user data patterns
    const workflowRecs = generateWorkflowRecommendations();
    recs.push(...workflowRecs);

    // Sort by confidence and limit results
    const sortedRecs = recs
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxRecommendations);

    setRecommendations(sortedRecs);
  };

  const generateCompletionRecommendations = (): EnhancedRecommendation[] => {
    const recs: EnhancedRecommendation[] = [];

    // Budget → Debt tracking
    const budgetData = loadToolData('budget_card_conveyor');
    if (budgetData?.items?.length > 0) {
      const hasDebtExpenses = budgetData.items.some((item: any) => 
        item.category?.toLowerCase().includes('debt') || 
        item.description?.toLowerCase().includes('payment')
      );
      
      if (hasDebtExpenses && !userHistory.includes('debt-snowball-tracker')) {
        const debtTool = tools.find(t => t.id === 'debt-snowball-tracker');
        if (debtTool) {
          recs.push({
            tool: debtTool,
            reason: 'You have debt payments in your budget - track payoff progress',
            confidence: 95,
            category: 'completion',
            icon: Target,
            actionText: 'Optimize debt payoff'
          });
        }
      }
    }

    // Tax estimator → Rate calculator (for freelancers)
    const taxData = loadToolData('self_employed_tax_estimator');
    if (taxData?.incomes?.some((income: any) => income.type === '1099')) {
      if (!userHistory.includes('hourly-rate-calculator')) {
        const rateTool = tools.find(t => t.id === 'hourly-rate-calculator');
        if (rateTool) {
          recs.push({
            tool: rateTool,
            reason: 'As a freelancer, ensure your rates cover taxes and expenses',
            confidence: 88,
            category: 'completion',
            icon: Zap,
            actionText: 'Optimize pricing'
          });
        }
      }
    }

    // Health data → Sleep tracking
    const healthData = loadToolData('health_hub');
    if (healthData?.sessions?.length > 0 && !userHistory.includes('sleep-debt-calculator')) {
      const sleepTool = tools.find(t => t.id === 'sleep-debt-calculator');
      if (sleepTool) {
        recs.push({
          tool: sleepTool,
          reason: 'Complete your wellness tracking with sleep monitoring',
          confidence: 82,
          category: 'completion',
          icon: Target,
          actionText: 'Track sleep health'
        });
      }
    }

    return recs;
  };

  const generateWorkflowRecommendations = (): EnhancedRecommendation[] => {
    const recs: EnhancedRecommendation[] = [];

    // Analyze user's tool usage patterns
    const toolCategories = userHistory.map(toolId => {
      const tool = tools.find(t => t.id === toolId);
      return tool?.category;
    }).filter(Boolean);

    const categoryFrequency = toolCategories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // If user is heavily focused on financial tools, suggest business tools
    if (categoryFrequency['financial'] >= 2 && categoryFrequency['business'] === 0) {
      const businessTools = tools.filter(t => t.category === 'business' && !userHistory.includes(t.id));
      if (businessTools.length > 0) {
        recs.push({
          tool: businessTools[0],
          reason: 'Expand from financial planning to business optimization',
          confidence: 75,
          category: 'workflow',
          icon: ArrowRight,
          actionText: 'Grow your business'
        });
      }
    }

    // If user is focused on health, suggest planning tools
    if (categoryFrequency['wellness'] >= 2 && categoryFrequency['planning'] === 0) {
      const planningTools = tools.filter(t => t.category === 'planning' && !userHistory.includes(t.id));
      if (planningTools.length > 0) {
        recs.push({
          tool: planningTools[0],
          reason: 'Organize your wellness journey with better planning',
          confidence: 78,
          category: 'workflow',
          icon: Target,
          actionText: 'Plan better'
        });
      }
    }

    return recs;
  };

  const getRecommendationsByCategory = (category: string) => {
    if (category === 'all') return recommendations;
    return recommendations.filter(rec => rec.category === category);
  };

  const filteredRecommendations = getRecommendationsByCategory(activeCategory);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Smart Recommendations</h3>
        </div>
        
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All', icon: Sparkles },
            { id: 'workflow', label: 'Workflow', icon: ArrowRight },
            { id: 'completion', label: 'Complete', icon: Target },
            { id: 'popular', label: 'Popular', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                activeCategory === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((rec, index) => {
          const Icon = rec.icon;
          const ToolIcon = rec.tool.icon;
          
          return (
            <div
              key={`${rec.tool.id}-${index}`}
              onClick={() => onSelectTool(rec.tool)}
              className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all duration-200 hover:scale-105 border border-gray-600 hover:border-blue-500/30"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${rec.tool.color} flex items-center justify-center`}>
                  <ToolIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm mb-1">{rec.tool.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400 capitalize">{rec.category}</span>
                    <span className="text-xs text-gray-500">
                      {rec.confidence}% match
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                {rec.reason}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-400 font-medium">
                  {rec.actionText}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-500" />
              </div>

              {/* Confidence indicator */}
              <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${rec.confidence}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && activeCategory !== 'all' && (
        <div className="text-center py-8 text-gray-400">
          <p>No {activeCategory} recommendations available right now.</p>
          <button
            onClick={() => setActiveCategory('all')}
            className="text-blue-400 hover:text-blue-300 transition-colors mt-2"
          >
            View all recommendations
          </button>
        </div>
      )}
    </div>
  );
};