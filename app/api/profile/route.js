import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth'; // Assuming an auth middleware or utility

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { 
        profile: true, 
        enrolledCourses: { 
          include: { course: true } 
        }, 
        quizAttempts: true 
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ profile: userWithoutPassword });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ message: "Error fetching user profile", error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required for profile update." }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        email: email,
      },
    });

    return NextResponse.json({ profile: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ message: "Error updating user profile", error: error.message }, { status: 500 });
  }
}
