import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  category: string;
  nextBilling: string;
  isActive: boolean;
}

export const SubscriptionPurgeTool: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    cost: 0,
    frequency: 'monthly' as 'monthly' | 'yearly' | 'weekly',
    category: '',
    nextBilling: '',
    isActive: true
  });

  const addSubscription = () => {
    if (newSubscription.name && newSubscription.cost > 0) {
      setSubscriptions([...subscriptions, {
        id: Date.now().toString(),
        ...newSubscription
      }]);
      setNewSubscription({
        name: '',
        cost: 0,
        frequency: 'monthly',
        category: '',
        nextBilling: '',
        isActive: true
      });
    }
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
    ));
  };

  const convertToMonthly = (cost: number, frequency: string) => {
    switch (frequency) {
      case 'weekly': return cost * 4.33;
      case 'monthly': return cost;
      case 'yearly': return cost / 12;
      default: return cost;
    }
  };

  const calculateTotals = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.isActive);
    const inactiveSubscriptions = subscriptions.filter(sub => !sub.isActive);
    
    const monthlyTotal = activeSubscriptions.reduce((sum, sub) => 
      sum + convertToMonthly(sub.cost, sub.frequency), 0
    );
    
    const yearlyTotal = monthlyTotal * 12;
    
    const potentialSavings = inactiveSubscriptions.reduce((sum, sub) => 
      sum + convertToMonthly(sub.cost, sub.frequency), 0
    ) * 12;

    return {
      monthlyTotal,
      yearlyTotal,
      potentialSavings,
      activeCount: activeSubscriptions.length,
      inactiveCount: inactiveSubscriptions.length
    };
  };

  const totals = calculateTotals();

  const exportData = {
    subscriptions,
    totals,
    exportDate: new Date().toISOString()
  };

  const csvData = subscriptions.map(sub => ({
    'Service Name': sub.name,
    'Cost': sub.cost,
    'Frequency': sub.frequency,
    'Category': sub.category,
    'Next Billing': sub.nextBilling,
    'Active': sub.isActive ? 'Yes' : 'No',
    'Monthly Equivalent': convertToMonthly(sub.cost, sub.frequency).toFixed(2)
  }));

  const categories = [...new Set(subscriptions.map(sub => sub.category))].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="subscriptions"
          title="Subscription Tracker"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Subscription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Service Name"
            value={newSubscription.name}
            onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Cost"
            value={newSubscription.cost || ''}
            onChange={(e) => setNewSubscription({...newSubscription, cost: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={newSubscription.frequency}
            onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value as any})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            value={newSubscription.category}
            onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Next Billing"
            value={newSubscription.nextBilling}
            onChange={(e) => setNewSubscription({...newSubscription, nextBilling: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addSubscription}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-red-100">Monthly Total</h3>
          <p className="text-2xl font-bold">${totals.monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="bg-orange-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-orange-100">Yearly Total</h3>
          <p className="text-2xl font-bold">${totals.yearlyTotal.toFixed(2)}</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-green-100">Potential Savings</h3>
          <p className="text-2xl font-bold">${totals.potentialSavings.toFixed(2)}</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-blue-100">Active Subscriptions</h3>
          <p className="text-2xl font-bold">{totals.activeCount}</p>
        </div>
      </div>

      <div className="space-y-2">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className={`rounded-lg p-4 border-2 ${
            subscription.isActive 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-800/50 border-gray-600 opacity-60'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={subscription.isActive}
                  onChange={() => toggleSubscription(subscription.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <h4 className="font-medium">{subscription.name}</h4>
                  <p className="text-sm text-gray-400">
                    {subscription.category} • Next billing: {subscription.nextBilling || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">${subscription.cost.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{subscription.frequency}</p>
                  <p className="text-xs text-blue-400">
                    ${convertToMonthly(subscription.cost, subscription.frequency).toFixed(2)}/month
                  </p>
                </div>
                <button
                  onClick={() => removeSubscription(subscription.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">By Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categorySubscriptions = subscriptions.filter(sub => sub.category === category && sub.isActive);
              const categoryTotal = categorySubscriptions.reduce((sum, sub) => 
                sum + convertToMonthly(sub.cost, sub.frequency), 0
              );
              
              return (
                <div key={category} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{category}</h4>
                  <p className="text-sm text-gray-400">{categorySubscriptions.length} subscriptions</p>
                  <p className="text-lg font-bold text-blue-400">${categoryTotal.toFixed(2)}/month</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};