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

import yahooFinance from "yahoo-finance2";

export async function fetchStockData(symbol: string) {
  const quote = await yahooFinance.quote(symbol);

  if (!quote) {
    throw new Error("Dados não encontrados.");
  }

  return {
    price: quote.regularMarketPrice,
    dividend: quote.trailingAnnualDividendRate,
    marketCap: quote.marketCap,
    pvpRatio: quote.priceToBook || 0,
  };
}
