"use client";

import { useState } from "react";
import { Search, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { StockData } from "@/lib/types";
import { fetchStockData } from "@/lib/stock-service";
import { InvestmentCalculator } from "@/components/investment-calculator";
import { TimelineCalculator } from "@/components/investment-timeline";

export function StockAnalyzer() {
  const [stockSymbol, setStockSymbol] = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!stockSymbol) return;

    setLoading(true);
    setError("");

    try {
      console.log("stockSymbol", stockSymbol);
      // const data = await fetchStockData(stockSymbol);
      const response = await fetch(`/api/stocks?symbol=${stockSymbol.toUpperCase()}`);
      console.log('response', response);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados.");
      }
      const data = await response.json();
      console.log('data', data.regularMarketOpen);
      setStockData(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stock data";
      setError(errorMessage);
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && stockSymbol) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="stock-input">Stock Symbol</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="stock-input"
                placeholder="Enter stock symbol (e.g., MXRF11)"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !stockSymbol}
                className="w-24"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {stockData && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Preço atual</span>
              </div>
              <p className="text-2xl font-bold">
              R$ {stockData.price ? stockData.price.toFixed(2) : 'N/A'}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Último Dividendo</span>
              </div>
              <p className="text-2xl font-bold">
              R$ {stockData.lastDividend ? stockData.lastDividend.toFixed(2) : 'N/A'}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Relação P/VP</span>
              </div>
              <p className="text-2xl font-bold">{stockData.pvpRatio.toFixed(2)}</p>
            </div>
          </div>
        )}
      </Card>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="calculator">Calculadora de Investimentos</TabsTrigger>
          <TabsTrigger value="timeline">Simulador de linha do tempo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <Card className="p-6">
            <InvestmentCalculator stockData={stockData} />
          </Card>
        </TabsContent>
        <TabsContent value="timeline">
          <Card className="p-6">
            <TimelineCalculator stockData={stockData} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}