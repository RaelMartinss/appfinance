"use client";

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

interface NavigationLinksProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function NavigationLinks({ mobile, onNavigate }: NavigationLinksProps) {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Calculator', href: '/dashboard/calculator', icon: Calculator },
    { name: 'Market Overview', href: '/dashboard/market', icon: Search },
  ];

  const marketLinks = [
    { name: 'Watchlist', href: '/watchlist', icon: Star },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Top Gainers', href: '/gainers', icon: TrendingUp },
    { name: 'Top Losers', href: '/losers', icon: TrendingDown },
  ];

  const handleClick = () => {
    if (mobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className={cn("flex flex-col gap-4", mobile ? "mt-8" : "")}>
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-4">
        <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">Market</h3>
        <div className="space-y-2">
          {marketLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === link.href 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}