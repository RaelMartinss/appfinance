"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StockData } from "@/lib/types";
import { formatBRLNumber, parseBRLNumber, formatCurrency } from "@/lib/utils";

interface InvestmentCalculatorProps {
  stockData: StockData | null;
}

export function InvestmentCalculator({ stockData }: InvestmentCalculatorProps) {
  const [shares, setShares] = useState<string>("");
  const [investment, setInvestment] = useState<string>("");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");

  const calculateValues = (
    type: "shares" | "investment" | "income",
    value: string
  ) => {
    if (!stockData) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    const monthlyDividend = stockData.lastDividend;
    const sharePrice = stockData.price;

    console.log('sharePrice', sharePrice)
    console.log('monthlyDividend', monthlyDividend)

    switch (type) {
      case "shares":
        setShares(value);
        setInvestment(formatCurrency(numValue * sharePrice));
        setMonthlyIncome(formatCurrency(numValue * monthlyDividend));
        break;
      case "investment":
        const calculatedShares = (numValue / sharePrice).toFixed(0);
        setShares(calculatedShares);
        setInvestment(formatCurrency(numValue));
        setMonthlyIncome(
          formatCurrency(parseInt(calculatedShares) * monthlyDividend)
        );
        break;
      case "income":
        const requiredShares = (numValue / monthlyDividend).toFixed(0);
        setShares(requiredShares);
        setInvestment(formatCurrency(parseInt(requiredShares) * sharePrice));
        setMonthlyIncome(formatCurrency(numValue));
        break;
    }
  };

  useEffect(() => {
    setShares("");
    setInvestment("");
    setMonthlyIncome("");
  }, [stockData]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="shares">Número de Ações</Label>
          <Input
            id="shares"
            placeholder="Enter number of shares"
            value={shares}
            onChange={(e) => calculateValues("shares", e.target.value)}
            type="text"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="investment">Investimento Total (R$)</Label>
          <Input
            id="investment"
            placeholder="Enter investment amount"
            value={investment}
            onChange={(e) => calculateValues("investment", e.target.value.replace(/[^\d.,]/g, ""))}
            type="text"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly-income">Renda Mensal Desejada (R$)</Label>
          <Input
            id="monthly-income"
            placeholder="Enter desired monthly income"
            value={monthlyIncome}
            onChange={(e) => calculateValues("income", e.target.value.replace(/[^\d.,]/g,""))}
            type="text"
          />
        </div>
      </div>

      {!stockData && (
        <p className="text-muted-foreground text-sm text-center">
          Pesquise uma ação para usar a calculadora de investimentos
        </p>
      )}
    </div>
  );
}