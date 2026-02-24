import { NextResponse } from 'next/server';
const { db } = require('@/lib/db');
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const studyPlans = await db.studyPlan.findMany({
      where: { userId: session.id },
      include: {
        course: true,
        modules: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: studyPlans });
  } catch (error) {
    console.error('GET /api/study-plans error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch study plans' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, examDate, title } = body;

    if (!courseId || !examDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch modules for the course to include in the study plan
    const modules = await db.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });

    const studyPlan = await db.studyPlan.create({
      data: {
        userId: session.id,
        courseId,
        title: title || `Study Plan for ${courseId}`,
        startDate: new Date(),
        endDate: new Date(examDate),
        status: 'active',
        modules: {
          connect: modules.map(m => ({ id: m.id }))
        }
      },
      include: {
        course: true,
        modules: true
      }
    });

    return NextResponse.json({ success: true, data: studyPlan });
  } catch (error) {
    console.error('POST /api/study-plans error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate study plan' }, { status: 500 });
  }
}
