export interface StockData {
  symbol: string;
  currentPrice: number;
  lastDividend: number;
  pvpRatio: number;
  shortName: string;
  change: number;
  changePercent: number;
  regularMarketPrice?: number; // Opcional
  price?: number; // Opcional
  dividend?: number; // Opcional
  historicalData?: HistoricalData[]; // Opcional
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