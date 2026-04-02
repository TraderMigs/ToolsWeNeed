import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData, hasToolData, saveToolDataWithAnalytics } from '../../utils/storageUtils';
import { SmartSuggestions } from '../SmartSuggestions';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import { getSmartSuggestions } from '../../data/smartSuggestions';
import { ProgressRing, BarChart, TrendLine } from '../DataVisualization';
import { ProgressiveOnboarding, getOnboardingSteps, OnboardingTrigger, useProgressiveOnboarding } from '../ProgressiveOnboarding';

interface Debt {
  id: string;
  name: string;
  creditorName: string;
  balance: number;
  minPayment: number;
  interestRate: number;
  dueDate: string;
  category: string;
  accountNumber: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

interface DebtSnowballTrackerProps {
  toolId?: string;
}

const debtCategories = [
  'Credit Card',
  'Student Loan',
  'Auto Loan',
  'Personal Loan',
  'Medical Debt',
  'Mortgage',
  'Home Equity',
  'Business Loan',
  'Other'
];

export const DebtSnowballTracker: React.FC<DebtSnowballTrackerProps> = ({ toolId }) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const { shouldShowOnboarding, setShouldShowOnboarding } = useProgressiveOnboarding('debt_snowball_tracker');
  const [newDebt, setNewDebt] = useState({
    name: '',
    creditorName: '',
    balance: 0,
    minPayment: 0,
    interestRate: 0,
    dueDate: '',
    category: 'Credit Card',
    accountNumber: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    notes: ''
  });

  // Load saved data on component mount
  React.useEffect(() => {
    const savedData = loadToolData('debt_snowball_tracker');
    if (savedData) {
      if (savedData.debts) setDebts(savedData.debts);
      if (savedData.extraPayment) setExtraPayment(savedData.extraPayment);
      if (savedData.strategy) setStrategy(savedData.strategy);
      setHasSavedData(true);
    } else {
      setShowSuggestions(true);
    }
  }, []);

  // Auto-save data when it changes
  React.useEffect(() => {
    if (debts.length > 0 || extraPayment > 0) {
      saveToolData('debt_snowball_tracker', {
        debts,
        extraPayment,
        strategy
      });
      setHasSavedData(true);
    }
  }, [debts, extraPayment, strategy]);

  const handleClearSavedData = () => {
    clearToolData('debt_snowball_tracker');
    setHasSavedData(false);
    setDebts([]);
    setExtraPayment(0);
    setStrategy('snowball');
  };

  const handleUseSuggestions = (suggestions: any) => {
    if (suggestions.debts) setDebts(suggestions.debts);
    if (suggestions.extraPayment) setExtraPayment(suggestions.extraPayment);
    if (suggestions.strategy) setStrategy(suggestions.strategy);
    setShowSuggestions(false);
  };
  const addDebt = () => {
  const handleOnboardingComplete = (data: any) => {
    setShouldShowOnboarding(false);
  };

  // Prepare visualization data
  const debtVisualizationData = [...debts].sort((a, b) => 
    strategy === 'snowball' ? a.balance - b.balance : b.interestRate - a.interestRate
  ).map((debt, index) => ({
    label: debt.name,
    value: debt.balance
  }));

  const payoffProjection = debts.length > 0 ? debts.map((debt, index) => ({
    label: `Month ${index + 1}`,
    value: debt.balance * (1 - (index * 0.1)) // Simplified projection
  })) : [];

    if (newDebt.name && newDebt.balance > 0) {
      setDebts([...debts, {
        id: Date.now().toString(),
        ...newDebt
      }]);
      setNewDebt({
        name: '',
        creditorName: '',
        balance: 0,
        minPayment: 0,
        interestRate: 0,
        dueDate: '',
        category: 'Credit Card',
        accountNumber: '',
        priority: 'medium',
        notes: ''
      });
    }
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const startEditing = (id: string) => {
    setEditingId(id);
  };

  const saveEdit = () => {
    setEditingId(null);
  };

  const calculateSnowball = () => {
    const sortedDebts = strategy === 'snowball' 
      ? [...debts].sort((a, b) => a.balance - b.balance)
      : [...debts].sort((a, b) => b.interestRate - a.interestRate);
    
    const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
    const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalInterest = debts.reduce((sum, debt) => sum + (debt.balance * debt.interestRate / 100), 0);
    
    let monthsToPayoff = 0;
    let remainingDebts = [...sortedDebts];
    let currentExtraPayment = extraPayment;
    let totalInterestPaid = 0;

    while (remainingDebts.length > 0) {
      monthsToPayoff++;
      
      // Apply payments to all debts
      remainingDebts = remainingDebts.map(debt => {
        const payment = debt.minPayment + (debt === remainingDebts[0] ? currentExtraPayment : 0);
        const interestCharge = debt.balance * (debt.interestRate / 100 / 12);
        totalInterestPaid += interestCharge;
        const newBalance = Math.max(0, debt.balance + interestCharge - payment);
        
        return { ...debt, balance: newBalance };
      });

      // Remove paid-off debts and add their minimum payment to extra payment
      const paidOffDebts = remainingDebts.filter(debt => debt.balance === 0);
      remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
      currentExtraPayment += paidOffDebts.reduce((sum, debt) => sum + debt.minPayment, 0);

      if (monthsToPayoff > 600) break; // Safety check
    }

    return {
      monthsToPayoff,
      yearsToPayoff: monthsToPayoff / 12,
      totalBalance,
      totalMinPayments,
      totalInterest,
      totalInterestPaid,
      monthlySavings: currentExtraPayment
    };
  };

  const results = calculateSnowball();
  const hasResults = debts.length > 0;

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
    setEditingId(null);
  };

