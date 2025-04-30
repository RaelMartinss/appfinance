import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Permite continuar para a rota protegida
  return NextResponse.next();
}
export const config = {
  matcher: [],
};

