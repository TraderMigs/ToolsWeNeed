import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { env } from '../utils/env';
import { 
  BarChart3, Users, Settings, DollarSign, Download, Eye, EyeOff, 
  Edit3, Save, Trash2, Plus, ExternalLink, Shield, TrendingUp,
  Calendar, Clock, FileText, Link, ToggleLeft, ToggleRight,
  Search, Filter, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react';
import { tools } from '../data/tools';
import { getUsageStats, exportUserData, clearUserData } from '../utils/exportAnalytics';
import { getToolClusters, getCoUsageData, toolContextMap } from '../data/toolRelationships';
import { stripeProducts } from '../stripe-config';

interface AdminStats {
  totalUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  totalExports: number;
  totalRevenue: number;
  topTools: Array<{
    id: string;
    name: string;
    views: number;
    exports: number;
  }>;
}

interface ExportLog {
  id: string;
  sessionId: string;
  tool: string;
  format: string;
  type: 'preview' | 'paid';
  timestamp: string;
  amount?: number;
}

interface AffiliateLink {
  id: string;
  toolName: string;
  replacementName: string;
  url: string;
  type: 'Free' | 'Cheaper' | 'Open Source' | 'Premium';
  isActive: boolean;
  clickCount: number;
  conversionRate: number;
}

interface AdminSettings {
  exportWatermarking: boolean;
  feedbackPrompts: boolean;
  aiPrompts: boolean;
  aiFormAssistant: boolean;
  popularToolCarousel: boolean;
  volumeExportLimits: boolean;
  globalMonetization: boolean;
  maintenanceMode: boolean;
  analyticsTracking: boolean;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tools' | 'exports' | 'affiliates' | 'payments' | 'settings'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    totalExports: 0,
    totalRevenue: 0,
    topTools: []
  });
  const [exportLogs, setExportLogs] = useState<ExportLog[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    exportWatermarking: true,
    feedbackPrompts: true,
    aiPrompts: false,
    aiFormAssistant: true,
    popularToolCarousel: true,
    volumeExportLimits: false,
    globalMonetization: true,
    maintenanceMode: false,
    analyticsTracking: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTool, setEditingTool] = useState<string | null>(null);

  // Authentication
  const handleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      // SECURITY FIX: Implement proper server-side authentication
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setAuthError('Invalid credentials');
        return;
      }
      
      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', data.user.id)
        .single();
      
      if (profileError || profile?.role !== 'admin') {
        setAuthError('Unauthorized access');
        await supabase.auth.signOut();
        return;
      }
      
      setIsAuthenticated(true);
      loadAdminData();
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load admin data
  const loadAdminData = () => {
    // Load usage statistics
    const usageStats = getUsageStats();
    
    // Simulate admin stats (in production, load from backend)
    setStats({
      totalUsers: 1247,
      dailyActiveUsers: 89,
      weeklyActiveUsers: 342,
      monthlyActiveUsers: 1247,
      totalExports: 456,
      totalRevenue: 1234.56,
      topTools: [
        { id: 'budget-card-conveyor', name: 'Budget Card Conveyor', views: 234, exports: 45 },
        { id: 'self-employed-tax-estimator', name: 'Tax Estimator', views: 189, exports: 38 },
        { id: 'debt-snowball-tracker', name: 'Debt Snowball', views: 156, exports: 29 },
        { id: 'net-worth-snapshot', name: 'Net Worth Snapshot', views: 134, exports: 25 },
        { id: 'hourly-rate-calculator', name: 'Hourly Rate Calculator', views: 123, exports: 22 }
      ]
    });

    // Load export logs (simulated)
    setExportLogs([
      {
        id: '1',
        sessionId: 'sess_123',
        tool: 'Budget Card Conveyor',
        format: 'pdf',
        type: 'paid',
        timestamp: new Date().toISOString(),
        amount: 1.00
      },
      {
        id: '2',
        sessionId: 'sess_124',
        tool: 'Tax Estimator',
        format: 'csv',
        type: 'preview',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]);

    // Load affiliate links (simulated)
    setAffiliateLinks([
      {
        id: '1',
        toolName: 'Adobe Photoshop',
        replacementName: 'Canva Pro',
        url: 'https://partner.canva.com/toolsweneed',
        type: 'Cheaper',
        isActive: true,
        clickCount: 45,
        conversionRate: 12.5
      },
      {
        id: '2',
        toolName: 'Grammarly',
        replacementName: 'LanguageTool',
        url: 'https://languagetool.org/ref/toolsweneed',
        type: 'Cheaper',
        isActive: true,
        clickCount: 23,
        conversionRate: 8.7
      }
    ]);

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('toolsweneed_admin_settings');
    if (savedSettings) {
      setAdminSettings(JSON.parse(savedSettings));
    }
  };

  // Save settings
  const saveSettings = () => {
    localStorage.setItem('toolsweneed_admin_settings', JSON.stringify(adminSettings));
    alert('Settings saved successfully!');
  };

  // Toggle setting
  const toggleSetting = (key: keyof AdminSettings) => {
    setAdminSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Add affiliate link
  const addAffiliateLink = () => {
    const newLink: AffiliateLink = {
      id: Date.now().toString(),
      toolName: '',
      replacementName: '',
      url: '',
      type: 'Free',
      isActive: true,
      clickCount: 0,
      conversionRate: 0
    };
    setAffiliateLinks([...affiliateLinks, newLink]);
  };

  // Update affiliate link
  const updateAffiliateLink = (id: string, field: keyof AffiliateLink, value: any) => {
    setAffiliateLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  // Delete affiliate link
  const deleteAffiliateLink = (id: string) => {
    setAffiliateLinks(prev => prev.filter(link => link.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-400">Enter admin credentials to continue</p>
          </div>
          {authError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm">{authError}</p>
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              disabled={isLoading}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleLogin()}
              disabled={isLoading}
            />
            <button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg transition-colors"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ToolsWeNeed Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Last updated: {new Date().toLocaleString()}</span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Users & Sessions', icon: Users },
              { id: 'tools', label: 'Tool Management', icon: Settings },
              { id: 'exports', label: 'Export Logs', icon: Download },
              { id: 'affiliates', label: 'Affiliate Links', icon: Link },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Daily Active</p>
                      <p className="text-2xl font-bold">{stats.dailyActiveUsers}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Exports</p>
                      <p className="text-2xl font-bold">{stats.totalExports}</p>
                    </div>
                    <Download className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Top Tools */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Most Popular Tools</h3>
                <div className="space-y-3">
                  {stats.topTools.map((tool, index) => (
                    <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium">{tool.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{tool.views} views</span>
                        <span>{tool.exports} exports</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Users & Sessions</h2>
                <button
                  onClick={() => {
                    const data = exportUserData();
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'user-analytics.json';
                    a.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Export User Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Weekly Active Users</h3>
                  <p className="text-3xl font-bold text-green-400">{stats.weeklyActiveUsers}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Monthly Active Users</h3>
                  <p className="text-3xl font-bold text-blue-400">{stats.monthlyActiveUsers}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-purple-400">12.5%</p>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Session ID</th>
                        <th className="text-left py-2">Tools Used</th>
                        <th className="text-left py-2">Exports</th>
                        <th className="text-left py-2">Duration</th>
                        <th className="text-left py-2">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="py-2">sess_123</td>
                        <td className="py-2">Budget, Tax, Debt</td>
                        <td className="py-2">3</td>
                        <td className="py-2">45m</td>
                        <td className="py-2">2 hours ago</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2">sess_124</td>
                        <td className="py-2">Net Worth, Savings</td>
                        <td className="py-2">1</td>
                        <td className="py-2">23m</td>
                        <td className="py-2">5 hours ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Tool Management</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tool Relationship Clusters */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Tool Relationship Clusters</h3>
                <div className="space-y-4">
                  {getToolClusters().map((cluster, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Cluster {index + 1}</h4>
                      <div className="flex flex-wrap gap-2">
                        {cluster.map(toolId => {
                          const tool = tools.find(t => t.id === toolId);
                          return tool ? (
                            <span key={toolId} className="px-3 py-1 bg-blue-600 rounded-full text-sm">
                              {tool.title}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Co-Usage Analytics */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Tool Co-Usage Patterns</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Tool Pair</th>
                        <th className="text-left py-2">Co-Usage Count</th>
                        <th className="text-left py-2">Relationship Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(getCoUsageData())
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 10)
                        .map(([pair, count]) => {
                          const [toolA, toolB] = pair.split('|');
                          const toolAName = tools.find(t => t.id === toolA)?.title || toolA;
                          const toolBName = tools.find(t => t.id === toolB)?.title || toolB;
                          return (
                            <tr key={pair} className="border-b border-gray-700">
                              <td className="py-2">{toolAName} ↔ {toolBName}</td>
                              <td className="py-2">{count}</td>
                              <td className="py-2">
                                <div className="w-full bg-gray-600 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(100, count * 10)}%` }}
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-3">
                {tools
                  .filter(tool => tool.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((tool) => (
                  <div key={tool.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center`}>
                          <tool.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{tool.title}</h3>
                          <p className="text-sm text-gray-400">{tool.description}</p>
                          {toolContextMap[tool.id] && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {toolContextMap[tool.id].primaryTags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-blue-600 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTool(editingTool === tool.id ? null : tool.id)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {editingTool === tool.id && (
                      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            defaultValue={tool.title}
                            placeholder="Tool Title"
                            className="px-3 py-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            defaultValue={tool.tags}
                            placeholder="Tags"
                            className="px-3 py-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                          />
                          <textarea
                            defaultValue={tool.description}
                            placeholder="Description"
                            className="md:col-span-2 px-3 py-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end mt-4">
                          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exports Tab */}
          {activeTab === 'exports' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Export Logs & Controls</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Total Exports</h3>
                  <p className="text-3xl font-bold text-blue-400">{exportLogs.length}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Paid Exports</h3>
                  <p className="text-3xl font-bold text-green-400">
                    {exportLogs.filter(log => log.type === 'paid').length}
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-purple-400">
                    {((exportLogs.filter(log => log.type === 'paid').length / exportLogs.length) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Recent Export Activity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Session</th>
                        <th className="text-left py-2">Tool</th>
                        <th className="text-left py-2">Format</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exportLogs.map((log) => (
                        <tr key={log.id} className="border-b border-gray-700">
                          <td className="py-2">{log.sessionId}</td>
                          <td className="py-2">{log.tool}</td>
                          <td className="py-2">{log.format.toUpperCase()}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              log.type === 'paid' ? 'bg-green-600' : 'bg-gray-600'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="py-2">{log.amount ? `$${log.amount.toFixed(2)}` : '-'}</td>
                          <td className="py-2">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Affiliates Tab */}
          {activeTab === 'affiliates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Affiliate Links Management</h2>
                <button
                  onClick={addAffiliateLink}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {affiliateLinks.map((link) => (
                  <div key={link.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <input
                        type="text"
                        value={link.toolName}
                        onChange={(e) => updateAffiliateLink(link.id, 'toolName', e.target.value)}
                        placeholder="Original Tool"
                        className="px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={link.replacementName}
                        onChange={(e) => updateAffiliateLink(link.id, 'replacementName', e.target.value)}
                        placeholder="Alternative Name"
                        className="px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateAffiliateLink(link.id, 'url', e.target.value)}
                        placeholder="Affiliate URL"
                        className="px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <select
                        value={link.type}
                        onChange={(e) => updateAffiliateLink(link.id, 'type', e.target.value)}
                        className="px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Free">Free</option>
                        <option value="Cheaper">Cheaper</option>
                        <option value="Open Source">Open Source</option>
                        <option value="Premium">Premium</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateAffiliateLink(link.id, 'isActive', !link.isActive)}
                          className={`p-2 rounded transition-colors ${
                            link.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                          }`}
                        >
                          {link.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteAffiliateLink(link.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                      <span>Clicks: {link.clickCount}</span>
                      <span>Conversion: {link.conversionRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Payments Management</h2>
              
              {/* Stripe Products Configuration */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Stripe Products</h3>
                <div className="space-y-3">
                  {stripeProducts.map((product) => (
                    <div key={product.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{product.name}</h4>
                          <p className="text-sm text-gray-400">{product.description}</p>
                          <p className="text-xs text-gray-500">Price ID: {product.priceId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">{product.mode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Today's Revenue</h3>
                  <p className="text-3xl font-bold text-blue-400">$23.00</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Successful Payments</h3>
                  <p className="text-3xl font-bold text-purple-400">456</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Failed Payments</h3>
                  <p className="text-3xl font-bold text-red-400">12</p>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Transaction ID</th>
                        <th className="text-left py-2">Tool</th>
                        <th className="text-left py-2">Format</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="py-2">txn_123456</td>
                        <td className="py-2">Budget Card Conveyor</td>
                        <td className="py-2">PDF</td>
                        <td className="py-2">$1.00</td>
                        <td className="py-2">
                          <span className="px-2 py-1 bg-green-600 rounded text-xs">Success</span>
                        </td>
                        <td className="py-2">{new Date().toLocaleDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Platform Settings</h2>
                <button
                  onClick={saveSettings}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Export Controls</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'exportWatermarking', label: 'Export Watermarking' },
                      { key: 'globalMonetization', label: 'Global Monetization' },
                      { key: 'volumeExportLimits', label: 'Volume Export Limits' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span>{label}</span>
                        <button
                          onClick={() => toggleSetting(key as keyof AdminSettings)}
                          className={`p-1 rounded transition-colors ${
                            adminSettings[key as keyof AdminSettings] ? 'text-green-400' : 'text-gray-400'
                          }`}
                        >
                          {adminSettings[key as keyof AdminSettings] ? 
                            <ToggleRight className="w-8 h-8" /> : 
                            <ToggleLeft className="w-8 h-8" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">User Experience</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'feedbackPrompts', label: 'Feedback Prompts' },
                      { key: 'aiPrompts', label: 'AI Prompts' },
                      { key: 'aiFormAssistant', label: 'AI Form Assistant' },
                      { key: 'popularToolCarousel', label: 'Popular Tool Carousel' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span>{label}</span>
                        <button
                          onClick={() => toggleSetting(key as keyof AdminSettings)}
                          className={`p-1 rounded transition-colors ${
                            adminSettings[key as keyof AdminSettings] ? 'text-green-400' : 'text-gray-400'
                          }`}
                        >
                          {adminSettings[key as keyof AdminSettings] ? 
                            <ToggleRight className="w-8 h-8" /> : 
                            <ToggleLeft className="w-8 h-8" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">System Controls</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'maintenanceMode', label: 'Maintenance Mode' },
                      { key: 'analyticsTracking', label: 'Analytics Tracking' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span>{label}</span>
                        <button
                          onClick={() => toggleSetting(key as keyof AdminSettings)}
                          className={`p-1 rounded transition-colors ${
                            adminSettings[key as keyof AdminSettings] ? 'text-green-400' : 'text-gray-400'
                          }`}
                        >
                          {adminSettings[key as keyof AdminSettings] ? 
                            <ToggleRight className="w-8 h-8" /> : 
                            <ToggleLeft className="w-8 h-8" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Data Management</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const data = exportUserData();
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'platform-data-export.json';
                        a.click();
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Export All Data
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure? This will clear all user analytics data.')) {
                          clearUserData();
                          alert('User data cleared successfully!');
                        }
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Clear User Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};