  const exportData = {
    strategy,
    extraPayment,
    debts,
    results,
    generatedAt: new Date().toISOString()
  };

  const csvData = debts.map(debt => ({
    'Debt Name': debt.name,
    'Creditor': debt.creditorName,
    'Balance': debt.balance,
    'Min Payment': debt.minPayment,
    'Interest Rate': debt.interestRate,
    'Due Date': debt.dueDate,
    'Category': debt.category,
    'Account Number': debt.accountNumber,
    'Priority': debt.priority,
    'Notes': debt.notes,
    'Snowball Order': debts.sort((a, b) => 
      strategy === 'snowball' ? a.balance - b.balance : b.interestRate - a.interestRate
    ).findIndex(d => d.id === debt.id) + 1
  }));

  return (
    <div className="space-y-6">
      {/* Progressive Onboarding */}
      {shouldShowOnboarding && (
        <ProgressiveOnboarding
          toolName="Debt Snowball Tracker"
          steps={getOnboardingSteps('debt-snowball-tracker')}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShouldShowOnboarding(false)}
        />
      )}

      {/* Onboarding Trigger */}
      <OnboardingTrigger
        toolName="Debt Snowball Tracker"
        onStart={() => setShouldShowOnboarding(true)}
      />

      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          toolId={toolId}
          filename="debt-snowball"
          title="Debt Snowball Tracker"
          elementId="debt-snowball-content"
        />
      </div>

      <div id="debt-snowball-content">
      <AutoSaveIndicator
        toolName="Debt Snowball Tracker"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <SmartSuggestions
        toolName="debt-snowball-tracker"
        suggestions={getSmartSuggestions('debt-snowball-tracker')}
        onUseSuggestion={handleUseSuggestions}
        onDismiss={() => setShowSuggestions(false)}
        visible={showSuggestions}
      />

