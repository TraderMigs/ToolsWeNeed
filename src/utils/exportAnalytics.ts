// Export Analytics and Session Tracking System
// Quietly tracks user export behavior for future monetization optimization
import { updateToolUsage } from '../data/tools';
import { trackEvent } from './analytics';

export interface ExportEvent {
  id: string;
  sessionId: string;
  tool: string;
  format: 'pdf' | 'csv' | 'txt' | 'json' | 'png' | 'excel';
  type: 'preview' | 'paid';
  timestamp: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  lastActivity: string;
  totalExports: number;
  paidExports: number;
  previewExports: number;
  toolsUsed: string[];
  mostUsedFormat: string;
  totalSpent: number;
}

class ExportAnalytics {
  private sessionId: string;
  private storageKey = 'toolsweneed_exports';
  private sessionKey = 'toolsweneed_session';
  private maxStorageEntries = 1000; // Prevent localStorage bloat

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializeSession();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('toolsweneed_session_id');
    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem('toolsweneed_session_id', sessionId);
    }
    return sessionId;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private initializeSession(): void {
    const existingSession = this.getSessionData();
    if (!existingSession) {
      const newSession: SessionData = {
        sessionId: this.sessionId,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        totalExports: 0,
        paidExports: 0,
        previewExports: 0,
        toolsUsed: [],
        mostUsedFormat: '',
        totalSpent: 0
      };
      this.saveSessionData(newSession);
    }
  }

  private getSessionData(): SessionData | null {
    try {
      const data = localStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to parse session data:', error);
      return null;
    }
  }

  private saveSessionData(sessionData: SessionData): void {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save session data:', error);
    }
  }

  private getExportLogs(): ExportEvent[] {
    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.warn('Failed to parse export logs:', error);
      return [];
    }
  }

  private saveExportLogs(logs: ExportEvent[]): void {
    try {
      // Limit storage size to prevent bloat
      const limitedLogs = logs.slice(-this.maxStorageEntries);
      localStorage.setItem(this.storageKey, JSON.stringify(limitedLogs));
    } catch (error) {
      console.warn('Failed to save export logs:', error);
    }
  }

  public trackExport(
    tool: string, 
    format: ExportEvent['format'], 
    type: ExportEvent['type'],
    amount?: number
  ): void {
    // Update tool usage for smart sorting
    updateToolUsage(tool, 'export');
    
    const exportEvent: ExportEvent = {
      id: this.generateUUID(),
      sessionId: this.sessionId,
      tool,
      format,
      type,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent || 'unknown',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Save export event
    const existingLogs = this.getExportLogs();
    existingLogs.push(exportEvent);
    this.saveExportLogs(existingLogs);

    // Update session data
    this.updateSessionData(tool, format, type, amount);

    // Check for usage patterns (silent monitoring)
    this.analyzeUsagePatterns(existingLogs);
  }

  private updateSessionData(
    tool: string, 
    format: ExportEvent['format'], 
    type: ExportEvent['type'],
    amount: number = 0
  ): void {
    const sessionData = this.getSessionData();
    if (!sessionData) return;

    // Update session metrics
    sessionData.lastActivity = new Date().toISOString();
    sessionData.totalExports += 1;
    
    if (type === 'paid') {
      sessionData.paidExports += 1;
      sessionData.totalSpent += amount;
    } else {
      sessionData.previewExports += 1;
    }

    // Track tools used
    if (!sessionData.toolsUsed.includes(tool)) {
      sessionData.toolsUsed.push(tool);
    }

    // Update most used format
    const logs = this.getExportLogs();
    const formatCounts = logs.reduce((acc, log) => {
      acc[log.format] = (acc[log.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    sessionData.mostUsedFormat = Object.entries(formatCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || format;

    this.saveSessionData(sessionData);
  }

  private analyzeUsagePatterns(logs: ExportEvent[]): void {
    const sessionLogs = logs.filter(log => log.sessionId === this.sessionId);
    
    // Silent monitoring hooks for future monetization
    const totalExports = sessionLogs.length;
    const paidExports = sessionLogs.filter(log => log.type === 'paid').length;
    const uniqueTools = new Set(sessionLogs.map(log => log.tool)).size;
    
    // Future usage cap logic (not activated)
    const dailyExportLimit = 50; // Future limit
    const todayExports = sessionLogs.filter(log => {
      const logDate = new Date(log.timestamp).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length;

    // Silent flags for future monetization triggers
    const flags = {
      highUsage: totalExports > 20,
      powerUser: uniqueTools > 5,
      payingCustomer: paidExports > 0,
      nearDailyLimit: todayExports > dailyExportLimit * 0.8,
      conversionCandidate: totalExports > 10 && paidExports === 0
    };

    // Store flags for future use (not acted upon yet)
    sessionStorage.setItem('toolsweneed_usage_flags', JSON.stringify(flags));
  }

  public getUsageStats(): {
    session: SessionData | null;
    totalExports: number;
    todayExports: number;
    conversionRate: number;
    averageExportsPerTool: number;
    flags: any;
  } {
    const sessionData = this.getSessionData();
    const logs = this.getExportLogs();
    const sessionLogs = logs.filter(log => log.sessionId === this.sessionId);
    
    const todayExports = sessionLogs.filter(log => {
      const logDate = new Date(log.timestamp).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length;

    const paidExports = sessionLogs.filter(log => log.type === 'paid').length;
    const conversionRate = sessionLogs.length > 0 ? (paidExports / sessionLogs.length) * 100 : 0;
    
    const uniqueTools = new Set(sessionLogs.map(log => log.tool)).size;
    const averageExportsPerTool = uniqueTools > 0 ? sessionLogs.length / uniqueTools : 0;

    const flags = JSON.parse(sessionStorage.getItem('toolsweneed_usage_flags') || '{}');

    return {
      session: sessionData,
      totalExports: sessionLogs.length,
      todayExports,
      conversionRate,
      averageExportsPerTool,
      flags
    };
  }

  public exportAnalyticsData(): string {
    const sessionData = this.getSessionData();
    const logs = this.getExportLogs();
    const stats = this.getUsageStats();

    const analyticsExport = {
      exportedAt: new Date().toISOString(),
      session: sessionData,
      exportLogs: logs.filter(log => log.sessionId === this.sessionId),
      statistics: stats,
      metadata: {
        version: '1.0',
        source: 'ToolsWeNeed.com',
        privacy: 'Browser-only, no server tracking'
      }
    };

    return JSON.stringify(analyticsExport, null, 2);
  }

  public clearAnalyticsData(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem('toolsweneed_session_id');
    sessionStorage.removeItem('toolsweneed_usage_flags');
  }

  // Future monetization hooks
  public shouldShowUpgradePrompt(): boolean {
    const flags = JSON.parse(sessionStorage.getItem('toolsweneed_usage_flags') || '{}');
    // Not activated yet, but ready for future use
    return false; // flags.conversionCandidate && flags.highUsage;
  }

  public getRemainingFreeExports(): number {
    const dailyLimit = 50; // Future limit
    const stats = this.getUsageStats();
    return Math.max(0, dailyLimit - stats.todayExports);
  }

  public getRecommendedUpgrade(): string | null {
    const flags = JSON.parse(sessionStorage.getItem('toolsweneed_usage_flags') || '{}');
    
    if (flags.powerUser && flags.highUsage) {
      return 'unlimited'; // Future unlimited plan
    } else if (flags.conversionCandidate) {
      return 'premium'; // Future premium plan
    }
    
    return null;
  }
}

// Singleton instance
export const exportAnalytics = new ExportAnalytics();

// Convenience functions for easy integration
export const trackExport = (
  tool: string, 
  format: ExportEvent['format'], 
  type: ExportEvent['type'],
  amount?: number
) => {
  exportAnalytics.trackExport(tool, format, type, amount);
  
  // Track export event in analytics
  trackEvent(tool, 'export');
};

export const getUsageStats = () => {
  return exportAnalytics.getUsageStats();
};

export const exportUserData = () => {
  return exportAnalytics.exportAnalyticsData();
};

export const clearUserData = () => {
  exportAnalytics.clearAnalyticsData();
};

// Privacy-focused analytics (no external tracking)
export const getAnonymizedInsights = () => {
  const stats = getUsageStats();
  
  return {
    // Anonymized metrics for internal optimization
    sessionLength: stats.session ? 
      new Date().getTime() - new Date(stats.session.startTime).getTime() : 0,
    toolsExplored: stats.session?.toolsUsed.length || 0,
    exportFrequency: stats.averageExportsPerTool,
    conversionRate: stats.conversionRate,
    preferredFormat: stats.session?.mostUsedFormat || 'unknown',
    userType: stats.flags.powerUser ? 'power' : 
              stats.flags.payingCustomer ? 'paying' : 'casual'
  };
};