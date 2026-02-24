import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth'; // Assuming an auth middleware or utility

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = params;
    const body = await request.json();
    const { name, code, description } = body;

    if (!name || !code) {
      return NextResponse.json({ success: false, error: 'Course name and code are required' }, { status: 400 });
    }

    // Check if a course with the same code or name already exists, excluding the current course
    const existingCourse = await db.course.findFirst({
      where: {
        id: { not: courseId },
        OR: [
          { code: code },
          { name: name }
        ]
      }
    });

    if (existingCourse) {
      return NextResponse.json({ success: false, error: 'Course with this code or name already exists' }, { status: 409 });
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: { name, code, description },
    });

    return NextResponse.json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error(`PUT /api/courses/${params.courseId} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = params;

    await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/courses/${params.courseId} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
  }
}
