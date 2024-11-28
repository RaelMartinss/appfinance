import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.warn('No token found in cookies');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // const res = await fetch(`${request.nextUrl.origin}/api/role`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if (!res.ok) {
  //   console.warn('Failed to fetch user data from API:', res.status);
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // try {
  //   const data = await res.json();
  //   console.log('User data:', data);
  // } catch (error) {
  //   console.error('Error parsing JSON response:', error);
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Permite continuar para a rota protegida
  return NextResponse.next();
}
export const config = {
  matcher: ['/dashboard/:path*'],
};

// export const config = {
//   matcher: [
//     /*
//      * Define as rotas protegidas, exceto as públicas:
//      * - _next/static (arquivos estáticos)
//      * - _next/image (otimização de imagens)
//      * - favicon.ico (ícone do navegador)
//      * - Rotas públicas específicas, como /login e /register
//      */
//     '/((?!_next/static|_next/image|favicon.ico|public|login|register).*)',
//   ],
// };
