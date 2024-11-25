"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { StockCard } from '@/components/stock-card';
import { StockData } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Fund {
  id: number;
  symbol: string;
  shortName: string;
}

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [pecentResults, setPecentResults] = useState<StockData[]>([]);
  const [favorites, setFavorites] = useState<Fund[]>([]); 
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      console.log('searchQuery', searchQuery);
      const response = await fetch(`/api/stocks?symbol=${searchQuery.toUpperCase()}`);
      const data = await response.json();
      console.log('MarketPage - data', data);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching stocks:', error);
    }
  };

  useEffect(() => {
    // Função para buscar todos os favoritos
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/favorites');
        const data: Fund[] = await response.json();

        if (Array.isArray(data)) {
          const symbols: string[] = data.map(item => item.symbol);

          const r = await fetch(`/api/stocks?symbol=${symbols.join(',').toUpperCase()}`);
          const d = await r.json();
          setPecentResults(d)

        }
        else {
          console.error('Os dados não são uma tabela.');
        }
        // const symbol: string[] = data.map(item => item.symbol)

        // const r = await fetch(`/api/stocks?symbol=${symbol.toUpperCase()}`);
        // const d = await r.json();

        if (response.ok) {
          setFavorites(data); // Atualiza o estado com os favoritos
        } else {
          console.error('Erro ao buscar favoritos:');
        }
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites(); // Busca os favoritos ao carregar
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Market Overview</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search stocks (e.g., MXRF11)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            className="max-w-md"
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map((stock) => (
              <StockCard
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.shortName}
                price={stock.price !== undefined ? stock.price : 0 }
                change={stock.change}
                changePercent={stock.changePercent}
              />
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="space-y-4">
          {loading ? (
            <p>Loading...</p> // Indicador de carregamento
          ) : favorites.length > 0 ? (
            <div className="space-y-4">
              {favorites.map((favorite) => {
                // Procurar o preço correspondente ao símbolo no searchResults
                const stockData = pecentResults.find(
                  (stock) => stock.symbol === favorite.symbol
                );
                console.log('stockData - pecente', stockData);

                return (
                  <div
                    key={favorite.symbol}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold">{favorite.symbol[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{favorite.shortName}</h3>
                        <p className="text-sm text-muted-foreground">{favorite.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                            {stockData?.price !== undefined ? (
                              stockData.changePercent > 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : stockData.changePercent < 0 ? (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              ) : (
                                <span className="w-4 h-4 text-gray-500" />
                              )
                            ) : (
                              <span className="w-4 h-4 text-gray-500">-</span>
                            )}
                            <span
                              className={`text-sm ${
                                stockData?.changePercent !== undefined && stockData.changePercent > 0
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {stockData?.changePercent !== undefined
                                ? `${stockData.changePercent.toFixed(2)}%`
                                : 'N/A'}
                            </span>
                          </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Your watchlist is empty</p>
          )}
        </TabsContent>



        <TabsContent value="portfolio" className="space-y-4">
          {/* Portfolio content will be populated when implemented */}
          <p className="text-muted-foreground">Your portfolio is empty</p>
        </TabsContent>

        <TabsContent value="gainers" className="space-y-4">
          {/* Top gainers will be populated from API */}
          <p className="text-muted-foreground">Loading top gainers...</p>
        </TabsContent>

        <TabsContent value="losers" className="space-y-4">
          {/* Top losers will be populated from API */}
          <p className="text-muted-foreground">Loading top losers...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
