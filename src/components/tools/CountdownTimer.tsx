import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSet = hours * 3600 + minutes * 60 + seconds;
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;
  const circumference = 2 * Math.PI * 90;

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const start = () => {
    if (secondsLeft === 0) {
      const total = totalSet;
      if (total === 0) return;
      setTotalSeconds(total);
      setSecondsLeft(total);
    }
    setFinished(false);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(0);
    setTotalSeconds(0);
    setFinished(false);
  };

  const NumInput = ({ label, value, setValue, max }: { label: string; value: number; setValue: (v: number) => void; max: number }) => (
    <div className="flex flex-col items-center">
      <label className="text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number" min={0} max={max} value={value}
        onChange={e => { setValue(Math.min(max, Math.max(0, Number(e.target.value)))); reset(); }}
        className="w-20 text-center text-2xl font-mono font-bold bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-6">
      {!running && secondsLeft === 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
          <p className="text-sm text-gray-400 text-center mb-4">Set your countdown</p>
          <div className="flex items-center justify-center gap-4">
            <NumInput label="Hours" value={hours} setValue={setHours} max={23} />
            <span className="text-3xl font-bold text-gray-500 mb-0 mt-4">:</span>
            <NumInput label="Minutes" value={minutes} setValue={setMinutes} max={59} />
            <span className="text-3xl font-bold text-gray-500 mb-0 mt-4">:</span>
            <NumInput label="Seconds" value={seconds} setValue={setSeconds} max={59} />
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl border border-gray-700 p-8 flex flex-col items-center gap-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#374151" strokeWidth="12" />
            <circle
              cx="100" cy="100" r="90" fill="none" strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * progress}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${finished ? 'stroke-red-400' : 'stroke-blue-400'}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {finished ? (
              <Bell className="w-12 h-12 text-red-400 animate-bounce" />
            ) : (
              <span className="text-4xl font-bold font-mono text-white">
                {formatTime(secondsLeft > 0 ? secondsLeft : totalSet)}
              </span>
            )}
            {finished && <span className="text-red-400 text-sm font-medium mt-1">Time's up!</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!finished && (
            <button
              onClick={running ? () => setRunning(false) : start}
              disabled={totalSet === 0 && secondsLeft === 0}
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 flex items-center justify-center transition-colors shadow-lg"
            >
              {running ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
            </button>
          )}
          <button onClick={reset} className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
            <RotateCcw className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
