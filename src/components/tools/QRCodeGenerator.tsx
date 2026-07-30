import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import QRCode from 'qrcode';

export const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState('');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!text.trim()) return;
    setError('');
    try {
      setQrUrl(await QRCode.toDataURL(text.trim(), {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
      }));
    } catch (generationError) {
      console.error('QR generation failed:', generationError);
      setQrUrl('');
      setError('Unable to generate a QR code from this input.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'qrcode.png';
    link.click();
  };

  const errorLevels = [
    { value: 'L', label: 'Low (7%)' },
    { value: 'M', label: 'Medium (15%)' },
    { value: 'Q', label: 'Quartile (25%)' },
    { value: 'H', label: 'High (30%)' },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-4 rounded-xl border border-gray-700 bg-gray-900 p-6">
        <div>
          <label htmlFor="qr-content" className="mb-2 block text-sm font-medium text-gray-300">Text or URL to encode</label>
          <textarea
            id="qr-content"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter text, URL, phone number, or email"
            rows={3}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="qr-size" className="mb-2 block text-sm font-medium text-gray-300">Size: {size} × {size}px</label>
            <input id="qr-size" type="range" min={128} max={512} step={32} value={size} onChange={(event) => setSize(Number(event.target.value))} className="w-full accent-blue-500" />
          </div>
          <div>
            <label htmlFor="qr-error-level" className="mb-2 block text-sm font-medium text-gray-300">Error correction</label>
            <select id="qr-error-level" value={errorLevel} onChange={(event) => setErrorLevel(event.target.value as typeof errorLevel)} className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
              {errorLevels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
            </select>
          </div>
        </div>

        <button type="button" onClick={() => void generate()} disabled={!text.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-40">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Generate QR code
        </button>
      </div>

      <p className="text-center text-sm text-green-300">Generated locally — the encoded content is never uploaded.</p>
      {error && <p className="text-center text-sm text-red-300" role="alert">{error}</p>}

      {qrUrl && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <div className="rounded-xl bg-white p-4">
            <img src={qrUrl} alt="Generated QR code" width={size} height={size} className="block max-w-full" />
          </div>
          <button type="button" onClick={handleDownload} className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};
