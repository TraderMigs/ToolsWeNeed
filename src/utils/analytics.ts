/**
 * Product signals: stored locally to personalize sorting on this device, and
 * mirrored (anonymously — tool id, event type, random session id only) to the
 * tool_analytics table so the Trending section reflects real site-wide usage.
 */
import { env } from './env';

export type EventType = 'view' | 'submit' | 'export' | 'feedback' | 'share';

export interface AnalyticsEvent {
  tool_id: string;
  event_type: EventType;
  timestamp: number;
  session_id: string;
}

const sessionKey = 'toolsweneed_session_id';

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(sessionKey, sessionId);
  }
  return sessionId;
};

export const getReferrer = (): string | undefined => undefined;

const storeLocalEvent = (event: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = `toolsweneed_events_${event.event_type}`;
    const counts = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, number>;
    counts[event.tool_id] = (counts[event.tool_id] ?? 0) + 1;
    localStorage.setItem(key, JSON.stringify(counts));
  } catch {
    // Usage personalization is optional; private browsing may reject storage.
  }
};

const logRemoteEvent = (toolId: string, eventType: EventType, sessionId: string): void => {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY;
  if (!url || !key || typeof window === 'undefined') return;
  void fetch(`${url}/rest/v1/tool_analytics`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ tool_id: toolId, event_type: eventType, session_id: sessionId }),
    keepalive: true,
  }).catch(() => {
    // Usage stats are best-effort; never surface errors to the user.
  });
};

export const trackEvent = async (toolId: string, eventType: EventType): Promise<void> => {
  const sessionId = getSessionId();
  storeLocalEvent({
    tool_id: toolId,
    event_type: eventType,
    timestamp: Date.now(),
    session_id: sessionId,
  });
  logRemoteEvent(toolId, eventType, sessionId);
};

export const getLocalEventCounts = (eventType: EventType): Record<string, number> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(`toolsweneed_events_${eventType}`) || '{}');
  } catch {
    return {};
  }
};

const getLocalTrending = (limit: number, eventType: EventType) =>
  Object.entries(getLocalEventCounts(eventType))
    .map(([tool_id, count]) => ({ tool_id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

export const getTrendingTools = async (
  days = 7,
  limit = 10,
  eventType: EventType = 'view',
): Promise<Array<{ tool_id: string; count: number }>> => {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY;
  if (url && key && typeof window !== 'undefined') {
    try {
      const res = await fetch(`${url}/rest/v1/rpc/get_trending_tools`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_days: days, p_limit: limit, p_event_type: eventType }),
      });
      if (res.ok) {
        const rows: Array<{ tool_id: string; count: number | string }> = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map(row => ({ tool_id: row.tool_id, count: Number(row.count) }));
        }
      }
    } catch {
      // Fall through to this device's local counts.
    }
  }
  return getLocalTrending(limit, eventType);
};

export const isToolTrending = (
  toolId: string,
  trendingTools: Array<{ tool_id: string; count: number }>,
  threshold = 3,
): boolean => (trendingTools.find(tool => tool.tool_id === toolId)?.count ?? 0) >= threshold;
