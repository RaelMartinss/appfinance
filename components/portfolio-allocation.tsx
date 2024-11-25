"use client";

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioAllocation() {
  const data: ChartData<'pie'> = {
    labels: ['FIIs', 'Stocks', 'Crypto', 'International', 'Fixed Income'],
    datasets: [
      {
        data: [30, 25, 15, 20, 10],
        backgroundColor: [
          'rgb(59, 130, 246)', // blue-500
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
          color: 'currentColor', // This will respect the current text color
        },
      },
      title: {
        display: true,
        text: 'Portfolio Allocation',
        color: 'currentColor', // This will respect the current text color
      },
    },
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-semibold mb-6">Portfolio Allocation</h2>
      <div className="aspect-square">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}