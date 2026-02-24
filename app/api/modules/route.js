import { NextResponse } from 'next/server';
const { db } = require('@/lib/db');
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Missing courseId' }, { status: 400 });
    }

    const modules = await db.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ success: true, data: modules });
  } catch (error) {
    console.error('GET /api/modules error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch modules' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, title, content, type, order } = body;

    if (!courseId || !title || !content || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const module = await db.module.create({
      data: {
        courseId,
        title,
        content,
        type,
        order: order || 0
      }
    });

    return NextResponse.json({ success: true, data: module });
  } catch (error) {
    console.error('POST /api/modules error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create module' }, { status: 500 });
  }
}
