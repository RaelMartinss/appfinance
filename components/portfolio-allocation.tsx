"use client";

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Portfolio } from '@/lib/types';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioAllocation() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
 
  useEffect(() => {
    const fetchPortfolioHome = async () => {
      try {
        const userte = await fetch('/api/auth/user');
        const userId = await userte.json();
        console.log('userIds', userId);
        const response = await fetch(`/api/portfolio?userId=${userId.id}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar o portfólio: ${response.statusText}`);
        }
        const data = await response.json();

        setPortfolio(data);
      } catch (error) {
        console.error("Erro ao buscar o portfólio:", error);
      }  
    }
    fetchPortfolioHome();
  }, []);

  // Função para mapear os dados do portfolio e calcular a alocação
  const calculateAllocation = () => {
    const allocation = {
      fiis: 0,
      stocks: 0,
      crypto: 0,
      international: 0,
      fixedIncome: 0,
    };
  
    portfolio.forEach((item) => {
      const quantity = item.quantity ?? 0;  // Atribui 0 se quantity for undefined
      const currentPrice = item.currentPrice ?? 0;  // Atribui 0 se currentPrice for undefined
  
      // Agora, usa quantity e currentPrice com a garantia de que não são indefinidos
      if (item.assetType === 'fiis') {
        allocation.fiis += quantity * currentPrice;
      } else if (item.assetType === 'stocks') {
        allocation.stocks += quantity * currentPrice;
      } else if (item.assetType === 'crypto') {
        allocation.crypto += quantity * currentPrice;
      } else if (item.assetType === 'international') {
        allocation.international += quantity * currentPrice;
      } else if (item.assetType === 'fixedIncome') {
        allocation.fixedIncome += quantity * currentPrice;
      }
    });
  
    return allocation;
  };
  

  const allocation = calculateAllocation();

  const dados: ChartData<'pie'> = {
    labels: ['FIIs', 'Stocks', 'Crypto', 'International', 'Fixed Income'],
    datasets: [
      {
        data: [
          allocation.fiis,
          allocation.stocks,
          allocation.crypto,
          allocation.international,
          allocation.fixedIncome,
        ],
        backgroundColor: [
          'rgb(0, 102, 102)', // blue-500
          'rgb(16, 185, 129)', // green-500
          'rgb(168, 85, 247)', // purple-500
          'rgb(249, 115, 22)', // orange-500
          'rgb(236, 72, 153)', // pink-500
        ],
        borderColor: [
          'rgb(255, 255, 255)',
          'rgb(255, 255, 255)',
          'rgb(255, 255, 255)',
          'rgb(255, 255, 255)',
          'rgb(255, 255, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'currentColor',
        },
      },
      title: {
        display: true,
        text: 'Portfolio Allocation',
        color: 'currentColor',
      },
    },
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-semibold mb-6">Portfolio Allocation</h2>
      <div className="aspect-square">
        <Pie data={dados} options={options} />
      </div>
    </div>
  );
}
