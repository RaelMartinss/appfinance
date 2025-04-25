"use client";

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createChart } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { Star, Plus } from 'lucide-react';
import { StockData } from '@/lib/types';
import { toast } from 'sonner';

interface StockPageProps {
  params: {
    symbol: string;
  };
}

export default function StockPage({ params }: StockPageProps) {
  const router = useRouter();
  const [stock, setStock] = useState<StockData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPortfolio, setIsPortfolio] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`/api/stocks?symbol=${params.symbol}`);
        const data = await response.json();
        setStock(data[0]);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 5000);

    return () => clearInterval(interval);
  }, [params.symbol]);

  useLayoutEffect(() => {  

    if (chartContainerRef.current && stock) {
      // Inicialize o gráfico apenas uma vez
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });
      const candlestickSeries = chart.addCandlestickSeries();
      chartRef.current = { chart, candlestickSeries };
  
      return () => {
        chart.remove();
      };
    }
  }, [stock]);
  
  useEffect(() => {
    
    if (chartRef.current && stock?.historicalData) {      
      const { candlestickSeries } = chartRef.current;

      const validData = stock.historicalData
      .filter((data) => data.time && !isNaN(new Date(data.time).getTime())) // Filtrar itens com time válido
      .map((data) => ({
        time: Math.floor(new Date(data.time).getTime() / 1000), // Converte para timestamp
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      }))
      .sort((a, b) => a.time - b.time);


      candlestickSeries.setData(validData);
    }
  }, [stock]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        if(stock){
          const userte = await fetch('/api/auth/user');
          const userId = await userte.json();
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              symbol: stock.symbol,
              name: stock.shortName,
              userId: userId.id,
            }),
          });

          const data = await response.json();
          console.log('data', data.isFavorite);
          console.log('response', response);
    
          if (response.ok) {
            setIsFavorite(data.isFavorite);
          } else {
            console.error('Erro ao buscar status de favorito:', data.error);
          }
        }
        // else {
        //     toast.error("Stock data is null, cannot toggle favorite.");
        //   }  
      } catch (error) {
        console.error('Erro ao buscar status de favorito:', error);
      }
    };
  
    fetchFavoriteStatus();
  }, [stock]);

  useEffect(() => {
    const fetchPortfolioStatus = async () => {
      try {
        const response = await fetch(`/api/portfolio?symbol=${params.symbol}`);
        const data = await response.json();
  
        if (response.ok) {
          setIsPortfolio(data.isFavorite);
        } else {
          console.error('Erro ao buscar status de favorito:', data.error);
        }
      } catch (error) {
        console.error('Erro ao buscar status de favorito:', error);
      }
    };
  
    fetchPortfolioStatus();
  }, [params.symbol]);
  
  
  const toggleFavorite = async () => {
    try {
      console.log('Toggle Favorite', isFavorite);
      if(stock){
        if (isFavorite) {
          await fetch(`/api/favorites?symbol=${stock.symbol}`, {
            method: "DELETE",
          });
          toast.info("Removido dos favoritos!");
        } else {
          const userte = await fetch('/api/auth/user');
          const userId = await userte.json();
          const response = await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symbol: stock.symbol,
              name: stock.shortName,
              userId: userId.id,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update portfolio');
          }

          toast.success("Adicionado aos favoritos!");
        }
        setIsFavorite(!isFavorite);
      } 
      //else {
      //   toast.error("Stock data is null, cannot toggle favorite.");
      // }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  const addToPortfolio = () => {
    if (stock) {
      router.push(`/dashboard/portfolio?symbol=${params.symbol}&price=${stock.price}&name=${encodeURIComponent(stock.shortName)}`);
    }
  };


  if (!stock) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{stock.shortName}</h1>
          <p className="text-xl text-muted-foreground">{stock.symbol}</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={toggleFavorite}
            className={isFavorite ? "text-yellow-500" : ""}
          >
            <Star className="w-4 h-4 mr-2" />
            {isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
          </Button>
          <Button onClick={addToPortfolio}>
            <Plus className="w-4 h-4 mr-2" />
              Add to Portfolio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-muted-foreground">Current Price</p>
          <p className="text-2xl font-bold">
          {stock?.price !== undefined ? 
            stock.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }): 'Carregando...'}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-muted-foreground">Monthly Dividend</p>
          <p className="text-2xl font-bold">
            {stock?.lastDividend.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-muted-foreground">P/VP Ratio</p>
          <p className="text-2xl font-bold">{stock.pvpRatio.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border">
        <div className="flex gap-4 mb-4">
          <Button variant="outline">1D</Button>
          <Button variant="outline">5D</Button>
          <Button variant="outline">1M</Button>
          <Button variant="outline">Line</Button>
          <Button variant="outline">Candles</Button>
        </div>
        <div
          ref={chartContainerRef}
          style={{ width: '100%', height: '400px' }}
          className="chart-container"
        />
      </div>
    </div>
  );
}
