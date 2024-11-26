"use client";

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { createChart } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { Star, Plus } from 'lucide-react';
import { StockData } from '@/lib/types';

interface StockPageProps {
  params: {
    symbol: string;
  };
}

export default function StockPage({ params }: StockPageProps) {
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

        console.log('StockPage', data);
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
        const response = await fetch(`/api/favorites?symbol=${params.symbol}`);
        const data = await response.json();
  
        if (response.ok) {
          setIsFavorite(data.isFavorite);
        } else {
          console.error('Erro ao buscar status de favorito:', data.error);
        }
      } catch (error) {
        console.error('Erro ao buscar status de favorito:', error);
      }
    };
  
    fetchFavoriteStatus();
  }, [params.symbol]);

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
      if(stock){
        if (isFavorite) {
          await fetch(`/api/favorites?symbol=${stock.symbol}`, {
            method: "DELETE",
          });
          console.log("Removido dos favoritos!");
        } else {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symbol: stock.symbol,
              shortName: stock.shortName,
            }),
          });
          console.log("Adicionado aos favoritos!");
        }
        setIsFavorite(!isFavorite);
      } else {
        console.error("Stock data is null, cannot toggle favorite.");
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };
  
  const addToPortfolio = async () => {
    try {
      if (stock) {
        if (isPortfolio) {
          await fetch(`/api/portfolio?symbol=${stock.symbol}`, {
            method: "DELETE",
          });
          console.log("Removido do portfólio!");
        }else {
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: stock.symbol,
            shortName: stock.shortName,
          }),
        });
        console.log("Adicionado ao portfólio!");
      }
      setIsPortfolio(!isPortfolio);
      } else {
        console.error("Stock data is null, cannot add to portfolio.");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao portfólio:", error);
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
            {isPortfolio ? "Remove from Portfolio" : "Add to Portfolio +"}
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
