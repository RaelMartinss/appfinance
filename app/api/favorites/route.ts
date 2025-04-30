import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { symbol, name, userId } = await request.json();

    if (!symbol || !name || !userId) {
      return new Response("Campos obrigatórios estão ausentes.", { status: 400 });
    }

    const existingFavorite = await prisma.favoritos.findFirst({
      where: {
        symbol,
        userId,
      },
    });

    if (existingFavorite) {
      return new Response(
        JSON.stringify({isFavorite: true}), 
        { status: 200 }
      );
    }
    
    const favorite = await prisma.favoritos.create({
      data: {
        symbol,
        name,
        user: {
          connect: { id: userId },
        },
      },
    });

    return new Response(JSON.stringify(favorite), { status: 201 });
  } catch (error) {
    return new Response("Erro interno no servidor.", { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Parâmetro userId é obrigatório" }),
        { status: 400 }
      );
    }

    // Busca os favoritos do usuário
    const favoritos = await prisma.favoritos.findMany({
      where: {
        userId: Number(userId),
      },
    });
    if (favoritos.length === 0) {
      return new Response("Nenhum favorito encontrado", { status: 404 });
    }

    return NextResponse.json(favoritos);
  } catch (error) {
    return new Response("Erro interno ao buscar os favoritos", { status: 500 });
  }
}
