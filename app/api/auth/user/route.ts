import { NextResponse, NextRequest } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = await getUserById(decodedToken.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

