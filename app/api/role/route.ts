import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Conexão com Prisma
import { verifyToken } from '@/lib/auth'; // Função para verificar token

// Handle para requisições GET
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Token not provided' }, { status: 401 });
    }

    // Decodifica e verifica o token JWT
    const payload = verifyToken(token); // Retorna o ID do usuário do token
    const userId = payload.id;

    // Busca o usuário no banco de dados
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /api/role:', error.message);
      return NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      );
    }
  }
}
