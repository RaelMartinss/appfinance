import yahooFinance from 'yahoo-finance2';
import { MarketDataRepository, MarketQuote } from '../../application/market-data/MarketDataRepository';
import { formatSymbol } from './SymbolFormatter';

const MARKET_SYMBOLS = [
  'PETR4',
  'VALE3',
  'ITUB4',
  'BBAS3',
  'BBDC4',
  'ABEV3',
  'WEGE3',
  'MGLU3',
  'AAPL',
  'MSFT',
  'GOOGL',
  'BTC-USD',
];

export class YahooFinanceClient implements MarketDataRepository {
  async getQuotes(): Promise<MarketQuote[]> {
    const symbols = MARKET_SYMBOLS.map(formatSymbol);
    const quotes = await yahooFinance.quote(symbols, { return: 'map' });

    return symbols.flatMap((symbol) => {
      const quote = quotes.get(symbol);
      const price = quote?.regularMarketPrice;

      if (!quote || typeof price !== 'number') {
        return [];
      }

      return [{
        symbol,
        name: quote.shortName ?? quote.longName ?? symbol,
        price,
        change: quote.regularMarketChange ?? 0,
        changePercent: quote.regularMarketChangePercent ?? 0,
      }];
    });
  }
}