import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tool Not Found | Tools We Need',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 text-white grid place-items-center p-6">
      <section className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">404</p>
        <h1 className="mt-3 text-3xl font-bold">That tool is not in the catalog</h1>
        <p className="mt-3 text-gray-400">The link may be outdated, or the tool name may be misspelled.</p>
        <Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500" href="/">Browse all tools</Link>
      </section>
    </main>
  );
}
