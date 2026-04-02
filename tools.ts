import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Edit, Save } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface Attendee {
  id: string;
  name: string;
  hourlyRate: number;
  role: string;
}

export const MeetingCostEstimator: React.FC = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [meetingDuration, setMeetingDuration] = useState(60);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState('In-Person');
  const [editMode, setEditMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    hourlyRate: 50,
    role: ''
  });

  const addAttendee = () => {
    if (newAttendee.name && newAttendee.hourlyRate > 0) {
      setAttendees([...attendees, {
        id: Date.now().toString(),
        ...newAttendee
      }]);
      setNewAttendee({
        name: '',
        hourlyRate: 50,
        role: ''
      });
    }
  };

  const removeAttendee = (id: string) => {
    setAttendees(attendees.filter(attendee => attendee.id !== id));
  };

  const updateAttendee = (id: string, field: keyof Attendee, value: string | number) => {
    setAttendees(attendees.map(attendee => 
      attendee.id === id ? { ...attendee, [field]: value } : attendee
    ));
  };

  const calculateCosts = () => {
    const durationInHours = meetingDuration / 60;
    
    const attendeeCosts = attendees.map(attendee => ({
      ...attendee,
      cost: attendee.hourlyRate * durationInHours
    }));

    const totalCost = attendeeCosts.reduce((sum, attendee) => sum + attendee.cost, 0);
    const averageHourlyRate = attendees.length > 0 
      ? attendees.reduce((sum, attendee) => sum + attendee.hourlyRate, 0) / attendees.length 
      : 0;

    // Advanced calculations
    const costPerMinute = totalCost / meetingDuration;
    const opportunityCost = totalCost; // What else could be done with this time
    const productivityIndex = attendees.length > 0 ? Math.max(0, 100 - (attendees.length * 5)) : 100; // Decreases with more attendees
    const recommendedDuration = Math.max(15, Math.min(60, meetingDuration * 0.8)); // 20% shorter recommendation

    return {
      attendeeCosts,
      totalCost,
      averageHourlyRate,
      costPerMinute,
      durationInHours,
      opportunityCost,
      productivityIndex,
      recommendedDuration
    };
  };

  const results = calculateCosts();
  const hasResults = attendees.length > 0 && meetingDuration > 0;

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  const exportData = {
    meetingTitle,
    meetingDate,
    meetingType,
    meetingDuration,
    attendees,
    results,
    date: new Date().toISOString()
  };

  const csvData = results.attendeeCosts.map(attendee => ({
    Name: attendee.name,
    Role: attendee.role,
    'Hourly Rate': attendee.hourlyRate,
    'Meeting Cost': attendee.cost.toFixed(2)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="meeting-cost-estimate"
          title="Meeting Cost Estimate"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Meeting Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Meeting Title"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={meetingDuration}
              onChange={(e) => setMeetingDuration(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="In-Person">In-Person</option>
            <option value="Video Call">Video Call</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        
        {/* Advanced Options */}
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Meeting Analysis
          </button>
          
          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Purpose</label>
                  <select className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none">
                    <option value="Planning">Planning</option>
                    <option value="Review">Review</option>
                    <option value="Decision Making">Decision Making</option>
                    <option value="Information Sharing">Information Sharing</option>
                    <option value="Brainstorming">Brainstorming</option>
                    <option value="Status Update">Status Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Frequency</label>
                  <select className="w-full px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none">
                    <option value="One-time">One-time</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-red-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-red-100">Total Cost</h3>
          <p className="text-2xl font-bold">${results.totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-orange-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-orange-100">Cost Per Minute</h3>
          <p className="text-2xl font-bold">${results.costPerMinute.toFixed(2)}</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-blue-100">Attendees</h3>
          <p className="text-2xl font-bold">{attendees.length}</p>
        </div>
        <div className="bg-purple-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-purple-100">Avg Hourly Rate</h3>
          <p className="text-2xl font-bold">${results.averageHourlyRate.toFixed(2)}</p>
        </div>
        {showAdvanced && (
          <div className="bg-teal-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-teal-100">Productivity Index</h3>
            <p className="text-2xl font-bold">{results.productivityIndex.toFixed(0)}%</p>
            <p className="text-xs text-teal-200">efficiency score</p>
          </div>
        )}
      </div>

      {/* Edit Mode Button */}
      {attendees.length > 0 && !editMode && (
        <div className="flex justify-center">
          <button
            onClick={handleEditMode}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Meeting Details
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
        <h3 className="text-lg font-semibold mb-4">Add Attendee</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newAttendee.name}
            onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Role"
            value={newAttendee.role}
            onChange={(e) => setNewAttendee({...newAttendee, role: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Hourly Rate"
            value={newAttendee.hourlyRate || ''}
            onChange={(e) => setNewAttendee({...newAttendee, hourlyRate: parseFloat(e.target.value) || 0})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={addAttendee}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Attendee
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Attendees & Costs</h3>
        <div className="space-y-2">
          {results.attendeeCosts.map((attendee) => (
            <div key={attendee.id} className="bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                <input
                  type="text"
                  value={attendee.name}
                  onChange={(e) => updateAttendee(attendee.id, 'name', e.target.value)}
                  className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={attendee.role}
                  onChange={(e) => updateAttendee(attendee.id, 'role', e.target.value)}
                  className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Role"
                />
                <input
                  type="number"
                  value={attendee.hourlyRate}
                  onChange={(e) => updateAttendee(attendee.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                  className="px-3 py-2 bg-gray-600 rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Hourly Rate"
                />
                <div className="text-center">
                  <span className="text-lg font-bold text-green-400">${attendee.cost.toFixed(2)}</span>
                  <p className="text-xs text-gray-400">Meeting cost</p>
                </div>
                <button
                  onClick={() => removeAttendee(attendee.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {results.totalCost > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Time Value Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>15 minutes:</span>
                  <span>${(results.totalCost * 0.25).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>30 minutes:</span>
                  <span>${(results.totalCost * 0.5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>45 minutes:</span>
                  <span>${(results.totalCost * 0.75).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{meetingDuration} minutes:</span>
                  <span>${results.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Efficiency Tips</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Consider if this meeting could be an email</li>
                <li>• Reduce attendees to only essential participants</li>
                <li>• Set a clear agenda and time limit</li>
                <li>• Start and end on time</li>
                <li>• Follow up with action items</li>
              </ul>
            </div>
            {showAdvanced && (
              <div>
                <h4 className="font-medium mb-2">Meeting Optimization</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Recommended duration: {results.recommendedDuration} minutes</p>
                  <p>Productivity score: {results.productivityIndex}%</p>
                  <p>Opportunity cost: ${results.opportunityCost.toFixed(2)}</p>
                  <p className="text-blue-400">
                    {results.productivityIndex < 70 ? 'Consider reducing attendees' : 'Good attendee count'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};