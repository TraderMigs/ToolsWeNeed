import { describe, expect, it } from 'vitest';
import { calculateTaxes } from './SelfEmployedTaxEstimator';

// Expected values hand-computed from official 2026 IRS figures:
// brackets, standard deductions, 92.35% SE factor, $184,500 SS wage base,
// 20% QBI deduction limited to 20% of taxable income, $2,200 child credit.
const base = {
  incomes: [] as Array<{ id: string; type: '1099' | 'w2' | 'rental' | 'investment' | 'other'; source: string; amount: number; notes: string }>,
  deductions: 0,
  filingStatus: 'single' as const,
  state: '',
  selfEmployed: true,
  quarterlyPayments: 0,
  healthInsurance: 0,
  retirementContributions: 0,
  homeOfficeDeduction: 0,
  vehicleExpenses: 0,
  equipmentExpenses: 0,
  professionalServices: 0,
  stateIncomeTaxRate: 0,
  dependents: 0,
  childTaxCredit: false,
  itemizedDeductions: [] as Array<{ id: string; category: string; description: string; amount: number }>,
};

describe('calculateTaxes (2026 tax year)', () => {
  it('computes an $85k single 1099 filer with SE tax and QBI', () => {
    const r = calculateTaxes({
      ...base,
      incomes: [{ id: '1', type: '1099', source: 'Client', amount: 85000, notes: '' }],
    });
    // SE tax: 85,000 x 0.9235 x 15.3% = 12,010.12
    expect(r.selfEmploymentTax).toBeCloseTo(12010.12, 0);
    // QBI limited by 20% of taxable-before-QBI (62,894.94) = 12,578.99
    expect(r.qbiDeduction).toBeCloseTo(12578.99, 0);
    // Federal on 50,315.95 taxable: 1,240 + 37,915.95 x 12% = 5,789.90
    expect(r.federalTax).toBeCloseTo(5789.9, 0);
  });

  it('computes a married W-2 household without SE tax or QBI', () => {
    const r = calculateTaxes({
      ...base,
      filingStatus: 'married',
      selfEmployed: false,
      incomes: [{ id: '1', type: 'w2', source: 'Employer', amount: 100000, notes: '' }],
    });
    expect(r.selfEmploymentTax).toBe(0);
    expect(r.qbiDeduction).toBe(0);
    // Taxable 67,800: 2,480 + 43,000 x 12% = 7,640
    expect(r.federalTax).toBeCloseTo(7640, 0);
  });

  it('applies the $2,200-per-child credit', () => {
    const r = calculateTaxes({
      ...base,
      filingStatus: 'married',
      selfEmployed: false,
      dependents: 2,
      childTaxCredit: true,
      incomes: [{ id: '1', type: 'w2', source: 'Employer', amount: 100000, notes: '' }],
    });
    // 7,640 - 2 x 2,200 = 3,240
    expect(r.federalTax).toBeCloseTo(3240, 0);
  });

  it('caps Social Security tax at the $184,500 wage base', () => {
    const r = calculateTaxes({
      ...base,
      incomes: [{ id: '1', type: '1099', source: 'Client', amount: 300000, notes: '' }],
    });
    // SE base 277,050: SS capped at 184,500 x 12.4% = 22,878;
    // Medicare 277,050 x 2.9% = 8,034.45; Additional 77,050 x 0.9% = 693.45
    expect(r.selfEmploymentTax).toBeCloseTo(22878 + 8034.45 + 693.45, 0);
  });
});
