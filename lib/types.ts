export interface StockData {
  symbol: string;
  symbolSa: string;
  currentPrice: number;
  lastDividend: number;
  pvpRatio: number;
  regularMarketPrice: number;
  price: string | number;
  dividend: number;
  shortName: string;
  change: number;
  changePercent: number;
  historicalData: HistoricalData[];
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface HistoricalData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}