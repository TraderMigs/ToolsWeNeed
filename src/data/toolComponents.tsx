import { lazy, type ComponentType } from 'react';

const lazyNamed = (loader: () => Promise<Record<string, unknown>>, name: string) => lazy(async () => {
  const module = await loader();
  return { default: module[name] as ComponentType<any> };
});

export const toolComponents: Record<string, ComponentType<any>> = {
  'budget-card-conveyor': lazyNamed(() => import('../components/tools/BudgetCardConveyor'), 'BudgetCardConveyor'),
  'self-employed-tax-estimator': lazyNamed(() => import('../components/tools/SelfEmployedTaxEstimator'), 'SelfEmployedTaxEstimator'),
  'debt-snowball-tracker': lazyNamed(() => import('../components/tools/DebtSnowballTracker'), 'DebtSnowballTracker'),
  'net-worth-snapshot': lazyNamed(() => import('../components/tools/NetWorthSnapshot'), 'NetWorthSnapshot'),
  'savings-goal-tracker': lazyNamed(() => import('../components/tools/SavingsGoalTracker'), 'SavingsGoalTracker'),
  'hourly-rate-calculator': lazyNamed(() => import('../components/tools/HourlyRateCalculator'), 'HourlyRateCalculator'),
  'freelance-proposal-estimator': lazyNamed(() => import('../components/tools/FreelanceProposalEstimator'), 'FreelanceProposalEstimator'),
  'loan-comparison-tool': lazyNamed(() => import('../components/tools/LoanComparisonTool'), 'LoanComparisonTool'),
  'subscription-purge-tool': lazyNamed(() => import('../components/tools/SubscriptionPurgeTool'), 'SubscriptionPurgeTool'),
  'cost-of-living-calculator': lazyNamed(() => import('../components/tools/CostOfLivingCalculator'), 'CostOfLivingCalculator'),
  'meeting-cost-estimator': lazyNamed(() => import('../components/tools/MeetingCostEstimator'), 'MeetingCostEstimator'),
  'resume-scanner': lazyNamed(() => import('../components/tools/ResumeScanner'), 'ResumeScanner'),
  'resume-builder-pro': lazyNamed(() => import('../components/tools/ResumeBuilderPro'), 'ResumeBuilderPro'),
  'health-hub': lazyNamed(() => import('../components/tools/HealthHub'), 'HealthHub'),
  'sleep-debt-calculator': lazyNamed(() => import('../components/tools/SleepDebtCalculator'), 'SleepDebtCalculator'),
  'event-cost-estimator': lazyNamed(() => import('../components/tools/EventCostEstimator'), 'EventCostEstimator'),
  'bill-splitter-pro': lazyNamed(() => import('../components/tools/BillSplitterPro'), 'BillSplitterPro'),
  'packing-checklist-generator': lazyNamed(() => import('../components/tools/PackingChecklistGenerator'), 'PackingChecklistGenerator'),
  'time-blocking-scheduler': lazyNamed(() => import('../components/tools/TimeBlockingScheduler'), 'TimeBlockingScheduler'),
  'wedding-budget-planner': lazyNamed(() => import('../components/tools/WeddingBudgetPlanner'), 'WeddingBudgetPlanner'),
  'trade-profit-risk-calculator': lazyNamed(() => import('../components/tools/TradeProfitRiskCalculator'), 'TradeProfitRiskCalculator'),
  'subscription-swap-finder': lazyNamed(() => import('../components/tools/SubscriptionSwapFinder'), 'SubscriptionSwapFinder'),
  'pomodoro-timer': lazyNamed(() => import('../components/tools/PomodoroTimer'), 'PomodoroTimer'),
  'countdown-timer': lazyNamed(() => import('../components/tools/CountdownTimer'), 'CountdownTimer'),
  'unit-converter': lazyNamed(() => import('../components/tools/UnitConverter'), 'UnitConverter'),
  'password-generator': lazyNamed(() => import('../components/tools/PasswordGenerator'), 'PasswordGenerator'),
  'color-picker': lazyNamed(() => import('../components/tools/ColorPicker'), 'ColorPicker'),
  'word-counter': lazyNamed(() => import('../components/tools/WordCharacterCounter'), 'WordCharacterCounter'),
  'text-case-converter': lazyNamed(() => import('../components/tools/TextCaseConverter'), 'TextCaseConverter'),
  'qr-code-generator': lazyNamed(() => import('../components/tools/QRCodeGenerator'), 'QRCodeGenerator'),
  'base64-tool': lazyNamed(() => import('../components/tools/Base64Tool'), 'Base64Tool'),
  'json-formatter': lazyNamed(() => import('../components/tools/JSONFormatter'), 'JSONFormatter'),
  'pdf-merger': lazyNamed(() => import('../components/tools/PDFMerger'), 'PDFMerger'),
  'image-optimizer': lazyNamed(() => import('../components/tools/ImageOptimizer'), 'ImageOptimizer'),
  'csv-workbench': lazyNamed(() => import('../components/tools/CSVWorkbench'), 'CSVWorkbench'),
  'file-hash-generator': lazyNamed(() => import('../components/tools/FileHashGenerator'), 'FileHashGenerator'),
  default: () => <div className="py-8 text-center text-gray-400">Tool unavailable.</div>,
};
