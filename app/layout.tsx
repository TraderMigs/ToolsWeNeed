import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../src/index.css';
import { ServiceWorkerRegistration } from './ServiceWorkerRegistration';

export const metadata: Metadata = {
  metadataBase: new URL('https://toolsweneed.com'),
  title: { default: 'Tools We Need — Free, Private Browser Tools', template: '%s | Tools We Need' },
  description: 'Professional-grade calculators and utilities that run in your browser, require no account, and are free to use.',
  applicationName: 'Tools We Need',
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Tools We Need',
    title: 'Tools We Need — Free, Private Browser Tools',
    description: 'Professional-grade calculators and utilities that run in your browser.',
    images: ['/social-preview.png'],
  },
};

export const viewport: Viewport = { themeColor: '#111827', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistration />
        {/* Vercel Web Analytics — no-op until enabled in the Vercel dashboard */}
        <Script defer src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
