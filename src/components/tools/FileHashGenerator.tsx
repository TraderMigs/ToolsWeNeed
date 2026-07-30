import { useState } from 'react';
import { Check, Copy, Fingerprint } from 'lucide-react';

type Algorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';
interface HashResult { name: string; size: number; hash: string }

export function FileHashGenerator() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [results, setResults] = useState<HashResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');

  const hashFiles = async (files: File[]) => {
    setBusy(true);
    const next: HashResult[] = [];
    for (const file of files) {
      const digest = await crypto.subtle.digest(algorithm, await file.arrayBuffer());
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      next.push({ name: file.name, size: file.size, hash });
    }
    setResults(next);
    setBusy(false);
  };

  const copy = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopied(hash);
    window.setTimeout(() => setCopied(''), 1200);
  };

  const downloadManifest = () => {
    const body = results.map(result => `${result.hash}  ${result.name}`).join('\n');
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${algorithm.toLowerCase()}-checksums.txt`; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-5">
      <div className="grid gap-4 rounded-xl bg-gray-700 p-5 sm:grid-cols-[200px_1fr]">
        <label className="text-sm font-medium">Algorithm<select value={algorithm} onChange={event => setAlgorithm(event.target.value as Algorithm)} className="mt-2 w-full rounded-lg border border-gray-500 bg-gray-800 px-3 py-2"><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></label>
        <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-500 hover:border-blue-400"><Fingerprint className="mb-2 h-6 w-6 text-blue-400" /><span>{busy ? 'Hashing files…' : 'Choose one or more files'}</span><input className="sr-only" type="file" multiple disabled={busy} onChange={event => hashFiles(Array.from(event.target.files ?? []))} /></label>
      </div>
      <div className="space-y-3">{results.map(result => <article key={`${result.name}-${result.hash}`} className="rounded-lg bg-gray-900 p-4"><div className="flex items-center justify-between gap-3"><h3 className="truncate font-medium">{result.name}</h3><span className="text-xs text-gray-400">{(result.size / 1024).toFixed(1)} KB</span></div><div className="mt-3 flex gap-2"><code className="min-w-0 flex-1 break-all rounded bg-black/30 p-3 text-xs text-green-300">{result.hash}</code><button type="button" aria-label={`Copy checksum for ${result.name}`} onClick={() => copy(result.hash)} className="rounded bg-gray-700 p-3 hover:bg-gray-600">{copied === result.hash ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}</button></div></article>)}</div>
      {results.length > 0 && <button type="button" onClick={downloadManifest} className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500">Download checksum manifest</button>}
    </section>
  );
}
