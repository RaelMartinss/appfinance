"use client";

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchCommandProps {
  onSelect: (symbol: string) => void;
}

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
}

export function SearchCommand({ onSelect }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const searchAssets = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      console.log('data', data);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchAssets(query);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, searchAssets]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 h-10 px-4 py-2 text-sm text-muted-foreground rounded-md border border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Search assets...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search assets (e.g., PETR4, AAPL, BTC)..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {/* {isLoading && (
            // <CommandLoading>
            //   <div className="flex items-center justify-center p-4">
            //     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            //   </div>
            // </CommandLoading>
          )} */}
          {results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem
                  key={result.symbol}
                  value={result.symbol}
                  onSelect={() => {
                    onSelect(result.symbol);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">{result.symbol[0]}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{result.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {result.symbol} • {result.type}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}