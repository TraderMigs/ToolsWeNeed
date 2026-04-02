import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { ProgressRing, BarChart } from '../DataVisualization';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
}

export const SavingsGoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    monthlyContribution: 0
  });

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setGoals([...goals, {
        id: Date.now().toString(),
        ...newGoal
      }]);
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '',
        monthlyContribution: 0
      });
    }
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoal = (id: string, field: keyof SavingsGoal, value: string | number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const calculateProgress = (goal: SavingsGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
    
    const targetDate = new Date(goal.targetDate);
    const currentDate = new Date();
    const monthsRemaining = Math.max(0, 
      (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
      (targetDate.getMonth() - currentDate.getMonth())
    );
    
    const requiredMonthlyContribution = monthsRemaining > 0 ? remaining / monthsRemaining : 0;
    
    return {
      remaining,
      progressPercentage,
      monthsRemaining,
      requiredMonthlyContribution,
      onTrack: goal.monthlyContribution >= requiredMonthlyContribution,
      projectedCompletion: goal.monthlyContribution > 0 ? 
        new Date(currentDate.getTime() + (remaining / goal.monthlyContribution) * 30 * 24 * 60 * 60 * 1000) : 
        null
    };
  };

  // Prepare visualization data
  const goalProgressData = goals.map(goal => {
    const progress = calculateProgress(goal);
    return {
      label: goal.name,
      value: progress.progressPercentage
    };
  });

  const exportData = {
    goals: goals.map(goal => ({
      ...goal,
      progress: calculateProgress(goal)
    })),
    generatedAt: new Date().toISOString()
  };

  const csvData = goals.map(goal => {
    const progress = calculateProgress(goal);
    return {
      'Goal Name': goal.name,
      'Target Amount': goal.targetAmount,
      'Current Amount': goal.currentAmount,
      'Target Date': goal.targetDate,
      'Monthly Contribution': goal.monthlyContribution,
      'Progress (%)': progress.progressPercentage.toFixed(1),
      'Remaining': progress.remaining.toFixed(2),
      'Months Left': progress.monthsRemaining,
      'On Track': progress.onTrack ? 'Yes' : 'No'
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="savings-goals"
          title="Savings Goal Tracker"
        />
      </div>

      {/* Visualizations Toggle */}
      {goals.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showVisualizations}
              onChange={(e) => setShowVisualizations(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-lg font-medium">Show Goal Progress Visualizations</span>
            <span className="text-sm text-gray-400">(Progress charts & comparisons)</span>
          </label>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Goal Name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={newGoal.targetAmount || ''}
            onChange={(e) => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Current Amount"
            value={newGoal.currentAmount || ''}
            onChange={(e) => setNewGoal({...newGoal, currentAmount: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Target Date"
            value={newGoal.targetDate}
            onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Monthly Contribution"
            value={newGoal.monthlyContribution || ''}
            onChange={(e) => setNewGoal({...newGoal, monthlyContribution: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addGoal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          return (
            <div key={goal.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{goal.name}</h3>
                <button
                  onClick={() => removeGoal(goal.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Amount</label>
                  <input
                    type="number"
                    value={goal.currentAmount}
                    onChange={(e) => updateGoal(goal.id, 'currentAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Target Amount</label>
                  <input
                    type="number"
                    value={goal.targetAmount}
                    onChange={(e) => updateGoal(goal.id, 'targetAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Contribution</label>
                  <input
                    type="number"
                    value={goal.monthlyContribution}
                    onChange={(e) => updateGoal(goal.id, 'monthlyContribution', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-medium">{progress.progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, progress.progressPercentage)}%` }}
                  ></div>
                </div>
                {showVisualizations && (
                  <div className="flex justify-center">
                    <ProgressRing 
                      percentage={progress.progressPercentage} 
                      size={80} 
                      color="#3B82F6"
                      label={`${progress.progressPercentage.toFixed(1)}%`}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Remaining</p>
                  <p className="text-lg font-bold text-orange-400">${progress.remaining.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Months Left</p>
                  <p className="text-lg font-bold text-blue-400">{progress.monthsRemaining}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Required Monthly</p>
                  <p className="text-lg font-bold text-purple-400">${progress.requiredMonthlyContribution.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`text-lg font-bold ${progress.onTrack ? 'text-green-400' : 'text-red-400'}`}>
                    {progress.onTrack ? 'On Track' : 'Behind'}
                  </p>
                </div>
              </div>

              {progress.projectedCompletion && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Projected completion: {progress.projectedCompletion.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Goals Comparison Visualization */}
      {showVisualizations && goalProgressData.length > 1 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Goals Progress Comparison</h3>
          <BarChart data={goalProgressData} height={200} />
        </div>
      )}
    </div>
  );
};