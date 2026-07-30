import { Database, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Tool } from '../data/tools';
import { getToolTrust } from '../data/toolTrust';

export function ToolTrustPanel({ tool }: { tool: Tool }) {
  const trust = getToolTrust(tool);
  return (
    <aside className="border-b border-gray-700 bg-gray-900/70 px-6 py-4" aria-label="Privacy and calculation details">
      <div className="grid gap-3 text-sm text-gray-300 md:grid-cols-2">
        <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" /><span><strong className="text-white">Processed locally.</strong> {trust.processing}</span></p>
        <p className="flex gap-2"><Database className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" /><span><strong className="text-white">Storage.</strong> {trust.storage}</span></p>
        <p className="flex gap-2"><Download className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" /><span><strong className="text-white">Exports.</strong> {trust.export}</span></p>
        <p className="flex gap-2"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" /><span><strong className="text-white">Network.</strong> {trust.externalLinks}</span></p>
      </div>
      {trust.methodology && (
        <details className="mt-4 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
          <summary className="cursor-pointer font-medium text-white">Method, assumptions, and source</summary>
          <p className="mt-3 text-sm leading-6 text-gray-300">{trust.methodology.method}</p>
          {trust.methodology.source && <a className="mt-2 inline-flex text-sm text-blue-400 underline hover:text-blue-300" href={trust.methodology.source.url} target="_blank" rel="noreferrer">{trust.methodology.source.label}</a>}
        </details>
      )}
      <p className="mt-3 text-xs text-gray-500">Feedback is separate: it transmits only the rating or text you explicitly submit.</p>
    </aside>
  );
}
