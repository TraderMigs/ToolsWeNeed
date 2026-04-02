import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { ProgressRing, PieChart, BarChart } from '../DataVisualization';

interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'liquid' | 'investment' | 'property' | 'other';
}

interface Liability {
  id: string;
  name: string;
  amount: number;
  type: 'mortgage' | 'loan' | 'credit_card' | 'other';
}

export const NetWorthSnapshot: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const [newAsset, setNewAsset] = useState({
    name: '',
    value: 0,
    type: 'liquid' as Asset['type']
  });
  const [newLiability, setNewLiability] = useState({
    name: '',
    amount: 0,
    type: 'mortgage' as Liability['type']
  });

  const addAsset = () => {
    if (newAsset.name && newAsset.value > 0) {
      setAssets([...assets, {
        id: Date.now().toString(),
        ...newAsset
      }]);
      setNewAsset({ name: '', value: 0, type: 'liquid' });
    }
  };

  const addLiability = () => {
    if (newLiability.name && newLiability.amount > 0) {
      setLiabilities([...liabilities, {
        id: Date.now().toString(),
        ...newLiability
      }]);
      setNewLiability({ name: '', amount: 0, type: 'mortgage' });
    }
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter(liability => liability.id !== id));
  };

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  // Prepare visualization data
  const assetTypeData = ['liquid', 'investment', 'property', 'other'].map(type => {
    const typeAssets = assets.filter(asset => asset.type === type);
    const typeTotal = typeAssets.reduce((sum, asset) => sum + asset.value, 0);
    return {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: typeTotal
    };
  }).filter(item => item.value > 0);

  const liabilityTypeData = ['mortgage', 'loan', 'credit_card', 'other'].map(type => {
    const typeLiabilities = liabilities.filter(liability => liability.type === type);
    const typeTotal = typeLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
    return {
      label: type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1),
      value: typeTotal
    };
  }).filter(item => item.value > 0);

  const netWorthData = [
    { label: 'Assets', value: totalAssets, color: '#10B981' },
    { label: 'Liabilities', value: totalLiabilities, color: '#EF4444' }
  ];

  const exportData = {
    assets,
    liabilities,
    summary: {
      totalAssets,
      totalLiabilities,
      netWorth,
      date: new Date().toISOString()
    }
  };

  const csvData = [
    ...assets.map(asset => ({
      Type: 'Asset',
      Name: asset.name,
      Category: asset.type,
      Value: asset.value
    })),
    ...liabilities.map(liability => ({
      Type: 'Liability',
      Name: liability.name,
      Category: liability.type,
      Value: liability.amount
    }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="net-worth-snapshot"
          title="Net Worth Snapshot"
        />
      </div>

      {/* Visualizations Toggle */}
      {(assets.length > 0 || liabilities.length > 0) && (
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showVisualizations}
              onChange={(e) => setShowVisualizations(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-lg font-medium">Show Net Worth Visualizations</span>
            <span className="text-sm text-gray-400">(Asset & liability breakdowns)</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-green-100">Total Assets</h3>
          <p className="text-2xl font-bold">${totalAssets.toFixed(2)}</p>
          {showVisualizations && totalAssets > 0 && (
            <div className="mt-2 flex justify-center">
              <ProgressRing 
                percentage={100} 
                size={50} 
                color="#10B981" 
                showPercentage={false}
              />
            </div>
          )}
        </div>
        <div className="bg-red-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-red-100">Total Liabilities</h3>
          <p className="text-2xl font-bold">${totalLiabilities.toFixed(2)}</p>
          {showVisualizations && totalLiabilities > 0 && (
            <div className="mt-2 flex justify-center">
              <ProgressRing 
                percentage={totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0} 
                size={50} 
                color="#EF4444" 
                showPercentage={false}
              />
            </div>
          )}
        </div>
        <div className={`${netWorth >= 0 ? 'bg-blue-600' : 'bg-orange-600'} rounded-lg p-4 text-center`}>
          <h3 className="text-sm font-medium text-blue-100">Net Worth</h3>
          <p className="text-2xl font-bold">${netWorth.toFixed(2)}</p>
          {showVisualizations && (
            <div className="mt-2 flex justify-center">
              <ProgressRing 
                percentage={totalAssets > 0 ? Math.abs(netWorth / totalAssets) * 100 : 0} 
                size={50} 
                color={netWorth >= 0 ? '#3B82F6' : '#F97316'} 
                showPercentage={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Visualizations */}
      {showVisualizations && (totalAssets > 0 || totalLiabilities > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assets vs Liabilities Overview */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Assets vs Liabilities</h3>
            <div className="flex justify-center">
              <PieChart data={netWorthData} size={180} />
            </div>
          </div>

          {/* Asset Type Breakdown */}
          {assetTypeData.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Assets by Type</h3>
              <div className="flex justify-center">
                <PieChart data={assetTypeData} size={180} />
              </div>
            </div>
          )}

          {/* Liability Type Breakdown */}
          {liabilityTypeData.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Liabilities by Type</h3>
              <div className="flex justify-center">
                <PieChart data={liabilityTypeData} size={180} />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Assets</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Asset Name"
                value={newAsset.name}
                onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Value"
                value={newAsset.value || ''}
                onChange={(e) => setNewAsset({...newAsset, value: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <select
                value={newAsset.type}
                onChange={(e) => setNewAsset({...newAsset, type: e.target.value as Asset['type']})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="liquid">Liquid (Cash/Savings)</option>
                <option value="investment">Investment</option>
                <option value="property">Property</option>
                <option value="other">Other</option>
              </select>
              <button
                onClick={addAsset}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{asset.name}</h4>
                    <p className="text-sm text-gray-400 capitalize">{asset.type.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-400">${asset.value.toFixed(2)}</span>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Liabilities</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Liability Name"
                value={newLiability.name}
                onChange={(e) => setNewLiability({...newLiability, name: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newLiability.amount || ''}
                onChange={(e) => setNewLiability({...newLiability, amount: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <select
                value={newLiability.type}
                onChange={(e) => setNewLiability({...newLiability, type: e.target.value as Liability['type']})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="mortgage">Mortgage</option>
                <option value="loan">Loan</option>
                <option value="credit_card">Credit Card</option>
                <option value="other">Other</option>
              </select>
              <button
                onClick={addLiability}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {liabilities.map((liability) => (
                <div key={liability.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{liability.name}</h4>
                    <p className="text-sm text-gray-400 capitalize">{liability.type.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-400">${liability.amount.toFixed(2)}</span>
                    <button
                      onClick={() => removeLiability(liability.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};