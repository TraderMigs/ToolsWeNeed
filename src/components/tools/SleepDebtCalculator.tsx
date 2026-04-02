import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExportButtons } from '../ExportButtons';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  hoursSlept: number;
  quality: number;
}

export const SleepDebtCalculator: React.FC = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [idealSleep, setIdealSleep] = useState(8);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '22:00',
    wakeTime: '06:00',
    quality: 7
  });

  const calculateHoursSlept = (bedtime: string, wakeTime: string) => {
    const bedDate = new Date(`2000-01-01 ${bedtime}`);
    let wakeDate = new Date(`2000-01-01 ${wakeTime}`);
    
    // If wake time is earlier than bedtime, assume it's the next day
    if (wakeDate <= bedDate) {
      wakeDate = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const diffMs = wakeDate.getTime() - bedDate.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const addEntry = () => {
    if (newEntry.date && newEntry.bedtime && newEntry.wakeTime) {
      const hoursSlept = calculateHoursSlept(newEntry.bedtime, newEntry.wakeTime);
      setEntries([...entries, {
        id: Date.now().toString(),
        ...newEntry,
        hoursSlept
      }]);
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        bedtime: '22:00',
        wakeTime: '06:00',
        quality: 7
      });
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateSleepStats = () => {
    if (entries.length === 0) return null;

    const totalSleepDebt = entries.reduce((debt, entry) => {
      const deficit = idealSleep - entry.hoursSlept;
      return debt + (deficit > 0 ? deficit : 0);
    }, 0);

    const averageSleep = entries.reduce((sum, entry) => sum + entry.hoursSlept, 0) / entries.length;
    const averageQuality = entries.reduce((sum, entry) => sum + entry.quality, 0) / entries.length;

    const recentEntries = entries.slice(-7); // Last 7 days
    const weeklyDebt = recentEntries.reduce((debt, entry) => {
      const deficit = idealSleep - entry.hoursSlept;
      return debt + (deficit > 0 ? deficit : 0);
    }, 0);

    // Calculate recovery time (assuming 1 extra hour per night can pay back 1 hour of debt)
    const recoveryNights = Math.ceil(totalSleepDebt);

    return {
      totalSleepDebt,
      averageSleep,
      averageQuality,
      weeklyDebt,
      recoveryNights,
      totalEntries: entries.length
    };
  };

  const stats = calculateSleepStats();

  const exportData = {
    entries,
    idealSleep,
    stats,
    date: new Date().toISOString()
  };

  const csvData = entries.map(entry => ({
    Date: entry.date,
    'Bedtime': entry.bedtime,
    'Wake Time': entry.wakeTime,
    'Hours Slept': entry.hoursSlept.toFixed(1),
    'Quality (1-10)': entry.quality,
    'Sleep Debt': Math.max(0, idealSleep - entry.hoursSlept).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <ExportButtons 
          data={exportData}
          csvData={csvData}
          filename="sleep-data"
          title="Sleep Debt Calculator"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sleep Goal</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-300">
            Ideal Sleep Hours per Night:
          </label>
          <input
            type="number"
            step="0.5"
            value={idealSleep}
            onChange={(e) => setIdealSleep(parseFloat(e.target.value) || 8)}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none w-20"
          />
          <span className="text-sm text-gray-400">hours</span>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-red-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-red-100">Total Sleep Debt</h3>
            <p className="text-2xl font-bold">{stats.totalSleepDebt.toFixed(1)}h</p>
          </div>
          <div className="bg-orange-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-orange-100">Weekly Debt</h3>
            <p className="text-2xl font-bold">{stats.weeklyDebt.toFixed(1)}h</p>
          </div>
          <div className="bg-blue-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-blue-100">Average Sleep</h3>
            <p className="text-2xl font-bold">{stats.averageSleep.toFixed(1)}h</p>
          </div>
          <div className="bg-purple-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-purple-100">Sleep Quality</h3>
            <p className="text-2xl font-bold">{stats.averageQuality.toFixed(1)}/10</p>
          </div>
          <div className="bg-green-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-green-100">Recovery Nights</h3>
            <p className="text-2xl font-bold">{stats.recoveryNights}</p>
          </div>
          <div className="bg-gray-600 rounded-lg p-4 text-center">
            <h3 className="text-sm font-medium text-gray-100">Total Entries</h3>
            <p className="text-2xl font-bold">{stats.totalEntries}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Sleep Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="time"
            value={newEntry.bedtime}
            onChange={(e) => setNewEntry({...newEntry, bedtime: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="time"
            value={newEntry.wakeTime}
            onChange={(e) => setNewEntry({...newEntry, wakeTime: e.target.value})}
            className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quality (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={newEntry.quality}
              onChange={(e) => setNewEntry({...newEntry, quality: parseInt(e.target.value) || 7})}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={addEntry}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          <p>Estimated sleep: {calculateHoursSlept(newEntry.bedtime, newEntry.wakeTime).toFixed(1)} hours</p>
        </div>
      </div>

      <div className="space-y-2">
        {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => {
          const deficit = idealSleep - entry.hoursSlept;
          const isDeficit = deficit > 0;
          
          return (
            <div key={entry.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{new Date(entry.date).toLocaleDateString()}</h4>
                    <p className="text-sm text-gray-400">
                      {entry.bedtime} - {entry.wakeTime}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-400">{entry.hoursSlept.toFixed(1)}h</p>
                    <p className="text-xs text-gray-400">slept</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-400">{entry.quality}/10</p>
                    <p className="text-xs text-gray-400">quality</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-bold ${isDeficit ? 'text-red-400' : 'text-green-400'}`}>
                      {isDeficit ? '+' : ''}{deficit.toFixed(1)}h
                    </p>
                    <p className="text-xs text-gray-400">
                      {isDeficit ? 'debt' : 'surplus'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {stats && stats.totalSleepDebt > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recovery Plan</h3>
          <div className="space-y-3">
            <p className="text-gray-300">
              You have accumulated <span className="font-bold text-red-400">{stats.totalSleepDebt.toFixed(1)} hours</span> of sleep debt.
            </p>
            <p className="text-gray-300">
              To recover, you could:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 ml-4">
              <li>Sleep 1 extra hour per night for {Math.ceil(stats.totalSleepDebt)} nights</li>
              <li>Sleep 2 extra hours per night for {Math.ceil(stats.totalSleepDebt / 2)} nights</li>
              <li>Take strategic naps (20-30 minutes) during the day</li>
              <li>Prioritize sleep quality by maintaining consistent sleep schedule</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};