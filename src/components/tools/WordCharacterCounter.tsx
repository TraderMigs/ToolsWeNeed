import React, { useState, useMemo } from 'react';
import { FileText, Copy, Trash2 } from 'lucide-react';

export const WordCharacterCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));
    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'Words', value: stats.words.toLocaleString(), color: 'text-blue-400' },
    { label: 'Characters', value: stats.characters.toLocaleString(), color: 'text-green-400' },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces.toLocaleString(), color: 'text-yellow-400' },
    { label: 'Sentences', value: stats.sentences.toLocaleString(), color: 'text-purple-400' },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString(), color: 'text-pink-400' },
    { label: 'Reading Time', value: `~${stats.readingTime} min`, color: 'text-orange-400' },
    { label: 'Speaking Time', value: `~${stats.speakingTime} min`, color: 'text-cyan-400' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.slice(0, 4).map(s => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {statCards.slice(4).map(s => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={12}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-y font-mono text-sm"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!text}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 rounded-lg transition-colors"
            title="Copy text"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setText('')}
            disabled={!text}
            className="p-2 bg-gray-700 hover:bg-red-700 disabled:opacity-30 rounded-lg transition-colors"
            title="Clear"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      {copied && <p className="text-green-400 text-sm text-center">Copied to clipboard!</p>}
    </div>
  );
};
