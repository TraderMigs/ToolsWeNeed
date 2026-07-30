import { useMemo, useState } from 'react';
import { Download, TableProperties } from 'lucide-react';
import Papa from 'papaparse';

type Cell = string | number | boolean | null;

export function CSVWorkbench() {
  const [rows, setRows] = useState<Cell[][]>([]);
  const [filename, setFilename] = useState('cleaned-data.csv');
  const [trimCells, setTrimCells] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [error, setError] = useState('');

  const cleaned = useMemo(() => {
    let next = rows.map(row => row.map(cell => typeof cell === 'string' && trimCells ? cell.trim() : cell));
    if (removeEmpty) next = next.filter(row => row.some(cell => cell !== null && String(cell).trim() !== ''));
    if (removeDuplicates && next.length > 1) {
      const seen = new Set<string>();
      next = next.filter((row, index) => index === 0 || !seen.has(JSON.stringify(row)) && Boolean(seen.add(JSON.stringify(row))));
    }
    return next;
  }, [rows, trimCells, removeEmpty, removeDuplicates]);

  const read = (file?: File) => {
    if (!file) return;
    setError('');
    Papa.parse<Cell[]>(file, {
      dynamicTyping: true,
      skipEmptyLines: false,
      complete: result => { setRows(result.data); setFilename(`${file.name.replace(/\.[^.]+$/, '')}-cleaned.csv`); },
      error: () => { setError('The file could not be read. Choose a valid CSV or TSV file.'); setRows([]); },
    });
  };

  const download = () => {
    const csv = Papa.unparse(cleaned);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
  };

  const columnCount = cleaned.reduce((max, row) => Math.max(max, row.length), 0);
  return (
    <section className="space-y-5">
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 bg-gray-900/60 hover:border-blue-400"><TableProperties className="mb-2 h-8 w-8 text-green-400" /><strong>Open delimited data</strong><span className="mt-1 text-sm text-gray-400">CSV or TSV · local only</span><input className="sr-only" type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" onChange={event => read(event.target.files?.[0])} /></label>
      <fieldset className="flex flex-wrap gap-5 rounded-lg bg-gray-700 p-4"><legend className="sr-only">Cleanup operations</legend>{[[trimCells, setTrimCells, 'Trim whitespace'], [removeEmpty, setRemoveEmpty, 'Remove empty rows'], [removeDuplicates, setRemoveDuplicates, 'Remove duplicate rows']].map(([checked, setter, label]) => <label key={label as string} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checked as boolean} onChange={event => (setter as (value: boolean) => void)(event.target.checked)} />{label as string}</label>)}</fieldset>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {rows.length > 0 && <><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-gray-300">{rows.length.toLocaleString()} source rows → {cleaned.length.toLocaleString()} output rows · {columnCount} columns</p><button onClick={download} className="rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-500"><Download className="mr-2 inline h-4 w-4" />Download cleaned CSV</button></div><div className="overflow-auto rounded-lg border border-gray-700"><table className="min-w-full divide-y divide-gray-700 text-left text-sm"><tbody className="divide-y divide-gray-800">{cleaned.slice(0, 50).map((row, rowIndex) => <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-700 font-semibold' : 'bg-gray-900'}>{Array.from({ length: columnCount }, (_, columnIndex) => <td key={columnIndex} className="max-w-64 truncate px-3 py-2">{String(row[columnIndex] ?? '')}</td>)}</tr>)}</tbody></table></div>{cleaned.length > 50 && <p className="text-xs text-gray-500">Previewing the first 50 rows. The download includes all rows.</p>}</>}
    </section>
  );
}
