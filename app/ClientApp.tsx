'use client';

import dynamic from 'next/dynamic';

const BrowserApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-gray-950 text-white grid place-items-center">
      <p className="text-sm text-gray-400">Loading tools…</p>
    </main>
  ),
});

export function ClientApp({ initialToolId }: { initialToolId?: string }) {
  return <BrowserApp initialToolId={initialToolId} />;
}
