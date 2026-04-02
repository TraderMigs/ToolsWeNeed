import React, { useState, useEffect } from 'react';
import { Upload, ChevronUp, ChevronDown, Edit, Save, Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData } from '../../utils/storageUtils';
import { SmartSuggestions } from '../SmartSuggestions';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import { getSmartSuggestions } from '../../data/smartSuggestions';
import { ProgressRing, PieChart, BarChart } from '../DataVisualization';
import { ProgressiveOnboarding, getOnboardingSteps, OnboardingTrigger, useProgressiveOnboarding } from '../ProgressiveOnboarding';

interface TaxData {
  incomes: Array<{
    id: string;
    type: '1099' | 'w2' | 'rental' | 'investment' | 'other';
    source: string;
    amount: number;
    notes: string;
  }>;
  deductions: number;
  filingStatus: 'single' | 'married' | 'head';
  state: string;
  selfEmployed: boolean;
  quarterlyPayments: number;
  healthInsurance: number;
  retirementContributions: number;
  homeOfficeDeduction: number;
  vehicleExpenses: number;
  equipmentExpenses: number;
  professionalServices: number;
  stateIncomeTaxRate: number;
  dependents: number;
  childTaxCredit: boolean;
  itemizedDeductions: Array<{
    id: string;
    category: string;
    description: string;
    amount: number;
  }>;
}

interface SelfEmployedTaxEstimatorProps {
  toolId?: string;
}

// Helper function to get marginal tax rate
const getMarginalRate = (taxableIncome: number): number => {
  if (taxableIncome <= 11000) return 10;
  if (taxableIncome <= 44725) return 12;
  if (taxableIncome <= 95375) return 22;
  if (taxableIncome <= 182050) return 24;
  if (taxableIncome <= 231250) return 32;
  if (taxableIncome <= 578125) return 35;
  return 37;
};

