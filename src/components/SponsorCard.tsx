import React, { useState } from 'react';
import { Star, ExternalLink, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export interface SponsorData {
  name: string;
  title: string;
  company: string;
  tagline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  avatarInitials: string;
  avatarColor: string;
  rating: number;
  reviewCount: number;
  badge: string;
}

// Default sponsors per tool category — shown until a real sponsor buys the slot
const defaultSponsors: Record<string, SponsorData> = {
  'self-employed-tax-estimator': {
    name: 'Sarah Mitchell, CPA',
    title: 'Certified Public Accountant',
    company: 'Mitchell Tax Advisory',
    tagline: 'Save more. Stress less.',
    description: 'Specializing in freelancer & 1099 tax strategy. Free 15-min consult for Tools We Need users.',
    ctaText: 'Book Free Consult',
    ctaUrl: '#sponsor',
    avatarInitials: 'SM',
    avatarColor: 'bg-green-600',
    rating: 4.9,
    reviewCount: 142,
    badge: 'Tax Pro'
  },
  'debt-snowball-tracker': {
    name: 'James Okafor, AFC',
    title: 'Accredited Financial Counselor',
    company: 'ClearPath Financial',
    tagline: 'Debt-free is closer than you think.',
    description: 'Helping people eliminate debt and build real wealth. Get your free debt payoff roadmap today.',
    ctaText: 'Get Debt Roadmap',
    ctaUrl: '#sponsor',
    avatarInitials: 'JO',
    avatarColor: 'bg-red-600',
    rating: 5.0,
    reviewCount: 89,
    badge: 'Financial Coach'
  },
  'budget-card-conveyor': {
    name: 'Priya Nair, CFP',
    title: 'Certified Financial Planner',
    company: 'Nair Financial Group',
    tagline: 'A budget that actually works for you.',
    description: 'Personalized budgeting plans for individuals and families. First session is always free.',
    ctaText: 'Start Free Session',
    ctaUrl: '#sponsor',
    avatarInitials: 'PN',
    avatarColor: 'bg-blue-600',
    rating: 4.8,
    reviewCount: 203,
    badge: 'CFP'
  },
  'loan-comparison-tool': {
    name: 'Derek Moss',
    title: 'Senior Mortgage Advisor',
    company: 'Moss Lending Group',
    tagline: 'The right loan at the right rate.',
    description: 'Access 50+ lenders to find your best rate. No credit pull required to get started.',
    ctaText: 'See My Rate',
    ctaUrl: '#sponsor',
    avatarInitials: 'DM',
    avatarColor: 'bg-teal-600',
    rating: 4.9,
    reviewCount: 317,
    badge: 'Mortgage Expert'
  },
  'net-worth-snapshot': {
    name: 'Alicia Chen, RIA',
    title: 'Registered Investment Advisor',
    company: 'Horizon Wealth Partners',
    tagline: 'Grow what you have.',
    description: 'Independent, fee-only wealth management. No commissions — just advice that\'s actually in your corner.',
    ctaText: 'Free Wealth Review',
    ctaUrl: '#sponsor',
    avatarInitials: 'AC',
    avatarColor: 'bg-purple-600',
    rating: 5.0,
    reviewCount: 76,
    badge: 'Wealth Advisor'
  },
  'savings-goal-tracker': {
    name: 'Thomas Reed',
    title: 'Personal Finance Coach',
    company: 'Reed Money Method',
    tagline: 'Hit your goals faster.',
    description: 'Accountability coaching for savers and goal-setters. Structured 90-day programs that get results.',
    ctaText: 'Join 90-Day Program',
    ctaUrl: '#sponsor',
    avatarInitials: 'TR',
    avatarColor: 'bg-indigo-600',
    rating: 4.7,
    reviewCount: 58,
    badge: 'Money Coach'
  },
  'trade-profit-risk-calculator': {
    name: 'Marcus Webb',
    title: 'Head of Education',
    company: 'TradeSmith Academy',
    tagline: 'Learn to trade. Keep your money.',
    description: 'Structured trading courses for forex, futures, and equities. Risk management is our foundation.',
    ctaText: 'Free Trial Class',
    ctaUrl: '#sponsor',
    avatarInitials: 'MW',
    avatarColor: 'bg-emerald-600',
    rating: 4.8,
    reviewCount: 421,
    badge: 'Trading Educator'
  },
  'health-hub': {
    name: 'Dr. Lisa Crane, RDN',
    title: 'Registered Dietitian Nutritionist',
    company: 'Crane Nutrition & Wellness',
    tagline: 'Eat smarter. Feel better.',
    description: 'Personalized nutrition plans for intermittent fasting, weight management, and metabolic health.',
    ctaText: 'Book Nutrition Consult',
    ctaUrl: '#sponsor',
    avatarInitials: 'LC',
    avatarColor: 'bg-orange-600',
    rating: 5.0,
    reviewCount: 94,
    badge: 'Dietitian'
  },
  'sleep-debt-calculator': {
    name: 'Dr. Noah Park',
    title: 'Sleep Health Specialist',
    company: 'SleepWell Clinic',
    tagline: 'Sleep is your superpower.',
    description: 'Telehealth sleep consultations covering insomnia, sleep apnea, and recovery optimization.',
    ctaText: 'Book Telehealth Visit',
    ctaUrl: '#sponsor',
    avatarInitials: 'NP',
    avatarColor: 'bg-blue-800',
    rating: 4.9,
    reviewCount: 131,
    badge: 'Sleep Doctor'
  },
  'wedding-budget-planner': {
    name: 'Camille Dupont',
    title: 'Certified Wedding Planner',
    company: 'Dupont Events',
    tagline: 'Your perfect day, planned right.',
    description: 'Full-service and partial planning packages. Serving couples across the US since 2014.',
    ctaText: 'Check Availability',
    ctaUrl: '#sponsor',
    avatarInitials: 'CD',
    avatarColor: 'bg-rose-600',
    rating: 5.0,
    reviewCount: 187,
    badge: 'Wedding Pro'
  },
  'event-cost-estimator': {
    name: 'Victor Reyes',
    title: 'Corporate Event Director',
    company: 'Reyes Event Group',
    tagline: 'Events that run on budget.',
    description: 'Corporate and private event planning with full vendor management. Free quote for events 50+.',
    ctaText: 'Get Free Quote',
    ctaUrl: '#sponsor',
    avatarInitials: 'VR',
    avatarColor: 'bg-cyan-600',
    rating: 4.8,
    reviewCount: 63,
    badge: 'Event Planner'
  },
  'hourly-rate-calculator': {
    name: 'Dana Wells',
    title: 'Freelance Business Strategist',
    company: 'Freelance Forward',
    tagline: 'Charge what you\'re worth.',
    description: 'Helping freelancers land better clients, raise rates, and build sustainable businesses.',
    ctaText: 'Free Strategy Call',
    ctaUrl: '#sponsor',
    avatarInitials: 'DW',
    avatarColor: 'bg-amber-600',
    rating: 4.9,
    reviewCount: 109,
    badge: 'Freelance Coach'
  },
  'freelance-proposal-estimator': {
    name: 'Dana Wells',
    title: 'Freelance Business Strategist',
    company: 'Freelance Forward',
    tagline: 'Win more proposals.',
    description: 'Proposal templates, pricing guides, and 1-on-1 coaching to help you close more clients.',
    ctaText: 'Get Proposal Templates',
    ctaUrl: '#sponsor',
    avatarInitials: 'DW',
    avatarColor: 'bg-amber-600',
    rating: 4.9,
    reviewCount: 109,
    badge: 'Freelance Coach'
  },
  'subscription-purge-tool': {
    name: 'Ellen Torres',
    title: 'Consumer Finance Advisor',
    company: 'SpendSmart Advisory',
    tagline: 'Stop paying for things you don\'t use.',
    description: 'Subscription audits and spending optimization for individuals and households.',
    ctaText: 'Book Spending Audit',
    ctaUrl: '#sponsor',
    avatarInitials: 'ET',
    avatarColor: 'bg-pink-600',
    rating: 4.7,
    reviewCount: 44,
    badge: 'Finance Advisor'
  },
  'cost-of-living-calculator': {
    name: 'Ray Hoffman',
    title: 'Relocation Specialist',
    company: 'Hoffman Relocation Group',
    tagline: 'Move smart. Live better.',
    description: 'Full relocation services including cost planning, neighborhood matching, and housing guidance.',
    ctaText: 'Free Relocation Consult',
    ctaUrl: '#sponsor',
    avatarInitials: 'RH',
    avatarColor: 'bg-yellow-600',
    rating: 4.8,
    reviewCount: 72,
    badge: 'Relocation Pro'
  },
};

// Generic fallback for tools not explicitly mapped
const genericSponsor: SponsorData = {
  name: 'Your Name Here',
  title: 'Your Title',
  company: 'Your Company',
  tagline: 'Reach your ideal audience here.',
  description: 'Sponsor this tool and connect with thousands of users who match your exact ideal client profile. Simple monthly pricing, no long-term contracts.',
  ctaText: 'Advertise Here',
  ctaUrl: 'mailto:hello@toolsweneed.com?subject=Sponsor%20Inquiry',
  avatarInitials: '?',
  avatarColor: 'bg-gray-500',
  rating: 0,
  reviewCount: 0,
  badge: 'Featured Sponsor'
};

interface SponsorCardProps {
  toolId: string;
  className?: string;
}

export const SponsorCard: React.FC<SponsorCardProps> = ({ toolId, className = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const sponsor = defaultSponsors[toolId] || genericSponsor;
  const isGeneric = !defaultSponsors[toolId];

  return (
    <div className={`mt-6 rounded-xl border border-yellow-500/30 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Featured Expert</span>
        </div>
        <span className="text-xs text-gray-500">Sponsored</span>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-full ${sponsor.avatarColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-white font-bold text-lg">{sponsor.avatarInitials}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">{sponsor.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
                {sponsor.badge}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{sponsor.title} · {sponsor.company}</p>

            {/* Rating */}
            {sponsor.rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(sponsor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">{sponsor.rating} ({sponsor.reviewCount} reviews)</span>
              </div>
            )}

            {/* Tagline */}
            <p className="text-sm font-medium text-white mt-2 italic">"{sponsor.tagline}"</p>
          </div>
        </div>

        {/* Expandable description */}
        {expanded && (
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">{sponsor.description}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3">
          <a
            href={sponsor.ctaUrl}
            target={isGeneric ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-lg text-sm font-semibold transition-colors"
          >
            {sponsor.ctaText}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Less</> : <><ChevronDown className="w-3.5 h-3.5" /> More info</>}
          </button>
        </div>

        {isGeneric && (
          <p className="text-xs text-gray-600 mt-2">
            Want this slot? <a href="mailto:hello@toolsweneed.com?subject=Sponsor%20Inquiry" className="text-blue-400 hover:text-blue-300">Contact us</a> — simple monthly pricing, no long-term contracts.
          </p>
        )}
      </div>
    </div>
  );
};
