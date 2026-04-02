import React, { useState } from 'react';
import { ToolCard } from './components/ToolCard';
import { ToolPage } from './components/ToolPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { AdvancedSearch } from './components/AdvancedSearch';
import { OfflineSupport } from './components/OfflineSupport';
import { AccessibilityEnhancements } from './components/AccessibilityEnhancements';
import { usePerformanceOptimization } from './hooks/usePerformanceOptimization';
import { seoOptimizer } from './utils/seoOptimization';
import {
  getPopularityBasedTools,
  updateToolUsage,
  tools,
  toolCategories,
  getSortedTools,
  getToolsByCategory
} from './data/tools';
import { RequestToolButton } from './components/RequestToolButton';
import { FeedbackButton } from './components/FeedbackButton';
import { CategoryFilter } from './components/CategoryFilter';
import { SortingDropdown } from './components/SortingDropdown';
import { TrendingToolsSection } from './components/TrendingToolsSection';
import { BudgetCardConveyor } from './components/tools/BudgetCardConveyor';
import { SelfEmployedTaxEstimator } from './components/tools/SelfEmployedTaxEstimator';
import { DebtSnowballTracker } from './components/tools/DebtSnowballTracker';
import { NetWorthSnapshot } from './components/tools/NetWorthSnapshot';
import { SavingsGoalTracker } from './components/tools/SavingsGoalTracker';
import { HourlyRateCalculator } from './components/tools/HourlyRateCalculator';
import { FreelanceProposalEstimator } from './components/tools/FreelanceProposalEstimator';
import { MeetingCostEstimator } from './components/tools/MeetingCostEstimator';
import { HealthHub } from './components/tools/HealthHub';
import { SleepDebtCalculator } from './components/tools/SleepDebtCalculator';
import { EventCostEstimator } from './components/tools/EventCostEstimator';
import { BillSplitterPro } from './components/tools/BillSplitterPro';
import { PackingChecklistGenerator } from './components/tools/PackingChecklistGenerator';
import { TimeBlockingScheduler } from './components/tools/TimeBlockingScheduler';
import { WeddingBudgetPlanner } from './components/tools/WeddingBudgetPlanner';
import { SubscriptionPurgeTool } from './components/tools/SubscriptionPurgeTool';
import { LoanComparisonTool } from './components/tools/LoanComparisonTool';
import { CostOfLivingCalculator } from './components/tools/CostOfLivingCalculator';
import { ResumeScanner } from './components/tools/ResumeScanner';
import { ResumeBuilderPro } from './components/tools/ResumeBuilderPro';
import { TradeProfitRiskCalculator } from './components/tools/TradeProfitRiskCalculator';
import { SubscriptionSwapFinder } from './components/tools/SubscriptionSwapFinder';
import { FastingPlanner } from './components/tools/FastingPlanner';
import { PersonalizedInsights } from './components/PersonalizedInsights';
import { EnhancedToolRecommendations } from './components/EnhancedToolRecommendations';
import { AccessibilityTour } from './components/AccessibilityTour';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { SponsorCard } from './components/SponsorCard';

const toolComponents: Record<string, React.ComponentType<any>> = {
  'budget-card-conveyor': BudgetCardConveyor,
  'self-employed-tax-estimator': SelfEmployedTaxEstimator,
  'debt-snowball-tracker': DebtSnowballTracker,
  'net-worth-snapshot': NetWorthSnapshot,
  'savings-goal-tracker': SavingsGoalTracker,
  'hourly-rate-calculator': HourlyRateCalculator,
  'freelance-proposal-estimator': FreelanceProposalEstimator,
  'meeting-cost-estimator': MeetingCostEstimator,
  'health-hub': HealthHub,
  'fasting-planner': HealthHub,
  'fasting-planner-standalone': FastingPlanner,
  'sleep-debt-calculator': SleepDebtCalculator,
  'event-cost-estimator': EventCostEstimator,
  'bill-splitter-pro': BillSplitterPro,
  'packing-checklist-generator': PackingChecklistGenerator,
  'time-blocking-scheduler': TimeBlockingScheduler,
  'wedding-budget-planner': WeddingBudgetPlanner,
  'subscription-purge-tool': SubscriptionPurgeTool,
  'loan-comparison-tool': LoanComparisonTool,
  'cost-of-living-calculator': CostOfLivingCalculator,
  'resume-scanner': ResumeScanner,
  'resume-builder-pro': ResumeBuilderPro,
  'trade-profit-risk-calculator': TradeProfitRiskCalculator,
  'subscription-swap-finder': SubscriptionSwapFinder,
  'default': () => <div className="text-center py-8 text-gray-400">Tool loading...</div>
};

