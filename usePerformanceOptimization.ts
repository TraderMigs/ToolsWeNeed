import {
  Calculator,
  Receipt,
  TrendingDown,
  TrendingUp,
  PieChart,
  Users,
  BarChart3,
  Target,
  CreditCard,
  MapPin,
  Heart,
  Calendar,
  Package,
  Clock,
  CalendarDays,
  DollarSign,
  FileText,
  Briefcase,
  Moon,
  Timer,
  RefreshCw,
  Search
} from 'lucide-react';
import { optimizeToolPlacement, trackToolCoUsage } from './toolRelationships';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  tags: string;
  category: 'financial' | 'business' | 'wellness' | 'planning' | 'trading' | 'search';
  sortWeight: number;
  usageCount?: number;
  exportCount?: number;
}

export const toolCategories = {
  financial: {
    name: '🧮 Financial Calculators',
    description: 'Tax, debt, budgeting, and investment tools',
    color: 'bg-green-600',
    priority: 1
  },
  business: {
    name: '👔 Career & Work',
    description: 'Resume, proposals, and professional tools',
    color: 'bg-blue-600',
    priority: 2
  },
  wellness: {
    name: '🏋️‍♂️ Health & Fitness',
    description: 'Fasting, nutrition, and wellness tracking',
    color: 'bg-orange-600',
    priority: 3
  },
  planning: {
    name: '🧠 Life Organizers',
    description: 'Events, travel, and life planning tools',
    color: 'bg-purple-600',
    priority: 4
  },
  trading: {
    name: '📈 Trading & Investing',
    description: 'Investment and market analysis tools',
    color: 'bg-emerald-600',
    priority: 1
  },
  search: {
    name: '🧰 Utilities & Converters',
    description: 'Productivity and utility tools',
    color: 'bg-indigo-600',
    priority: 5
  }
};

