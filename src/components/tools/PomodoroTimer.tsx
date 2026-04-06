import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';

type Phase = 'work' | 'short' | 'long';

const phaseConfig: Record<Phase, { label: string; color: string; ring: string }> = {
  work: { label: 'Focus Time', color: 'text-red-400', ring: 'stroke-red-400' },
  short: { label: 'Short Break', color: 'text-green-400', ring: 'stroke-green-400' },
  long: { label: 'Long Break', color: 'text-blue-400', ring: 'stroke-blue-400' },
};

export const PomodoroTimer: React.FC = () => {
  const [workMins, setWorkMins] = useState(25);
  const [shortMins, setShortMins] = useState(5);
  const [longMins, setLongMins] = useState(15);
  const [longAfter, setLongAfter] = useState(4);
  const [phase, setPhase] = useState<Phase>('work');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = phase === 'work' ? workMins * 60 : phase === 'short' ? shortMins * 60 : longMins * 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 90;

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const nextPhase = useCallback(() => {
    if (phase === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      if (newCompleted % longAfter === 0) {
        setPhase('long');
        setSecondsLeft(longMins * 60);
      } else {
        setPhase('short');
        setSecondsLeft(shortMins * 60);
      }
    } else {
      setPhase('work');
      setSecondsLeft(workMins * 60);
      setSession(s => s + 1);
    }
    setRunning(false);
  }, [phase, completedPomodoros, longAfter, longMins, shortMins, workMins]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) { nextPhase(); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, nextPhase]);

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setSecondsLeft(workMins * 60);
    setSession(1);
    setCompletedPomodoros(0);
  };

  const applySettings = () => {
    setRunning(false);
    setPhase('work');
    setSecondsLeft(workMins * 60);
    setShowSettings(false);
  };

  const cfg = phaseConfig[phase];

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 flex flex-col items-center gap-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#374151" strokeWidth="12" />
            <circle
              cx="100" cy="100" r="90" fill="none" strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${cfg.ring}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-mono text-white">{formatTime(secondsLeft)}</span>
            <span className={`text-sm font-medium mt-1 ${cfg.color}`}>{cfg.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {[...Array(longAfter)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < completedPomodoros % longAfter ? 'bg-red-400' : 'bg-gray-600'}`} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setRunning(r => !r)}
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-lg"
          >
            {running ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
          </button>
          <button onClick={reset} className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
            <RotateCcw className="w-4 h-4 text-gray-300" />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
            <Settings className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-400">
          Session {session} &bull; {completedPomodoros} pomodoro{completedPomodoros !== 1 ? 's' : ''} completed
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Timer Settings</h3>
              <button onClick={() => setShowSettings(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {[
              { label: 'Focus Duration (min)', value: workMins, set: setWorkMins, min: 1, max: 90 },
              { label: 'Short Break (min)', value: shortMins, set: setShortMins, min: 1, max: 30 },
              { label: 'Long Break (min)', value: longMins, set: setLongMins, min: 1, max: 60 },
              { label: 'Long Break After (sessions)', value: longAfter, set: setLongAfter, min: 2, max: 8 },
            ].map(({ label, value, set, min, max }) => (
              <div key={label}>
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>{label}</span><span className="text-blue-400 font-bold">{value}</span>
                </div>
                <input type="range" min={min} max={max} value={value}
                  onChange={e => set(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
            ))}
            <button onClick={applySettings} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
              Apply Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
