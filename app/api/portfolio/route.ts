// import { db, dbAll, dbGet } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { symbol, shortName } = body;


//   if (!symbol || !shortName) {
//     return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
//   }

//   db.run(
//     `INSERT OR IGNORE INTO portfolio (symbol, shortName) VALUES (?, ?)`,
//     [symbol, shortName],
//     (err) => {
//       if (err) {
//         console.error("Erro ao adicionar portfolio:", err);
//         return NextResponse.json({ error: "Erro ao salvar no banco." }, { status: 500 });
//       }
//     }
//   );

//   return NextResponse.json({ message: "Adicionado ao portfolio!" });
// }

// export async function DELETE(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const symbol = searchParams.get("symbol");

//   if (!symbol) {
//     return NextResponse.json({ error: "Símbolo não fornecido." }, { status: 400 });
//   }

//   db.run(`DELETE FROM portfolio WHERE symbol = ?`, [symbol], (err) => {
//     if (err) {
//       console.error("Erro ao remover favorito:", err);
//       return NextResponse.json({ error: "Erro ao deletar no banco." }, { status: 500 });
//     }
//   });

//   return NextResponse.json({ message: "Removido do portfolio!" });
// }

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const symbol = searchParams.get('symbol');

//   if (symbol) {
//     const favorite = await dbGet('SELECT * FROM portfolio WHERE symbol = ?', [symbol]);

//     if (favorite) {
//       return NextResponse.json({ isFavorite: true });
//     } else {
//       return NextResponse.json({ isFavorite: false });
//     }
//   } else {
//     const favorites = await dbAll('SELECT * FROM portfolio');
//     return NextResponse.json(favorites);
// }
// } 


import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { portfolio, transactions, watchlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const portfolioData = await db.select().from(portfolio);
    const watchlistData = await db.select().from(watchlist);

    return NextResponse.json({
      portfolio: portfolioData,
      watchlist: watchlistData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { symbol, name, type, assetType, quantity, price, date } = await request.json();
    const total = quantity * price;

    console.log(symbol, name, type, assetType, quantity, price, date)
   
    // Start a transaction
    db.transaction((tx) => {
      // Record the transaction
      const transactionResult = tx.insert(transactions).values({
        symbol,
        name,
        type,
        assetType,
        quantity: Number(quantity),
        price: Number(price),
        total,
        date: new Date(date),
      }).run();

      console.log("Transaction Insert Result:", transactionResult);

      // Update portfolio
      const existingPosition = tx
        .select()
        .from(portfolio)
        .where(eq(portfolio.symbol, symbol))
        .get();

      if (existingPosition) {
        console.log('existingPosition', existingPosition)
        if (type === 'buy') {
          console.log('buy', type)
          const newQuantity = existingPosition.quantity + Number(quantity);
          const newAveragePrice = 
            ((existingPosition.quantity * existingPosition.averagePrice) + total) / newQuantity;

            const updateResult = tx
              .update(portfolio)
              .set({
                quantity: newQuantity,
                averagePrice: newAveragePrice,
                currentPrice: price,
                lastUpdate: new Date(),
              })
              .where(eq(portfolio.symbol, symbol))
              .run();

              console.log("Portfolio Update Result:", updateResult);
        } else {
          console.log('else', type)
          const newQuantity = existingPosition.quantity - Number(quantity);
          if (newQuantity <= 0) {
            const deleteResult =  tx.delete(portfolio).where(eq(portfolio.symbol, symbol));
            console.log("Portfolio Delete Result:", deleteResult);
          } else {
            const updateResult = tx
              .update(portfolio)
              .set({
                quantity: newQuantity,
                currentPrice: price,
                lastUpdate: new Date(),
              })
              .where(eq(portfolio.symbol, symbol))
              .run();

              console.log("Portfolio Update Result (sell):", updateResult);
          }
        }
      } else if (type === 'buy') {
        console.log('else if', type)
        const portfolioInsertResult = tx.insert(portfolio).values({
          symbol,
          name,
          assetType,
          quantity: Number(quantity),
          averagePrice: price,
          currentPrice: price,
          lastUpdate: new Date(),
        }).run();

        console.log("Portfolio Insert Result:", portfolioInsertResult);
      }

    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}