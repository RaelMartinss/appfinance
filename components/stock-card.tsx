"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number | string;
  change: number;
  changePercent: number;
}

export function StockCard({ symbol, name, price, change, changePercent }: StockCardProps) {
  const [currentPrice, setCurrentPrice] = useState(price || 0);
  const [currentChange, setCurrentChange] = useState(change || 0);
  const [currentChangePercent, setCurrentChangePercent] = useState(changePercent || 0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
       
        const response = await fetch(`/api/stocks?symbol=${symbol.toUpperCase()}`);

        const data = await response.json();

        setCurrentPrice(data.price);

        setCurrentChange(data.change);
        setCurrentChangePercent(data.changePercent);
      } catch (error) {
        console.error('Error updating stock price:', error);
      }
    }, 40000);

    return () => clearInterval(interval);
  }, [symbol]);

  const isPositive = currentChangePercent >= 0;

  return (
    <Link href={`/stock/${symbol}`}>
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold">{symbol[0]}</span>
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">
          {price !== undefined
            ? price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
            : 'Carregando...'}
          </p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}