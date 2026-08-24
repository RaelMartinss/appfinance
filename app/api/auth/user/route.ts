import { NextResponse, NextRequest } from 'next/server';
import { decrypt, getUserById } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let decodedToken;
  try {
    decodedToken = await decrypt(token);
  } catch {
    const response = NextResponse.json(
      { error: 'Invalid token'},
      {status: 401 }
    );

    response.cookies.delete('token');
    return response
  }

  if (!decodedToken) {
    const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    response.cookies.delete('token');
    return response;
  }

  const userId = Number(decodedToken.id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}

