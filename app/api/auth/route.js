import { NextResponse } from 'next/server';
import { checkPassword, createAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { password } = await req.json();

  if (!await checkPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createAdminToken();
  
  cookies().set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return NextResponse.json({ success: true });
}
