"use client";

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { ApiResponse, Fund } from '@/lib/types';

export function PortfolioSummary() {
  const [portfolio, setPortfolio] = useState<Fund[]>([]);

  useEffect(() => {
    const fetchPortfolioHome = async () => {
      const response = await fetch('/api/portfolio');
      const data: ApiResponse = await response.json();
      console.log(data);
      setPortfolio(data.portfolio);
    }
    fetchPortfolioHome();
  }, []);

  // Função para calcular os valores de cada categoria no portfolio
  const calculateSummary = () => {
    const summary = {
      availableCash: 0,
      fiis: 0,
      crypto: 0,
      stocks: 0,
      international: 0,
      fixedIncome: 0,
    };
  
    portfolio.forEach((item) => {
      const quantity = item.quantity ?? 0; // Usa 0 se quantity for undefined
  
      if (item.assetType === 'fiis') {
        summary.fiis += quantity * (item.currentPrice ?? 0);
      } else if (item.assetType === 'stocks') {
        summary.stocks += quantity * (item.currentPrice ?? 0);
      } else if (item.assetType === 'crypto') {
        summary.crypto += quantity * (item.currentPrice ?? 0);
      } else if (item.assetType === 'international') {
        summary.international += quantity * (item.currentPrice ?? 0);
      } else if (item.assetType === 'fixedIncome') {
        summary.fixedIncome += quantity * (item.currentPrice ?? 0);
      }
    });
  
    // Supondo que você tenha o valor de disponível em caixa (ou seja, uma variável fora do portfolio)
    summary.availableCash = 30000;  // Este valor pode ser calculado ou vindo de outra fonte.
  
    return summary;
  };
  

  const summary = calculateSummary();

  const summaryData = [
    { label: 'Available Cash', value: `R$ ${summary.availableCash.toLocaleString('pt-BR')}`, color: 'text-green-500' },
    { label: 'FIIs', value: `R$ ${summary.fiis.toLocaleString('pt-BR')}`, color: 'text-blue-500' },
    { label: 'Crypto', value: `R$ ${summary.crypto.toLocaleString('pt-BR')}`, color: 'text-purple-500' },
    { label: 'Stocks', value: `R$ ${summary.stocks.toLocaleString('pt-BR')}`, color: 'text-orange-500' },
    { label: 'International', value: `R$ ${summary.international.toLocaleString('pt-BR')}`, color: 'text-cyan-500' },
    { label: 'Fixed Income', value: `R$ ${summary.fixedIncome.toLocaleString('pt-BR')}`, color: 'text-pink-500' },
  ];

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-semibold mb-6">Portfolio Summary</h2>
      <div className="grid gap-4">
        {summaryData.map((item) => (
          <Card key={item.label} className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{item.label}</span>
              <span className={`font-semibold ${item.color}`}>{item.value}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
