import { db, dbAll, dbGet } from "@/lib/db";
import { PortfolioPosition } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // const body = await req.json();
    // const { symbol, shortName } = body;

    const { symbol, shortName, type, assetType, quantity, price, date } = await request.json();
    const total = quantity * price;

    console.log(symbol, shortName, type, assetType, quantity, price, total, date);

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Insere a transação na tabela `transactions`
      db.run(
        `
      INSERT INTO transactions (symbol, shortName, type, asset_type, quantity, price, total, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [symbol, shortName, type, assetType, Number(quantity), Number(price), total, new Date(date).toISOString()],
        (err) => {
          if (err) {
            console.error('Erro ao inserir transação:', err);
            db.run('ROLLBACK');
            return;
          }
        }
      );

      db.get<PortfolioPosition>(
        `
      SELECT * FROM portfolio WHERE symbol = ?
      `,
        [symbol],
        (err, existingPosition) => {
          if (err) {
            console.error('Erro ao consultar o portfólio:', err);
            db.run('ROLLBACK');
            return;
          }

          if (existingPosition) {
            if (type === 'buy') {
              console.log('buy', type);

              const currentQuantity = Number(existingPosition.quantity || 0);
              const currentAveragePrice = Number(existingPosition.average_price || 0);
              const newQuantity = currentQuantity + Number(quantity);
              const newAveragePrice =
              newQuantity > 0
                ? ((currentQuantity * currentAveragePrice) + total) / newQuantity
                : currentAveragePrice;

              // Atualiza a tabela `portfolio`
              db.run(
                `
              UPDATE portfolio
              SET quantity = ?, average_price  = ?, current_price  = ?, last_update  = ?
              WHERE symbol = ?
              `,
                [newQuantity, newAveragePrice, price, new Date().toISOString(), symbol],
                (err) => {
                  if (err) {
                    console.error('Erro ao atualizar o portfólio:', err);
                    db.run('ROLLBACK');
                    return;
                  }
                  console.log('Portfolio atualizado com sucesso');
                }
              );
            }
          } else {
            // Se não existir, insere uma nova posição (opcional)
            if (type === 'buy') {
              db.run(
                `
              INSERT INTO portfolio (symbol, shortName, asset_type, quantity, average_price, current_price, last_update)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
                [symbol, shortName, assetType, Number(quantity), Number(price), Number(price), new Date().toISOString()],
                (err) => {
                  if (err) {
                    console.error('Erro ao inserir nova posição no portfólio:', err);
                    db.run('ROLLBACK');
                    return;
                  }
                  console.log('Nova posição inserida no portfólio');
                }
              );
            }
          }

          // Finaliza a transação
          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Erro ao finalizar a transação:', err);
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Erro no POST:', error);
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Símbolo não fornecido." }, { status: 400 });
  }

  db.run(`DELETE FROM portfolio WHERE symbol = ?`, [symbol], (err) => {
    if (err) {
      console.error("Erro ao remover favorito:", err);
      return NextResponse.json({ error: "Erro ao deletar no banco." }, { status: 500 });
    }
  });

  return NextResponse.json({ message: "Removido do portfolio!" });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  if (symbol) {
    const favorite = await dbGet('SELECT * FROM portfolio WHERE symbol = ?', [symbol]);

    if (favorite) {
      return NextResponse.json({ isFavorite: true });
    } else {
      return NextResponse.json({ isFavorite: false });
    }
  } else {
    const favorites = await dbAll('SELECT * FROM portfolio');
    return NextResponse.json(favorites);
  }
}


// import { NextResponse } from 'next/server';
// import { db } from '@/lib/db/index';
// import { portfolio, transactions, watchlist } from '@/lib/db/schema';
// import { eq } from 'drizzle-orm';
// import { PortfolioPosition } from "@/lib/types";

// export async function GET() {
//   try {
//     const portfolioData = await db.select().from(portfolio);
//     const watchlistData = await db.select().from(watchlist);

//     return NextResponse.json({
//       portfolio: portfolioData,
//       watchlist: watchlistData,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch portfolio data' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const { symbol, name, type, assetType, quantity, price, date } = await request.json();
//     const total = quantity * price;

//     console.log(symbol, name, type, assetType, quantity, price, date)

//     // Start a transaction
//     db.transaction((tx) => {
//       // Record the transaction
//       const transactionResult = tx.insert(transactions).values({
//         symbol,
//         name,
//         type,
//         assetType,
//         quantity: Number(quantity),
//         price: Number(price),
//         total,
//         date: new Date(date),
//       }).run();

//       console.log("Transaction Insert Result:", transactionResult);

//       // Update portfolio
//       const existingPosition = tx
//         .select()
//         .from(portfolio)
//         .where(eq(portfolio.symbol, symbol))
//         .get();

//       if (existingPosition) {
//         if (type === 'buy') {
//           console.log('buy', type)
//           const newQuantity = existingPosition.quantity + Number(quantity);
//           const newAveragePrice =
//             ((existingPosition.quantity * existingPosition.averagePrice) + total) / newQuantity;

//           const updateResult = tx
//             .update(portfolio)
//             .set({
//               quantity: newQuantity,
//               averagePrice: newAveragePrice,
//               currentPrice: price,
//               lastUpdate: new Date(),
//             })
//             .where(eq(portfolio.symbol, symbol))
//             .run();

//           console.log("Portfolio Update Result:", updateResult);
//         } else {
//           console.log('else', type)
//           const newQuantity = existingPosition.quantity - Number(quantity);
//           if (newQuantity <= 0) {
//             const deleteResult = tx.delete(portfolio).where(eq(portfolio.symbol, symbol));
//             console.log("Portfolio Delete Result:", deleteResult);
//           } else {
//             const updateResult = tx
//               .update(portfolio)
//               .set({
//                 quantity: newQuantity,
//                 currentPrice: price,
//                 lastUpdate: new Date(),
//               })
//               .where(eq(portfolio.symbol, symbol))
//               .run();

//             console.log("Portfolio Update Result (sell):", updateResult);
//           }
//         }
//       } else if (type === 'buy') {
//         console.log('else if', type)
//         const portfolioInsertResult = tx.insert(portfolio).values({
//           symbol,
//           name,
//           assetType,
//           quantity: Number(quantity),
//           averagePrice: price,
//           currentPrice: price,
//           lastUpdate: new Date(),
//         }).run();

//         console.log("Portfolio Insert Result:", portfolioInsertResult);
//       }

//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to update portfolio' },
//       { status: 500 }
//     );
//   }
// }