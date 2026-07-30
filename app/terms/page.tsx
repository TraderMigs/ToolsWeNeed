import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Terms of Use', description: 'Terms for using Tools We Need.' };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-10">
        <header><p className="text-sm text-blue-400">Effective July 30, 2026</p><h1 className="mt-2 text-3xl font-bold text-white">Terms of Use</h1></header>
        <section><h2 className="text-xl font-semibold text-white">Using the tools</h2><p className="mt-2">You may use the site and its browser-based tools for lawful personal or business purposes. Do not disrupt the service, probe it for unauthorized access, or use it to harm others.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Informational estimates</h2><p className="mt-2">Results are estimates based on the values and assumptions shown in each tool. Financial, tax, health, legal, and trading outputs are educational and are not professional advice. Verify important decisions with current authoritative sources or a qualified professional.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Your data and exports</h2><p className="mt-2">You are responsible for the data you enter and the files you download. Avoid entering confidential information on a shared device. Our Privacy Policy explains local storage and the limited forms that transmit data.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Availability and external sites</h2><p className="mt-2">We may correct, replace, or discontinue tools. Third-party sites linked from this service are independent; we do not control their availability, content, pricing, or privacy practices.</p></section>
        <section><h2 className="text-xl font-semibold text-white">No paid tier</h2><p className="mt-2">The listed tools are currently free and require no subscription. Donations or sponsorship inquiries, if offered separately, do not unlock tool functionality.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Contact</h2><p className="mt-2">Questions about these terms can be sent to <a className="text-blue-400 underline" href="mailto:hello@toolsweneed.com">hello@toolsweneed.com</a>.</p></section>
        <div className="flex flex-wrap gap-3"><Link className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500" href="/">Back to all tools</Link><Link className="inline-flex rounded-lg border border-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-800" href="/privacy">Privacy Policy</Link></div>
      </article>
    </main>
  );
}
