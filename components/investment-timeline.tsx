"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { StockData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface TimelineCalculatorProps {
  stockData: StockData | null;
}

export function TimelineCalculator({ stockData }: TimelineCalculatorProps) {
  const [monthlyInvestmentRaw, setMonthlyInvestmentRaw] = useState<number>(0); // Valor bruto sem formatação
  const [targetIncomeRaw, setTargetIncomeRaw] = useState<number>(0); // Valor bruto sem formatação

  const [timeline, setTimeline] = useState<{
    months: number;
    totalInvestment: number;
    finalShares: number;
  } | null>(null);

  const calculateTimeline = (monthlyInvestment: number, targetIncome: number) => {
    if (!stockData) {
      setTimeline(null);
      return;
    }

    if (monthlyInvestment <= 0 || targetIncome <= 0 || stockData.lastDividend <= 0 || stockData.price <= 0) {
      setTimeline(null);
      return;
    }

    const sharesNeededForIncome = Math.ceil(targetIncome / stockData.lastDividend);
    const sharesPerMonth = Math.floor(monthlyInvestment / stockData.price);

    if (sharesPerMonth <= 0) {
      setTimeline(null);
      return;
    }

    const monthsNeeded = Math.ceil(sharesNeededForIncome / sharesPerMonth);
    const totalInvestment = sharesNeededForIncome * stockData.price;

    setTimeline({
      months: monthsNeeded,
      totalInvestment,
      finalShares: sharesNeededForIncome,
    });
  };

  const handleMonthlyInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const numericValue = parseInt(rawValue, 10) || 0; // Converte para número

    setMonthlyInvestmentRaw(numericValue); // Armazena o valor bruto
    calculateTimeline(numericValue / 100, targetIncomeRaw / 100); // Calcula usando valores não formatados
  };

  const handleTargetIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const numericValue = parseInt(rawValue, 10) || 0; // Converte para número

    setTargetIncomeRaw(numericValue); // Armazena o valor bruto
    calculateTimeline(monthlyInvestmentRaw / 100, numericValue / 100); // Calcula usando valores não formatados
  };

  useEffect(() => {
    setMonthlyInvestmentRaw(0);
    setTargetIncomeRaw(0);
    setTimeline(null);
  }, [stockData]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthly-investment">Investimento Mensal (R$)</Label>
          <Input
            id="monthly-investment"
            placeholder="R$ 0,00"
            value={formatCurrency(monthlyInvestmentRaw / 100)} // Converte o valor bruto para moeda
            onChange={handleMonthlyInvestmentChange}
            type="text"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target-income">Renda Mensal Alvo (R$)</Label>
          <Input
            id="target-income"
            placeholder="R$ 0,00"
            value={formatCurrency(targetIncomeRaw / 100)} // Converte o valor bruto para moeda
            onChange={handleTargetIncomeChange}
            type="text"
          />
        </div>
      </div>

      {timeline && (
        <Card className="p-4 mt-4">
          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground">Tempo para alcançar a meta:</span>
              <p className="text-xl font-semibold">
                {timeline.months} meses ({Math.floor(timeline.months / 12)} anos e {timeline.months % 12} meses)
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Investimento Total Necessário:</span>
              <p className="text-xl font-semibold">{formatCurrency(timeline.totalInvestment)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total de Ações Necessárias:</span>
              <p className="text-xl font-semibold">{timeline.finalShares.toLocaleString()} ações</p>
            </div>
          </div>
        </Card>
      )}

      {!stockData && (
        <p className="text-muted-foreground text-sm text-center">
          Pesquise uma ação para usar a calculadora de tempo
        </p>
      )}
    </div>
  );
}
