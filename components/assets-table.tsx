"use client";

import { format } from 'date-fns';

interface Asset {
  id: number;
  purchaseDate: Date;
  group: string;
  ticker: string;
  shares: number;
  averagePrice: number;
}

const mockAssets: Asset[] = [
  {
    id: 1,
    purchaseDate: new Date('2024-01-15'),
    group: 'FII',
    ticker: 'MXRF11',
    shares: 100,
    averagePrice: 9.80,
  },
  {
    id: 2,
    purchaseDate: new Date('2024-02-01'),
    group: 'Stock',
    ticker: 'PETR4',
    shares: 50,
    averagePrice: 34.25,
  },
  {
    id: 3,
    purchaseDate: new Date('2024-02-15'),
    group: 'Crypto',
    ticker: 'BTC',
    shares: 0.05,
    averagePrice: 250000.00,
  },
];

export function AssetsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Purchase Date</th>
            <th className="text-left p-4">Group</th>
            <th className="text-left p-4">Ticker</th>
            <th className="text-right p-4">Shares</th>
            <th className="text-right p-4">Average Price</th>
            <th className="text-right p-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {mockAssets.map((asset) => (
            <tr key={asset.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                {format(asset.purchaseDate, 'dd/MM/yyyy')}
              </td>
              <td className="p-4">{asset.group}</td>
              <td className="p-4">{asset.ticker}</td>
              <td className="p-4 text-right">{asset.shares.toLocaleString()}</td>
              <td className="p-4 text-right">
                {asset.averagePrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
              <td className="p-4 text-right">
                {(asset.shares * asset.averagePrice).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}