export const tools: Tool[] = [
  // 🧮 FINANCIAL CALCULATORS
  {
    id: 'self-employed-tax-estimator',
    title: 'Self-Employed Tax Estimator',
    description: '1099 income estimator with deductions and tax bracket calculations',
    icon: Receipt,
    color: 'bg-green-500',
    tags: 'finance,tax,freelance,business,1099',
    category: 'financial',
    sortWeight: 1000
  },
  {
    id: 'debt-snowball-tracker',
    title: 'Debt Snowball Tracker',
    description: 'Auto-prioritize debt payoff strategy and visualize progress',
    icon: TrendingDown,
    color: 'bg-red-500',
    tags: 'finance,debt,payoff,snowball,tracker',
    category: 'financial',
    sortWeight: 900
  },
  {
    id: 'hourly-rate-calculator',
    title: 'Hourly Rate Calculator',
    description: 'Calculate required hourly rate from income goals and taxes',
    icon: Clock,
    color: 'bg-amber-500',
    tags: 'finance,freelance,pricing,business,rate',
    category: 'financial',
    sortWeight: 850
  },
  {
    id: 'net-worth-snapshot',
    title: 'Net Worth Snapshot',
    description: 'Track all assets and liabilities with change visualization',
    icon: PieChart,
    color: 'bg-purple-500',
    tags: 'finance,networth,assets,liabilities,wealth',
    category: 'financial',
    sortWeight: 800
  },
  {
    id: 'savings-goal-tracker',
    title: 'Savings Goal Tracker',
    description: 'Set targets, track progress, and project completion dates',
    icon: Target,
    color: 'bg-indigo-500',
    tags: 'finance,savings,goals,tracker,planning',
    category: 'financial',
    sortWeight: 700
  },
  {
    id: 'budget-card-conveyor',
    title: 'Budget Card Conveyor',
    description: 'Full budget planner with daily, weekly, monthly, and yearly tracking',
    icon: Calculator,
    color: 'bg-blue-500',
    tags: 'finance,budget,planning,expense,income',
    category: 'financial',
    sortWeight: 650
  },
  {
    id: 'loan-comparison-tool',
    title: 'Loan Comparison Tool',
    description: 'Compare APR vs interest rates with amortization tables',
    icon: BarChart3,
    color: 'bg-teal-500',
    tags: 'finance,loan,comparison,mortgage,apr',
    category: 'financial',
    sortWeight: 600
  },
  {
    id: 'subscription-purge-tool',
    title: 'Subscription Purge Tool',
    description: 'List recurring costs with monthly totals and export options',
    icon: CreditCard,
    color: 'bg-pink-500',
    tags: 'finance,subscription,recurring,cost,purge',
    category: 'financial',
    sortWeight: 550
  },
  {
    id: 'cost-of-living-calculator',
    title: 'Cost of Living Calculator',
    description: 'Compare living costs between different cities',
    icon: MapPin,
    color: 'bg-yellow-500',
    tags: 'finance,cost,living,city,comparison',
    category: 'financial',
    sortWeight: 500
  },

  // 📈 TRADING & INVESTING
  {
    id: 'trade-profit-risk-calculator',
    title: 'Multi-Asset Trading Calculator',
    description: 'Calculate P&L, risk, margin & pip value for all asset classes',
    icon: TrendingUp,
    color: 'bg-emerald-600',
    tags: 'finance,trading,forex,stocks,risk,futures,options',
    category: 'trading',
    sortWeight: 750
  },

  // 👔 CAREER & WORK
  {
    id: 'resume-builder-pro',
    title: 'Resume Builder Pro',
    description: 'AI-crafted, ATS-optimized resume & cover letter — powered by SexyResume',
    icon: FileText,
    color: 'bg-pink-600',
    tags: 'career,resume,job,ats,ai,cover letter',
    category: 'business',
    sortWeight: 480
  },
  {
    id: 'resume-scanner',
    title: 'Resume Scanner',
    description: 'Match your resume against job descriptions and spot gaps instantly',
    icon: Search,
    color: 'bg-slate-500',
    tags: 'career,resume,job,scanner,ats,match',
    category: 'business',
    sortWeight: 460
  },
  {
    id: 'freelance-proposal-estimator',
    title: 'Freelance Proposal Estimator',
    description: 'Rate and scope calculator with milestone tracking',
    icon: Briefcase,
    color: 'bg-blue-600',
    tags: 'finance,freelance,proposal,business,pricing',
    category: 'business',
    sortWeight: 440
  },
  {
    id: 'meeting-cost-estimator',
    title: 'Meeting Cost Estimator',
    description: 'Calculate the real cost of meetings based on attendee rates',
    icon: DollarSign,
    color: 'bg-violet-500',
    tags: 'business,productivity,cost,meeting,time',
    category: 'business',
    sortWeight: 420
  },

  // 🏋️ HEALTH & FITNESS
  {
    id: 'health-hub',
    title: 'Health Hub',
    description: 'Complete health tracking with intermittent fasting timer and nutrition logging',
    icon: Timer,
    color: 'bg-orange-600',
    tags: 'health,fasting,nutrition,intermittent,tracker,wellness',
    category: 'wellness',
    sortWeight: 400
  },
  {
    id: 'sleep-debt-calculator',
    title: 'Sleep Debt Calculator',
    description: 'Track sleep patterns and calculate recovery time needed',
    icon: Moon,
    color: 'bg-blue-800',
    tags: 'health,sleep,debt,recovery,tracker',
    category: 'wellness',
    sortWeight: 380
  },

  // 🧠 LIFE ORGANIZERS
  {
    id: 'wedding-budget-planner',
    title: 'Wedding Budget Planner',
    description: 'Track wedding items, vendors, and total costs',
    icon: Heart,
    color: 'bg-rose-500',
    tags: 'wedding,budget,planning,vendor,cost',
    category: 'planning',
    sortWeight: 360
  },
  {
    id: 'event-cost-estimator',
    title: 'Event Cost Estimator',
    description: 'Multi-line cost breakdown for events of any size',
    icon: Calendar,
    color: 'bg-cyan-500',
    tags: 'event,cost,planning,budget,party',
    category: 'planning',
    sortWeight: 340
  },
  {
    id: 'bill-splitter-pro',
    title: 'Bill Splitter Pro',
    description: 'Fair bill splitting with tips and per-person export',
    icon: Users,
    color: 'bg-orange-500',
    tags: 'finance,bill,split,group,expense',
    category: 'planning',
    sortWeight: 320
  },
  {
    id: 'packing-checklist-generator',
    title: 'Packing Checklist Generator',
    description: 'Destination and purpose-based packing checklist builder',
    icon: Package,
    color: 'bg-lime-500',
    tags: 'travel,packing,checklist,trip,planning',
    category: 'planning',
    sortWeight: 300
  },
  {
    id: 'time-blocking-scheduler',
    title: 'Time Blocking Scheduler',
    description: 'Visual schedule builder with downloadable time blocks',
    icon: CalendarDays,
    color: 'bg-emerald-500',
    tags: 'productivity,time,schedule,planning,blocks',
    category: 'planning',
    sortWeight: 280
  },

  // 🧰 UTILITIES
  {
    id: 'subscription-swap-finder',
    title: 'Subscription Swap Finder',
    description: 'Find free or cheaper alternatives to paid subscriptions and tools',
    icon: RefreshCw,
    color: 'bg-indigo-600',
    tags: 'finance,subscription,alternatives,savings,swap',
    category: 'search',
    sortWeight: 260
  },
];

