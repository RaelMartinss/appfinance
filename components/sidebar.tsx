"use client";

import { useState } from 'react';
import { NavigationLinks } from '@/components/navigation-links';

export function Sidebar() {
  const [portfolioValue, setPortfolioValue] = useState("R$ 50.000,00");

  return (
    <div className="hidden lg:flex w-64 bg-card border-r flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Portfolio Value</h2>
        <p className="text-2xl font-bold text-primary">{portfolioValue}</p>
      </div>
      <NavigationLinks />
    </div>
  );
}