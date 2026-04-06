import React, { useState } from 'react';
import { Copy, Check, Trash2, Minimize2, Maximize2 } from 'lucide-react';

export const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const format = () => {
    setError('');
    if (!input.trim()) { setOutput(''); setIsValid(null); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setIsValid(true);
    } catch (e: any) {
      setError(e.message);
      setIsValid(false);
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
    } catch (e: any) {
      setError(e.message);
      setIsValid(false);
    }
  };

  const validate = () => {
    setError('');
    if (!input.trim()) { setIsValid(null); return; }
    try {
      JSON.parse(input);
      setIsValid(true);
    } catch (e: any) {
      setError(e.message);
      setIsValid(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sample = `{
  "name": "Tools We Need",
  "version": "2.0",
  "tools": ["budget", "tax", "debt"],
  "free": true,
  "stats": { "users": 1000, "rating": 4.9 }
}`;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={format} disabled={!input.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5">
          <Maximize2 className="w-4 h-4" /> Format
        </button>
        <button onClick={minify} disabled={!input.trim()} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5">
          <Minimize2 className="w-4 h-4" /> Minify
        </button>
        <button onClick={validate} disabled={!input.trim()} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg font-medium transition-colors">
          Validate
        </button>
        <button onClick={() => setInput(sample)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
          Load Sample
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-400">Indent:</label>
          {[2, 4].map(n => (
            <button key={n} onClick={() => setIndent(n)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${indent === n ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >{n}</button>
          ))}
        </div>
      </div>

      {isValid !== null && (
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${isValid ? 'bg-green-900/30 border border-green-500/40 text-green-400' : 'bg-red-900/30 border border-red-500/40 text-red-400'}`}>
          {isValid ? '✓ Valid JSON' : `✗ Invalid JSON: ${error}`}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Input JSON</label>
            <button onClick={() => { setInput(''); setOutput(''); setIsValid(null); setError(''); }}
              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            rows={20}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono text-sm resize-y focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Output</label>
            <button onClick={copy} disabled={!output} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={20}
            placeholder="Formatted output will appear here..."
            className="w-full px-4 py-3 bg-gray-900 border border-green-500/20 rounded-xl text-green-300 font-mono text-sm resize-y focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
