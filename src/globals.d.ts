declare const gtag: undefined | ((event: string, action: string, parameters?: Record<string, unknown>) => void);

interface Window {
  dataLayer?: unknown[];
}
