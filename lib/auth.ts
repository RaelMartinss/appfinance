import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getJwtSecretKey() {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET não está configurado no ambiente de produção.');
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export async function encrypt(payload: any) {
  const secret = await getJwtSecretKey();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  return token;
}

export async function decrypt(token: string): Promise<any> {
  const secret = await getJwtSecretKey();
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    console.warn('Nenhum token encontrado no cookie.');
    return null;
  }

  try {
    const payload = await decrypt(token);
    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      console.warn(`Usuário com ID ${payload.id} não encontrado no banco de dados.`);
    }

    return user;
  } catch (error) {
    console.error('Erro ao autenticar o usuário a partir do token:', error);
    return null;
  }
}

export async function setUserCookie(response: NextResponse, token: string) {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}