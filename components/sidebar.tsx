"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home,
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Briefcase,
  Calculator
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [portfolioValue, setPortfolioValue] = useState("R$ 0,00");

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'Market Overview', href: '/market', icon: Search },
  ];

  return (
    <div className="w-64 bg-card border-r flex flex-col h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Portfolio Value</h2>
        <p className="text-2xl font-bold text-primary">{portfolioValue}</p>
      </div>
      
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === link.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-sm font-medium text-muted-foreground">Market</h3>
          <div className="mt-2 space-y-1">
            <Link
              href="/watchlist"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === '/watchlist' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              <Star className="h-4 w-4" />
              Watchlist
            </Link>
            <Link
              href="/portfolio"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === '/portfolio' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              <Briefcase className="h-4 w-4" />
              Portfolio
            </Link>
            <Link
              href="/gainers"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === '/gainers' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Top Gainers
            </Link>
            <Link
              href="/losers"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === '/losers' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              <TrendingDown className="h-4 w-4" />
              Top Losers
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}