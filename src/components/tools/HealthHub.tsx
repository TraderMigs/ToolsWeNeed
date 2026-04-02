import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Search, Droplets } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';
import { saveToolData, loadToolData, clearToolData } from '../../utils/storageUtils';
import { SmartSuggestions } from '../SmartSuggestions';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import { getSmartSuggestions } from '../../data/smartSuggestions';
import { foodDatabase, getFastBreakingFoods, searchFoods, getCategories, FoodItem } from '../../data/foodDatabase';
import { ProgressRing, PieChart, BarChart } from '../DataVisualization';
import { ProgressiveOnboarding, getOnboardingSteps, OnboardingTrigger, useProgressiveOnboarding } from '../ProgressiveOnboarding';

interface FastingSession {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
  date: string;
}

interface NutritionEntry {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  mealTag: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  notes: string;
  timestamp: string;
}

const fastingTypes = {
  '16:8': { fast: 16, eat: 8, description: 'Fast for 16 hours, eat within 8 hours' },
  '18:6': { fast: 18, eat: 6, description: 'Fast for 18 hours, eat within 6 hours' },
  '20:4': { fast: 20, eat: 4, description: 'Fast for 20 hours, eat within 4 hours' },
  'OMAD': { fast: 24, eat: 0, description: 'One Meal A Day (24-hour fast)' },
  'Custom': { fast: 0, eat: 0, description: 'Set custom fasting window' }
};

const mealTags = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Break Fast'];

