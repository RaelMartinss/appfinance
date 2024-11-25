import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const POPULAR_ASSETS = [
  { symbol: 'PETR4.SA', name: 'Petrobras PN', type: 'Brazilian Stock' },
  { symbol: 'VALE3.SA', name: 'Vale ON', type: 'Brazilian Stock' },
  { symbol: 'BBAS3.SA', name: 'Banco do Brasil ON', type: 'Brazilian Stock' },
  { symbol: 'MXRF11.SA', name: 'Maxi Renda FII', type: 'REIT' },
  { symbol: 'HGLG11.SA', name: 'CGHG Logística FII', type: 'REIT' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'International Stock' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'International Stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'International Stock' },
  { symbol: 'BTC-USD', name: 'Bitcoin USD', type: 'Cryptocurrency' },
  { symbol: 'ETH-USD', name: 'Ethereum USD', type: 'Cryptocurrency' },
];

interface formattedResults {
  symbol: string;
  longname: string;
  shortname: string;
  quotes: []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json(POPULAR_ASSETS);
  }

  try {
    // First, filter local popular assets
    const localResults = POPULAR_ASSETS.filter(
      asset => 
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query)
    );

    // If we have enough local results, return them
    if (localResults.length >= 2) {
      return NextResponse.json(localResults);
    }

    // Otherwise, search Yahoo Finance
    const searchResults = await yahooFinance.search(query, {
      quotesCount: 5,
      newsCount: 0,
    });
    console.log('searchResults', searchResults);
    const formattedResults = searchResults.quotes.map(quote => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname || quote.symbol,
      type: getAssetType(quote.symbol),
    }));

    // Combine local and API results, remove duplicates
    const combinedResults = [...localResults, ...formattedResults]
      .filter((value, index, self) => 
        index === self.findIndex((t) => t.symbol === value.symbol)
      )
      .slice(0, 10);

    return NextResponse.json(combinedResults);
  } catch (error) {
    console.error('Search error:', error);
    // If API fails, return at least local results
    return NextResponse.json(
      POPULAR_ASSETS.filter(
        asset => 
          asset.symbol.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query)
      )
    );
  }
}

function getAssetType(symbol: string): string {
  if (symbol.endsWith('.SA')) {
    return symbol.includes('11') ? 'REIT' : 'Brazilian Stock';
  }
  if (symbol.endsWith('-USD')) {
    return 'Cryptocurrency';
  }
  return 'International Stock';
}