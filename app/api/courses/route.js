import { NextResponse } from 'next/server';
const { db } = require('@/lib/db');
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        _count: {
          select: { modules: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, name, description } = body;

    if (!code || !name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const course = await db.course.create({
      data: { code, name, description }
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error('POST /api/courses error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 });
  }
}
