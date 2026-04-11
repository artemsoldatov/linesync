import { describe, expect, it } from 'vitest';
import { decimalToMilli, formatDecimal, milliToDecimal } from './odds';

describe('odds', () => {
  it('converts milli-units to decimal and back', () => {
    expect(milliToDecimal(2500)).toBe(2.5);
    expect(decimalToMilli(2.5)).toBe(2500);
  });

  it('formats decimal odds', () => {
    expect(formatDecimal(2500)).toBe('2.50');
  });
});
