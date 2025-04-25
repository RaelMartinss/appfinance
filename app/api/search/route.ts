import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { SearchResults } from '@/lib/types';
import { isQuoteResult, getAssetType } from '@/utils/function';

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

  { symbol: 'PEPE24478-USD', name: 'Pepe Coin', type: 'Cryptocurrency' },
  { symbol: 'BONK-USD', name: 'Bonk', type: 'Cryptocurrency' },

  { symbol: 'PEPECOIN-USD', name: 'PepeCoin USD', type: 'Cryptocurrency' },
  { symbol: 'PEPE3027425-USD', name: 'Pepe 3.0 USD', type: 'Cryptocurrency' },
];

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
    const searchResults: SearchResults = await yahooFinance.search(query, {
      quotesCount: 5,
      newsCount: 0,
    });

    const formattedResults = searchResults.quotes
    .filter(isQuoteResult)
    .map(quote => ({
      symbol: quote.symbol,
      name:  quote.shortname || quote.longname || quote.symbol,
      type: getAssetType(quote.symbol),
    }));
    // Combine local and API results, remove duplicates
    const combinedResults = [...localResults, ...formattedResults]
      .filter((value, index, self) => 
        index === self.findIndex((t) => t.symbol === value.symbol)
      )
      .slice(0, 10);

      const processedSymbol = combinedResults.filter(result => result.symbol === query);
      console.log(processedSymbol);

      console.log('processedSymbol--', processedSymbol)

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