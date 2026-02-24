import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required for deletion.' }, { status: 400 });
    }

    await db.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/orders/${params.orderId} error:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete order' }, { status: 500 });
  }
}
