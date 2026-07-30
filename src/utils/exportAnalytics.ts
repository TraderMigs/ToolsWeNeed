import { updateToolUsage } from '../data/tools';
import { trackEvent } from './analytics';

export type ExportFormat = 'pdf' | 'csv' | 'txt' | 'json' | 'png' | 'excel';

export interface ExportEvent {
  id: string;
  sessionId: string;
  tool: string;
  format: ExportFormat;
  type: 'download';
  timestamp: string;
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  lastActivity: string;
  totalExports: number;
  paidExports: 0;
  previewExports: 0;
  toolsUsed: string[];
  mostUsedFormat: string;
  totalSpent: 0;
}

const EXPORTS_KEY = 'toolsweneed_exports';
const SESSION_KEY = 'toolsweneed_session';

const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const getOrCreateSession = (): SessionData => {
  const existing = readJSON<SessionData | null>(SESSION_KEY, null);
  if (existing) return { ...existing, paidExports: 0, previewExports: 0, totalSpent: 0 };

  const now = new Date().toISOString();
  const session: SessionData = {
    sessionId: createId(),
    startTime: now,
    lastActivity: now,
    totalExports: 0,
    paidExports: 0,
    previewExports: 0,
    toolsUsed: [],
    mostUsedFormat: '',
    totalSpent: 0,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const trackExport = (tool: string, format: ExportFormat, type: 'download' = 'download') => {
  const session = getOrCreateSession();
  const events = readJSON<ExportEvent[]>(EXPORTS_KEY, []);
  const event: ExportEvent = {
    id: createId(),
    sessionId: session.sessionId,
    tool,
    format,
    type,
    timestamp: new Date().toISOString(),
  };
  const nextEvents = [...events, event].slice(-1000);
  localStorage.setItem(EXPORTS_KEY, JSON.stringify(nextEvents));

  const formatCounts = nextEvents.reduce<Record<string, number>>((counts, item) => {
    counts[item.format] = (counts[item.format] ?? 0) + 1;
    return counts;
  }, {});
  const mostUsedFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? format;

  const nextSession: SessionData = {
    ...session,
    lastActivity: event.timestamp,
    totalExports: session.totalExports + 1,
    toolsUsed: session.toolsUsed.includes(tool) ? session.toolsUsed : [...session.toolsUsed, tool],
    mostUsedFormat,
    paidExports: 0,
    previewExports: 0,
    totalSpent: 0,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  updateToolUsage(tool, 'export');
  trackEvent(tool, 'export');
};

export const getUsageStats = () => {
  const session = readJSON<SessionData | null>(SESSION_KEY, null);
  const logs = readJSON<ExportEvent[]>(EXPORTS_KEY, []);
  const sessionLogs = session ? logs.filter((log) => log.sessionId === session.sessionId) : [];
  const today = new Date().toDateString();
  const todayExports = sessionLogs.filter((log) => new Date(log.timestamp).toDateString() === today).length;
  const uniqueTools = new Set(sessionLogs.map((log) => log.tool)).size;

  return {
    session,
    totalExports: sessionLogs.length,
    todayExports,
    conversionRate: 0,
    averageExportsPerTool: uniqueTools ? sessionLogs.length / uniqueTools : 0,
    flags: {
      conversionCandidate: false,
      powerUser: false,
      payingCustomer: false,
      highUsage: false,
    },
  };
};

export const exportUserData = () => JSON.stringify({
  exportedAt: new Date().toISOString(),
  session: readJSON<SessionData | null>(SESSION_KEY, null),
  exportLogs: readJSON<ExportEvent[]>(EXPORTS_KEY, []),
  privacy: 'Stored only in this browser',
}, null, 2);

export const clearUserData = () => {
  localStorage.removeItem(EXPORTS_KEY);
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('toolsweneed_session_id');
  sessionStorage.removeItem('toolsweneed_usage_flags');
};

export const getAnonymizedInsights = () => {
  const stats = getUsageStats();
  return {
    sessionLength: stats.session ? Date.now() - new Date(stats.session.startTime).getTime() : 0,
    toolsExplored: stats.session?.toolsUsed.length ?? 0,
    exportFrequency: stats.averageExportsPerTool,
    preferredFormat: stats.session?.mostUsedFormat || 'unknown',
  };
};