class ToolErrorBoundary extends React.Component<
  { children: React.ReactNode; toolName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; toolName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'tool_error', {
        'event_category': 'error',
        'event_label': this.props.toolName,
        'error_message': error.message
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4">Tool Temporarily Unavailable</h1>
            <p className="text-gray-400 mb-6">
              The {this.props.toolName} tool encountered an error and could not load properly.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'alphabetical'>('popular');

  const { debounce } = usePerformanceOptimization();

  const allTools = searchResults.length > 0 ? searchResults : getSortedTools(sortBy);
  const filteredByCategory = activeCategory ? getToolsByCategory(activeCategory) : allTools;

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentCanceled = urlParams.get('payment_canceled');
    if (paymentCanceled === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    seoOptimizer.updatePageSEO({
      title: 'Tools We Need | Access Premium Tools Without Premium Pricing',
      description: 'Free online tools for budgeting, taxes, debt tracking, health monitoring, and productivity. Access premium tools without premium pricing.',
      keywords: ['free tools', 'budget calculator', 'tax estimator', 'debt tracker', 'productivity tools'],
      canonicalUrl: window.location.href
    });

    seoOptimizer.trackPageView();

    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'Home',
        page_path: '/',
        page_location: window.location.href
      });
    }
  }, []);

  const debouncedSearch = React.useMemo(
    () => debounce((term: string) => {
      if (!term && !showAdvancedSearch) {
        setSearchResults([]);
      }
    }, 300),
    [debounce, showAdvancedSearch]
  );

  React.useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const filteredTools = filteredByCategory.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTool = (tool: any) => {
    setSelectedTool(tool);
    updateToolUsage(tool.id);

    setUserHistory(prev => {
      const newHistory = [tool.id, ...prev.filter(id => id !== tool.id)].slice(0, 10);
      localStorage.setItem('user-tool-history', JSON.stringify(newHistory));
      return newHistory;
    });

    seoOptimizer.updatePageSEO({
      title: `${tool.title} | Free Online Tool | Tools We Need`,
      description: `${tool.description} Use our free ${tool.title.toLowerCase()} tool online. No registration required.`,
      keywords: [tool.title.toLowerCase(), 'free tool', 'online calculator', ...tool.tags.split(',')],
      canonicalUrl: `${window.location.origin}/${tool.id}`
    });

    seoOptimizer.trackPageView(tool.id);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'select_tool', {
        'event_category': 'engagement',
        'event_label': tool.title,
        'tool_id': tool.id
      });
    }

    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedTool(null);
    seoOptimizer.updatePageSEO({
      title: 'Tools We Need | Access Premium Tools Without Premium Pricing',
      description: 'Free online tools for budgeting, taxes, debt tracking, health monitoring, and productivity.',
      keywords: ['free tools', 'budget calculator', 'tax estimator', 'debt tracker', 'productivity tools'],
      canonicalUrl: window.location.origin
    });
    if (typeof gtag !== 'undefined') {
      gtag('event', 'return_to_home', { 'event_category': 'navigation', 'event_label': 'Back button' });
    }
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    const savedHistory = localStorage.getItem('user-tool-history');
    if (savedHistory) setUserHistory(JSON.parse(savedHistory));
  }, []);

  if (showPaymentSuccess && paymentSessionId) {
    return (
      <PaymentSuccessPage
        sessionId={paymentSessionId}
        onBack={() => { setShowPaymentSuccess(false); setPaymentSessionId(''); }}
      />
    );
  }

  if (selectedTool) {
    const ToolComponent = toolComponents[selectedTool.id] || toolComponents['default'];

    return (
      <ToolErrorBoundary toolName={selectedTool.title}>
        <React.Suspense fallback={
          <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading {selectedTool.title}...</p>
            </div>
          </div>
        }>
          <ToolPage tool={selectedTool} onBack={handleBack}>
            <ToolComponent toolId={selectedTool.id} />
            <SponsorCard toolId={selectedTool.id} />
            <EnhancedToolRecommendations
              currentTool={selectedTool}
              userHistory={userHistory}
              onSelectTool={handleSelectTool}
            />
          </ToolPage>
        </React.Suspense>
      </ToolErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <OfflineSupport />
      <AccessibilityEnhancements />
      <AccessibilityTour />
      <PWAInstallPrompt />

      {/* Header */}
      <header className="py-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">22 Free Tools & Counting</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Tools We Need
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
          Access premium tools without premium pricing.
        </p>
        <div className="mt-5 flex justify-center">
          <RequestToolButton variant="primary" />
        </div>
      </header>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Advanced Search
          </button>
          <SortingDropdown onSort={setSortBy} currentSort={sortBy} />
        </div>
        <CategoryFilter activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      </div>

      {/* Tools Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16" id="main-content">
        {!searchTerm && !activeCategory && (
          <PersonalizedInsights onSelectTool={(toolId) => {
            const tool = tools.find(t => t.id === toolId);
            if (tool) handleSelectTool(tool);
          }} />
        )}

        {!searchTerm && !activeCategory && (
          <TrendingToolsSection onSelectTool={handleSelectTool} />
        )}

        {searchResults.length > 0 && (
          <div className="mb-6 text-gray-400">Found {searchResults.length} tools matching your search</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => handleSelectTool(tool)} />
          ))}
        </div>

        {!selectedTool && !searchTerm && !activeCategory && (
          <EnhancedToolRecommendations
            userHistory={userHistory}
            onSelectTool={handleSelectTool}
          />
        )}
      </div>

      {showAdvancedSearch && (
        <AdvancedSearch
          onResults={setSearchResults}
          onClose={() => setShowAdvancedSearch(false)}
        />
      )}

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-400 border-t border-gray-800">
        <div className="max-w-4xl mx-auto mt-8 mb-8 text-left" role="region" id="seo-content">
          <h2 className="text-xl font-bold text-white mb-4">Free Online Tools for Finance, Health, and Productivity</h2>
          <div className="text-gray-400 text-sm space-y-4">
            <p>
              Tools We Need offers a comprehensive collection of free online tools designed to help you manage your finances,
              improve your health, and boost your productivity — all without requiring signup or installation.
              Access premium tools without premium pricing.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Available Free Online Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { const t = tools.find(x => x.id === tool.id); if (t) handleSelectTool(t); }}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-left"
                >
                  {tool.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Tool Categories</h3>
            <div className="space-y-4">
              {Object.entries(toolCategories).map(([key, category]) => {
                const categoryTools = tools.filter(tool => tool.category === key);
                if (categoryTools.length === 0) return null;
                return (
                  <div key={key} className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {categoryTools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => { const t = tools.find(x => x.id === tool.id); if (t) handleSelectTool(t); }}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {tool.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tools We Need",
            "url": "https://www.toolsweneed.com",
            "description": "Free online tools for finance, health, and productivity. Access premium tools without premium pricing.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.toolsweneed.com/?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        <div className="flex justify-center mb-4 gap-2">
          <RequestToolButton variant="secondary" />
          <FeedbackButton toolId="homepage" toolName="Homepage" variant="secondary" />
        </div>
        <p>
          &copy; 2025 ToolsWeNeed.com &nbsp;&bull;&nbsp;
          <a href="/privacy.html" className="hover:text-blue-400 transition-colors">Privacy</a> &nbsp;&bull;&nbsp;
          <a href="/terms.html" className="hover:text-blue-400 transition-colors">Terms</a> &nbsp;&bull;&nbsp;
          <a href="mailto:hello@toolsweneed.com" className="hover:text-blue-400 transition-colors">Advertise</a>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Interested in sponsoring a tool?{' '}
          <a href="mailto:hello@toolsweneed.com?subject=Sponsor%20Inquiry" className="text-blue-500 hover:text-blue-400">
            Contact us
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
