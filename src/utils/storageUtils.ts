import { getAnonymizedInsights, getUsageStats } from './exportAnalytics';

export const saveToSession = (key: string, data: unknown) => {
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch { /* storage is optional */ }
};

export const loadFromSession = (key: string) => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

export const removeFromSession = (key: string) => {
  try { sessionStorage.removeItem(key); } catch { /* storage is optional */ }
};

export const clearSession = () => {
  try { sessionStorage.clear(); } catch { /* storage is optional */ }
};

const toolKey = (toolName: string) => `twn_${toolName}_data`;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

export const saveToolData = (toolName: string, data: unknown) => {
  try {
    localStorage.setItem(toolKey(toolName), JSON.stringify({ data, timestamp: Date.now(), version: '1.0' }));
  } catch { /* storage is optional */ }
};

export const loadToolData = (toolName: string) => {
  try {
    const saved = localStorage.getItem(toolKey(toolName));
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (Date.now() - parsed.timestamp > sevenDays || !parsed.data || typeof parsed.data !== 'object') {
      localStorage.removeItem(toolKey(toolName));
      return null;
    }
    return parsed.data;
  } catch {
    try { localStorage.removeItem(toolKey(toolName)); } catch { /* no-op */ }
    return null;
  }
};

export const clearToolData = (toolName: string) => {
  try { localStorage.removeItem(toolKey(toolName)); } catch { /* storage is optional */ }
};

export const hasToolData = (toolName: string): boolean => {
  try {
    const saved = localStorage.getItem(toolKey(toolName));
    if (!saved) return false;
    return Date.now() - JSON.parse(saved).timestamp <= sevenDays;
  } catch { return false; }
};

export const saveToolDataWithAnalytics = (toolName: string, data: unknown) => {
  try {
    localStorage.setItem(toolKey(toolName), JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0',
      localUsage: getAnonymizedInsights(),
    }));
  } catch { /* storage is optional */ }
};

export const getToolUsageInsights = () => getUsageStats();

export const storeExportDataLocal = async (sessionId: string, data: unknown): Promise<boolean> => {
  try {
    localStorage.setItem(`export_data_${sessionId}`, JSON.stringify(data));
    return true;
  } catch { return false; }
};
