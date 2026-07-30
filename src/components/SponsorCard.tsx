import React from 'react';
import { ExternalLink, ShieldCheck, Star } from 'lucide-react';

export interface SponsorData {
  name: string;
  title: string;
  company: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  rating?: number;
  reviewCount?: number;
  verified: true;
}

// Sponsors must be individually verified before being added here. Empty by design.
const verifiedSponsors: Readonly<Record<string, SponsorData>> = {};

interface SponsorCardProps {
  toolId: string;
  className?: string;
}

export const SponsorCard: React.FC<SponsorCardProps> = ({ toolId, className = '' }) => {
  const sponsor = verifiedSponsors[toolId];
  if (!sponsor) return null;

  return (
    <aside className={`mt-6 rounded-xl border border-yellow-500/30 bg-gray-900 p-5 ${className}`} aria-label="Verified sponsor">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-yellow-400">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Verified sponsor
      </div>
      <h3 className="font-bold text-white">{sponsor.name}</h3>
      <p className="text-sm text-gray-400">{sponsor.title} · {sponsor.company}</p>
      <p className="mt-3 text-sm text-gray-300">{sponsor.description}</p>
      {sponsor.rating !== undefined && sponsor.reviewCount !== undefined && (
        <p className="mt-2 flex items-center gap-1 text-sm text-gray-300">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          {sponsor.rating.toFixed(1)} from {sponsor.reviewCount} verified reviews
        </p>
      )}
      <a href={sponsor.ctaUrl} target="_blank" rel="sponsored noopener noreferrer" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-950 hover:bg-yellow-400">
        {sponsor.ctaText}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </aside>
  );
};
