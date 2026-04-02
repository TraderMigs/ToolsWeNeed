import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, DollarSign, Activity, Award, Eye, EyeOff } from 'lucide-react';
import { getUsageStats } from '../utils/exportAnalytics';
import { loadToolData } from '../utils/storageUtils';
import { tools } from '../data/tools';

interface Insight {
  id: string;
  type: 'achievement' | 'progress' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  value?: string;
  icon: React.ComponentType<any>;
  color: string;
  actionable?: boolean;
  toolId?: string;
}

interface PersonalizedInsightsProps {
  onSelectTool?: (toolId: string) => void;
  compact?: boolean;
}

export const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({
  onSelectTool,
  compact = false
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setIsLoading(true);
    const generatedInsights: Insight[] = [];

    try {
      // Get usage statistics
      const usageStats = getUsageStats();

      // Tool usage insights
      if (usageStats.totalExports > 0) {
        generatedInsights.push({
          id: 'total-exports',
          type: 'achievement',
          title: 'Export Activity',
          description: `You've exported ${usageStats.totalExports} files`,
          value: `${usageStats.totalExports} exports`,
          icon: Award,
          color: 'bg-blue-600'
        });
      }

      if (usageStats.session?.toolsUsed && usageStats.session.toolsUsed.length > 0) {
        generatedInsights.push({
          id: 'tools-explored',
          type: 'progress',
          title: 'Tools Explored',
          description: `You've used ${usageStats.session.toolsUsed.length} different tools`,
          value: `${usageStats.session.toolsUsed.length}/${tools.length}`,
          icon: Target,
          color: 'bg-green-600'
        });
      }

      // Budget insights
      const budgetData = loadToolData('budget_card_conveyor');
      if (budgetData?.items?.length > 0) {
        const totalIncome = budgetData.items
          .filter((item: any) => item.type === 'income')
          .reduce((sum: number, item: any) => sum + item.amount, 0);
        const totalExpenses = budgetData.items
          .filter((item: any) => item.type === 'expense')
          .reduce((sum: number, item: any) => sum + item.amount, 0);
        const netIncome = totalIncome - totalExpenses;

        generatedInsights.push({
          id: 'budget-status',
          type: netIncome >= 0 ? 'achievement' : 'suggestion',
          title: 'Budget Status',
          description: netIncome >= 0 
            ? `You have a positive budget of $${netIncome.toFixed(2)}/month`
            : `Budget deficit of $${Math.abs(netIncome).toFixed(2)}/month`,
          value: `$${netIncome.toFixed(2)}`,
          icon: DollarSign,
          color: netIncome >= 0 ? 'bg-green-600' : 'bg-red-600',
          actionable: netIncome < 0,
          toolId: 'budget-card-conveyor'
        });
      }

      // Debt insights
      const debtData = loadToolData('debt_snowball_tracker');
      if (debtData?.debts?.length > 0) {
        const totalDebt = debtData.debts.reduce((sum: number, debt: any) => sum + debt.balance, 0);
        generatedInsights.push({
          id: 'debt-tracking',
          type: 'progress',
          title: 'Debt Tracking',
          description: `Tracking $${totalDebt.toLocaleString()} across ${debtData.debts.length} debts`,
          value: `$${totalDebt.toLocaleString()}`,
          icon: TrendingUp,
          color: 'bg-orange-600',
          actionable: true,
          toolId: 'debt-snowball-tracker'
        });
      }

      // Health insights
      const healthData = loadToolData('health_hub');
      if (healthData?.sessions?.length > 0) {
        const completedFasts = healthData.sessions.filter((session: any) => session.completed).length;
        generatedInsights.push({
          id: 'fasting-progress',
          type: 'achievement',
          title: 'Fasting Journey',
          description: `Completed ${completedFasts} successful fasting sessions`,
          value: `${completedFasts} fasts`,
          icon: Activity,
          color: 'bg-purple-600',
          toolId: 'fasting-planner'
        });
      }

      // Net worth insights
      const netWorthData = loadToolData('net_worth_snapshot');
      if (netWorthData?.assets?.length > 0 || netWorthData?.liabilities?.length > 0) {
        const totalAssets = netWorthData.assets?.reduce((sum: number, asset: any) => sum + asset.value, 0) || 0;
        const totalLiabilities = netWorthData.liabilities?.reduce((sum: number, liability: any) => sum + liability.amount, 0) || 0;
        const netWorth = totalAssets - totalLiabilities;

        generatedInsights.push({
          id: 'net-worth',
          type: netWorth >= 0 ? 'achievement' : 'suggestion',
          title: 'Net Worth',
          description: `Your tracked net worth is $${netWorth.toLocaleString()}`,
          value: `$${netWorth.toLocaleString()}`,
          icon: TrendingUp,
          color: netWorth >= 0 ? 'bg-green-600' : 'bg-red-600',
          toolId: 'net-worth-snapshot'
        });
      }

      // Savings goals insights
      const savingsData = loadToolData('savings_goal_tracker');
      if (savingsData?.goals?.length > 0) {
        const totalTargetAmount = savingsData.goals.reduce((sum: number, goal: any) => sum + goal.targetAmount, 0);
        const totalCurrentAmount = savingsData.goals.reduce((sum: number, goal: any) => sum + goal.currentAmount, 0);
        const progressPercentage = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

        generatedInsights.push({
          id: 'savings-progress',
          type: 'progress',
          title: 'Savings Goals',
          description: `${progressPercentage.toFixed(1)}% progress toward your savings goals`,
          value: `${progressPercentage.toFixed(1)}%`,
          icon: Target,
          color: 'bg-blue-600',
          toolId: 'savings-goal-tracker'
        });
      }

      // Session length insight
      if (usageStats.session?.startTime) {
        const sessionLength = Date.now() - new Date(usageStats.session.startTime).getTime();
        const minutes = Math.floor(sessionLength / (1000 * 60));
        
        if (minutes > 5) {
          generatedInsights.push({
            id: 'session-time',
            type: 'milestone',
            title: 'Active Session',
            description: `You've been using tools for ${minutes} minutes`,
            value: `${minutes}m`,
            icon: Calendar,
            color: 'bg-indigo-600'
          });
        }
      }

      // Conversion suggestions
      if (usageStats.flags?.conversionCandidate && usageStats.totalExports > 5) {
        generatedInsights.push({
          id: 'power-user',
          type: 'suggestion',
          title: 'Power User',
          description: 'You\'re making great use of our tools! Consider bookmarking for easy access.',
          icon: Award,
          color: 'bg-yellow-600'
        });
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsightClick = (insight: Insight) => {
    if (insight.toolId && onSelectTool) {
      onSelectTool(insight.toolId);
    }
  };

  if (!isVisible || insights.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Your Progress
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Hide insights"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      <div className={`grid gap-3 ${
        compact 
          ? 'grid-cols-1 sm:grid-cols-2' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {insights.slice(0, compact ? 4 : 6).map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              onClick={() => handleInsightClick(insight)}
              className={`${insight.color} rounded-lg p-4 transition-all duration-200 hover:scale-105 ${
                insight.actionable || insight.toolId ? 'cursor-pointer hover:shadow-lg' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-white" />
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{insight.title}</h4>
                  <p className="text-xs text-white/80">{insight.description}</p>
                  {insight.value && (
                    <p className="text-lg font-bold text-white mt-1">{insight.value}</p>
                  )}
                </div>
              </div>
              {insight.actionable && (
                <div className="mt-2 text-xs text-white/60">
                  Click to improve →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {insights.length > (compact ? 4 : 6) && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsVisible(false)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Show less
          </button>
        </div>
      )}
    </div>
  );
};

// Hook for getting insights data
export const usePersonalizedInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const generateInsights = () => {
      // Implementation similar to above but as a hook
      // This allows other components to access insights data
    };

    generateInsights();
  }, []);

  return insights;
};