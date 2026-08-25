import { NextResponse } from 'next/server';
import { GetTopGainersUseCase } from '../../../application/market-data/get-top-gainers/GetTopGainersUseCase';

export class MarketDataController {
  constructor(private readonly getTopGainersUseCase: GetTopGainersUseCase) {}

  async getTopGainers() {
    try {
      const gainers = await this.getTopGainersUseCase.execute();
      return NextResponse.json(gainers);
    } catch {
      return NextResponse.json(
        { error: 'Não foi possível buscar os maiores ganhos do mercado.' },
        { status: 502 }
      );
    }
  }
}