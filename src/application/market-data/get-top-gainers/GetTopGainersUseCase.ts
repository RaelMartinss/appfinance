import { MarketDataRepository } from '../MarketDataRepository';

export interface MarketGainer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export class GetTopGainersUseCase {
  constructor(private readonly marketDataRepository: MarketDataRepository) {}

  async execute(limit = 5): Promise<MarketGainer[]> {
    const quotes = await this.marketDataRepository.getQuotes();

    return quotes
      .filter((quote) => quote.changePercent > 0)
      .sort((first, second) => second.changePercent - first.changePercent)
      .slice(0, limit)
      .map((quote) => ({
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
      }));
  }
}