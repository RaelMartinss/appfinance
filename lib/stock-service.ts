import { StockData } from './types';
import yahooFinance from "yahoo-finance2";

const ASSET_PATTERNS = {
  BRAZILIAN_STOCK: /^[A-Z]{4}\d{1,2}$/,
  CRYPTO: /^[A-Z0-9\-]{1,}-USD$/,
  INTERNATIONAL_STOCK: /^[A-Z0-9\-]{1,}$/
};

export function formatSymbol(symbol: string): string {
  const cleanSymbol = symbol.trim().toUpperCase();

  // Brazilian stocks
  if (ASSET_PATTERNS.BRAZILIAN_STOCK.test(cleanSymbol)) {
    return `${cleanSymbol}.SA`;
  }
  
  // Cryptocurrencies
  if (cleanSymbol.endsWith('-USD')) {
    return cleanSymbol;
  }
  // if (['BTC', 'ETH', 'USDT', 'BNB', 'XRP'].includes(cleanSymbol)) {
  //   return `${cleanSymbol}-USD`;
  // }

  // International stocks (no modification needed)
  return cleanSymbol;
}

export async function fetchStockData(symbol: string): Promise<StockData> {
  if (!symbol.trim()) {
    throw new Error('Asset symbol is required');
  }

  try {
    const formattedSymbol = formatSymbol(symbol);
    const quote = await yahooFinance.quote(formattedSymbol);
    console.log('fetchStockData', quote)

    if (!quote || !quote.regularMarketPrice) {
      throw new Error('Asset data not found');
    }

    return {
      symbol: symbol,
      shortName: quote.longName || quote.shortName || symbol,
      currentPrice: quote.regularMarketPrice,
      lastDividend: (quote.trailingAnnualDividendRate || 0) / 12,
      pvpRatio: quote.priceToBook || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
    };
  } catch (error) {
    throw new Error(`Failed to fetch asset data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
