"use client";

import { Card } from '@/components/ui/card';

export function PortfolioSummary() {
  const summaryData = [
    { label: 'Available Cash', value: 'R$ 30.000,00', color: 'text-green-500' },
    { label: 'FIIs', value: 'R$ 5.000,00', color: 'text-blue-500' },
    { label: 'Crypto', value: 'R$ 2.000,00', color: 'text-purple-500' },
    { label: 'Stocks', value: 'R$ 8.000,00', color: 'text-orange-500' },
    { label: 'International', value: 'R$ 3.000,00', color: 'text-cyan-500' },
    { label: 'Fixed Income', value: 'R$ 2.000,00', color: 'text-pink-500' },
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