      {/* Visualizations Toggle */}
      {debts.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showVisualizations}
              onChange={(e) => setShowVisualizations(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-lg font-medium">Show Debt Visualizations</span>
            <span className="text-sm text-gray-400">(Progress charts & payoff projections)</span>
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
          <span className="text-sm text-gray-400">(More fields & options)</span>
        </label>
      </div>

      {/* Strategy Selection */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Debt Payoff Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="strategy"
              value="snowball"
              checked={strategy === 'snowball'}
              onChange={(e) => setStrategy(e.target.value as 'snowball' | 'avalanche')}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium">Debt Snowball</div>
              <div className="text-sm text-gray-400">Pay smallest balances first (psychological wins)</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="strategy"
              value="avalanche"
              checked={strategy === 'avalanche'}
              onChange={(e) => setStrategy(e.target.value as 'snowball' | 'avalanche')}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium">Debt Avalanche</div>
              <div className="text-sm text-gray-400">Pay highest interest rates first (save money)</div>
            </div>
          </label>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Debt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Debt Name (e.g., Chase Visa)"
            value={newDebt.name}
            onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Creditor Name"
            value={newDebt.creditorName}
            onChange={(e) => setNewDebt({...newDebt, creditorName: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Current Balance"
            value={newDebt.balance || ''}
            onChange={(e) => setNewDebt({...newDebt, balance: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Minimum Payment"
            value={newDebt.minPayment || ''}
            onChange={(e) => setNewDebt({...newDebt, minPayment: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Interest Rate (%)"
            value={newDebt.interestRate || ''}
            onChange={(e) => setNewDebt({...newDebt, interestRate: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={newDebt.category}
            onChange={(e) => setNewDebt({...newDebt, category: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {debtCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {showAdvanced && (
            <>
              <input
                type="date"
                placeholder="Next Due Date"
                value={newDebt.dueDate}
                onChange={(e) => setNewDebt({...newDebt, dueDate: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Account Number (last 4 digits)"
                value={newDebt.accountNumber}
                onChange={(e) => setNewDebt({...newDebt, accountNumber: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <select
                value={newDebt.priority}
                onChange={(e) => setNewDebt({...newDebt, priority: e.target.value as 'high' | 'medium' | 'low'})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="text"
                placeholder="Notes"
                value={newDebt.notes}
                onChange={(e) => setNewDebt({...newDebt, notes: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none md:col-span-2"
              />
            </>
          )}
          
          <button
            onClick={addDebt}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Debt
          </button>
        </div>
      </div>

      {/* Extra Payment */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Extra Payment Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Extra Monthly Payment Amount
            </label>
            <input
              type="number"
              placeholder="Extra monthly payment amount"
              value={extraPayment || ''}
              onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          {showAdvanced && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Frequency
              </label>
              <select className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none">
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {hasResults && (
        <>
          {/* Enhanced Results with Visualizations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-600 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-100">Total Debt</h3>
              <p className="text-2xl font-bold">${results.totalBalance.toFixed(2)}</p>
              {showVisualizations && (
                <div className="mt-2 flex justify-center">
                  <ProgressRing 
                    percentage={100} 
                    size={50} 
                    color="#EF4444" 
                    showPercentage={false}
                  />
                </div>
              )}
            </div>
            <div className="bg-orange-600 rounded-lg p-4">
              <h3 className="text-sm font-medium text-orange-100">Min Payments</h3>
              <p className="text-2xl font-bold">${results.totalMinPayments.toFixed(2)}</p>
            </div>
            <div className="bg-blue-600 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-100">Months to Payoff</h3>
              <p className="text-2xl font-bold">{results.monthsToPayoff}</p>
              {showVisualizations && (
                <div className="mt-2 flex justify-center">
                  <ProgressRing 
                    percentage={Math.max(0, 100 - (results.monthsToPayoff / 60) * 100)} 
                    size={50} 
                    color="#3B82F6" 
                    showPercentage={false}
                  />
                </div>
              )}
            </div>
            <div className="bg-green-600 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-100">Years to Payoff</h3>
              <p className="text-2xl font-bold">{results.yearsToPayoff.toFixed(1)}</p>
            </div>
          </div>

          {/* Debt Visualization Charts */}
          {showVisualizations && debtVisualizationData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {strategy === 'snowball' ? 'Snowball Order' : 'Avalanche Order'} (by Balance)
                </h3>
                <BarChart data={debtVisualizationData} height={200} />
              </div>
              
              {payoffProjection.length > 1 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Projected Payoff Timeline</h3>
                  <TrendLine data={payoffProjection} height={150} color="#10B981" />
                </div>
              )}
            </div>
          )}

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-100">Total Interest Paid</h3>
                <p className="text-2xl font-bold">${results.totalInterestPaid.toFixed(2)}</p>
              </div>
              <div className="bg-teal-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-teal-100">Monthly Savings Potential</h3>
                <p className="text-2xl font-bold">${results.monthlySavings.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Edit Mode Button */}
          {!editMode && (
            <div className="flex justify-center">
              <button
                onClick={handleEditMode}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Debts
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
        </>
      )}

      {/* Debt List with Inline Editing */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {strategy === 'snowball' ? 'Debt Snowball Order' : 'Debt Avalanche Order'}
        </h3>
        {[...debts].sort((a, b) => 
          strategy === 'snowball' ? a.balance - b.balance : b.interestRate - a.interestRate
        ).map((debt, index) => (
          <div key={debt.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  #{index + 1}
                </span>
                <div>
                  <h4 className="font-medium">{debt.name}</h4>
                  <p className="text-sm text-gray-400">
                    {debt.creditorName && `${debt.creditorName} • `}
                    ${debt.balance.toFixed(2)} at {debt.interestRate}% APR
                    {debt.category && ` • ${debt.category}`}
                  </p>
                  {showAdvanced && debt.dueDate && (
                    <p className="text-xs text-blue-400">
                      Next due: {new Date(debt.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {showAdvanced && debt.priority && (
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      debt.priority === 'high' ? 'bg-red-600' :
                      debt.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                    }`}>
                      {debt.priority} priority
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editingId === debt.id ? (
                  <button
                    onClick={saveEdit}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(debt.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {editingId === debt.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Debt Name"
                />
                <input
                  type="text"
                  value={debt.creditorName}
                  onChange={(e) => updateDebt(debt.id, 'creditorName', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Creditor"
                />
                <input
                  type="number"
                  value={debt.balance}
                  onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Balance"
                />
                <input
                  type="number"
                  value={debt.minPayment}
                  onChange={(e) => updateDebt(debt.id, 'minPayment', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Min Payment"
                />
                <input
                  type="number"
                  value={debt.interestRate}
                  onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Interest Rate"
                />
                <select
                  value={debt.category}
                  onChange={(e) => updateDebt(debt.id, 'category', e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {debtCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {showAdvanced && (
                  <>
                    <input
                      type="date"
                      value={debt.dueDate}
                      onChange={(e) => updateDebt(debt.id, 'dueDate', e.target.value)}
                      className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={debt.accountNumber}
                      onChange={(e) => updateDebt(debt.id, 'accountNumber', e.target.value)}
                      className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Account Number"
                    />
                    <select
                      value={debt.priority}
                      onChange={(e) => updateDebt(debt.id, 'priority', e.target.value)}
                      className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <input
                      type="text"
                      value={debt.notes}
                      onChange={(e) => updateDebt(debt.id, 'notes', e.target.value)}
                      className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none md:col-span-2"
                      placeholder="Notes"
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm">${debt.minPayment.toFixed(2)}/month</span>
                {showAdvanced && debt.notes && (
                  <span className="text-sm text-gray-400">{debt.notes}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {debts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No debts added yet. Start by adding your first debt above.</p>
        </div>
      )}
      </div>
    </div>
  );
};