import { describe, expect, it } from 'vitest';
import {
  calculateOvernightHours,
  calculateSameDayDurationMinutes,
  calculateSavingsProjection,
  parseLocalDate,
} from './calculations';

describe('calculation fixtures', () => {
  it('calculates a savings plan using calendar months', () => {
    const result = calculateSavingsProjection({
      targetAmount: 12_000,
      currentAmount: 3_000,
      targetDate: '2027-07-30',
      monthlyContribution: 750,
    }, new Date(2026, 6, 30));

    expect(result.monthsRemaining).toBe(12);
    expect(result.requiredMonthlyContribution).toBe(750);
    expect(result.onTrack).toBe(true);
  });

  it('rejects impossible local dates', () => {
    expect(parseLocalDate('2026-02-30')).toBeNull();
  });

  it('calculates overnight sleep without implementation-defined date parsing', () => {
    expect(calculateOvernightHours('23:00', '05:00')).toBe(6);
  });

  it('requires a positive same-day schedule duration', () => {
    expect(calculateSameDayDurationMinutes('09:00', '11:00')).toBe(120);
    expect(calculateSameDayDurationMinutes('11:00', '09:00')).toBeNull();
  });
});
