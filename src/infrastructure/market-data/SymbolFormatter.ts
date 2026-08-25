const BRAZILIAN_STOCK_PATTERN = /^[A-Z]{4}\d{1,2}$/;

export function formatSymbol(symbol: string): string {
  const normalizedSymbol = symbol.trim().toUpperCase();

  if (BRAZILIAN_STOCK_PATTERN.test(normalizedSymbol)) {
    return `${normalizedSymbol}.SA`;
  }

  return normalizedSymbol;
}