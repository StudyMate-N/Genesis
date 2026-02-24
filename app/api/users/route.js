import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth'; // Assuming an auth middleware or utility

export async function GET(request) {
  try {
    // In a real app, you'd want to add authentication and authorization checks here
    // For example, only allow admins to view all users
    const users = await db.user.findMany({
      include: { profile: true },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, email } = await request.json();

    if (!id || (!name && !email)) {
      return NextResponse.json({ message: "User ID and at least one field (name or email) are required for update." }, { status: 400 });
    }

    // In a real app, you'd want to add authentication and authorization checks here
    // For example, a user can only update their own profile, or an admin can update any user

    const updatedUser = await db.user.update({
      where: { id: id },
      data: {
        name: name,
        email: email,
      },
    });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Error updating user", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "User ID is required for deletion." }, { status: 400 });
    }

    // In a real app, you'd want to add authentication and authorization checks here
    // For example, only admins can delete users

    await db.user.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Error deleting user", error: error.message }, { status: 500 });
  }
}
