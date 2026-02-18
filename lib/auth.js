import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-production-please');

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function createAdminToken() {
  return createToken({ role: 'admin' });
}

export async function verifyToken() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value || cookieStore.get('admin_token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function verifyAdmin() {
  const payload = await verifyToken();
  return payload?.role === 'admin';
}

export async function checkPassword(password) {
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  return password === adminPass;
}
