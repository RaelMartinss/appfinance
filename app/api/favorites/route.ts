import { db, dbGet, dbAll } from "@/lib/db";
import { NextResponse } from "next/server";

// Função auxiliar para tratar db.run como uma Promise
const dbRun = (query: string, params: any[]) => {
  return new Promise<void>((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export async function POST(req: Request) {
  const body = await req.json();
  console.log('body', body);
  const { symbol, shortName }: { symbol: string; shortName: string } = body;

  console.log('symbol', symbol);

  if (!symbol || !shortName) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  try {
    await dbRun(
      `INSERT OR IGNORE INTO favorites (symbol, shortName) VALUES (?, ?)`,
      [symbol, shortName]
    );
    return NextResponse.json({ message: "Adicionado aos favoritos!" });
  } catch (err) {
    console.error("Erro ao adicionar favorito:", err);
    return NextResponse.json({ error: "Erro ao salvar no banco." }, { status: 500 });
  }
};

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Símbolo não fornecido." }, { status: 400 });
  }

  try {
    await dbRun(`DELETE FROM favorites WHERE symbol = ?`, [symbol]);
    return NextResponse.json({ message: "Removido dos favoritos!" });
  } catch (err) {
    console.error("Erro ao remover favorito:", err);
    return NextResponse.json({ error: "Erro ao deletar no banco." }, { status: 500 });
  }
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol"); // Pega o símbolo enviado na query string
  
  // Garantir que o symbol seja tratado como string, se não, retornar erro
  if (symbol === null) {
    return NextResponse.json({ error: "Símbolo não fornecido." }, { status: 400 });
  }

  try {
    if (symbol) {
      console.log("estou no GET COM symbol");

      // Certificando-se de que symbol é tratado corretamente como string
      const favorite = await dbGet("SELECT * FROM favorites WHERE symbol = ?", [symbol]);

      if (favorite) {
        return NextResponse.json({ isFavorite: true });
      } else {
        return NextResponse.json({ isFavorite: false });
      }
    } else {
      console.log("SEM O SYMBOL");

      // Caso contrário, retorna todos os favoritos
      const favorites = await dbAll("SELECT * FROM favorites");
      console.log("favorites", favorites);
      return NextResponse.json(favorites);
    }
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json({ error: "Erro ao buscar favoritos." }, { status: 500 });
  }
}

