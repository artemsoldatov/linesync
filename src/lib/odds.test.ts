import { describe, expect, it } from 'vitest';
import {
  formatDecimal,
  impliedProbability,
  parlayMilli,
  toAmerican,
  toFractional,
} from './odds';

describe('odds', () => {
  it('converts decimal milli to american', () => {
    expect(toAmerican(2500)).toBe(150);
    expect(toAmerican(1500)).toBe(-200);
  });

  it('converts decimal milli to a fraction', () => {
    expect(toFractional(2500)).toBe('3/2');
    expect(toFractional(3000)).toBe('2/1');
  });

  it('computes implied probability', () => {
    expect(impliedProbability(2000)).toBeCloseTo(0.5);
    expect(impliedProbability(4000)).toBeCloseTo(0.25);
  });

  it('multiplies a parlay', () => {
    expect(parlayMilli([2000, 1500, 3000])).toBe(9000);
    expect(parlayMilli([])).toBe(0);
  });

  it('formats decimal odds', () => {
    expect(formatDecimal(2500)).toBe('2.50');
  });
});
