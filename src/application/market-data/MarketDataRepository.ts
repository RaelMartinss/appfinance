export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketDataRepository {
  getQuotes(): Promise<MarketQuote[]>;
}