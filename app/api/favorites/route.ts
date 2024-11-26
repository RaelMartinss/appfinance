// import { db, dbGet, dbAll } from "@/lib/db";
// import { NextResponse } from "next/server";

// // Função auxiliar para tratar db.run como uma Promise
// const dbRun = (query: string, params: any[]) => {
//   return new Promise<void>((resolve, reject) => {
//     db.run(query, params, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve();
//       }
//     });
//   });
// };

// export async function POST(req: Request) {
//   const body = await req.json();
//   console.log('body', body);
//   const { symbol, shortName }: { symbol: string; shortName: string } = body;

//   console.log('symbol', symbol);

//   if (!symbol || !shortName) {
//     return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
//   }

//   try {
//     await dbRun(
//       `INSERT OR IGNORE INTO favorites (symbol, shortName) VALUES (?, ?)`,
//       [symbol, shortName]
//     );
//     return NextResponse.json({ message: "Adicionado aos favoritos!" });
//   } catch (err) {
//     console.error("Erro ao adicionar favorito:", err);
//     return NextResponse.json({ error: "Erro ao salvar no banco." }, { status: 500 });
//   }
// };

// export async function DELETE(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const symbol = searchParams.get("symbol");

//   if (!symbol) {
//     return NextResponse.json({ error: "Símbolo não fornecido." }, { status: 400 });
//   }

//   try {
//     await dbRun(`DELETE FROM favorites WHERE symbol = ?`, [symbol]);
//     return NextResponse.json({ message: "Removido dos favoritos!" });
//   } catch (err) {
//     console.error("Erro ao remover favorito:", err);
//     return NextResponse.json({ error: "Erro ao deletar no banco." }, { status: 500 });
//   }
// };

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const symbol = searchParams.get("symbol");

//   if (symbol) {
//     const favorite = await dbGet("SELECT * FROM favorites WHERE symbol = ?", [symbol]);

//     if (favorite) {
//       return NextResponse.json({ isFavorite: true });
//     }
//     else {
//       return NextResponse.json({ isFavorite: false });
//     }
//   }
//   else {
//       const favorites = await dbAll('SELECT * FROM favorites');

//       return NextResponse.json(favorites);
//   }
// }



import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { portfolio, transactions, watchlist } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const watchlistData = await db.select().from(watchlist);

    return NextResponse.json({
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
    const { symbol, name} = await request.json();

    console.log(symbol, name)
   
    // Start a transaction
    db.transaction((tx) => {
      // Record the transaction
      const transactionResult = tx.insert(transactions).values({
        symbol,
        name
      }).run();

      console.log("Transaction Insert Result:", transactionResult);

      const watchlistEntry = tx
        .select()
        .from(watchlist)
        .where(eq(watchlist.symbol, symbol))
        .get();


      if (watchlistEntry) {
        console.log('existingPosition', watchlistEntry)
          console.log('Watch Result:');
          if (!watchlistEntry) {
            console.log('Watch Result:', watchlistEntry);
            const watchlistInsertResult = tx.insert(watchlist).values({
              symbol,
              name,
              addedAt: new Date(), // Use a data atual para o registro
            }).run(); // Executa a operação
            console.log("Watchlist Insert Result:", watchlistInsertResult);

          } else {
            console.log(`Symbol ${symbol} já existe na watchlist, ignorando inserção.`);
          }
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