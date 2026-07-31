import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientApp } from '../ClientApp';
import { tools } from '../../src/data/tools';

interface ToolRouteProps { params: Promise<{ tool: string }> }

export function generateStaticParams() {
  return tools.map(tool => ({ tool: tool.id }));
}

export async function generateMetadata({ params }: ToolRouteProps): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = tools.find(candidate => candidate.id === slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: `${tool.description}. Free to use with no registration required.`,
    alternates: { canonical: `/${tool.id}` },
    openGraph: { title: `${tool.title} | Tools We Need`, description: tool.description, url: `/${tool.id}`, images: ['/social-preview.png?v=2'] },
  };
}

export default async function ToolRoute({ params }: ToolRouteProps) {
  const { tool: slug } = await params;
  const tool = tools.find(candidate => candidate.id === slug);
  if (!tool) notFound();

  // Per-tool structured data so search engines index each tool as a free web app
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    url: `https://www.toolsweneed.com/${tool.id}`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any (browser-based)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'Tools We Need', url: 'https://www.toolsweneed.com' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientApp initialToolId={tool.id} />
    </>
  );
}
