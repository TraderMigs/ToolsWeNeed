import React, { useState, useCallback } from 'react';
import { Copy, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: 'Il1O0',
};

const getStrength = (pwd: string): { label: string; color: string; width: string; icon: any } => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 3) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4', icon: ShieldAlert };
  if (score <= 5) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4', icon: Shield };
  if (score <= 6) return { label: 'Strong', color: 'bg-blue-500', width: 'w-3/4', icon: ShieldCheck };
  return { label: 'Very Strong', color: 'bg-green-500', width: 'w-full', icon: ShieldCheck };
};

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    let charset = '';
    if (useUpper) charset += CHARS.upper;
    if (useLower) charset += CHARS.lower;
    if (useNumbers) charset += CHARS.numbers;
    if (useSymbols) charset += CHARS.symbols;
    if (excludeAmbiguous) {
      CHARS.ambiguous.split('').forEach(c => { charset = charset.replace(new RegExp(c, 'g'), ''); });
    }
    if (!charset) { charset = CHARS.lower + CHARS.numbers; }

    const generated = Array.from({ length: count }, () =>
      Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('')
    );
    setPasswords(generated);
    setCopied(null);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, count]);

  const copyPwd = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const strength = passwords[0] ? getStrength(passwords[0]) : null;
  const StrengthIcon = strength?.icon;

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Password Length</label>
            <span className="text-blue-400 font-bold">{length}</span>
          </div>
          <input
            type="range" min={6} max={64} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>6</span><span>64</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Number of Passwords</label>
            <span className="text-blue-400 font-bold">{count}</span>
          </div>
          <input
            type="range" min={1} max={10} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Toggle label="Uppercase (A-Z)" checked={useUpper} onChange={() => setUseUpper(p => !p)} />
          <Toggle label="Lowercase (a-z)" checked={useLower} onChange={() => setUseLower(p => !p)} />
          <Toggle label="Numbers (0-9)" checked={useNumbers} onChange={() => setUseNumbers(p => !p)} />
          <Toggle label="Symbols (!@#...)" checked={useSymbols} onChange={() => setUseSymbols(p => !p)} />
          <Toggle label="Exclude Ambiguous (Il1O0)" checked={excludeAmbiguous} onChange={() => setExcludeAmbiguous(p => !p)} />
        </div>

        <button
          onClick={generate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate Password{count > 1 ? 's' : ''}
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="space-y-3">
          {strength && (
            <div className="flex items-center gap-3 mb-2">
              {StrengthIcon && <StrengthIcon className="w-5 h-5 text-gray-400" />}
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
              </div>
              <span className="text-sm font-medium text-gray-300">{strength.label}</span>
            </div>
          )}
          {passwords.map((pwd, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
              <code className="flex-1 text-green-400 font-mono text-sm break-all">{pwd}</code>
              <button
                onClick={() => copyPwd(pwd, idx)}
                className="flex-shrink-0 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-white" />
              </button>
              {copied === idx && <span className="text-xs text-green-400">Copied!</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
