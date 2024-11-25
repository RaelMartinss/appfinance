import { db, dbAll, dbGet } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { symbol, shortName } = body;


  if (!symbol || !shortName) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  db.run(
    `INSERT OR IGNORE INTO portfolio (symbol, shortName) VALUES (?, ?)`,
    [symbol, shortName],
    (err) => {
      if (err) {
        console.error("Erro ao adicionar portfolio:", err);
        return NextResponse.json({ error: "Erro ao salvar no banco." }, { status: 500 });
      }
    }
  );

  return NextResponse.json({ message: "Adicionado ao portfolio!" });
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
