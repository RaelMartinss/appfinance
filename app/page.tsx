"use client";

import { PortfolioAllocation } from '@/components/portfolio-allocation';
import { PortfolioSummary } from '@/components/portfolio-summary';
import { AssetsTable } from '@/components/assets-table';

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Portfolio Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PortfolioAllocation />
        <PortfolioSummary />
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-6">Assets List</h2>
        <AssetsTable />
      </div>
    </div>
  );
}