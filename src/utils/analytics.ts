/** Local-only product signals used to personalize sorting on this device. */
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

export const trackEvent = async (toolId: string, eventType: EventType): Promise<void> => {
  storeLocalEvent({
    tool_id: toolId,
    event_type: eventType,
    timestamp: Date.now(),
    session_id: getSessionId(),
  });
};

export const getLocalEventCounts = (eventType: EventType): Record<string, number> => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(`toolsweneed_events_${eventType}`) || '{}');
  } catch {
    return {};
  }
};

export const getTrendingTools = async (
  _days = 7,
  limit = 10,
  eventType: EventType = 'submit',
): Promise<Array<{ tool_id: string; count: number }>> => Object.entries(getLocalEventCounts(eventType))
  .map(([tool_id, count]) => ({ tool_id, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, limit);

export const isToolTrending = (
  toolId: string,
  trendingTools: Array<{ tool_id: string; count: number }>,
  threshold = 3,
): boolean => (trendingTools.find(tool => tool.tool_id === toolId)?.count ?? 0) >= threshold;
