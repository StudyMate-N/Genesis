import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production-please');

export async function createAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyAdmin() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, secret);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function checkPassword(password) {
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  return password === adminPass;
}
