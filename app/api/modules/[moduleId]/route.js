import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth'; // Assuming an auth middleware or utility

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = params;
    const body = await request.json();
    const { title, content, type, order, courseId } = body;

    if (!title || !content || !type || !courseId) {
      return NextResponse.json({ success: false, error: 'Missing required fields (title, content, type, courseId)' }, { status: 400 });
    }

    const existingModule = await db.module.findUnique({
      where: { id: moduleId },
    });

    if (!existingModule) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }

    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const updatedModule = await db.module.update({
      where: { id: moduleId },
      data: { title, content, type, order: order || 0, courseId },
    });

    return NextResponse.json({ success: true, data: updatedModule });
  } catch (error) {
    console.error(`PUT /api/modules/${params.moduleId} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to update module' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = params;

    await db.module.delete({
      where: { id: moduleId },
    });

    return NextResponse.json({ success: true, message: 'Module deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/modules/${params.moduleId} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete module' }, { status: 500 });
  }
}
