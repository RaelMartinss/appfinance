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


export interface User {
  id: number;
  email: string;
  password: string; 
  name?: string; 
  createdAt: Date; 
  updatedAt: Date; 

  // Relacionamentos
  transactions?: Transaction[]; 
  portfolio?: Portfolio[];     
  watchlist?: Favoritos[]; 
}

export interface Transaction {
  id: number;
  symbol: string;       // Símbolo do ativo (ex: "AAPL")
  name: string;         // Nome do ativo (ex: "Apple Inc.")
  type: 'buy' | 'sell'; // Tipo da transação
  assetType: string;    // Tipo do ativo (ex: "stocks", "fiis")
  quantity: number;     // Quantidade negociada
  price: number;        // Preço por unidade
  total: number;        // Valor total da transação
  date: Date;           // Data da transação

  userId: number;       // Relacionamento: ID do usuário
  user?: User;          // Objeto do usuário associado (opcional)
}

export interface Portfolio {
  id: number;
  symbol: string;       // Símbolo do ativo (ex: "AAPL")
  name: string;         // Nome do ativo (ex: "Apple Inc.")
  assetType: string;    // Tipo do ativo (ex: "stocks", "fiis")
  quantity: number;     // Quantidade total no portfólio
  averagePrice: number; // Preço médio do ativo no portfólio
  currentPrice: number; // Preço atual do ativo
  lastUpdate: Date;     // Última atualização do portfólio
  last_update: string;

  userId: number;       // Relacionamento: ID do usuário
  user?: User;          // Objeto do usuário associado (opcional)
}

export interface Favoritos {
  id: number;
  symbol: string;   // Símbolo do ativo (ex: "AAPL")
  name: string;     // Nome do ativo (ex: "Apple Inc.")
  addedAt: Date;    // Data em que o ativo foi adicionado aos favoritos

  userId: number;   // Relacionamento: ID do usuário
  user?: User;      // Objeto do usuário associado (opcional)
}

export interface UserWithRelations extends User {
  transactions: Transaction[]; // Todas as transações do usuário
  portfolio: Portfolio[];      // Todos os ativos no portfólio do usuário
  watchlist: Favoritos[];      // Todos os ativos na lista de observação do usuário
}

export interface TransactionWithUser extends Transaction {
  user: User; // Usuário relacionado a essa transação
}
