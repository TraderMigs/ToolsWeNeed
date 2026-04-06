import React, { useState } from 'react';
import { Copy, ArrowDownUp, Trash2 } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError('');
    if (!input.trim()) { setOutput(''); return; }
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string. Check your input.' : 'Encoding error. Try removing special characters.');
      setOutput('');
    }
  };

  const swap = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Decode
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
        </label>
        <div className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
            rows={6}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm resize-y"
          />
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="absolute top-3 right-3 p-1.5 bg-gray-700 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={process}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
        >
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>
        <button
          onClick={swap}
          disabled={!output}
          title="Use output as input"
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 rounded-xl transition-colors"
        >
          <ArrowDownUp className="w-5 h-5 text-white" />
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-900/30 border border-red-500/40 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </label>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={6}
            className="w-full px-4 py-3 bg-gray-900 border border-green-500/40 rounded-xl text-green-300 font-mono text-sm resize-y"
          />
          <p className="text-xs text-gray-500 mt-1">
            Input: {input.length} chars &bull; Output: {output.length} chars
            {mode === 'encode' && ` &bull; ${Math.round((output.length / input.length) * 100)}% of original size`}
          </p>
        </div>
      )}
    </div>
  );
};