// Main tax calculation function
const calculateTaxes = (taxData: TaxData) => {
  try {
    const { incomes, deductions, filingStatus, selfEmployed,
            healthInsurance, retirementContributions, homeOfficeDeduction, 
            vehicleExpenses, equipmentExpenses, professionalServices,
            stateIncomeTaxRate, dependents, childTaxCredit, quarterlyPayments } = taxData;
    
    const total1099Income = incomes.filter(inc => inc.type === '1099').reduce((sum, inc) => sum + inc.amount, 0);
    const totalW2Income = incomes.filter(inc => inc.type === 'w2').reduce((sum, inc) => sum + inc.amount, 0);
    const totalOtherIncome = incomes.filter(inc => !['1099', 'w2'].includes(inc.type)).reduce((sum, inc) => sum + inc.amount, 0);
    const totalIncome = total1099Income + totalW2Income + totalOtherIncome;
    
    const totalItemizedDeductions = taxData.itemizedDeductions.reduce((sum, ded) => sum + ded.amount, 0);
    const totalBusinessDeductions = deductions + totalItemizedDeductions + healthInsurance + homeOfficeDeduction + 
                                   vehicleExpenses + equipmentExpenses + professionalServices;
    const netIncome = Math.max(0, totalIncome - totalBusinessDeductions);
    
    // Self-employment tax (Social Security + Medicare)
    const selfEmploymentTax = selfEmployed ? total1099Income * 0.1413 : 0;
    const seDeduction = selfEmploymentTax * 0.5; // Half of SE tax is deductible
    
    // Federal tax brackets for 2024
    let federalTax = 0;
    let standardDeduction = 0;
    
    switch (filingStatus) {
      case 'single':
        standardDeduction = 14600;
        break;
      case 'married':
        standardDeduction = 29200;
        break;
      case 'head':
        standardDeduction = 21900;
        break;
    }
    
    const adjustedGrossIncome = netIncome - seDeduction - retirementContributions;
    const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);
    
    if (taxableIncome > 0) {
      if (taxableIncome <= 11000) {
        federalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 44725) {
        federalTax = 1100 + (taxableIncome - 11000) * 0.12;
      } else if (taxableIncome <= 95375) {
        federalTax = 5147 + (taxableIncome - 44725) * 0.22;
      } else if (taxableIncome <= 182050) {
        federalTax = 16290 + (taxableIncome - 95375) * 0.24;
      } else if (taxableIncome <= 231250) {
        federalTax = 37104 + (taxableIncome - 182050) * 0.32;
      } else if (taxableIncome <= 578125) {
        federalTax = 52832 + (taxableIncome - 231250) * 0.35;
      } else {
        federalTax = 174238 + (taxableIncome - 578125) * 0.37;
      }
    }

    // Child Tax Credit
    const childCredit = childTaxCredit && dependents > 0 ? Math.min(dependents * 2000, federalTax) : 0;
    federalTax = Math.max(0, federalTax - childCredit);

    // State tax
    const stateTax = adjustedGrossIncome * (stateIncomeTaxRate / 100);

    const totalTax = federalTax + selfEmploymentTax + stateTax;
    const afterTaxIncome = netIncome - totalTax;
    const effectiveRate = netIncome > 0 ? (totalTax / netIncome) * 100 : 0;
    const marginalRate = getMarginalRate(taxableIncome);
    const remainingQuarterly = Math.max(0, totalTax - quarterlyPayments);

    return {
      grossIncome: totalIncome,
      total1099Income,
      totalW2Income,
      totalOtherIncome,
      totalBusinessDeductions,
      totalItemizedDeductions,
      netIncome,
      adjustedGrossIncome,
      standardDeduction,
      taxableIncome,
      federalTax,
      selfEmploymentTax,
      stateTax,
      totalTax,
      afterTaxIncome,
      effectiveRate,
      marginalRate,
      quarterlyPayment: totalTax / 4,
      monthlyPayment: totalTax / 12,
      seDeduction,
      childCredit,
      remainingQuarterly
    };
  } catch (error) {
    console.error('Error calculating taxes:', error);
    return {
      grossIncome: 0,
      total1099Income: 0,
      totalW2Income: 0,
      totalOtherIncome: 0,
      totalBusinessDeductions: 0,
      totalItemizedDeductions: 0,
      netIncome: 0,
      adjustedGrossIncome: 0,
      standardDeduction: 0,
      taxableIncome: 0,
      federalTax: 0,
      selfEmploymentTax: 0,
      stateTax: 0,
      totalTax: 0,
      afterTaxIncome: 0,
      effectiveRate: 0,
      marginalRate: 0,
      quarterlyPayment: 0,
      monthlyPayment: 0,
      seDeduction: 0,
      childCredit: 0,
      remainingQuarterly: 0
    };
  }
};

