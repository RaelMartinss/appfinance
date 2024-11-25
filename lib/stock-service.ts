// import { StockData } from './types';

// const isBrazilianStock = (symbol: string): boolean => {
//   const patterns = [
//     /^[A-Z]{4}\d{1,2}$/, // Regular stocks and units (e.g., PETR4, PETR3, BIDI11)
//     /^[A-Z]{4}11$/, // REITs (e.g., HGLG11)
//   ];
//   return patterns.some(pattern => pattern.test(symbol));
// };

// function isStockData(data: any): data is StockData {
//   return data && typeof data.symbol === 'string' && typeof data.price === 'number'; // Ajuste conforme sua tipagem
// }

// export async function fetchStockData(symbol: string): Promise<StockData> {
//   if (!symbol.trim()) {
//     throw new Error('Stock symbol is required');
//   }

//   if (!isBrazilianStock(symbol)) {
//     throw new Error('Invalid Brazilian stock symbol format');
//   }

//   try {
//     console.log('symbol7877', symbol);
//     const response = await fetch(`/api/stocks?symbol=${symbol}`);
//     console.log('response', response);
//     if (!response.ok) {
//       const errorMessage = await response.text();
//       throw new Error(`Failed to fetch stock data: ${errorMessage}`);
//     }

//     const data = await response.json();

//     if (!isStockData(data)) {
//       throw new Error('Invalid data format from API');
//     }

//     return data;
//   } catch (error) {
//     throw new Error(`Failed to fetch stock data: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// }
import { StockData } from './types';
import yahooFinance from "yahoo-finance2";

const ASSET_PATTERNS = {
  BRAZILIAN_STOCK: /^[A-Z]{4}\d{1,2}$/,
  CRYPTO: /^[A-Z]{3,4}-USD$/,
  INTERNATIONAL_STOCK: /^[A-Z]{1,4}$/
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
  if (['BTC', 'ETH', 'USDT', 'BNB', 'XRP'].includes(cleanSymbol)) {
    return `${cleanSymbol}-USD`;
  }

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
