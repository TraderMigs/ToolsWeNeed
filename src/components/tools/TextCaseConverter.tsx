import React, { useState } from 'react';
import { Copy, Trash2, Type } from 'lucide-react';

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

const toSentenceCase = (str: string) =>
  str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());

const toCamelCase = (str: string) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

const toSnakeCase = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

const toKebabCase = (str: string) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const toAlternatingCase = (str: string) =>
  str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');

const conversions = [
  { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase(), id: 'upper' },
  { label: 'lowercase', fn: (s: string) => s.toLowerCase(), id: 'lower' },
  { label: 'Title Case', fn: toTitleCase, id: 'title' },
  { label: 'Sentence case', fn: toSentenceCase, id: 'sentence' },
  { label: 'camelCase', fn: toCamelCase, id: 'camel' },
  { label: 'snake_case', fn: toSnakeCase, id: 'snake' },
  { label: 'kebab-case', fn: toKebabCase, id: 'kebab' },
  { label: 'AlTeRnAtInG', fn: toAlternatingCase, id: 'alt' },
];

export const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [activeCase, setActiveCase] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const applyCase = (fn: (s: string) => string, id: string) => {
    setOutput(fn(text));
    setActiveCase(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Input Text</label>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setOutput(''); setActiveCase(''); }}
          placeholder="Type or paste your text here..."
          rows={5}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-y"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {conversions.map(c => (
          <button
            key={c.id}
            onClick={() => applyCase(c.fn, c.id)}
            disabled={!text}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 ${
              activeCase === c.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {output && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Result</label>
          <textarea
            value={output}
            readOnly
            rows={5}
            className="w-full px-4 py-3 bg-gray-900 border border-green-500/40 rounded-xl text-green-300 focus:outline-none resize-y"
          />
          <button
            onClick={handleCopy}
            className="absolute top-9 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>
          {copied && <p className="text-green-400 text-sm mt-1">Copied!</p>}
        </div>
      )}
    </div>
  );
};
