import { beforeEach, describe, expect, it, vi } from "vitest";
import { MarketDataRepository } from "../MarketDataRepository";
import { GetTopGainersUseCase } from "./GetTopGainersUseCase";

describe('GetTopGainersUseCase', () => {
   let repositoryMock: MarketDataRepository;
   let useCase: GetTopGainersUseCase

   // Dados mockados que cobrem ativos positivos, negativos e ordens misturadas
   const mockQuotes = [
    { symbol: 'PETR4', name: 'Petrobras', price: 38.0, change: 0.5, changePercent: 1.33 },
    { symbol: 'VALE3', name: 'Vale', price: 62.0, change: -1.2, changePercent: -1.90 }, // Deve ser filtrado (< 0)
    { symbol: 'ITUB4', name: 'Itaú', price: 34.0, change: 1.8, changePercent: 5.59 },   // Maior alta
    { symbol: 'WEGE3', name: 'Weg', price: 40.0, change: 1.1, changePercent: 2.83 },
    { symbol: 'ABEV3', name: 'Ambev', price: 12.0, change: 0.0, changePercent: 0.00 },  // Deve ser filtrado (= 0)
    { symbol: 'BBDC4', name: 'Bradesco', price: 15.0, change: 0.2, changePercent: 1.35 },
  ];

  beforeEach(() => {
    repositoryMock = {
        getQuotes: vi.fn().mockResolvedValue(mockQuotes),
    } as unknown as MarketDataRepository;
  
    useCase = new GetTopGainersUseCase(repositoryMock);
  });

  it('It should filter only assets with a changePercent greater than 0', async () => {
    const result = await useCase.execute();

    const hasNegativeOrZero = result.some((item) => item.changePercent <= 0);
    expect(hasNegativeOrZero).toBe(false);
  });

  it('must sort the assets by changePercent from highest to lowest', async () => {
    const result = await useCase.execute();

    expect(result[0].symbol).toBe('ITUB4');
    expect(result[1].symbol).toBe('WEGE3');
    expect(result[2].symbol).toBe('BBDC4');
    expect(result[3].symbol).toBe('PETR4');
  });

  it('must respect the limit on the number of items specified', async () => {
    const limit = 2
    const result = await useCase.execute(limit);

    expect(result).toHaveLength(limit);
    expect(result[0].symbol).toBe('ITUB4');
    expect(result[1].symbol).toBe('WEGE3');
  });

  it('should correctly map only the expected public DTO', async () => {
    const result = await useCase.execute(1);

    expect(result[0]).toEqual({
      symbol: 'ITUB4',
      name: 'Itaú',
      price: 34.0,
      change: 1.8,
      changePercent: 5.59,
    });
  });
});