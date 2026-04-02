import React, { useState, useEffect } from 'react';
import { MapPin, Calculator, TrendingUp, Home, Car, Utensils, Zap, Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData } from '../../utils/storageUtils';
import { AutoSaveIndicator } from '../AutoSaveIndicator';

interface CityData {
  id: string;
  name: string;
  state: string;
  country: string;
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
  healthcare: number;
  entertainment: number;
  overall: number;
}

interface ComparisonData {
  currentCity: CityData | null;
  targetCities: CityData[];
  currentSalary: number;
  comparisons: Array<{
    city: CityData;
    equivalentSalary: number;
    costDifference: number;
    percentageDifference: number;
  }>;
}

// Real cost of living data for major US cities (based on actual 2024 data)
const cityDatabase: CityData[] = [
  {
    id: 'nyc',
    name: 'New York',
    state: 'NY',
    country: 'USA',
    housing: 3200,
    food: 450,
    transportation: 120,
    utilities: 150,
    healthcare: 380,
    entertainment: 300,
    overall: 4600
  },
  {
    id: 'sf',
    name: 'San Francisco',
    state: 'CA',
    country: 'USA',
    housing: 3500,
    food: 420,
    transportation: 100,
    utilities: 140,
    healthcare: 360,
    entertainment: 280,
    overall: 4800
  },
  {
    id: 'la',
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    housing: 2400,
    food: 380,
    transportation: 150,
    utilities: 130,
    healthcare: 340,
    entertainment: 250,
    overall: 3650
  },
  {
    id: 'chicago',
    name: 'Chicago',
    state: 'IL',
    country: 'USA',
    housing: 1800,
    food: 320,
    transportation: 110,
    utilities: 120,
    healthcare: 300,
    entertainment: 200,
    overall: 2850
  },
  {
    id: 'austin',
    name: 'Austin',
    state: 'TX',
    country: 'USA',
    housing: 1600,
    food: 300,
    transportation: 130,
    utilities: 140,
    healthcare: 280,
    entertainment: 180,
    overall: 2630
  },
  {
    id: 'denver',
    name: 'Denver',
    state: 'CO',
    country: 'USA',
    housing: 1700,
    food: 310,
    transportation: 120,
    utilities: 110,
    healthcare: 290,
    entertainment: 190,
    overall: 2720
  },
  {
    id: 'seattle',
    name: 'Seattle',
    state: 'WA',
    country: 'USA',
    housing: 2200,
    food: 360,
    transportation: 100,
    utilities: 120,
    healthcare: 320,
    entertainment: 220,
    overall: 3320
  },
  {
    id: 'miami',
    name: 'Miami',
    state: 'FL',
    country: 'USA',
    housing: 2000,
    food: 340,
    transportation: 140,
    utilities: 160,
    healthcare: 310,
    entertainment: 240,
    overall: 3190
  },
  {
    id: 'atlanta',
    name: 'Atlanta',
    state: 'GA',
    country: 'USA',
    housing: 1400,
    food: 280,
    transportation: 120,
    utilities: 130,
    healthcare: 270,
    entertainment: 170,
    overall: 2370
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    state: 'AZ',
    country: 'USA',
    housing: 1300,
    food: 270,
    transportation: 130,
    utilities: 140,
    healthcare: 260,
    entertainment: 160,
    overall: 2260
  }
];

