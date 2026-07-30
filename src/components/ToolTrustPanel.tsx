import { Database, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Tool } from '../data/tools';
import { getToolTrust } from '../data/toolTrust';

// One-line trust statement that expands on tap. The full privacy detail is a
// click away instead of two screens of reading before the tool itself.
export function ToolTrustPanel({ tool }: { tool: Tool }) {
  const trust = getToolTrust(tool);
  return (
    <aside className="border-b border-gray-700 bg-gray-900/70" aria-label="Privacy and calculation details">
      <details className="group">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 sm:px-6 text-sm text-gray-300 list-none [&::-webkit-details-marker]:hidden">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />
          <span className="flex-1">
            <strong className="text-white">Private by design.</strong> Runs entirely in your browser.
          </span>
          <span className="text-xs text-blue-400 group-open:hidden">Details</span>
          <span className="hidden text-xs text-blue-400 group-open:inline">Hide</span>
        </summary>
        <div className="space-y-3 px-4 pb-4 sm:px-6 text-sm text-gray-300">
          <p className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden="true" /><span><strong className="text-white">Processing.</strong> {trust.processing}</span></p>
          <p className="flex gap-2"><Database className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" /><span><strong className="text-white">Storage.</strong> {trust.storage}</span></p>
          <p className="flex gap-2"><Download className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" /><span><strong className="text-white">Exports.</strong> {trust.export}</span></p>
          <p className="flex gap-2"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" /><span><strong className="text-white">Network.</strong> {trust.externalLinks}</span></p>
          {trust.methodology && (
            <div className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
              <p className="font-medium text-white">Method, assumptions, and source</p>
              <p className="mt-2 text-sm leading-6 text-gray-300">{trust.methodology.method}</p>
              {trust.methodology.source && <a className="mt-2 inline-flex text-sm text-blue-400 underline hover:text-blue-300" href={trust.methodology.source.url} target="_blank" rel="noreferrer">{trust.methodology.source.label}</a>}
            </div>
          )}
          <p className="text-xs text-gray-500">Feedback is separate: it transmits only the rating or text you explicitly submit.</p>
        </div>
      </details>
    </aside>
  );
}
