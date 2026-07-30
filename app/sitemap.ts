import type { MetadataRoute } from 'next';
import { tools } from '../src/data/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.toolsweneed.com';
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    ...tools.map(tool => ({ url: `${baseUrl}/${tool.id}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
