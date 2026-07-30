import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Tools We Need processes and stores data.' };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-10">
        <header><p className="text-sm text-blue-400">Effective July 30, 2026</p><h1 className="mt-2 text-3xl font-bold text-white">Privacy Policy</h1></header>
        <section><h2 className="text-xl font-semibold text-white">Plain-language summary</h2><p className="mt-2">The calculators and utilities process their working data in your browser. They do not require an account, and normal tool inputs are not uploaded to Tools We Need.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Browser storage</h2><p className="mt-2">Some tools save preferences, history, drafts, or usage counts in local or session storage on your device. This data remains under your browser profile and can be removed by clearing site data. Downloaded exports are created on your device.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Information you choose to send</h2><p className="mt-2">Feedback and tool-request forms send the rating, comment, or request you enter to our configured database when that service is available. Those forms identify what will be sent before submission. Do not include sensitive personal information.</p></section>
        <section><h2 className="text-xl font-semibold text-white">External links</h2><p className="mt-2">Sponsor, sharing, resume, and software-alternative links can open third-party websites. Their privacy practices apply after you leave this site. Opening a tool itself does not send the values you enter to those sites.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Payments and accounts</h2><p className="mt-2">Tools We Need currently has no paid tool tier, payment checkout, or user accounts. We do not collect payment credentials.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Contact</h2><p className="mt-2">For privacy questions or deletion requests concerning feedback you submitted, email <a className="text-blue-400 underline" href="mailto:hello@toolsweneed.com">hello@toolsweneed.com</a>.</p></section>
        <Link className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500" href="/">Back to all tools</Link>
      </article>
    </main>
  );
}
