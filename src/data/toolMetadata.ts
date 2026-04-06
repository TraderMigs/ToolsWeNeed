export interface ToolMetadata {
  id: string;
  title: string;
  metaDescription: string;
  toolDescription: string;
  relatedTools: string[];
}

export const toolMetadata: Record<string, ToolMetadata> = {
  'budget-card-conveyor': {
    id: 'budget-card-conveyor',
    title: 'Budget Card Conveyor | Free Budget Planner | Tools We Need',
    metaDescription: 'Free budget planner with daily, weekly, monthly tracking. Plan your finances and track expenses with our comprehensive budgeting tool.',
    toolDescription: 'Take control of your finances with our comprehensive budget planner. Track income and expenses across daily, weekly, monthly, and yearly periods to build better spending habits.',
    relatedTools: ['savings-goal-tracker', 'debt-snowball-tracker']
  },
  'self-employed-tax-estimator': {
    id: 'self-employed-tax-estimator',
    title: 'Self-Employed Tax Estimator | Freelance Tax Calculator',
    metaDescription: 'Free tool for freelancers to estimate quarterly taxes quickly and easily. Calculate 1099 income tax with deductions and brackets.',
    toolDescription: 'Estimate your freelance taxes in seconds. This free tool helps self-employed professionals calculate quarterly payments and avoid surprises.',
    relatedTools: ['hourly-rate-calculator', 'freelance-proposal-estimator']
  },
  'debt-snowball-tracker': {
    id: 'debt-snowball-tracker',
    title: 'Debt Snowball Tracker | Free Debt Payoff Calculator',
    metaDescription: 'Auto-prioritize debt payoff strategy with our free debt snowball tracker. Visualize progress and calculate payoff timeline.',
    toolDescription: 'Pay off debt faster with the proven snowball method. Automatically prioritize your debts and track your progress toward financial freedom.',
    relatedTools: ['budget-card-conveyor', 'savings-goal-tracker']
  },
  'net-worth-snapshot': {
    id: 'net-worth-snapshot',
    title: 'Net Worth Calculator | Track Assets & Liabilities Free',
    metaDescription: 'Track all assets and liabilities with change visualization. Free net worth calculator to monitor your financial progress.',
    toolDescription: 'Get a complete picture of your financial health. Track all your assets and liabilities in one place with visual progress tracking.',
    relatedTools: ['budget-card-conveyor', 'debt-snowball-tracker']
  },
  'bill-splitter-pro': {
    id: 'bill-splitter-pro',
    title: 'Bill Splitter Pro | Fair Bill Splitting Calculator',
    metaDescription: 'Fair bill splitting with tips and per-person export. Free tool to split restaurant bills, group expenses, and shared costs.',
    toolDescription: 'Split bills fairly every time. Calculate individual shares including tips and taxes, then export detailed breakdowns for each person.',
    relatedTools: ['meeting-cost-estimator', 'event-cost-estimator']
  },
  'loan-comparison-tool': {
    id: 'loan-comparison-tool',
    title: 'Loan Comparison Tool | Compare APR vs Interest Rates',
    metaDescription: 'Compare APR vs interest rates with amortization tables. Free loan comparison calculator for mortgages and personal loans.',
    toolDescription: 'Make smarter borrowing decisions. Compare multiple loans side-by-side with detailed amortization schedules and total cost analysis.',
    relatedTools: ['debt-snowball-tracker', 'savings-goal-tracker']
  },
  'savings-goal-tracker': {
    id: 'savings-goal-tracker',
    title: 'Savings Goal Tracker | Free Goal Setting Calculator',
    metaDescription: 'Set targets, track progress, and project completion dates. Free savings goal tracker to reach your financial milestones.',
    toolDescription: 'Turn your financial dreams into achievable goals. Set targets, track progress, and get personalized recommendations to stay on track.',
    relatedTools: ['budget-card-conveyor', 'net-worth-snapshot']
  },
  'subscription-purge-tool': {
    id: 'subscription-purge-tool',
    title: 'Subscription Purge Tool | Track Recurring Costs Free',
    metaDescription: 'List recurring costs with monthly totals and export options. Free subscription tracker to cancel unwanted services.',
    toolDescription: 'Stop paying for forgotten subscriptions. Track all your recurring costs and identify potential savings with our comprehensive subscription manager.',
    relatedTools: ['budget-card-conveyor', 'bill-splitter-pro']
  },
  'cost-of-living-calculator': {
    id: 'cost-of-living-calculator',
    title: 'Cost of Living Calculator | Compare Cities Free',
    metaDescription: 'Compare living costs between different cities. Free cost of living calculator for relocation and salary negotiation.',
    toolDescription: 'Planning a move or salary negotiation? Compare living costs between cities to make informed financial decisions about your future.',
    relatedTools: ['budget-card-conveyor', 'hourly-rate-calculator']
  },
  'wedding-budget-planner': {
    id: 'wedding-budget-planner',
    title: 'Wedding Budget Planner | Free Wedding Cost Tracker',
    metaDescription: 'Track wedding items, vendors, and total costs. Free wedding budget planner to manage your special day expenses.',
    toolDescription: 'Plan your dream wedding without breaking the bank. Track vendors, costs, and payments to stay within budget for your special day.',
    relatedTools: ['event-cost-estimator', 'savings-goal-tracker']
  },
  'event-cost-estimator': {
    id: 'event-cost-estimator',
    title: 'Event Cost Estimator | Multi-line Event Budget Calculator',
    metaDescription: 'Multi-line cost breakdown for events of any size. Free event planning calculator for parties, conferences, and gatherings.',
    toolDescription: 'Plan successful events within budget. Break down costs by category and calculate per-attendee expenses for any type of gathering.',
    relatedTools: ['wedding-budget-planner', 'bill-splitter-pro']
  },
  'packing-checklist-generator': {
    id: 'packing-checklist-generator',
    title: 'Packing Checklist Generator | Travel Packing List Free',
    metaDescription: 'Destination and purpose-based packing checklist builder. Free travel packing list generator for any trip type.',
    toolDescription: 'Never forget essentials again. Generate customized packing lists based on your destination, trip duration, and travel purpose.',
    relatedTools: ['time-blocking-scheduler', 'cost-of-living-calculator']
  },
  'hourly-rate-calculator': {
    id: 'hourly-rate-calculator',
    title: 'Hourly Rate Calculator | Freelance Rate Calculator Free',
    metaDescription: 'Calculate required hourly rate from income goals and taxes. Free freelance rate calculator for contractors and consultants.',
    toolDescription: 'Price your services confidently. Calculate the hourly rate you need to meet your income goals while covering taxes and expenses.',
    relatedTools: ['self-employed-tax-estimator', 'freelance-proposal-estimator']
  },
  'time-blocking-scheduler': {
    id: 'time-blocking-scheduler',
    title: 'Time Blocking Scheduler | Visual Schedule Builder Free',
    metaDescription: 'Visual schedule builder with downloadable time blocks. Free time blocking tool to organize your day and boost productivity.',
    toolDescription: 'Master your schedule with visual time blocking. Create organized daily schedules and download your time blocks for maximum productivity.',
    relatedTools: ['meeting-cost-estimator', 'packing-checklist-generator']
  },
  'meeting-cost-estimator': {
    id: 'meeting-cost-estimator',
    title: 'Meeting Cost Estimator | Calculate Meeting Expenses Free',
    metaDescription: 'Calculate the real cost of meetings based on attendee rates. Free meeting cost calculator to optimize business efficiency.',
    toolDescription: 'Make meetings more efficient by understanding their true cost. Calculate expenses based on attendee rates and meeting duration.',
    relatedTools: ['time-blocking-scheduler', 'hourly-rate-calculator']
  },
  'resume-scanner': {
    id: 'resume-scanner',
    title: 'Resume Scanner | ATS Resume Checker Free',
    metaDescription: 'Compare resume against job descriptions with match percentage. Free ATS resume scanner to optimize your job applications.',
    toolDescription: 'Optimize your resume for any job. Compare your resume against job descriptions and get match percentages with improvement suggestions.',
    relatedTools: ['freelance-proposal-estimator', 'hourly-rate-calculator']
  },
  'resume-builder-pro': {
    id: 'resume-builder-pro',
    title: 'Resume Builder Pro | AI Resume Generator | Claude-Powered',
    metaDescription: 'AI-crafted, ATS-optimized resume & cover letter powered by Claude AI. Create professional resumes and cover letters in minutes on SexyResume.',
    toolDescription: 'Create professional, ATS-optimized resumes and matching cover letters powered by Claude AI. Access the full suite on SexyResume.com.',
    relatedTools: ['resume-scanner', 'freelance-proposal-estimator', 'hourly-rate-calculator']
  },
  'freelance-proposal-estimator': {
    id: 'freelance-proposal-estimator',
    title: 'Freelance Proposal Estimator | Project Scope Calculator',
    metaDescription: 'Rate and scope calculator with milestone tracking. Free freelance proposal tool to price projects and create professional estimates.',
    toolDescription: 'Create winning proposals with accurate pricing. Break down projects into milestones and generate professional estimates for clients.',
    relatedTools: ['hourly-rate-calculator', 'self-employed-tax-estimator']
  },
  'sleep-debt-calculator': {
    id: 'sleep-debt-calculator',
    title: 'Sleep Debt Calculator | Sleep Tracker Free',
    metaDescription: 'Track sleep patterns and calculate recovery time needed. Free sleep debt calculator to improve your sleep health.',
    toolDescription: 'Improve your sleep health with data-driven insights. Track sleep patterns, calculate debt, and get personalized recovery recommendations.',
    relatedTools: ['health-hub', 'fasting-planner']
  },
  'health-hub': {
    id: 'health-hub',
    title: 'Health Hub | Fasting + Nutrition Tracker Free',
    metaDescription: 'Complete health tracking with intermittent fasting timer and nutrition logging. Free tool for 16:8, OMAD fasting plus macro tracking.',
    toolDescription: 'Your complete health companion. Track intermittent fasting with live timers and log nutrition with comprehensive food database.',
    relatedTools: ['sleep-debt-calculator', 'budget-card-conveyor']
  },
  'fasting-planner': {
    id: 'fasting-planner',
    title: 'Health Hub | Fasting + Nutrition Tracker Free',
    metaDescription: 'Complete health tracking with intermittent fasting timer and nutrition logging. Free tool for 16:8, OMAD fasting plus macro tracking.',
    toolDescription: 'Your complete health companion. Track intermittent fasting with live timers and log nutrition with comprehensive food database.',
    relatedTools: ['sleep-debt-calculator', 'health-hub']
  },
  'trade-profit-risk-calculator': {
    id: 'trade-profit-risk-calculator',
    title: 'Multi-Asset Trading Calculator | P&L, Pip, Margin & Risk Tool',
    metaDescription: 'Calculate trading profits, risk, and margin for Forex, Futures, Stocks, Options, and more. Free multi-asset trading calculator with P&L analysis.',
    toolDescription: 'Professional trading calculator for all asset classes. Calculate profit/loss, risk-reward ratios, margin requirements, and pip values across Forex, Stocks, Futures, Options, Metals, and Commodities.',
    relatedTools: ['hourly-rate-calculator', 'self-employed-tax-estimator']
  },
  'subscription-swap-finder': {
    id: 'subscription-swap-finder',
    title: 'Subscription Swap Finder | Find Free Alternatives to Paid Tools',
    metaDescription: 'Find free or cheaper alternatives to paid subscriptions and software. Save money with our comprehensive database of alternative tools and services.',
    toolDescription: 'Tired of paying for overpriced software? Find free or cheaper alternatives to your paid subscriptions with detailed comparisons and potential savings calculations.',
    relatedTools: ['subscription-purge-tool', 'budget-card-conveyor']
  }
};

export const getToolMetadata = (toolId: string): ToolMetadata | null => {
  return toolMetadata[toolId] || null;
};

export const getRelatedToolsData = (toolId: string, allTools: any[]) => {
  const metadata = getToolMetadata(toolId);
  if (!metadata) return [];

  return metadata.relatedTools
    .map(relatedId => allTools.find(tool => tool.id === relatedId))
    .filter(Boolean);
};
