import { useState } from 'react';
import { ArrowDown, ArrowUp, FilePlus2, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  const merge = async () => {
    if (files.length < 2) return setError('Choose at least two PDF files.');
    setBusy(true);
    setError('');
    try {
      const output = await PDFDocument.create();
      for (const file of files) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const pages = await output.copyPages(source, source.getPageIndices());
        pages.forEach(page => output.addPage(page));
      }
      const bytes = await output.save();
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'merged-document.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('These PDFs could not be merged. Password-protected or damaged files are not supported.');
    } finally { setBusy(false); }
  };

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-dashed border-gray-600 bg-gray-900/60 p-6 text-center">
        <FilePlus2 className="mx-auto h-8 w-8 text-blue-400" aria-hidden="true" />
        <label className="mt-3 inline-flex cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500">
          Add PDF files
          <input className="sr-only" type="file" accept="application/pdf,.pdf" multiple onChange={event => setFiles(current => [...current, ...Array.from(event.target.files ?? [])])} />
        </label>
        <p className="mt-2 text-sm text-gray-400">Files are read and combined entirely on this device.</p>
      </div>
      <ol className="space-y-2" aria-label="PDF merge order">
        {files.map((file, index) => (
          <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-lg bg-gray-700 p-3">
            <span className="min-w-0 flex-1 truncate"><span className="mr-2 text-gray-400">{index + 1}.</span>{file.name}<span className="ml-2 text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span></span>
            <button type="button" aria-label={`Move ${file.name} up`} disabled={index === 0} onClick={() => move(index, -1)} className="rounded p-2 hover:bg-gray-600 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
            <button type="button" aria-label={`Move ${file.name} down`} disabled={index === files.length - 1} onClick={() => move(index, 1)} className="rounded p-2 hover:bg-gray-600 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
            <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles(files.filter((_, itemIndex) => itemIndex !== index))} className="rounded p-2 text-red-400 hover:bg-gray-600"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ol>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="button" disabled={busy || files.length < 2} onClick={merge} className="rounded-lg bg-green-600 px-5 py-3 font-semibold hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Merging…' : `Merge ${files.length || ''} PDFs`}</button>
    </section>
  );
}
