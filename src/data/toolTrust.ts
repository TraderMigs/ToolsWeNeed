import type { Tool } from './tools';

const autoSavedTools = new Set([
  'budget-card-conveyor', 'cost-of-living-calculator', 'debt-snowball-tracker',
  'freelance-proposal-estimator', 'health-hub', 'self-employed-tax-estimator',
  'trade-profit-risk-calculator',
]);

const externalLinkTools = new Set(['resume-builder-pro', 'subscription-swap-finder']);

export interface ToolMethodology {
  method: string;
  source?: { label: string; url: string };
}

const methodology: Partial<Record<string, ToolMethodology>> = {
  'self-employed-tax-estimator': {
    method: 'Estimates net self-employment income, self-employment tax, deductions, and income tax from the assumptions shown. Tax rules and annual limits can change; verify the selected tax year before filing.',
    source: { label: 'IRS Self-Employed Individuals Tax Center', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center' },
  },
  'debt-snowball-tracker': {
    method: 'Orders balances from smallest to largest, applies minimum payments, then rolls each freed payment into the next debt. Interest accrues from the APR entered.',
    source: { label: 'CFPB Reducing Debt Worksheet', url: 'https://www.consumerfinance.gov/documents/5782/cfpb_ymyg-toolkit_reducing-debt-worksheet.pdf' },
  },
  'savings-goal-tracker': {
    method: 'Required monthly savings equals the remaining target divided by whole calendar months to the target date. Projection assumes the entered contribution stays constant and does not assume investment returns.',
    source: { label: 'Investor.gov Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
  },
  'loan-comparison-tool': {
    method: 'Uses standard installment-loan amortization from principal, term, rate, and fees. APR and interest rate are different measures; compare lender disclosures before committing.',
    source: { label: 'CFPB guide to interest rate and APR', url: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/' },
  },
  'sleep-debt-calculator': {
    method: 'Adds positive nightly gaps between your chosen sleep target and logged duration. Recovery nights are a planning illustration, not a clinical prescription.',
    source: { label: 'CDC Sleep in Adults', url: 'https://www.cdc.gov/sleep/data-research/facts-stats/adults-sleep-facts-and-stats.html' },
  },
  'trade-profit-risk-calculator': {
    method: 'Calculates position size and scenario P&L from the prices, contract values, fees, leverage, and risk inputs shown. It does not model slippage, liquidity, taxes, or broker liquidation rules.',
    source: { label: 'Investor.gov investing calculators', url: 'https://www.investor.gov/financial-tools-calculators/calculators' },
  },
};

export function getToolTrust(tool: Tool) {
  return {
    processing: 'Calculations and working inputs stay in this browser and are not sent to our server.',
    storage: autoSavedTools.has(tool.id)
      ? 'This tool auto-saves a draft in this browser for up to 7 days; its clear-data control removes that draft.'
      : 'This tool does not intentionally persist its working inputs after the page is closed.',
    externalLinks: externalLinkTools.has(tool.id)
      ? 'This tool contains clearly labeled links to independent websites; no working input is sent when you calculate here.'
      : 'This tool makes no external data request while calculating.',
    export: 'Available exports are generated locally and downloaded directly to your device.',
    methodology: methodology[tool.id],
  };
}
