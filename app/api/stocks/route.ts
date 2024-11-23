// import { NextResponse } from 'next/server';
// import yahooFinance from 'yahoo-finance2';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   let symbol = searchParams.get('symbol');

//   if (!symbol) {
//     return NextResponse.json(
//       { error: 'Stock symbol is required' },
//       { status: 400 }
//     );
//   }

//   if (!symbol.endsWith(".SA")) {
//     symbol = `${symbol}.SA`;
//   }

//   try {
//     console.log("symbol:-- ", symbol);
//     const quote = await yahooFinance.quote(symbol);
//     console.log('quote: ', quote);

//     if (!quote) {
//       return NextResponse.json(
//         { error: 'Stock data not found' },
//         { status: 404 }
//       );
//     }

//     // const annualDividend = quote.trailingAnnualDividendRate || 0;
//     // const monthlyDividend = annualDividend / 12;

//     // return NextResponse.json({
//     //   symbol: symbol,
//     //   currentPrice: quote.regularMarketPrice,
//     //   lastDividend: monthlyDividend,
//     //   pvpRatio: quote.priceToBook || 0,
//     // });
//     return NextResponse.json({
//       symbol: symbol,
//       price: quote.regularMarketPrice,
//       dividend: quote.trailingAnnualDividendRate,
//       marketCap: quote.marketCap,
//       pvpRatio: quote.priceToBook || 0,
//     });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : 'Failed to fetch stock data';
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let symbol = searchParams.get("symbol");
  let symbolSa = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Símbolo não fornecido" }, { status: 400 });
  }

  if (!symbol.endsWith(".SA")) {
        symbol = `${symbol}.SA`;
      }

  try {
    // Obter dados históricos (preços e dividendos)
    const historicalData = await yahooFinance.historical(symbol, {
      period1: "2024-08-18", // Data inicial para buscar histórico
      period2: new Date().toISOString().split("T")[0], // Data atual
    // Inclui dividendos no histórico
    });
    const dividendsData = await yahooFinance.historical(symbol, {
      period1: "2024-08-18", // Data inicial para buscar histórico
      period2: new Date().toISOString().split("T")[0], // Data atual
      events: "dividends", // Inclui dividendos no histórico
    });

    // Formatar os dados de preços para o gráfico
    const formattedPriceData = historicalData.map((data) => ({
      time: data.date.toISOString().split("T")[0], // Formata a data no formato YYYY-MM-DD
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
    }));

    // Último dividendo
    const dividends = dividendsData || [];
    const lastDividend = dividends.length ? dividends[dividends.length - 1] : null;

    // Obter dados de cotação atuais
    const quote = await yahooFinance.quote(symbol);


    if (!quote) {
      return NextResponse.json({ error: "Dados não encontrados." }, { status: 404 });
    }

    // Retornar todos os dados necessários
    return NextResponse.json({
      symbol,
      symbolSa: symbolSa,
      price: quote.regularMarketPrice,
      dividend: quote.trailingAnnualDividendRate,
      marketCap: quote.marketCap,
      pvpRatio: quote.priceToBook || 0,
      changePercent: quote.regularMarketChangePercent,
      shortName: quote.shortName,
      marketChange: quote.regularMarketChange,
      historicalData: formattedPriceData, // Dados históricos de preços formatados
      dividends, // Todos os dividendos
      lastDividend: lastDividend ? lastDividend.dividends : null, // Último dividendo
      dividendDate: lastDividend ? lastDividend.date.toISOString().split("T")[0] : null, // Data do último dividendo
    });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json({ error: "Erro ao buscar dados." }, { status: 500 });
  }
}
