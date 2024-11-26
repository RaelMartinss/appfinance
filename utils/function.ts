import { QuoteResult } from '@/lib/types'

export function isQuoteResult(quote: any): quote is QuoteResult {
  return typeof quote.symbol === 'string';
}

export function getAssetType(symbol: string): string {
  if (symbol.endsWith('.SA')) {
    return symbol.includes('11') ? 'REIT' : 'Brazilian Stock';
  }
  if (symbol.endsWith('-USD')) {
    return 'Cryptocurrency';
  }
  return 'International Stock';
}