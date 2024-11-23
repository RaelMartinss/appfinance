import {  db, dbGet, dbAll } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log('body', body);
  const { symbol, shortName } = body;

  console.log('symbol', symbol);

  if (!symbol || !shortName) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  db.run(
    `INSERT OR IGNORE INTO favorites (symbol, shortName) VALUES (?, ?)`,
    [symbol, shortName],
    (err) => {
      if (err) {
        console.error("Erro ao adicionar favorito:", err);
        return NextResponse.json({ error: "Erro ao salvar no banco." }, { status: 500 });
      }
    }
  );

  return NextResponse.json({ message: "Adicionado aos favoritos!" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Símbolo não fornecido." }, { status: 400 });
  }

  db.run(`DELETE FROM favorites WHERE symbol = ?`, [symbol], (err) => {
    if (err) {
      console.error("Erro ao remover favorito:", err);
      return NextResponse.json({ error: "Erro ao deletar no banco." }, { status: 500 });
    }
  });

  return NextResponse.json({ message: "Removido dos favoritos!" });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol'); // Pega o símbolo enviado na query string
  
  try {
    if (symbol) {
      console.log('estou no GET COM symbol');
      // Se um símbolo for informado, busca por ele
      const favorite = await dbGet('SELECT * FROM favorites WHERE symbol = ?', [symbol]);

      if (favorite) {
        return NextResponse.json({ isFavorite: true });
      } else {
        return NextResponse.json({ isFavorite: false });
      }
    } else {
      console.log('SEM O SYMBOL');
      // Caso contrário, retorna todos os favoritos
      const favorites = await dbAll('SELECT * FROM favorites');
      console.log('favorites', favorites);
      return NextResponse.json(favorites);
    }
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return NextResponse.json({ error: 'Erro ao buscar favoritos.' }, { status: 500 });
  }
}