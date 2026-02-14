import { NextResponse } from 'next/server';
import api from '@/lib/api';

export async function GET() {
  return NextResponse.json(api.getStatus());
}
