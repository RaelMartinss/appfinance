import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { formatSymbol } from '@/lib/stock-service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbolParam = searchParams.get("symbol");

  if (!symbolParam) {
    return NextResponse.json({ error: "Símbolos não fornecidos" }, { status: 400 });
  }

  const symbols = symbolParam.split(",").map((symbol) => symbol.trim());

  const processedSymbols = symbols.map((symbol) => {
    const formattedSymbol = formatSymbol(symbol);
    return formattedSymbol;
  });

  try {
   
    const quotes = await yahooFinance.quote(processedSymbols, { return: "map" });
    console.log('PEPE24478', quotes)
    if (!quotes || quotes.size === 0) {
      throw new Error("No data found for the provided symbols.");
    }
    const historicalDataPromises = processedSymbols.map((symbol) =>
      yahooFinance.historical(symbol, {
        period1: "2024-01-01", 
        period2: new Date().toISOString().split("T")[0], 
      })
    );
    const historicalDataResults = await Promise.all(historicalDataPromises);

    const dividendsDataPromises = processedSymbols.map((symbol) =>
      yahooFinance.historical(symbol, {
        period1: "2024-01-01", 
        period2: new Date().toISOString().split("T")[0], 
        events: "dividends",
      })
    );
    const dividendsDataResults = await Promise.all(dividendsDataPromises);

    const formattedPriceData = historicalDataResults.map((historicalData) =>
      historicalData.map((data) => ({
        time: data.date.toISOString().split("T")[0],
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      }))
    );

    // Preparar os dados de retorno para cada símbolo
    const responseData = processedSymbols.map((symbol, index) => {
      const quote = quotes.get(symbol);
      const dividends = dividendsDataResults[index] || [];
      const lastDividend = dividends.length ? dividends[dividends.length - 1] : null;
      return {
        symbol,
        price: quote?.regularMarketPrice ?? 0,
        dividend: quote?.trailingAnnualDividendRate ?? 0,
        marketCap: quote?.marketCap ?? 0,
        pvpRatio: quote?.priceToBook || 0,
        changePercent: quote?.regularMarketChangePercent ?? 0,
        shortName: quote?.shortName ?? 0,
        marketChange: quote?.regularMarketChange,
        historicalData: formattedPriceData[index], // Dados históricos de preços formatados
        dividends, // Todos os dividendos
        lastDividend: lastDividend ? lastDividend.dividends : 0, // Último dividendo
        dividendDate: lastDividend ? lastDividend.date.toISOString().split("T")[0] : null, // Data do último dividendo
      };
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json({ error: "Erro ao buscar dados." }, { status: 500 });
  }
}
