import { useEffect, useState } from 'react';
import { Download, ImageDown, Trash2 } from 'lucide-react';
import { zipSync } from 'fflate';

type OutputType = 'image/jpeg' | 'image/webp' | 'image/png';
interface OptimizedImage { name: string; originalSize: number; blob: Blob; url: string; width: number; height: number }

const extension: Record<OutputType, string> = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' };

const optimizeImage = (file: File, maxWidth: number, quality: number, type: OutputType): Promise<OptimizedImage> => new Promise((resolve, reject) => {
  const image = new Image();
  const inputUrl = URL.createObjectURL(file);
  image.onload = () => {
    const scale = Math.min(1, maxWidth / image.naturalWidth);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);
    canvas.toBlob(blob => {
      URL.revokeObjectURL(inputUrl);
      if (!blob) return reject(new Error('Conversion failed'));
      const base = file.name.replace(/\.[^.]+$/, '');
      resolve({ name: `${base}-optimized.${extension[type]}`, originalSize: file.size, blob, url: URL.createObjectURL(blob), width, height });
    }, type, type === 'image/png' ? undefined : quality);
  };
  image.onerror = () => { URL.revokeObjectURL(inputUrl); reject(new Error('Unsupported image')); };
  image.src = inputUrl;
});

export function ImageOptimizer() {
  const [maxWidth, setMaxWidth] = useState(1920);
  const [quality, setQuality] = useState(0.82);
  const [type, setType] = useState<OutputType>('image/webp');
  const [results, setResults] = useState<OptimizedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => results.forEach(result => URL.revokeObjectURL(result.url)), [results]);

  const processFiles = async (files: File[]) => {
    results.forEach(result => URL.revokeObjectURL(result.url));
    setBusy(true); setError('');
    try { setResults(await Promise.all(files.map(file => optimizeImage(file, maxWidth, quality, type)))); }
    catch { setError('One or more images could not be processed. Try JPG, PNG, or WebP files.'); setResults([]); }
    finally { setBusy(false); }
  };

  const downloadAll = async () => {
    const entries: Record<string, Uint8Array> = {};
    for (const result of results) entries[result.name] = new Uint8Array(await result.blob.arrayBuffer());
    const url = URL.createObjectURL(new Blob([zipSync(entries) as BlobPart], { type: 'application/zip' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'optimized-images.zip'; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-5">
      <div className="grid gap-4 rounded-xl bg-gray-700 p-5 sm:grid-cols-3">
        <label className="text-sm font-medium">Maximum width (px)<input type="number" min="100" max="10000" value={maxWidth} onChange={event => setMaxWidth(Math.max(100, Number(event.target.value)))} className="mt-2 w-full rounded-lg border border-gray-500 bg-gray-800 px-3 py-2" /></label>
        <label className="text-sm font-medium">Quality: {Math.round(quality * 100)}%<input type="range" min="0.2" max="1" step="0.01" value={quality} disabled={type === 'image/png'} onChange={event => setQuality(Number(event.target.value))} className="mt-4 w-full" /></label>
        <label className="text-sm font-medium">Output format<select value={type} onChange={event => setType(event.target.value as OutputType)} className="mt-2 w-full rounded-lg border border-gray-500 bg-gray-800 px-3 py-2"><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label>
      </div>
      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 bg-gray-900/60 hover:border-blue-400"><ImageDown className="mb-2 h-8 w-8 text-blue-400" /><strong>{busy ? 'Optimizing…' : 'Choose images for batch optimization'}</strong><span className="mt-1 text-sm text-gray-400">JPG, PNG, or WebP; processed locally</span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={event => processFiles(Array.from(event.target.files ?? []))} /></label>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {results.length > 0 && <div className="flex justify-between gap-4"><p className="text-sm text-gray-400">Saved {Math.max(0, 100 - Math.round(results.reduce((sum, item) => sum + item.blob.size, 0) / results.reduce((sum, item) => sum + item.originalSize, 0) * 100))}% across {results.length} image(s)</p><button onClick={downloadAll} className="rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-500"><Download className="mr-2 inline h-4 w-4" />Download ZIP</button></div>}
      <div className="grid gap-4 sm:grid-cols-2">{results.map(result => <article key={result.url} className="overflow-hidden rounded-xl bg-gray-900"><img src={result.url} alt={`Optimized preview of ${result.name}`} className="h-44 w-full object-contain bg-black/30" /><div className="p-4"><h3 className="truncate font-medium">{result.name}</h3><p className="mt-1 text-xs text-gray-400">{result.width}×{result.height} · {(result.originalSize / 1024).toFixed(0)} KB → {(result.blob.size / 1024).toFixed(0)} KB</p><a href={result.url} download={result.name} className="mt-3 inline-flex rounded bg-blue-600 px-3 py-2 text-sm hover:bg-blue-500">Download</a></div></article>)}</div>
      {results.length > 0 && <button onClick={() => { results.forEach(item => URL.revokeObjectURL(item.url)); setResults([]); }} className="inline-flex items-center text-sm text-red-400 hover:text-red-300"><Trash2 className="mr-2 h-4 w-4" />Clear results</button>}
    </section>
  );
}
