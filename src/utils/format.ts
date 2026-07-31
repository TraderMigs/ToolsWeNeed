/** Shared display formatters so every tool renders numbers identically. */

export const formatMoney = (n: number): string =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/** Money without cents, for large round figures ("$85,000"). */
export const formatMoneyWhole = (n: number): string =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const formatNumber = (n: number, maxDecimals = 2): string =>
  n.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
