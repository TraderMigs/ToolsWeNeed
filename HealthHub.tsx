import React, { useState } from 'react';
import { Edit, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

export const HourlyRateCalculator: React.FC = () => {
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState(75000);
  const [workingWeeksPerYear, setWorkingWeeksPerYear] = useState(50);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [businessExpenses, setBusinessExpenses] = useState(15000);
  const [taxRate, setTaxRate] = useState(25);
  const [profitMargin, setProfitMargin] = useState(20);
  const [productSales, setProductSales] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [billableRatio, setBillableRatio] = useState(75);
  const [minimumHours, setMinimumHours] = useState(4);

  const calculateRates = () => {
    const totalWorkingHours = workingWeeksPerYear * hoursPerWeek;
    const grossIncomeNeeded = desiredAnnualIncome / (1 - taxRate / 100);
    const productRevenue = productSales * productPrice;
    const serviceRevenueNeeded = Math.max(0, grossIncomeNeeded + businessExpenses - productRevenue);
    const totalRevenueNeeded = serviceRevenueNeeded;
    const revenueWithProfit = totalRevenueNeeded / (1 - profitMargin / 100);
    
    const baseHourlyRate = serviceRevenueNeeded / totalWorkingHours;
    const hourlyRateWithProfit = revenueWithProfit / totalWorkingHours;
    
    // Different billing scenarios
    const billableHoursRatio = billableRatio / 100; // Convert percentage to decimal
    const adjustedHourlyRate = hourlyRateWithProfit / billableHoursRatio;

    // Advanced calculations
    const weeklyRate = adjustedHourlyRate * 40;
    const monthlyRate = adjustedHourlyRate * 160;
    const projectRate = adjustedHourlyRate * 8; // Day rate
    const retainerRate = monthlyRate * 0.8; // 20% discount for retainer

    return {
      totalWorkingHours,
      grossIncomeNeeded,
      serviceRevenueNeeded,
      productRevenue,
      totalRevenueNeeded,
      revenueWithProfit,
      baseHourlyRate,
      hourlyRateWithProfit,
      adjustedHourlyRate,
      dailyRate: projectRate,
      weeklyRate,
      monthlyRate,
      retainerRate,
      minimumProjectRate: adjustedHourlyRate * 4 // Minimum 4-hour projects
    };
  };

  const results = calculateRates();
  const hasResults = desiredAnnualIncome > 0;

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  const exportData = {
    inputs: {
      desiredAnnualIncome,
      workingWeeksPerYear,
      hoursPerWeek,
      businessExpenses,
      taxRate,
      profitMargin
    },
    results,
    date: new Date().toISOString()
  };

  const csvData = [{
    'Desired Annual Income': desiredAnnualIncome,
    'Working Weeks/Year': workingWeeksPerYear,
    'Hours/Week': hoursPerWeek,
    'Business Expenses': businessExpenses,
    'Tax Rate (%)': taxRate,
    'Profit Margin (%)': profitMargin,
    'Recommended Hourly Rate': results.adjustedHourlyRate.toFixed(2),
    'Daily Rate': results.dailyRate.toFixed(2),
    'Weekly Rate': results.weeklyRate.toFixed(2),
    'Monthly Rate': results.monthlyRate.toFixed(2)
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="hourly-rate-calculation"
          title="Hourly Rate Calculator Results"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Income Goals</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Desired Annual Income (After Tax)
              </label>
              <input
                type="number"
                value={desiredAnnualIncome}
                onChange={(e) => setDesiredAnnualIncome(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Working Weeks Per Year
              </label>
              <input
                type="number"
                value={workingWeeksPerYear}
                onChange={(e) => setWorkingWeeksPerYear(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hours Per Week
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Business Factors</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Annual Business Expenses
              </label>
              <input
                type="number"
                value={businessExpenses}
                onChange={(e) => setBusinessExpenses(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profit Margin (%)
              </label>
              <input
                type="number"
                value={profitMargin}
                onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        {/* Advanced Fields Toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            + Advanced Rate Options
          </button>
          
          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Billable Hours Ratio (%)
                </label>
                <input
                  type="number"
                  value={billableRatio || 75}
                  onChange={(e) => setBillableRatio(parseInt(e.target.value) || 75)}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="75% (default)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Project Hours
                </label>
                <input
                  type="number"
                  value={minimumHours || 4}
                  onChange={(e) => setMinimumHours(parseInt(e.target.value) || 4)}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="4 hours minimum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Product Sales (units/year)
                </label>
                <input
                  type="number"
                  value={productSales || ''}
                  onChange={(e) => setProductSales(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 100 courses sold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Price (per unit)
                </label>
                <input
                  type="number"
                  value={productPrice || ''}
                  onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., $299 per course"
                />
              </div>
              {productSales > 0 && productPrice > 0 && (
                <div className="md:col-span-2 p-3 bg-green-600/20 rounded-lg border border-green-500">
                  <p className="text-green-400 font-medium">
                    Product Revenue: ${results.productRevenue.toFixed(2)}/year
                  </p>
                  <p className="text-sm text-green-300">
                    This reduces your required hourly rate for services
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Professional Rate Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-600 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-blue-100">Hourly Rate</h4>
            <p className="text-2xl font-bold">${results.adjustedHourlyRate.toFixed(2)}</p>
            <p className="text-xs text-blue-200">Accounts for non-billable time</p>
          </div>
          <div className="bg-green-600 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-green-100">Daily Rate</h4>
            <p className="text-2xl font-bold">${results.dailyRate.toFixed(2)}</p>
            <p className="text-xs text-green-200">8 hours</p>
          </div>
          <div className="bg-purple-600 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-purple-100">Weekly Rate</h4>
            <p className="text-2xl font-bold">${results.weeklyRate.toFixed(2)}</p>
            <p className="text-xs text-purple-200">40 hours</p>
          </div>
          <div className="bg-orange-600 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-orange-100">Monthly Rate</h4>
            <p className="text-2xl font-bold">${results.monthlyRate.toFixed(2)}</p>
            <p className="text-xs text-orange-200">160 hours</p>
          </div>
          {showAdvanced && (
            <div className="bg-teal-600 rounded-lg p-4 text-center">
              <h4 className="text-sm font-medium text-teal-100">Retainer Rate</h4>
              <p className="text-2xl font-bold">${results.retainerRate.toFixed(2)}</p>
              <p className="text-xs text-teal-200">Monthly retainer (20% discount)</p>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Edit Mode Button */}
      {hasResults && !editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleEditMode}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Rate Parameters
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

      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Rate Calculation Analysis</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Working Hours/Year</span>
            <span className="font-medium">{results.totalWorkingHours.toFixed(0)} hours</span>
          </div>
          <div className="flex justify-between">
            <span>Gross Income Needed (Pre-Tax)</span>
            <span className="font-medium">${results.grossIncomeNeeded.toFixed(2)}</span>
          </div>
          {results.productRevenue > 0 && (
            <div className="flex justify-between">
              <span>Product Revenue</span>
              <span className="font-medium text-green-400">${results.productRevenue.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Service Revenue Needed (+ Expenses)</span>
            <span className="font-medium">${results.serviceRevenueNeeded.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Revenue with Profit Margin</span>
            <span className="font-medium">${results.revenueWithProfit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-2">
            <span className="font-semibold">Base Hourly Rate</span>
            <span className="font-bold text-blue-400">${results.baseHourlyRate.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Adjusted for Non-Billable Time</span>
            <span className="font-bold text-green-400">${results.adjustedHourlyRate.toFixed(2)}</span>
          </div>
          {showAdvanced && (
            <>
              <div className="flex justify-between">
                <span>Minimum Project Rate</span>
                <span className="font-medium text-purple-400">${results.minimumProjectRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Retainer Discount Rate</span>
                <span className="font-medium text-teal-400">${results.retainerRate.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h4 className="font-medium mb-2">Notes:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Adjusted rate assumes 75% of time is billable</li>
          <li>• Includes profit margin for business growth and emergencies</li>
          <li>• Product sales can significantly reduce required hourly rates</li>
          <li>• Consider market rates and client budgets when setting final prices</li>
          <li>• Review and adjust rates annually or as circumstances change</li>
          {showAdvanced && (
            <>
              <li>• Retainer rates offer stability in exchange for slight discount</li>
              <li>• Minimum project rates prevent unprofitable small jobs</li>
              <li>• Consider value-based pricing for high-impact projects</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};