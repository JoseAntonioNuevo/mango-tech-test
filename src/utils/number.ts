export function roundToDecimals(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return roundToDecimals(value, decimals).toFixed(decimals);
}

export function parseAndRound(value: string, decimals: number = 2): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? NaN : roundToDecimals(parsed, decimals);
}