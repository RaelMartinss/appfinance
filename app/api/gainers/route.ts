import { MarketDataController } from '@/src/presentation/http/controllers/MarketDataController';
import { GetTopGainersUseCase } from '@/src/application/market-data/get-top-gainers/GetTopGainersUseCase';
import { YahooFinanceClient } from '@/src/infrastructure/market-data/YahooFinanceClient';

const controller = new MarketDataController(
  new GetTopGainersUseCase(new YahooFinanceClient())
);

export async function GET() {
  return controller.getTopGainers();
}