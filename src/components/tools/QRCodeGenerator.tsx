import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw } from 'lucide-react';

// QR Code rendered via Google Charts API — no backend needed
export const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState('');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    if (!text.trim()) return;
    const encoded = encodeURIComponent(text.trim());
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&ecc=${errorLevel}&format=png`;
    setQrUrl(url);
    setGenerated(true);
  };

  const handleDownload = async () => {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
    URL.revokeObjectURL(url);
  };

  const errorLevels = [
    { val: 'L', label: 'L — Low (7%)' },
    { val: 'M', label: 'M — Medium (15%)' },
    { val: 'Q', label: 'Q — Quartile (25%)' },
    { val: 'H', label: 'H — High (30%)' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Text or URL to encode</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text, URL, phone number, email..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Size: {size}×{size}px</label>
            <input
              type="range" min={128} max={512} step={32} value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Error Correction</label>
            <select
              value={errorLevel}
              onChange={e => setErrorLevel(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {errorLevels.map(l => <option key={l.val} value={l.val}>{l.label}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!text.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate QR Code
        </button>
      </div>

      {generated && qrUrl && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-xl">
            <img src={qrUrl} alt="Generated QR Code" width={size} height={size} className="block" />
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};