export const HealthHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fasting' | 'nutrition'>('fasting');
  
  // Fasting state
  const [sessions, setSessions] = useState<FastingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [selectedType, setSelectedType] = useState('16:8');
  const [customStart, setCustomStart] = useState('20:00');
  const [customEnd, setCustomEnd] = useState('12:00');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hydrationReminder, setHydrationReminder] = useState(false);
  const [showBreakFastModal, setShowBreakFastModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showVisualizations, setShowVisualizations] = useState(true);
  const { shouldShowOnboarding, setShouldShowOnboarding } = useProgressiveOnboarding('health_hub');

  // Nutrition state
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  });

  const [newEntry, setNewEntry] = useState({
    foodName: '',
    servingSize: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });

  const addNutritionEntry = (foodItem: FoodItem, quantity: number, unit: string, mealTag: string) => {
    try {
      const entry: NutritionEntry = {
        id: Date.now().toString(),
        foodId: foodItem.id,
        foodName: foodItem.name,
        quantity,
        unit,
        mealTag,
        calories: (foodItem.calories_per_100g * quantity) / 100,
        protein: (foodItem.protein_per_100g * quantity) / 100,
        carbs: (foodItem.carbs_per_100g * quantity) / 100,
        fat: (foodItem.fat_per_100g * quantity) / 100,
        fiber: (foodItem.fiber_per_100g * quantity) / 100,
        sugar: (foodItem.sugar_per_100g * quantity) / 100,
        sodium: (foodItem.sodium_per_100g * quantity) / 100,
        notes: '',
        timestamp: new Date().toISOString()
      };
      setNutritionEntries([...nutritionEntries, entry]);
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
    }
  };

  // Calculate nutrition totals
  const nutritionTotals = nutritionEntries
    .filter(entry => entry.timestamp.split('T')[0] === new Date().toISOString().split('T')[0])
    .reduce((totals, entry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
      fiber: totals.fiber + entry.fiber,
      sugar: totals.sugar + entry.sugar,
      sodium: totals.sodium + entry.sodium
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedData = loadToolData('health_hub');
      if (savedData) {
        if (savedData.sessions && Array.isArray(savedData.sessions)) setSessions(savedData.sessions);
        if (savedData.nutritionEntries && Array.isArray(savedData.nutritionEntries)) setNutritionEntries(savedData.nutritionEntries);
        if (savedData.dailyGoals && typeof savedData.dailyGoals === 'object') setDailyGoals(savedData.dailyGoals);
        if (savedData.selectedType && typeof savedData.selectedType === 'string') setSelectedType(savedData.selectedType);
        setHasSavedData(true);
      } else {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error loading Health Hub data:', error);
      // Clear corrupted data and start fresh
      try {
        localStorage.removeItem('twn_health_hub_data');
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
      setShowSuggestions(true);
    }
  }, []);

  // Auto-save data when it changes
  useEffect(() => {
    try {
      if (sessions.length > 0 || nutritionEntries.length > 0) {
        saveToolData('health_hub', {
          sessions,
          nutritionEntries,
          dailyGoals,
          selectedType
        });
        setHasSavedData(true);
      }
    } catch (error) {
      console.error('Error saving Health Hub data:', error);
    }
  }, [sessions, nutritionEntries, dailyGoals, selectedType]);

  const handleClearSavedData = () => {
    clearToolData('health_hub');
    setHasSavedData(false);
    setSessions([]);
    setNutritionEntries([]);
    setDailyGoals({
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 67,
      fiber: 25,
      sugar: 50,
      sodium: 2300
    });
  };

  const handleUseSuggestions = (suggestions: any) => {
    if (suggestions.selectedType) setSelectedType(suggestions.selectedType);
    if (suggestions.hydrationReminder !== undefined) setHydrationReminder(suggestions.hydrationReminder);
    setShowSuggestions(false);
  };
  // Timer effect
  const handleOnboardingComplete = (data: any) => {
    setShouldShowOnboarding(false);
  };

  // Prepare visualization data
  const macroData = [
    { label: 'Protein', value: nutritionTotals.protein * 4, color: '#3B82F6' },
    { label: 'Carbs', value: nutritionTotals.carbs * 4, color: '#10B981' },
    { label: 'Fat', value: nutritionTotals.fat * 9, color: '#F59E0B' }
  ];

  const weeklyFastingData = sessions.slice(-7).map((session, index) => ({
    label: `Day ${index + 1}`,
    value: session.completed ? session.duration : 0
  }));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentSession) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(currentSession.endTime).getTime();
        const remaining = Math.max(0, endTime - now);
        
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setIsActive(false);
          completeFast();
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, currentSession]);

  // Hydration reminder effect
  useEffect(() => {
    if (hydrationReminder && isActive) {
      const interval = setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification('Hydration Reminder', {
            body: 'Time to drink some water! 💧',
            icon: '/favicon.ico'
          });
        }
      }, 2 * 60 * 60 * 1000); // 2 hours

      return () => clearInterval(interval);
    }
  }, [hydrationReminder, isActive]);

  const startFast = () => {
    const now = new Date();
    let fastDuration: number;
    let endTime: Date;

    if (selectedType === 'Custom') {
      const startHour = parseInt(customStart.split(':')[0]);
      const startMinute = parseInt(customStart.split(':')[1]);
      const endHour = parseInt(customEnd.split(':')[0]);
      const endMinute = parseInt(customEnd.split(':')[1]);
      
      const start = new Date(now);
      start.setHours(startHour, startMinute, 0, 0);
      
      endTime = new Date(start);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      if (endTime <= start) {
        endTime.setDate(endTime.getDate() + 1);
      }
      
      fastDuration = (endTime.getTime() - start.getTime()) / (1000 * 60 * 60);
    } else {
      fastDuration = fastingTypes[selectedType as keyof typeof fastingTypes].fast;
      endTime = new Date(now.getTime() + fastDuration * 60 * 60 * 1000);
    }
    
    const newSession: FastingSession = {
      id: Date.now().toString(),
      type: selectedType,
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      duration: fastDuration,
      completed: false,
      date: now.toISOString().split('T')[0]
    };
    
    setCurrentSession(newSession);
    setIsActive(true);
    setTimeRemaining(fastDuration * 60 * 60 * 1000);

    // Request notification permission
    if (hydrationReminder && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseFast = () => setIsActive(false);
  const resumeFast = () => setIsActive(true);

  const stopFast = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: false
      };
      setSessions([...sessions, updatedSession]);
    }
    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);
  };

  const completeFast = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        completed: true
      };
      setSessions([...sessions, completedSession]);
      setShowBreakFastModal(true);
    }
    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);
  };

  const breakFast = () => {
    setActiveTab('nutrition');
    setShowBreakFastModal(false);
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (!currentSession) return 0;
    const totalDuration = currentSession.duration * 60 * 60 * 1000;
    const elapsed = totalDuration - timeRemaining;
    return (elapsed / totalDuration) * 100;
  };


  const removeNutritionEntry = (id: string) => {
    try {
      setNutritionEntries(nutritionEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error removing nutrition entry:', error);
    }
  };


  const exportFastingData = {
    sessions,
    currentSession,
    weeklyStats: {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.completed).length,
      totalHours: sessions.filter(s => s.completed).reduce((sum, s) => sum + s.duration, 0)
    },
    date: new Date().toISOString()
  };

  const exportNutritionData = {
    entries: nutritionEntries,
    dailyGoals,
    totals: nutritionTotals,
    date: new Date().toISOString()
  };

  const fastingCsvData = sessions.map(session => ({
    Date: session.date,
    'Fasting Type': session.type,
    'Start Time': new Date(session.startTime).toLocaleString(),
    'End Time': new Date(session.endTime).toLocaleString(),
    'Duration (hours)': session.duration,
    'Completed': session.completed ? 'Yes' : 'No'
  }));

  const nutritionCsvData = nutritionEntries.map(entry => ({
    'Food Name': entry.foodName,
    'Quantity': entry.quantity,
    'Unit': entry.unit,
    'Meal': entry.mealTag,
    'Calories': entry.calories.toFixed(1),
    'Protein (g)': entry.protein.toFixed(1),
    'Carbs (g)': entry.carbs.toFixed(1),
    'Fat (g)': entry.fat.toFixed(1),
    'Timestamp': new Date(entry.timestamp).toLocaleString()
  }));

  return (
    <div className="space-y-6">
      {/* Progressive Onboarding */}
      {shouldShowOnboarding && (
        <ProgressiveOnboarding
          toolName="Health Hub"
          steps={getOnboardingSteps('fasting-planner')}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShouldShowOnboarding(false)}
        />
      )}

      {/* Onboarding Trigger */}
      <OnboardingTrigger
        toolName="Health Hub"
        onStart={() => setShouldShowOnboarding(true)}
      />

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('fasting')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'fasting' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Fasting Planner
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'nutrition' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Nutrition Tracker
          </button>
        </div>
      </div>

      <AutoSaveIndicator
        toolName="Health Hub"
        hasData={hasSavedData}
        onClearData={handleClearSavedData}
      />

      <SmartSuggestions
        toolName="fasting-planner"
        suggestions={getSmartSuggestions('fasting-planner')}
        onUseSuggestion={handleUseSuggestions}
        onDismiss={() => setShowSuggestions(false)}
        visible={showSuggestions && activeTab === 'fasting'}
      />

      {/* Visualizations Toggle */}
      <div className="bg-gray-800 rounded-lg p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showVisualizations}
            onChange={(e) => setShowVisualizations(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-lg font-medium">Show Health Analytics</span>
          <span className="text-sm text-gray-400">(Visual progress tracking)</span>
        </label>
      </div>

      {/* Fasting Tab */}
      {activeTab === 'fasting' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <ExportButtons 
              data={exportFastingData}
              csvData={fastingCsvData}
              filename="fasting-log"
              title="Fasting Planner"
            />
          </div>

          {/* Preset Selector */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Choose Fasting Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {Object.entries(fastingTypes).map(([type, info]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedType === type
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-bold">{type}</div>
                  <div className="text-xs text-gray-400">{info.description}</div>
                </button>
              ))}
            </div>

            {selectedType === 'Custom' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hydrationReminder}
                  onChange={(e) => setHydrationReminder(e.target.checked)}
                  className="rounded"
                />
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Hydration reminders (every 2 hours)</span>
              </label>
            </div>

            {!currentSession && (
              <button
                onClick={startFast}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                Start Fast
              </button>
            )}
          </div>

          {/* Live Timer */}
          {currentSession && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center space-y-6">
                <h4 className="text-xl font-bold">{currentSession.type} Fast</h4>
                
                {/* Circular Progress */}
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      strokeDasharray={`${calculateProgress() * 2.827}, 282.7`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-gray-400">remaining</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {calculateProgress().toFixed(1)}% complete
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  <p>Started: {new Date(currentSession.startTime).toLocaleString()}</p>
                  <p>Target End: {new Date(currentSession.endTime).toLocaleString()}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                  {isActive ? (
                    <button
                      onClick={pauseFast}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeFast}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  )}
                  <button
                    onClick={stopFast}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Stop Fast
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Fasting Progress */}
          {showVisualizations && weeklyFastingData.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Fasting Progress</h3>
              <BarChart 
                data={weeklyFastingData.map(item => ({
                  ...item,
                  color: item.value > 0 ? '#10B981' : '#6B7280'
                }))} 
                height={150} 
              />
            </div>
          )}

          {/* Weekly Log */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Fasting History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Duration</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(-10).map((session) => (
                    <tr key={session.id} className="border-b border-gray-700">
                      <td className="py-2">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="py-2">{session.type}</td>
                      <td className="py-2">{session.duration}h</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          session.completed 
                            ? 'bg-green-600 text-green-100' 
                            : 'bg-red-600 text-red-100'
                        }`}>
                          {session.completed ? '✓ Completed' : '✗ Stopped Early'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <ExportButtons 
              data={exportNutritionData}
              csvData={nutritionCsvData}
              filename="nutrition-tracker"
              title="Nutrition Tracker"
            />
          </div>

          {/* Daily Goals */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Goals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(dailyGoals).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                    {key} {key === 'calories' ? '' : key === 'sodium' ? '(mg)' : '(g)'}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setDailyGoals({
                      ...dailyGoals,
                      [key]: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add Food Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Add Food</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Food Name"
                value={newEntry.foodName || ''}
                onChange={(e) => setNewEntry({...newEntry, foodName: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Serving Size"
                value={newEntry.servingSize || ''}
                onChange={(e) => setNewEntry({...newEntry, servingSize: e.target.value})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Calories"
                value={newEntry.calories || ''}
                onChange={(e) => setNewEntry({...newEntry, calories: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={newEntry.protein || ''}
                onChange={(e) => setNewEntry({...newEntry, protein: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={newEntry.carbs || ''}
                onChange={(e) => setNewEntry({...newEntry, carbs: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={newEntry.fat || ''}
                onChange={(e) => setNewEntry({...newEntry, fat: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Fiber (g)"
                value={newEntry.fiber || ''}
                onChange={(e) => setNewEntry({...newEntry, fiber: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Sugar (g)"
                value={newEntry.sugar || ''}
                onChange={(e) => setNewEntry({...newEntry, sugar: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Sodium (mg)"
                value={newEntry.sodium || ''}
                onChange={(e) => setNewEntry({...newEntry, sodium: parseFloat(e.target.value) || 0})}
                className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newEntry.foodName && newEntry.calories > 0) {
                    const entry: NutritionEntry = {
                      id: Date.now().toString(),
                      foodId: Date.now().toString(),
                      foodName: newEntry.foodName,
                      quantity: 1,
                      unit: 'serving',
                      mealTag: 'Breakfast',
                      calories: newEntry.calories,
                      protein: newEntry.protein || 0,
                      carbs: newEntry.carbs || 0,
                      fat: newEntry.fat || 0,
                      fiber: newEntry.fiber || 0,
                      sugar: newEntry.sugar || 0,
                      sodium: newEntry.sodium || 0,
                      notes: '',
                      timestamp: new Date().toISOString()
                    };
                    setNutritionEntries([...nutritionEntries, entry]);
                    setNewEntry({
                      foodName: '',
                      servingSize: '',
                      calories: 0,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      fiber: 0,
                      sugar: 0,
                      sodium: 0
                    });
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Food
              </button>
            </div>
          </div>

          {/* Progress Bars */}
          {showVisualizations && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Macro Distribution</h3>
              <div className="flex justify-center">
                <PieChart data={macroData} size={200} />
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Macro Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(nutritionTotals).map(([key, value]) => {
                const goal = dailyGoals[key as keyof typeof dailyGoals];
                const percentage = goal > 0 ? (value / goal) * 100 : 0;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">{key}</span>
                      <span className="text-sm">
                        {value.toFixed(1)} / {goal} {key === 'calories' ? '' : key === 'sodium' ? 'mg' : 'g'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          percentage > 100 ? 'bg-red-500' : 
                          percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Food Entries */}
          <div className="space-y-2">
            {nutritionEntries
              .filter(entry => entry.timestamp.split('T')[0] === new Date().toISOString().split('T')[0])
              .map((entry) => (
              <div key={entry.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{entry.foodName}</h4>
                    <p className="text-sm text-gray-400">
                      {entry.quantity} {entry.unit} • {entry.mealTag} • {entry.calories.toFixed(0)} cal
                    </p>
                    <p className="text-xs text-gray-500">
                      P: {entry.protein.toFixed(1)}g • C: {entry.carbs.toFixed(1)}g • F: {entry.fat.toFixed(1)}g
                    </p>
                  </div>
                  <button
                    onClick={() => removeNutritionEntry(entry.id)}
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

      {/* Break Fast Modal */}
      {showBreakFastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">🎉 Fast Completed!</h3>
            <p className="text-gray-300 mb-6">
              Congratulations! You've successfully completed your fast. Ready to log your first meal?
            </p>
            <div className="flex gap-3">
              <button
                onClick={breakFast}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Log First Meal
              </button>
              <button
                onClick={() => setShowBreakFastModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
        This planner is for informational purposes only and does not replace professional medical advice.
      </div>
    </div>
  );
};