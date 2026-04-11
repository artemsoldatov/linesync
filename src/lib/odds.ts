// Pure odds helpers. Odds are stored in the CRDT as integer milli-units
// (decimal odds x 1000) so concurrent edits never fight over float rounding.

export function milliToDecimal(milli: number): number {
  return milli / 1000;
}

export function decimalToMilli(decimal: number): number {
  return Math.round(decimal * 1000);
}

export function formatDecimal(decimalMilli: number): string {
  return (decimalMilli / 1000).toFixed(2);
}
