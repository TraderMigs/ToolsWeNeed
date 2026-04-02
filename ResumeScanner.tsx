import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface FastingSession {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  completed: boolean;
  date: string;
}

const fastingTypes = {
  '16:8': { fast: 16, eat: 8, description: 'Fast for 16 hours, eat within 8 hours' },
  '18:6': { fast: 18, eat: 6, description: 'Fast for 18 hours, eat within 6 hours' },
  '20:4': { fast: 20, eat: 4, description: 'Fast for 20 hours, eat within 4 hours' },
  '24:0': { fast: 24, eat: 0, description: 'Fast for 24 hours (OMAD - One Meal A Day)' },
  '36:12': { fast: 36, eat: 12, description: 'Fast for 36 hours, eat within 12 hours' },
  '48:0': { fast: 48, eat: 0, description: 'Fast for 48 hours (Extended fast)' }
};

export const FastingPlanner: React.FC = () => {
  const [sessions, setSessions] = useState<FastingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [selectedType, setSelectedType] = useState('16:8');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

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

  const startFast = () => {
    const now = new Date();
    const fastDuration = fastingTypes[selectedType as keyof typeof fastingTypes].fast;
    const endTime = new Date(now.getTime() + fastDuration * 60 * 60 * 1000);
    
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
  };

  const pauseFast = () => {
    setIsActive(false);
  };

  const resumeFast = () => {
    setIsActive(true);
  };

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
    }
    setCurrentSession(null);
    setIsActive(false);
    setTimeRemaining(0);
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

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekSessions = sessions.filter(session => 
      new Date(session.date) >= oneWeekAgo
    );
    
    const completed = weekSessions.filter(session => session.completed).length;
    const totalHours = weekSessions
      .filter(session => session.completed)
      .reduce((sum, session) => sum + session.duration, 0);
    
    return {
      totalSessions: weekSessions.length,
      completedSessions: completed,
      totalHours,
      averageHours: completed > 0 ? totalHours / completed : 0
    };
  };

  const weeklyStats = getWeeklyStats();

  const exportData = {
    sessions,
    currentSession,
    weeklyStats,
    fastingTypes,
    date: new Date().toISOString()
  };

  const csvData = sessions.map(session => ({
    Date: session.date,
    'Fasting Type': session.type,
    'Start Time': new Date(session.startTime).toLocaleString(),
    'End Time': new Date(session.endTime).toLocaleString(),
    'Duration (hours)': session.duration,
    'Completed': session.completed ? 'Yes' : 'No'
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="fasting-log"
          title="Fasting Planner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-blue-100">This Week</h3>
          <p className="text-2xl font-bold">{weeklyStats.completedSessions}</p>
          <p className="text-xs text-blue-200">completed fasts</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-green-100">Total Hours</h3>
          <p className="text-2xl font-bold">{weeklyStats.totalHours}</p>
          <p className="text-xs text-green-200">fasted this week</p>
        </div>
        <div className="bg-purple-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-purple-100">Average Fast</h3>
          <p className="text-2xl font-bold">{weeklyStats.averageHours.toFixed(1)}h</p>
          <p className="text-xs text-purple-200">per session</p>
        </div>
        <div className="bg-orange-600 rounded-lg p-4 text-center">
          <h3 className="text-sm font-medium text-orange-100">Success Rate</h3>
          <p className="text-2xl font-bold">
            {weeklyStats.totalSessions > 0 
              ? Math.round((weeklyStats.completedSessions / weeklyStats.totalSessions) * 100)
              : 0}%
          </p>
          <p className="text-xs text-orange-200">completion rate</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Current Fast</h3>
        
        {!currentSession ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Fasting Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                {Object.entries(fastingTypes).map(([type, info]) => (
                  <option key={type} value={type}>
                    {type} - {info.description}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={startFast}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              <Play className="w-5 h-5" />
              Start Fast
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2">{currentSession.type} Fast</h4>
              <p className="text-sm text-gray-400">
                Started: {new Date(currentSession.startTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Target End: {new Date(currentSession.endTime).toLocaleString()}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-400">Time Remaining</p>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
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
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Fasting History</h3>
        <div className="space-y-2">
          {sessions
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .slice(0, 10)
            .map((session) => (
            <div key={session.id} className={`rounded-lg p-4 border-2 ${
              session.completed 
                ? 'bg-green-600/20 border-green-500' 
                : 'bg-red-600/20 border-red-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{session.type} Fast</h4>
                  <p className="text-sm text-gray-400">
                    {new Date(session.startTime).toLocaleDateString()} - 
                    {new Date(session.startTime).toLocaleTimeString()} to 
                    {new Date(session.endTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${session.completed ? 'text-green-400' : 'text-red-400'}`}>
                    {session.completed ? 'Completed' : 'Stopped Early'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {session.duration}h target
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Fasting Types Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(fastingTypes).map(([type, info]) => (
            <div key={type} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium mb-2">{type}</h4>
              <p className="text-sm text-gray-400 mb-2">{info.description}</p>
              <div className="text-xs text-gray-500">
                <p>Fast: {info.fast} hours</p>
                <p>Eating window: {info.eat} hours</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};