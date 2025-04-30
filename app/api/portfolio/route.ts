import { PrismaClient, Transaction, Portfolio } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface TransactionRequest {
  symbol: string;
  name: string;
  type: "buy" | "sell";
  assetType: string;
  quantity: number;
  price: number;
  date: string; 
  userId: number
}

export async function POST(request: Request): Promise<Response> {
  try {
    const {
      symbol,
      name,
      type,
      assetType,
      quantity,
      price,
      date,
      userId,
    }: TransactionRequest = await request.json();

    const total = quantity * price;

    // Insere a transação
    const transaction: Transaction = await prisma.transaction.create({
      data: {
        symbol,
        name,
        type,
        assetType,
        quantity,
        price,
        total,
        date: new Date(date), 
        user: {
          connect: { id: userId },
        },
      },
    });

    const existingPosition: Portfolio | null = await prisma.portfolio.findFirst({
      where: {
          symbol,
          userId,
      },
    });
    

    if (existingPosition) {
      console.log("Posição existente encontrada:", existingPosition, type);
      if (type === "buy") {
        const newQuantity = new Decimal(existingPosition.quantity).plus(quantity);
        const newAveragePrice = new Decimal(existingPosition.quantity)
          .times(existingPosition.averagePrice) 
          .plus(total)
          .dividedBy(newQuantity);
      
        // Atualiza o portfólio
        const updatedPortfolio = await prisma.portfolio.update({
          where: { symbol_userId: { symbol, userId } },
          data: {
            quantity: newQuantity.toNumber(), 
            averagePrice: newAveragePrice.toNumber(),
            currentPrice: price,
            lastUpdate: new Date(),
          },
        });
      }else {
        console.log("############### Venda detectada em sell aqui estamos ##############");
        const deletePortfolio = await prisma.portfolio.delete({
          where: { symbol_userId: { symbol, userId } },
        });
      }
    } else {
      // Adiciona uma nova posição no portfólio
      const newPosition: Portfolio = await prisma.portfolio.create({
        data: {
          symbol,
          name,
          assetType,
          quantity,
          averagePrice: price,
          currentPrice: price,
          lastUpdate: new Date(),
          user: {
            connect: { id: userId },
          },
        },
      });
    }

    return new Response(
      JSON.stringify({
          success: "Operação concluída com sucesso"
        }), 
      { status: 200 });
  } catch (err) {
    console.error("Erro:", err);
    return new Response("Erro interno", { status: 500 });
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

    const portfolio = await prisma.portfolio.findMany({
      where: { userId: Number(userId) },
    });
    console.log('Portfolio:____________))))', portfolio);
    return new Response(JSON.stringify(portfolio), { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar o portfólio:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}