export const getSmartSortedTools = (usageData?: Record<string, number>) => {
  return [...tools].sort((a, b) => {
    const aScore = a.sortWeight + (usageData?.[a.id] || 0) * 5;
    const bScore = b.sortWeight + (usageData?.[b.id] || 0) * 5;
    return bScore - aScore;
  });
};

export const getToolsByCategory = (categoryId: string) => {
  return tools.filter(tool => tool.category === categoryId);
};

export const getCategoriesWithTools = () => {
  return Object.entries(toolCategories).map(([id, category]) => ({
    id,
    ...category,
    tools: getToolsByCategory(id)
  }));
};

export const updateToolUsage = (toolId: string, type: 'view' | 'export' = 'view') => {
  const key = `toolsweneed_usage_${type}`;
  const current = JSON.parse(localStorage.getItem(key) || '{}');
  current[toolId] = (current[toolId] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(current));
};

export const getToolUsageData = (type: 'view' | 'export' = 'view') => {
  const key = `toolsweneed_usage_${type}`;
  return JSON.parse(localStorage.getItem(key) || '{}');
};

export const getPopularTools = (limit: number = 12) => {
  const viewData = getToolUsageData('view');
  const exportData = getToolUsageData('export');
  const combinedUsage: Record<string, number> = {};
  Object.keys({ ...viewData, ...exportData }).forEach(toolId => {
    combinedUsage[toolId] = (viewData[toolId] || 0) + (exportData[toolId] || 0) * 2;
  });
  return [...tools]
    .sort((a, b) => (combinedUsage[b.id] || 0) - (combinedUsage[a.id] || 0))
    .slice(0, limit);
};

export const getPopularityBasedTools = () => {
  const viewData = getToolUsageData('view');
  const exportData = getToolUsageData('export');
  const combinedUsage: Record<string, number> = {};
  Object.keys({ ...viewData, ...exportData }).forEach(toolId => {
    combinedUsage[toolId] = (viewData[toolId] || 0) + (exportData[toolId] || 0) * 2;
  });
  return optimizeToolPlacement(tools, combinedUsage);
};

export const getRecentlyAddedTools = (limit: number = 5) => {
  return [...tools].slice(-limit);
};

export const getSortedTools = (sortBy: 'popular' | 'recent' | 'alphabetical' = 'popular') => {
  switch (sortBy) {
    case 'popular':
      return getPopularityBasedTools();
    case 'recent':
      return [...tools].sort((a, b) => b.sortWeight - a.sortWeight);
    case 'alphabetical':
      return [...tools].sort((a, b) => a.title.localeCompare(b.title));
    default:
      return getPopularityBasedTools();
  }
};

export const trackToolTransition = (fromTool: string, toTool: string) => {
  if (fromTool && toTool && fromTool !== toTool) {
    trackToolCoUsage(fromTool, toTool);
  }
};