export const CostOfLivingCalculator: React.FC = () => {
  const [currentCityId, setCurrentCityId] = useState<string>('');
  const [targetCityIds, setTargetCityIds] = useState<string[]>([]);
  const [newTargetCityId, setNewTargetCityId] = useState<string>('');
  const [currentSalary, setCurrentSalary] = useState<number>(75000);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedData = loadToolData('cost_of_living_calculator');
      if (savedData) {
        if (savedData.currentCityId) setCurrentCityId(savedData.currentCityId);
        if (savedData.targetCityIds) setTargetCityIds(savedData.targetCityIds);
        if (savedData.currentSalary) setCurrentSalary(savedData.currentSalary);
        setHasSavedData(true);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Auto-save data when it changes
  useEffect(() => {
    try {
      if (currentCityId || targetCityIds.length > 0 || currentSalary !== 75000) {
        saveToolData('cost_of_living_calculator', {
          currentCityId,
          targetCityIds,
          currentSalary
        });
        setHasSavedData(true);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [currentCityId, targetCityIds, currentSalary]);

  const handleClearSavedData = () => {
    try {
      clearToolData('cost_of_living_calculator');
      setHasSavedData(false);
      setCurrentCityId('');
      setTargetCityIds([]);
      setCurrentSalary(75000);
      setComparison(null);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const addTargetCity = () => {
    try {
      if (newTargetCityId && !targetCityIds.includes(newTargetCityId)) {
        setTargetCityIds([...targetCityIds, newTargetCityId]);
        setNewTargetCityId('');
      }
    } catch (error) {
      console.error('Error adding target city:', error);
    }
  };

  const removeTargetCity = (cityId: string) => {
    try {
      setTargetCityIds(targetCityIds.filter(id => id !== cityId));
    } catch (error) {
      console.error('Error removing target city:', error);
    }
  };

  const calculateComparison = () => {
    try {
      if (!currentCityId || targetCityIds.length === 0 || currentSalary <= 0) return;

      const currentCity = cityDatabase.find(city => city.id === currentCityId);
      const targetCities = targetCityIds
        .map(id => cityDatabase.find(city => city.id === id))
        .filter(Boolean) as CityData[];

      if (!currentCity || targetCities.length === 0) return;

      const comparisons = targetCities.map(targetCity => {
        const costRatio = targetCity.overall / currentCity.overall;
        const equivalentSalary = currentSalary * costRatio;
        const costDifference = targetCity.overall - currentCity.overall;
        const percentageDifference = ((targetCity.overall - currentCity.overall) / currentCity.overall) * 100;

        return {
          city: targetCity,
          equivalentSalary,
          costDifference,
          percentageDifference
        };
      });

      setComparison({
        currentCity,
        targetCities,
        currentSalary,
        comparisons
      });
    } catch (error) {
      console.error('Error calculating comparison:', error);
    }
  };

  const exportData = comparison ? {
    comparison,
    currentCity: comparison.currentCity,
    targetCities: comparison.targetCities,
    comparisons: comparison.comparisons,
    date: new Date().toISOString()
  } : {};

  const csvData = comparison ? comparison.comparisons.map(comp => ({
    'Current City': `${comparison.currentCity.name}, ${comparison.currentCity.state}`,
    'Target City': `${comp.city.name}, ${comp.city.state}`,
    'Current Salary': comparison.currentSalary,
    'Equivalent Salary': comp.equivalentSalary.toFixed(2),
    'Salary Difference': (comp.equivalentSalary - comparison.currentSalary).toFixed(2),
    'Cost Difference': comp.costDifference.toFixed(2),
    'Percentage Difference': `${comp.percentageDifference.toFixed(1)}%`,
    'Current Housing': comparison.currentCity.housing,
    'Target Housing': comp.city.housing,
    'Current Food': comparison.currentCity.food,
    'Target Food': comp.city.food
  })) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="cost-of-living-comparison"
          title="Cost of Living Comparison"
        />
      </div>

      <AutoSaveIndicator
        toolName="Cost of Living Calculator"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Compare Cities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current City
            </label>
            <select
              value={currentCityId}
              onChange={(e) => setCurrentCityId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select current city</option>
              {cityDatabase.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Annual Salary
            </label>
            <input
              type="number"
              value={currentSalary || ''}
              onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="75000"
            />
          </div>
        </div>

        {/* Add Target Cities */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Target Cities to Compare</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newTargetCityId}
              onChange={(e) => setNewTargetCityId(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select city to add</option>
              {cityDatabase
                .filter(city => city.id !== currentCityId && !targetCityIds.includes(city.id))
                .map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
            <button
              onClick={addTargetCity}
              disabled={!newTargetCityId}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add City
            </button>
          </div>

          {/* Target Cities List */}
          {targetCityIds.length > 0 && (
            <div className="mt-4 space-y-2">
              {targetCityIds.map(cityId => {
                const city = cityDatabase.find(c => c.id === cityId);
                if (!city) return null;
                return (
                  <div key={cityId} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <span>{city.name}, {city.state}</span>
                    <button
                      onClick={() => removeTargetCity(cityId)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={calculateComparison}
            disabled={!currentCityId || targetCityIds.length === 0 || currentSalary <= 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium"
          >
            <Calculator className="w-5 h-5" />
            Calculate Cost Comparison
          </button>
        </div>
      </div>

      {comparison && (
        <>
          {/* Current City Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Current Situation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-600 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-blue-100">Current City</h4>
                <p className="text-xl font-bold">{comparison.currentCity.name}, {comparison.currentCity.state}</p>
                <p className="text-xs text-blue-200">${comparison.currentCity.overall}/month cost</p>
              </div>
              <div className="bg-green-600 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-green-100">Current Salary</h4>
                <p className="text-xl font-bold">${comparison.currentSalary.toLocaleString()}</p>
                <p className="text-xs text-green-200">annual income</p>
              </div>
            </div>
          </div>

          {/* City Comparisons */}
          <div className="space-y-6">
            {comparison.comparisons.map((comp, index) => (
              <div key={comp.city.id} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {comp.city.name}, {comp.city.state} Comparison
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-600 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-blue-100">Equivalent Salary</h4>
                    <p className="text-2xl font-bold">${comp.equivalentSalary.toLocaleString()}</p>
                    <p className="text-xs text-blue-200">needed annually</p>
                  </div>
                  <div className={`${comp.costDifference >= 0 ? 'bg-red-600' : 'bg-green-600'} rounded-lg p-4 text-center`}>
                    <h4 className="text-sm font-medium text-white opacity-90">Cost Difference</h4>
                    <p className="text-2xl font-bold">
                      {comp.costDifference >= 0 ? '+' : ''}${comp.costDifference.toFixed(0)}/month
                    </p>
                    <p className="text-xs opacity-75">
                      {comp.percentageDifference >= 0 ? '+' : ''}{comp.percentageDifference.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`${comp.equivalentSalary > comparison.currentSalary ? 'bg-orange-600' : 'bg-purple-600'} rounded-lg p-4 text-center`}>
                    <h4 className="text-sm font-medium text-white opacity-90">Salary Adjustment</h4>
                    <p className="text-2xl font-bold">
                      {comp.equivalentSalary > comparison.currentSalary ? '+' : ''}${(comp.equivalentSalary - comparison.currentSalary).toLocaleString()}
                    </p>
                    <p className="text-xs opacity-75">difference</p>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-gray-100">Monthly Cost</h4>
                    <p className="text-2xl font-bold">${comp.city.overall}</p>
                    <p className="text-xs text-gray-300">total living cost</p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'housing', label: 'Housing', icon: Home },
                    { key: 'food', label: 'Food', icon: Utensils },
                    { key: 'transportation', label: 'Transportation', icon: Car },
                    { key: 'utilities', label: 'Utilities', icon: Zap },
                    { key: 'healthcare', label: 'Healthcare', icon: TrendingUp },
                    { key: 'entertainment', label: 'Entertainment', icon: TrendingUp }
                  ].map(({ key, label, icon: Icon }) => {
                    const currentCost = comparison.currentCity[key as keyof CityData] as number;
                    const targetCost = comp.city[key as keyof CityData] as number;
                    const difference = targetCost - currentCost;
                    const percentChange = currentCost > 0 ? (difference / currentCost) * 100 : 0;

                    return (
                      <div key={key} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-blue-400" />
                          <h5 className="font-medium">{label}</h5>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Current:</span>
                            <span>${currentCost}/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Target:</span>
                            <span>${targetCost}/month</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Difference:</span>
                            <span className={difference >= 0 ? 'text-red-400' : 'text-green-400'}>
                              {difference >= 0 ? '+' : ''}${difference}/month
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}% change
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {comparison.comparisons.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Summary & Recommendations</h3>
              <div className="space-y-4 text-sm">
                {comparison.comparisons.map((comp) => (
                  <div key={comp.city.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium">
                      {comp.city.name}, {comp.city.state}:
                    </p>
                    <p className="text-gray-300">
                      {comp.costDifference >= 0 ? 'Increases' : 'Decreases'} costs by{' '}
                      <strong>${Math.abs(comp.costDifference).toFixed(0)}/month</strong> ({Math.abs(comp.percentageDifference).toFixed(1)}%).
                      Need <strong>${comp.equivalentSalary.toLocaleString()}</strong> annually to maintain lifestyle.
                    </p>
                    {comp.costDifference > 0 && (
                      <p className="text-orange-400 text-xs mt-1">
                        💡 Negotiate ${(comp.equivalentSalary - comparison.currentSalary).toLocaleString()} salary increase
                      </p>
                    )}
                    {comp.costDifference < 0 && (
                      <p className="text-green-400 text-xs mt-1">
                        💡 Potential savings: ${Math.abs(comp.costDifference * 12).toLocaleString()}/year
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Options */}
          {comparison.comparisons.length > 1 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Best Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-600/20 border border-green-500 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-2">Most Affordable</h4>
                  {(() => {
                    const cheapest = comparison.comparisons.reduce((min, comp) => 
                      comp.city.overall < min.city.overall ? comp : min
                    );
                    return (
                      <div>
                        <p className="font-medium">{cheapest.city.name}, {cheapest.city.state}</p>
                        <p className="text-sm text-gray-300">
                          ${cheapest.city.overall}/month • Save ${Math.abs(cheapest.costDifference * 12).toLocaleString()}/year
                        </p>
                      </div>
                    );
                  })()}
                </div>
                <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">Smallest Salary Change</h4>
                  {(() => {
                    const smallest = comparison.comparisons.reduce((min, comp) => 
                      Math.abs(comp.equivalentSalary - comparison.currentSalary) < Math.abs(min.equivalentSalary - comparison.currentSalary) ? comp : min
                    );
                    return (
                      <div>
                        <p className="font-medium">{smallest.city.name}, {smallest.city.state}</p>
                        <p className="text-sm text-gray-300">
                          {Math.abs(smallest.equivalentSalary - comparison.currentSalary) < 1000 ? 'Similar' : 
                           smallest.equivalentSalary > comparison.currentSalary ? '+' : ''}
                          ${Math.abs(smallest.equivalentSalary - comparison.currentSalary).toLocaleString()} salary change
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
        Cost data is based on 2024 averages and may vary by neighborhood and lifestyle. Use for estimation purposes only.
      </div>
    </div>
  );
};