import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData, saveToolDataWithAnalytics } from '../../utils/storageUtils';
import { SmartSuggestions } from '../SmartSuggestions';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import { getSmartSuggestions } from '../../data/smartSuggestions';
import { ProgressRing, BarChart } from '../DataVisualization';
import { ProgressiveOnboarding, getOnboardingSteps, OnboardingTrigger, useProgressiveOnboarding } from '../ProgressiveOnboarding';

interface Milestone {
  id: string;
  title: string;
  description: string;
  hours: number;
  rate: number;
  cost: number;
}

interface FreelanceProposalEstimatorProps {
  toolId?: string;
}

export const FreelanceProposalEstimator: React.FC<FreelanceProposalEstimatorProps> = ({ toolId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [defaultHourlyRate, setDefaultHourlyRate] = useState(75);
  const [contingencyPercentage, setContingencyPercentage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const { shouldShowOnboarding, setShouldShowOnboarding } = useProgressiveOnboarding('freelance_proposal_estimator');
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    hours: 0
  });

  // Load saved data on component mount
  React.useEffect(() => {
    const savedData = loadToolData('freelance_proposal_estimator');
    if (savedData) {
      if (savedData.projectTitle) setProjectTitle(savedData.projectTitle);
      if (savedData.clientName) setClientName(savedData.clientName);
      if (savedData.defaultHourlyRate) setDefaultHourlyRate(savedData.defaultHourlyRate);
      if (savedData.contingencyPercentage) setContingencyPercentage(savedData.contingencyPercentage);
      if (savedData.milestones) setMilestones(savedData.milestones);
      setHasSavedData(true);
    } else {
      setShowSuggestions(true);
    }
  }, []);

  // Auto-save data when it changes
  React.useEffect(() => {
    if (projectTitle || clientName || milestones.length > 0) {
      saveToolData('freelance_proposal_estimator', {
        projectTitle,
        clientName,
        defaultHourlyRate,
        contingencyPercentage,
        milestones
      });
      setHasSavedData(true);
    }
  }, [projectTitle, clientName, defaultHourlyRate, contingencyPercentage, milestones]);

  const handleClearSavedData = () => {
    clearToolData('freelance_proposal_estimator');
    setHasSavedData(false);
    setProjectTitle('');
    setClientName('');
    setDefaultHourlyRate(75);
    setContingencyPercentage(10);
    setMilestones([]);
  };

  const handleUseSuggestions = (suggestions: any) => {
    if (suggestions.projectTitle) setProjectTitle(suggestions.projectTitle);
    if (suggestions.clientName) setClientName(suggestions.clientName);
    if (suggestions.defaultHourlyRate) setDefaultHourlyRate(suggestions.defaultHourlyRate);
    if (suggestions.contingencyPercentage) setContingencyPercentage(suggestions.contingencyPercentage);
    if (suggestions.milestones) setMilestones(suggestions.milestones);
    setShowSuggestions(false);
  };

  const handleOnboardingComplete = (data: any) => {
    setShouldShowOnboarding(false);
  };

  // Prepare visualization data
  const milestoneData = milestones.map(milestone => ({
    label: milestone.title,
    value: milestone.cost
  }));

  const generateProposalText = () => {
    return `
PROJECT PROPOSAL

Client: ${clientName}
Project: ${projectTitle}
Date: ${new Date().toLocaleDateString()}

SCOPE OF WORK:

${milestones.map((milestone, index) => `
${index + 1}. ${milestone.title}
   ${milestone.description}
   Estimated Hours: ${milestone.hours}
   Cost: $${milestone.cost.toFixed(2)}
`).join('')}

INVESTMENT BREAKDOWN:
Subtotal: $${totals.subtotal.toFixed(2)}
Contingency (${contingencyPercentage}%): $${totals.contingency.toFixed(2)}
Total Investment: $${totals.total.toFixed(2)}

Total Estimated Hours: ${totals.totalHours}
Average Hourly Rate: $${totals.averageHourlyRate.toFixed(2)}

PAYMENT TERMS:
- 50% deposit required to begin work
- Remaining balance due upon completion of each milestone
- Net 15 payment terms

This proposal is valid for 30 days from the date above.
    `.trim();
  };

  const calculateTotals = () => {
    const subtotal = milestones.reduce((sum, milestone) => sum + milestone.cost, 0);
    const totalHours = milestones.reduce((sum, milestone) => sum + milestone.hours, 0);
    const contingency = subtotal * (contingencyPercentage / 100);
    const total = subtotal + contingency;

    return {
      subtotal,
      totalHours,
      contingency,
      total,
      averageHourlyRate: totalHours > 0 ? subtotal / totalHours : 0
    };
  };

  const totals = calculateTotals();
  const hasResults = milestones.length > 0;

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  const exportData = {
    projectTitle,
    clientName,
    milestones,
    totals,
    contingencyPercentage,
    date: new Date().toISOString(),
    proposal: generateProposalText()
  };

  const csvData = milestones.map((milestone, index) => ({
    'Milestone': index + 1,
    'Title': milestone.title,
    'Description': milestone.description,
    'Hours': milestone.hours,
    'Rate': milestone.rate,
    'Cost': milestone.cost.toFixed(2)
  }));

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.hours > 0) {
      const cost = newMilestone.hours * defaultHourlyRate;
      setMilestones([...milestones, {
        id: Date.now().toString(),
        ...newMilestone,
        rate: defaultHourlyRate,
        cost
      }]);
      setNewMilestone({
        title: '',
        description: '',
        hours: 0
      });
    }
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones(milestones.map(milestone => {
      if (milestone.id === id) {
        const updated = { ...milestone, [field]: value };
        if (field === 'hours' || field === 'rate') {
          updated.cost = updated.hours * updated.rate;
        }
        return updated;
      }
      return milestone;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Progressive Onboarding */}
      {shouldShowOnboarding && (
        <ProgressiveOnboarding
          toolName="Freelance Proposal Estimator"
          steps={getOnboardingSteps('freelance-proposal-estimator')}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShouldShowOnboarding(false)}
        />
      )}

      {/* Onboarding Trigger */}
      <OnboardingTrigger
        toolName="Freelance Proposal Estimator"
        onStart={() => setShouldShowOnboarding(true)}
      />

      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          toolId={toolId}
          filename="freelance-proposal"
          title="Freelance Project Proposal"
          elementId="proposal-content"
        />
      </div>

      <div id="proposal-content">
      <AutoSaveIndicator
        toolName="Freelance Proposal Estimator"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <SmartSuggestions
        toolName="freelance-proposal-estimator"
        suggestions={getSmartSuggestions('freelance-proposal-estimator')}
        onUseSuggestion={handleUseSuggestions}
        onDismiss={() => setShowSuggestions(false)}
        visible={showSuggestions}
      />
      <div className="bg-gray-800 rounded-lg p-6">
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
            <span className="text-lg font-medium">Show Project Visualizations</span>
            <span className="text-sm text-gray-400">(Milestone breakdown & cost analysis)</span>
          </label>
        </div>
      )}

        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Default Hourly Rate"
            value={defaultHourlyRate || ''}
            onChange={(e) => setDefaultHourlyRate(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Contingency %"
            value={contingencyPercentage || ''}
            onChange={(e) => setContingencyPercentage(parseFloat(e.target.value) || 0)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Advanced Fields Toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            + Advanced Project Details
          </button>
          
          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
              <input
                type="text"
                placeholder="Project Timeline (e.g., 4-6 weeks)"
                className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Payment Terms (e.g., Net 15)"
                className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <textarea
                placeholder="Project Scope Summary"
                rows={3}
                className="md:col-span-2 px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {hasResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-blue-100">Total Hours</h3>
          <p className="text-2xl font-bold">{totals.totalHours}</p>
          {showVisualizations && (
            <div className="mt-2 flex justify-center">
              <ProgressRing 
                percentage={100} 
                size={50} 
                color="#3B82F6" 
                showPercentage={false}
              />
            </div>
          )}
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-green-100">Subtotal</h3>
          <p className="text-2xl font-bold">${totals.subtotal.toFixed(2)}</p>
        </div>
        <div className="bg-orange-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-orange-100">Contingency</h3>
          <p className="text-2xl font-bold">${totals.contingency.toFixed(2)}</p>
          {showVisualizations && (
            <div className="mt-2 flex justify-center">
              <ProgressRing 
                percentage={contingencyPercentage} 
                size={50} 
                color="#F97316" 
                showPercentage={false}
              />
            </div>
          )}
        </div>
        <div className="bg-purple-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-purple-100">Total</h3>
          <p className="text-2xl font-bold">${totals.total.toFixed(2)}</p>
        </div>
      </div>
      )}

      {/* Milestone Cost Visualization */}
      {showVisualizations && hasResults && milestoneData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Milestone Cost Breakdown</h3>
          <BarChart data={milestoneData} height={200} />
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
            Edit Proposal
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

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Milestone</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Milestone Title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Estimated Hours"
            value={newMilestone.hours || ''}
            onChange={(e) => setNewMilestone({...newMilestone, hours: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addMilestone}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Milestone {index + 1}</h3>
              <button
                onClick={() => removeMilestone(milestone.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                value={milestone.title}
                onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Title"
              />
              <input
                type="text"
                value={milestone.description}
                onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Description"
              />
              <input
                type="number"
                value={milestone.hours}
                onChange={(e) => updateMilestone(milestone.id, 'hours', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Hours"
              />
              <input
                type="number"
                value={milestone.rate}
                onChange={(e) => updateMilestone(milestone.id, 'rate', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Hourly Rate"
              />
              <div className="flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">${milestone.cost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasResults && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Proposal Preview</h3>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-700 p-4 rounded-lg overflow-x-auto">
            {generateProposalText()}
          </pre>
        </div>
      )}
      </div>
    </div>
  );
};