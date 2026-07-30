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
    openGraph: { title: `${tool.title} | Tools We Need`, description: tool.description, url: `/${tool.id}`, images: ['/social-preview.png'] },
  };
}

export default async function ToolRoute({ params }: ToolRouteProps) {
  const { tool: slug } = await params;
  const tool = tools.find(candidate => candidate.id === slug);
  if (!tool) notFound();
  return <ClientApp initialToolId={tool.id} />;
}
