import { NextResponse } from 'next/server';
const { db } = require('@/lib/db');
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const results = await db.quizResult.findMany({
      where: { userId: session.id },
      include: {
        module: {
          select: { title: true, course: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('GET /api/quizzes error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, answers, score, total } = body;

    if (!moduleId || answers === undefined || score === undefined || total === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.quizResult.create({
      data: {
        userId: session.id,
        moduleId,
        score: parseFloat(score),
        total: parseInt(total),
        answers: typeof answers === 'string' ? answers : JSON.stringify(answers)
      }
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('POST /api/quizzes error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit quiz result' }, { status: 500 });
  }
}