export const SelfEmployedTaxEstimator: React.FC<SelfEmployedTaxEstimatorProps> = ({ toolId }) => {
  // Initialize all state variables first
  const [taxData, setTaxData] = useState<TaxData>({
    incomes: [],
    deductions: 0,
    filingStatus: 'single',
    state: 'federal',
    selfEmployed: true,
    quarterlyPayments: 0,
    healthInsurance: 0,
    retirementContributions: 0,
    homeOfficeDeduction: 0,
    vehicleExpenses: 0,
    equipmentExpenses: 0,
    professionalServices: 0,
    stateIncomeTaxRate: 0,
    dependents: 0,
    childTaxCredit: false,
    itemizedDeductions: []
  });

  const [editMode, setEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const { shouldShowOnboarding, setShouldShowOnboarding } = useProgressiveOnboarding('self_employed_tax_estimator');

  const [newIncome, setNewIncome] = useState({
    type: '1099' as '1099' | 'w2' | 'rental' | 'investment' | 'other',
    source: '',
    amount: 0,
    notes: ''
  });

  const [newDeduction, setNewDeduction] = useState({
    category: '',
    description: '',
    amount: 0
  });

  // Calculate results using the external function
  const results = calculateTaxes(taxData);
  const hasResults = taxData.incomes.length > 0;

  // Prepare visualization data after results are calculated
  const taxBreakdownData = hasResults ? [
    { label: 'Federal Tax', value: results.federalTax, color: '#EF4444' },
    { label: 'Self-Employment Tax', value: results.selfEmploymentTax, color: '#F97316' },
    { label: 'State Tax', value: results.stateTax, color: '#F59E0B' },
    { label: 'After-Tax Income', value: results.afterTaxIncome, color: '#10B981' }
  ].filter(item => item.value > 0) : [];

  const incomeSourcesData = taxData.incomes.map(income => ({
    label: income.source,
    value: income.amount
  }));

  // Load data from session storage
  useEffect(() => {
    try {
      const savedData = loadToolData('self_employed_tax_estimator');
      if (savedData) {
        setTaxData({
          ...savedData,
          incomes: savedData.incomes || [],
          itemizedDeductions: savedData.itemizedDeductions || []
        });
        setHasSavedData(true);
      } else {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save data to session storage
  useEffect(() => {
    try {
      if (taxData.incomes.length > 0) {
        saveToolData('self_employed_tax_estimator', taxData);
        setHasSavedData(true);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [taxData]);

  // Event handlers
  const handleClearSavedData = () => {
    try {
      clearToolData('self_employed_tax_estimator');
      setHasSavedData(false);
      setTaxData({
        incomes: [],
        deductions: 0,
        filingStatus: 'single',
        state: 'federal',
        selfEmployed: true,
        quarterlyPayments: 0,
        healthInsurance: 0,
        retirementContributions: 0,
        homeOfficeDeduction: 0,
        vehicleExpenses: 0,
        equipmentExpenses: 0,
        professionalServices: 0,
        stateIncomeTaxRate: 0,
        dependents: 0,
        childTaxCredit: false,
        itemizedDeductions: []
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleUseSuggestions = (suggestions: any) => {
    try {
      setTaxData(prev => ({ ...prev, ...suggestions }));
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error applying suggestions:', error);
    }
  };
  
  const handleOnboardingComplete = (data: any) => {
    setShouldShowOnboarding(false);
  };

  const addIncome = () => {
    try {
      if (newIncome.source && newIncome.amount > 0) {
        setTaxData({
          ...taxData,
          incomes: [...taxData.incomes, {
            id: Date.now().toString(),
            ...newIncome
          }]
        });
        setNewIncome({
          type: '1099',
          source: '',
          amount: 0,
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const removeIncome = (id: string) => {
    try {
      setTaxData({
        ...taxData,
        incomes: taxData.incomes.filter(income => income.id !== id)
      });
    } catch (error) {
      console.error('Error removing income:', error);
    }
  };

  const addDeduction = () => {
    try {
      if (newDeduction.description && newDeduction.amount > 0) {
        setTaxData({
          ...taxData,
          itemizedDeductions: [...taxData.itemizedDeductions, {
            id: Date.now().toString(),
            ...newDeduction
          }]
        });
        setNewDeduction({ category: '', description: '', amount: 0 });
      }
    } catch (error) {
      console.error('Error adding deduction:', error);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            setTaxData(data);
          } catch (error) {
            console.error('Error parsing imported file:', error);
            alert('Invalid file format. Please upload a valid JSON file.');
          }
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  // Prepare export data
  const exportData = {
    inputs: taxData,
    calculations: results,
    taxBrackets: {
      '10%': '$0 - $11,000',
      '12%': '$11,001 - $44,725',
      '22%': '$44,726 - $95,375',
      '24%': '$95,376 - $182,050',
      '32%': '$182,051 - $231,250',
      '35%': '$231,251 - $578,125',
      '37%': '$578,126+'
    },
    generatedAt: new Date().toISOString()
  };

  const csvData = [{
    'Total Income': results.grossIncome,
    '1099 Income': results.total1099Income,
    'W2 Income': results.totalW2Income,
    'Other Income': results.totalOtherIncome,
    'Total Deductions': results.totalBusinessDeductions,
    'Itemized Deductions': results.totalItemizedDeductions,
    'Net Income': results.netIncome,
    'Federal Tax': results.federalTax,
    'Self Employment Tax': results.selfEmploymentTax,
    'Total Tax': results.totalTax,
    'Quarterly Payment': results.quarterlyPayment
  }];

  return (
    <div className="space-y-6">
      {/* Progressive Onboarding */}
      {shouldShowOnboarding && (
        <ProgressiveOnboarding
          toolName="Self-Employed Tax Estimator"
          steps={getOnboardingSteps('self-employed-tax-estimator')}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShouldShowOnboarding(false)}
        />
      )}

      {/* Onboarding Trigger */}
      <OnboardingTrigger
        toolName="Self-Employed Tax Estimator"
        onStart={() => setShouldShowOnboarding(true)}
      />

      {/* Export and Import Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          toolId={toolId}
          filename="tax-estimate"
          title="Self-Employed Tax Estimate"
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

      <AutoSaveIndicator
        toolName="Self-Employed Tax Estimator"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <SmartSuggestions
        toolName="self-employed-tax-estimator"
        suggestions={getSmartSuggestions('self-employed-tax-estimator')}
        onUseSuggestion={handleUseSuggestions}
        onDismiss={() => setShowSuggestions(false)}
        visible={showSuggestions}
      />

      {/* Visualizations Toggle */}
      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showVisualizations}
              onChange={(e) => setShowVisualizations(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-lg font-medium">Show Tax Visualizations</span>
            <span className="text-sm text-gray-400">(Charts & breakdowns)</span>
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
          <span className="text-sm text-gray-400">(Detailed deductions & credits)</span>
        </label>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Income Sources</h3>
        
        {/* Add Income Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Income Type</label>
            <select
              value={newIncome.type}
              onChange={(e) => setNewIncome({...newIncome, type: e.target.value as any})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="1099">1099 (Self-Employed)</option>
              <option value="w2">W2 (Employee)</option>
              <option value="rental">Rental Income</option>
              <option value="investment">Investment Income</option>
              <option value="other">Other Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Income Source</label>
            <input
              type="text"
              value={newIncome.source}
              onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Client ABC, Employer XYZ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Annual Amount</label>
            <input
              type="number"
              value={newIncome.amount || ''}
              onChange={(e) => setNewIncome({...newIncome, amount: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter annual amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
            <input
              type="text"
              value={newIncome.notes}
              onChange={(e) => setNewIncome({...newIncome, notes: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Additional notes"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={addIncome}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Income Source
          </button>
        </div>

        {/* Income Sources List */}
        {taxData.incomes.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Income Sources</h4>
            <div className="space-y-2">
              {taxData.incomes.map((income) => (
                <div key={income.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{income.source}</h5>
                      <p className="text-sm text-gray-400">
                        {income.type.toUpperCase()} • ${income.amount.toLocaleString()}
                        {income.notes && ` • ${income.notes}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeIncome(income.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Basic Deductions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Business Deductions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Standard Business Deductions</label>
            <input
              type="number"
              value={taxData.deductions || ''}
              onChange={(e) => setTaxData({...taxData, deductions: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter basic deductions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filing Status
            </label>
            <select
              value={taxData.filingStatus}
              onChange={(e) => setTaxData({...taxData, filingStatus: e.target.value as any})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="head">Head of Household</option>
            </select>
          </div>
        </div>

        {/* Add Itemized Deduction Form */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Add Specific Deduction</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Category (e.g., Office Supplies)"
              value={newDeduction.category}
              onChange={(e) => setNewDeduction({...newDeduction, category: e.target.value})}
              className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={newDeduction.description}
              onChange={(e) => setNewDeduction({...newDeduction, description: e.target.value})}
              className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newDeduction.amount || ''}
              onChange={(e) => setNewDeduction({...newDeduction, amount: parseFloat(e.target.value) || 0})}
              className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={addDeduction}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Deduction
            </button>
          </div>
        </div>

        {/* Itemized Deductions List */}
        {taxData.itemizedDeductions.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Itemized Deductions</h4>
            <div className="space-y-2">
              {taxData.itemizedDeductions.map((deduction) => (
                <div key={deduction.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{deduction.description}</h5>
                      <p className="text-sm text-gray-400">
                        {deduction.category} • ${deduction.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setTaxData({
                        ...taxData,
                        itemizedDeductions: taxData.itemizedDeductions.filter(d => d.id !== deduction.id)
                      })}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Self-Employed
            </label>
            <select
              value={taxData.selfEmployed.toString()}
              onChange={(e) => setTaxData({...taxData, selfEmployed: e.target.value === 'true'})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        
        {/* Advanced Fields */}
        {showAdvanced && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="font-medium mb-4">Advanced Deductions & Credits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Health Insurance Premiums
                </label>
                <input
                  type="number"
                  value={taxData.healthInsurance || ''}
                  onChange={(e) => setTaxData({...taxData, healthInsurance: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Annual premiums"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Retirement Contributions (SEP-IRA, etc.)
                </label>
                <input
                  type="number"
                  value={taxData.retirementContributions || ''}
                  onChange={(e) => setTaxData({...taxData, retirementContributions: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Annual contributions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Home Office Deduction
                </label>
                <input
                  type="number"
                  value={taxData.homeOfficeDeduction || ''}
                  onChange={(e) => setTaxData({...taxData, homeOfficeDeduction: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Annual deduction"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vehicle/Travel Expenses
                </label>
                <input
                  type="number"
                  value={taxData.vehicleExpenses || ''}
                  onChange={(e) => setTaxData({...taxData, vehicleExpenses: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Annual expenses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Equipment & Software
                </label>
                <input
                  type="number"
                  value={taxData.equipmentExpenses || ''}
                  onChange={(e) => setTaxData({...taxData, equipmentExpenses: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Annual expenses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Professional Services
                </label>
                <input
                  type="number"
                  value={taxData.professionalServices || ''}
                  onChange={(e) => setTaxData({...taxData, professionalServices: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Legal, accounting, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State Income Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxData.stateIncomeTaxRate || ''}
                  onChange={(e) => setTaxData({...taxData, stateIncomeTaxRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 5.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Dependents
                </label>
                <input
                  type="number"
                  value={taxData.dependents || ''}
                  onChange={(e) => setTaxData({...taxData, dependents: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Children under 17"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quarterly Payments Made
                </label>
                <input
                  type="number"
                  value={taxData.quarterlyPayments || ''}
                  onChange={(e) => setTaxData({...taxData, quarterlyPayments: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Total paid so far"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={taxData.childTaxCredit}
                  onChange={(e) => setTaxData({...taxData, childTaxCredit: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Eligible for Child Tax Credit</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {hasResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-100">Total Income</h3>
            <p className="text-2xl font-bold">${results.grossIncome.toFixed(2)}</p>
            <p className="text-xs text-green-200">
              1099: ${results.total1099Income.toLocaleString()} | W2: ${results.totalW2Income.toLocaleString()}
            </p>
            {showVisualizations && (
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
          <div className="bg-blue-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-100">Total Deductions</h3>
            <p className="text-2xl font-bold">${results.totalBusinessDeductions.toFixed(2)}</p>
            <p className="text-xs text-blue-200">
              Itemized: ${results.totalItemizedDeductions.toLocaleString()}
            </p>
            {showVisualizations && (
              <div className="mt-2 flex justify-center">
                <ProgressRing 
                  percentage={results.grossIncome > 0 ? (results.totalBusinessDeductions / results.grossIncome) * 100 : 0} 
                  size={50} 
                  color="#3B82F6" 
                  showPercentage={false}
                />
              </div>
            )}
          </div>
          <div className="bg-purple-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-100">Net Income</h3>
            <p className="text-2xl font-bold">${results.netIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-100">Federal Tax</h3>
            <p className="text-2xl font-bold">${results.federalTax.toFixed(2)}</p>
          </div>
          <div className="bg-orange-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-orange-100">Self-Employment Tax</h3>
            <p className="text-2xl font-bold">${results.selfEmploymentTax.toFixed(2)}</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-100">Total Tax</h3>
            <p className="text-2xl font-bold">${results.totalTax.toFixed(2)}</p>
            {showVisualizations && (
              <div className="mt-2 flex justify-center">
                <ProgressRing 
                  percentage={results.grossIncome > 0 ? (results.totalTax / results.grossIncome) * 100 : 0} 
                  size={50} 
                  color="#DC2626" 
                  showPercentage={false}
                />
              </div>
            )}
          </div>
          {showAdvanced && (
            <>
              <div className="bg-yellow-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-100">State Tax</h3>
                <p className="text-2xl font-bold">${results.stateTax.toFixed(2)}</p>
              </div>
              <div className="bg-teal-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-teal-100">After-Tax Income</h3>
                <p className="text-2xl font-bold">${results.afterTaxIncome.toFixed(2)}</p>
              </div>
              <div className="bg-gray-600 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-100">Effective Tax Rate</h3>
                <p className="text-2xl font-bold">{results.effectiveRate.toFixed(1)}%</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Enhanced Tax Visualizations */}
      {showVisualizations && hasResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Breakdown Pie Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Tax & Income Breakdown</h3>
            <div className="flex justify-center">
              <PieChart data={taxBreakdownData} size={200} />
            </div>
          </div>

          {/* Income Sources */}
          {incomeSourcesData.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Income Sources</h3>
              <BarChart data={incomeSourcesData} height={200} />
            </div>
          )}
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
            Edit Tax Information
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

      {/* Payment Schedule */}
      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Estimated Tax Payments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-300">Quarterly Tax Payment</p>
              <p className="text-xl font-bold text-blue-400">${results.quarterlyPayment.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Due: Jan 15, Apr 15, Jun 15, Sep 15</p>
            </div>
            <div>
              <p className="text-sm text-gray-300">Monthly Savings Target</p>
              <p className="text-xl font-bold text-green-400">${results.monthlyPayment.toFixed(2)}</p>
              <p className="text-xs text-gray-400">Set aside monthly for taxes</p>
            </div>
            {showAdvanced && results.remainingQuarterly > 0 && (
              <div>
                <p className="text-sm text-gray-300">Remaining Quarterly</p>
                <p className="text-xl font-bold text-orange-400">${results.remainingQuarterly.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Still owed this year</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tax Breakdown */}
      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Calculation Breakdown</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Gross Income:</span>
              <span>${results.grossIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Less: Business Deductions:</span>
              <span>-${results.totalBusinessDeductions.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Net Business Income:</span>
              <span>${results.netIncome.toFixed(2)}</span>
            </div>
            {showAdvanced && (
              <>
                <div className="flex justify-between">
                  <span>Less: SE Tax Deduction:</span>
                  <span>-${results.seDeduction.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Less: Retirement Contributions:</span>
                  <span>-${taxData.retirementContributions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Adjusted Gross Income:</span>
                  <span>${results.adjustedGrossIncome.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span>Less: Standard Deduction:</span>
              <span>-${results.standardDeduction.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Taxable Income:</span>
              <span>${results.taxableIncome.toFixed(2)}</span>
            </div>
            <hr className="border-gray-600" />
            <div className="flex justify-between">
              <span>Federal Income Tax:</span>
              <span>${results.federalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Self-Employment Tax (14.13%):</span>
              <span>${results.selfEmploymentTax.toFixed(2)}</span>
            </div>
            {showAdvanced && results.stateTax > 0 && (
              <div className="flex justify-between">
                <span>State Income Tax:</span>
                <span>${results.stateTax.toFixed(2)}</span>
              </div>
            )}
            {showAdvanced && results.childCredit > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Less: Child Tax Credit:</span>
                <span>-${results.childCredit.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total Tax Owed:</span>
              <span>${results.totalTax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};