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

export interface QuoteResult {
  symbol: string;
  shortname?: string;
  longname?: string;
}

export interface SearchResults {
  quotes: (QuoteResult | { isYahooFinance: false })[]; 

}
export interface ApiResponse {
  portfolio: Fund[];
  watchlist: Watchlist[];
}

export interface Fund {
  id: number;
  symbol: string;
  name: string;
  shortName: string;
  assetType?: string;
  asset_type?: string;
  current_price?: number;
  average_price?: number;
  quantity?: number;
  price?: number;
  currentPrice?: number;
  total?: number;
  date?: Date;
  last_update: string;
}

interface Watchlist extends Fund {
  id: number;
  symbol: string;
  name: string;
  addedAt: string;
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  average_price: number;
  currentPrice: number;
  lastUpdate: string;
}