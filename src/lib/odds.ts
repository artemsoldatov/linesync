// Pure odds helpers. Odds are stored in the CRDT as integer milli-units
// (decimal odds x 1000) so concurrent edits never fight over float rounding.

export function milliToDecimal(milli: number): number {
  return milli / 1000;
}

export function decimalToMilli(decimal: number): number {
  return Math.round(decimal * 1000);
}

export function impliedProbability(decimalMilli: number): number {
  return decimalMilli > 0 ? 1000 / decimalMilli : 0;
}

export function toAmerican(decimalMilli: number): number {
  const decimal = decimalMilli / 1000;
  if (decimal <= 1) return 0;
  return decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function toFractional(decimalMilli: number): string {
  const numerator = decimalMilli - 1000; // (decimal - 1) x 1000
  const denominator = 1000;
  const g = gcd(numerator, denominator) || 1;
  return `${numerator / g}/${denominator / g}`;
}

// combined decimal odds of a set of selections (accumulator), in milli-units
export function parlayMilli(oddsMilli: number[]): number {
  if (oddsMilli.length === 0) return 0;
  const decimal = oddsMilli.reduce((acc, m) => acc * (m / 1000), 1);
  return Math.round(decimal * 1000);
}

export function formatDecimal(decimalMilli: number): string {
  return (decimalMilli / 1000).toFixed(2);
}
