import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Edit, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData, hasToolData, saveToolDataWithAnalytics } from '../../utils/storageUtils';
import { SmartSuggestions } from '../SmartSuggestions';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import { getSmartSuggestions } from '../../data/smartSuggestions';
import { ProgressRing, PieChart, BarChart } from '../DataVisualization';
import { ProgressiveOnboarding, getOnboardingSteps, OnboardingTrigger, useProgressiveOnboarding } from '../ProgressiveOnboarding';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  isRecurring: boolean;
  startDate: string;
  endDate: string;
}

interface BudgetCardConveyorProps {
  toolId?: string;
}

export const BudgetCardConveyor: React.FC<BudgetCardConveyorProps> = ({ toolId }) => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const { shouldShowOnboarding, setShouldShowOnboarding } = useProgressiveOnboarding('budget_card_conveyor');
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    amount: 0,
    type: 'expense' as 'income' | 'expense',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    notes: '',
    isRecurring: true,
    startDate: '',
    endDate: ''
  });

  const startEditing = (id: string) => {
    setEditingId(id);
  };

  const saveEdit = () => {
    setEditingId(null);
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
    setEditingId(null);
  };

  // Load data from session storage on component mount
  useEffect(() => {
    const savedData = loadToolData('budget_card_conveyor');
    if (savedData && savedData.items) {
      setItems(savedData.items);
      setHasSavedData(true);
    } else {
      setShowSuggestions(true);
    }
  }, []);

  // Save data to session storage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      saveToolData('budget_card_conveyor', { items });
      setHasSavedData(true);
    }
  }, [items]);

  const handleClearSavedData = () => {
    clearToolData('budget_card_conveyor');
    setHasSavedData(false);
    setItems([]);
  };

  const handleUseSuggestions = (suggestions: any) => {
    if (suggestions.items) {
      setItems(suggestions.items);
    }
    setShowSuggestions(false);
  };
  const addItem = () => {
    if (newItem.category && newItem.description && newItem.amount > 0) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setItems([...items, item]);
      setNewItem({
        category: '',
        description: '',
        amount: 0,
        type: 'expense',
        frequency: 'monthly',
        category: '',
        priority: 'medium',
        notes: '',
        isRecurring: true,
        startDate: '',
        endDate: ''
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const convertToMonthly = (amount: number, frequency: string) => {
    switch (frequency) {
      case 'daily': return amount * 30;
      case 'weekly': return amount * 4.33;
      case 'monthly': return amount;
      case 'yearly': return amount / 12;
      default: return amount;
    }
  };

  const totalIncome = items
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + convertToMonthly(item.amount, item.frequency), 0);

  const totalExpenses = items
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + convertToMonthly(item.amount, item.frequency), 0);

  const netIncome = totalIncome - totalExpenses;

  // Prepare data for visualizations
  const categoryData = [...new Set(items.map(item => item.category))].filter(Boolean).map(category => {
    const categoryItems = items.filter(item => item.category === category);
    const categoryTotal = categoryItems.reduce((sum, item) => 
      sum + convertToMonthly(item.amount, item.frequency), 0
    );
    return {
      label: category,
      value: Math.abs(categoryTotal)
    };
  });

  const incomeVsExpensesData = [
    { label: 'Income', value: totalIncome, color: '#10B981' },
    { label: 'Expenses', value: totalExpenses, color: '#EF4444' }
  ];

  const priorityData = ['high', 'medium', 'low'].map(priority => {
    const priorityItems = items.filter(item => item.priority === priority);
    const priorityTotal = priorityItems.reduce((sum, item) => 
      sum + convertToMonthly(item.amount, item.frequency), 0
    );
    return {
      label: `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`,
      value: Math.abs(priorityTotal)
    };
  }).filter(item => item.value > 0);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            setItems(data);
          }
        } catch (error) {
          alert('Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleOnboardingComplete = (data: any) => {
    // Apply any data from onboarding if needed
    setShouldShowOnboarding(false);
  };

  const exportData = {
    summary: {
      totalIncome,
      totalExpenses,
      netIncome,
      totalItems: items.length
    },
    items,
    generatedAt: new Date().toISOString()
  };

  const csvData = items.map(item => ({
    Category: item.category,
    Description: item.description,
    Amount: item.amount,
    Type: item.type,
    Frequency: item.frequency,
    'Monthly Equivalent': convertToMonthly(item.amount, item.frequency).toFixed(2),
    Priority: item.priority,
    Notes: item.notes,
    'Is Recurring': item.isRecurring ? 'Yes' : 'No'
  }));

  return (
    <div className="space-y-6">
      {/* Progressive Onboarding */}
      {shouldShowOnboarding && (
        <ProgressiveOnboarding
          toolName="Budget Card Conveyor"
          steps={getOnboardingSteps('budget-card-conveyor')}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShouldShowOnboarding(false)}
        />
      )}

      {/* Onboarding Trigger */}
      <OnboardingTrigger
        toolName="Budget Card Conveyor"
        onStart={() => setShouldShowOnboarding(true)}
      />

      {/* Export and Import Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          toolId={toolId}
          filename="budget-analysis"
          title="Budget Analysis Report"
          elementId="budget-content"
        />
        <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </label>
      </div>

      <div id="budget-content">
      <AutoSaveIndicator
        toolName="Budget Card Conveyor"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <SmartSuggestions
        toolName="budget-card-conveyor"
        suggestions={getSmartSuggestions('budget-card-conveyor')}
        onUseSuggestion={handleUseSuggestions}
        onDismiss={() => setShowSuggestions(false)}
        visible={showSuggestions}
      />

      {/* Data Visualizations Toggle */}
      {items.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showVisualizations}
              onChange={(e) => setShowVisualizations(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-lg font-medium">Show Visual Analytics</span>
            <span className="text-sm text-gray-400">(Charts & graphs for better insights)</span>
          </label>
        </div>
      )}

      {/* Advanced Mode Toggle */}
      <div className="bg-gray-800 rounded-lg p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={(e) => setShowAdvanced(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-lg font-medium">Show Advanced Mode</span>
          <span className="text-sm text-gray-400">(More fields & tracking options)</span>
        </label>
      </div>

      {/* Add New Item Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Budget Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Category (e.g., Housing, Food, Entertainment)"
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Category (e.g., Housing, Food)"
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newItem.amount || ''}
            onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({...newItem, type: e.target.value as 'income' | 'expense'})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={newItem.frequency}
            onChange={(e) => setNewItem({...newItem, frequency: e.target.value as any})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          {showAdvanced && (
            <>
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem({...newItem, priority: e.target.value as 'high' | 'medium' | 'low'})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="text"
                placeholder="Notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <label className="flex items-center gap-2 px-3 py-2">
                <input
                  type="checkbox"
                  checked={newItem.isRecurring}
                  onChange={(e) => setNewItem({...newItem, isRecurring: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Recurring Item</span>
              </label>
              <input
                type="date"
                placeholder="Start Date"
                value={newItem.startDate}
                onChange={(e) => setNewItem({...newItem, startDate: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="date"
                placeholder="End Date (optional)"
                value={newItem.endDate}
                onChange={(e) => setNewItem({...newItem, endDate: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </>
          )}
          
          <button
            onClick={addItem}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Edit Mode Button */}
      {items.length > 0 && !editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleEditMode}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Budget Items
          </button>
        </div>
      )}

      {editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      )}

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-green-100">Monthly Income</h3>
          <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
          {showVisualizations && totalIncome > 0 && (
            <div className="mt-2">
              <ProgressRing 
                percentage={100} 
                size={60} 
                color="#10B981" 
                showPercentage={false}
              />
            </div>
          )}
        </div>
        <div className="bg-red-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-red-100">Monthly Expenses</h3>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          {showVisualizations && totalExpenses > 0 && (
            <div className="mt-2">
              <ProgressRing 
                percentage={totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0} 
                size={60} 
                color="#EF4444" 
                showPercentage={false}
              />
            </div>
          )}
        </div>
        <div className={`${netIncome >= 0 ? 'bg-blue-600' : 'bg-orange-600'} rounded-lg p-4 text-center`}>
          <h3 className="text-sm font-medium text-blue-100">Net Income</h3>
          <p className="text-2xl font-bold">${netIncome.toFixed(2)}</p>
          {showVisualizations && (
            <div className="mt-2">
              <ProgressRing 
                percentage={totalIncome > 0 ? Math.abs(netIncome / totalIncome) * 100 : 0} 
                size={60} 
                color={netIncome >= 0 ? '#3B82F6' : '#F97316'} 
                showPercentage={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Visualizations */}
      {showVisualizations && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
            <div className="flex justify-center">
              <PieChart data={incomeVsExpensesData} size={200} />
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryData.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
              <BarChart data={categoryData} height={200} />
            </div>
          )}
        </div>
      )}

      {/* Priority Visualization */}
      {showVisualizations && showAdvanced && priorityData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Priority Distribution</h3>
          <div className="flex justify-center">
            <PieChart 
              data={priorityData.map((item, index) => ({
                ...item,
                color: index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#10B981'
              }))} 
              size={250} 
            />
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{item.description}</h4>
                <p className="text-sm text-gray-400">
                  {item.category} • {item.type} • {item.frequency}
                  {item.priority && showAdvanced && ` • ${item.priority} priority`}
                </p>
                {showAdvanced && item.notes && (
                  <p className="text-xs text-blue-400">{item.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${item.amount.toFixed(2)}</span>
                {editingId === item.id ? (
                  <button
                    onClick={saveEdit}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(item.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {editingId === item.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Category"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Amount"
                />
                <select
                  value={item.type}
                  onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  value={item.frequency}
                  onChange={(e) => updateItem(item.id, 'frequency', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {showAdvanced && (
                  <>
                    <select
                      value={item.priority}
                      onChange={(e) => updateItem(item.id, 'priority', e.target.value)}
                      className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Notes"
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Monthly equivalent: ${convertToMonthly(item.amount, item.frequency).toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Summary */}
      {items.length > 0 && showAdvanced && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...new Set(items.map(item => item.category))].filter(Boolean).map(category => {
              const categoryItems = items.filter(item => item.category === category);
              const categoryTotal = categoryItems.reduce((sum, item) => 
                sum + convertToMonthly(item.amount, item.frequency), 0
              );
              const incomeItems = categoryItems.filter(item => item.type === 'income');
              const expenseItems = categoryItems.filter(item => item.type === 'expense');
              
              return (
                <div key={category} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{category}</h4>
                  <p className="text-sm text-gray-400">{categoryItems.length} items</p>
                  <p className="text-lg font-bold text-blue-400">${Math.abs(categoryTotal).toFixed(2)}/month</p>
                  {incomeItems.length > 0 && expenseItems.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      <p>Income: {incomeItems.length} items</p>
                      <p>Expenses: {expenseItems.length} items</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Priority Summary */}
      {items.length > 0 && showAdvanced && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Priority Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['high', 'medium', 'low'].map(priority => {
              const priorityItems = items.filter(item => item.priority === priority);
              const priorityTotal = priorityItems.reduce((sum, item) => 
                sum + convertToMonthly(item.amount, item.frequency), 0
              );
              
              return (
                <div key={priority} className={`rounded-lg p-4 ${
                  priority === 'high' ? 'bg-red-600' :
                  priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                }`}>
                  <h4 className="font-medium mb-2 capitalize">{priority} Priority</h4>
                  <p className="text-sm opacity-90">{priorityItems.length} items</p>
                  <p className="text-lg font-bold">${Math.abs(priorityTotal).toFixed(2)}/month</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No budget items added yet. Start by adding your income and expenses above.</p>
        </div>
      )}
      </div>
    </div>
  );
};