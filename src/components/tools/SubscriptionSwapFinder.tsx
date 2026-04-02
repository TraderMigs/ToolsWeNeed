import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, DollarSign, Star, Zap, Shield, Users } from 'lucide-react';
import { trackExport } from '../../utils/exportAnalytics';

interface Alternative {
  name: string;
  type: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  price: string;
  matchPercentage: number;
  features: string[];
  pros: string[];
  cons: string[];
  url: string;
  isAffiliate: boolean;
  description: string;
}

interface ServiceData {
  [key: string]: {
    category: string;
    alternatives: Alternative[];
  };
}

const serviceDatabase: ServiceData = {
  'adobe photoshop': {
    category: 'Design & Graphics',
    alternatives: [
      {
        name: 'GIMP',
        type: 'Free',
        price: 'Free',
        matchPercentage: 85,
        features: ['Advanced photo editing', 'Layer support', 'Filters & effects', 'Plugin ecosystem'],
        pros: ['Completely free', 'Powerful features', 'Cross-platform', 'Active community'],
        cons: ['Steeper learning curve', 'Different UI paradigm'],
        url: 'https://www.gimp.org',
        isAffiliate: false,
        description: 'Professional-grade image editor with advanced features'
      },
      {
        name: 'Canva Pro',
        type: 'Paid',
        price: '$12.99/month',
        matchPercentage: 75,
        features: ['Templates', 'Brand kit', 'Background remover', 'Magic resize'],
        pros: ['User-friendly', 'Great templates', 'Collaboration features'],
        cons: ['Less advanced editing', 'Subscription required'],
        url: 'https://www.canva.com/pro',
        isAffiliate: true,
        description: 'Easy-to-use design platform with professional templates'
      },
      {
        name: 'Photopea',
        type: 'Free',
        price: 'Free (with ads)',
        matchPercentage: 90,
        features: ['PSD support', 'Layer editing', 'Web-based', 'Photoshop-like interface'],
        pros: ['No download required', 'Familiar interface', 'PSD compatibility'],
        cons: ['Requires internet', 'Ad-supported'],
        url: 'https://www.photopea.com',
        isAffiliate: false,
        description: 'Browser-based photo editor with Photoshop compatibility'
      }
    ]
  },
  'grammarly': {
    category: 'Writing & Productivity',
    alternatives: [
      {
        name: 'LanguageTool',
        type: 'Freemium',
        price: '$4.92/month',
        matchPercentage: 88,
        features: ['Grammar checking', 'Style suggestions', '25+ languages', 'Browser extension'],
        pros: ['Multilingual support', 'Privacy-focused', 'Cheaper pricing'],
        cons: ['Fewer integrations', 'Less AI-powered'],
        url: 'https://languagetool.org',
        isAffiliate: true,
        description: 'Privacy-focused grammar checker with multilingual support'
      },
      {
        name: 'Hemingway Editor',
        type: 'Paid',
        price: '$19.99 (one-time)',
        matchPercentage: 70,
        features: ['Readability analysis', 'Writing suggestions', 'Offline desktop app'],
        pros: ['One-time payment', 'Focus on clarity', 'Offline capability'],
        cons: ['Limited grammar checking', 'No real-time suggestions'],
        url: 'https://hemingwayapp.com',
        isAffiliate: true,
        description: 'Writing app focused on clarity and readability'
      },
      {
        name: 'ProWritingAid',
        type: 'Freemium',
        price: '$6.58/month',
        matchPercentage: 85,
        features: ['Grammar & style', 'Plagiarism checker', 'Writing reports', 'Integrations'],
        pros: ['Comprehensive analysis', 'Lifetime option available', 'Detailed reports'],
        cons: ['Can be overwhelming', 'Slower processing'],
        url: 'https://prowritingaid.com',
        isAffiliate: true,
        description: 'Comprehensive writing assistant with detailed analysis'
      }
    ]
  },
  'spotify premium': {
    category: 'Music & Entertainment',
    alternatives: [
      {
        name: 'YouTube Music',
        type: 'Freemium',
        price: '$9.99/month',
        matchPercentage: 90,
        features: ['Ad-free music', 'Offline downloads', 'YouTube integration', 'Podcasts'],
        pros: ['Huge music library', 'YouTube content', 'Same price point'],
        cons: ['Battery drain', 'Interface complexity'],
        url: 'https://music.youtube.com',
        isAffiliate: false,
        description: 'Music streaming with YouTube integration'
      },
      {
        name: 'Apple Music',
        type: 'Paid',
        price: '$9.99/month',
        matchPercentage: 88,
        features: ['High-quality audio', 'Exclusive content', 'Spatial audio', 'Radio shows'],
        pros: ['High audio quality', 'Apple ecosystem integration', 'Exclusive releases'],
        cons: ['Limited on non-Apple devices', 'Same pricing'],
        url: 'https://music.apple.com',
        isAffiliate: false,
        description: 'Premium music streaming with high-quality audio'
      },
      {
        name: 'Tidal',
        type: 'Paid',
        price: '$9.99/month',
        matchPercentage: 82,
        features: ['Hi-Fi audio', 'Exclusive content', 'Music videos', 'Artist-owned'],
        pros: ['Superior audio quality', 'Artist-friendly', 'Exclusive content'],
        cons: ['Smaller library', 'Limited free tier'],
        url: 'https://tidal.com',
        isAffiliate: true,
        description: 'High-fidelity music streaming platform'
      }
    ]
  },
  'microsoft office': {
    category: 'Office & Productivity',
    alternatives: [
      {
        name: 'Google Workspace',
        type: 'Freemium',
        price: 'Free / $6/month',
        matchPercentage: 85,
        features: ['Docs, Sheets, Slides', 'Real-time collaboration', 'Cloud storage', 'Mobile apps'],
        pros: ['Free tier available', 'Excellent collaboration', 'Cloud-native'],
        cons: ['Requires internet', 'Different interface'],
        url: 'https://workspace.google.com',
        isAffiliate: false,
        description: 'Cloud-based office suite with real-time collaboration'
      },
      {
        name: 'LibreOffice',
        type: 'Free',
        price: 'Free',
        matchPercentage: 80,
        features: ['Writer, Calc, Impress', 'Offline capability', 'Open source', 'Format compatibility'],
        pros: ['Completely free', 'No subscription', 'Open source', 'Offline work'],
        cons: ['Less polished UI', 'Fewer cloud features'],
        url: 'https://www.libreoffice.org',
        isAffiliate: false,
        description: 'Free and open-source office suite'
      },
      {
        name: 'Notion',
        type: 'Freemium',
        price: 'Free / $8/month',
        matchPercentage: 70,
        features: ['All-in-one workspace', 'Databases', 'Templates', 'Collaboration'],
        pros: ['Versatile platform', 'Great for teams', 'Template library'],
        cons: ['Learning curve', 'Can be slow', 'Different paradigm'],
        url: 'https://www.notion.so',
        isAffiliate: true,
        description: 'All-in-one workspace for notes, docs, and collaboration'
      }
    ]
  },
  'slack': {
    category: 'Communication & Collaboration',
    alternatives: [
      {
        name: 'Discord',
        type: 'Freemium',
        price: 'Free / $9.99/month',
        matchPercentage: 75,
        features: ['Voice & video calls', 'Screen sharing', 'File sharing', 'Bots & integrations'],
        pros: ['Free tier generous', 'Great voice quality', 'Gaming-friendly'],
        cons: ['Less business-focused', 'Different culture'],
        url: 'https://discord.com',
        isAffiliate: false,
        description: 'Communication platform with excellent voice features'
      },
      {
        name: 'Microsoft Teams',
        type: 'Freemium',
        price: 'Free / $4/month',
        matchPercentage: 90,
        features: ['Chat & channels', 'Video meetings', 'File collaboration', 'Office integration'],
        pros: ['Office integration', 'Enterprise features', 'Lower cost'],
        cons: ['Can be resource-heavy', 'Complex interface'],
        url: 'https://teams.microsoft.com',
        isAffiliate: false,
        description: 'Business communication platform with Office integration'
      },
      {
        name: 'Rocket.Chat',
        type: 'Open Source',
        price: 'Free / $3/month',
        matchPercentage: 85,
        features: ['Self-hosted option', 'End-to-end encryption', 'Customizable', 'API access'],
        pros: ['Open source', 'Self-hosting option', 'Privacy-focused'],
        cons: ['Requires technical setup', 'Smaller ecosystem'],
        url: 'https://rocket.chat',
        isAffiliate: false,
        description: 'Open-source team communication platform'
      }
    ]
  }
};

const SubscriptionSwapFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [useCase, setUseCase] = useState('');
  const [currentCost, setCurrentCost] = useState('');
  const [results, setResults] = useState<Alternative[]>([]);
  const [searchedService, setSearchedService] = useState('');
  const [filters, setFilters] = useState({
    freeOnly: false,
    openSource: false,
    paidButCheaper: false,
    minMatch: 60
  });

  // Popular services for autocomplete
  const popularServices = [
    'Adobe Photoshop', 'Grammarly', 'Spotify Premium', 'Microsoft Office', 'Slack',
    'Netflix', 'Canva Pro', 'Zoom Pro', 'Dropbox', 'Evernote Premium',
    'Adobe Illustrator', 'Final Cut Pro', 'Sketch', 'Figma Pro', 'Notion Pro'
  ];

  useEffect(() => {
    trackExport('Subscription Swap Finder', 'view');
  }, []);

  const handleSearch = () => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const serviceData = serviceDatabase[normalizedSearch];
    
    if (serviceData) {
      let filteredResults = serviceData.alternatives;
      
      // Apply filters
      if (filters.freeOnly) {
        filteredResults = filteredResults.filter(alt => alt.type === 'Free');
      }
      
      if (filters.openSource) {
        filteredResults = filteredResults.filter(alt => alt.type === 'Open Source');
      }
      
      if (filters.paidButCheaper && currentCost) {
        const currentPrice = parseFloat(currentCost);
        filteredResults = filteredResults.filter(alt => {
          const altPrice = parseFloat(alt.price.replace(/[^0-9.]/g, ''));
          return altPrice < currentPrice && alt.type !== 'Free';
        });
      }
      
      // Filter by match percentage
      filteredResults = filteredResults.filter(alt => alt.matchPercentage >= filters.minMatch);
      
      setResults(filteredResults);
      setSearchedService(searchTerm);
    } else {
      // Fallback for services not in database
      setResults([]);
      setSearchedService(searchTerm);
    }
  };

  const calculateSavings = (alternative: Alternative) => {
    if (!currentCost || alternative.type === 'Free') return null;
    
    const current = parseFloat(currentCost);
    const altPrice = parseFloat(alternative.price.replace(/[^0-9.]/g, ''));
    
    if (isNaN(current) || isNaN(altPrice)) return null;
    
    const monthlySavings = current - altPrice;
    const annualSavings = monthlySavings * 12;
    
    return annualSavings > 0 ? annualSavings : null;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Free': return <Zap className="w-4 h-4" />;
      case 'Open Source': return <Shield className="w-4 h-4" />;
      case 'Freemium': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Free': return 'bg-green-100 text-green-800';
      case 'Open Source': return 'bg-blue-100 text-blue-800';
      case 'Freemium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Smart Switch Finder</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find free or cheaper alternatives to your current subscriptions and paid software. 
          Save money without sacrificing functionality.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Service or Software
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., Adobe Photoshop, Grammarly..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                list="services"
              />
              <datalist id="services">
                {popularServices.map((service) => (
                  <option key={service} value={service} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Monthly Cost (Optional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={currentCost}
                onChange={(e) => setCurrentCost(e.target.value)}
                placeholder="29.99"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Specific Use Case (Optional)
            </label>
            <input
              type="text"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="e.g., photo editing, team chat..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-6 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.freeOnly}
                onChange={(e) => setFilters({...filters, freeOnly: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Free only</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.openSource}
                onChange={(e) => setFilters({...filters, openSource: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Open source</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.paidButCheaper}
                onChange={(e) => setFilters({...filters, paidButCheaper: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Paid but cheaper</span>
            </label>

            <div className="space-y-1">
              <label className="block text-xs text-gray-600">
                Min. feature match: {filters.minMatch}%
              </label>
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={filters.minMatch}
                onChange={(e) => setFilters({...filters, minMatch: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Find Alternatives
        </button>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Alternatives to {searchedService}
            </h2>
            <p className="text-gray-600 mt-2">
              Found {results.length} alternative{results.length !== 1 ? 's' : ''} that match your criteria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((alternative, index) => {
              const savings = calculateSavings(alternative);
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 space-y-4 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{alternative.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{alternative.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getTypeColor(alternative.type)}`}>
                      {getTypeIcon(alternative.type)}
                      <span>{alternative.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{alternative.price}</span>
                      {alternative.price !== 'Free' && <span className="text-gray-500 text-sm">/month</span>}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Feature match</div>
                      <div className="text-lg font-bold text-blue-600">{alternative.matchPercentage}%</div>
                    </div>
                  </div>

                  {savings && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-green-800 font-medium">
                        Save ${savings.toFixed(0)}/year
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {alternative.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <h5 className="font-medium text-green-700 mb-1">Pros</h5>
                        <ul className="space-y-1">
                          {alternative.pros.slice(0, 2).map((pro, idx) => (
                            <li key={idx} className="text-green-600 text-xs">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-1">Cons</h5>
                        <ul className="space-y-1">
                          {alternative.cons.slice(0, 2).map((con, idx) => (
                            <li key={idx} className="text-red-600 text-xs">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <a
                    href={alternative.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {searchedService && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No alternatives found for "{searchedService}" with your current filters.
          </div>
          <p className="text-gray-400 mt-2">
            Try adjusting your filters or search for a different service.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSwapFinder;

export { SubscriptionSwapFinder }