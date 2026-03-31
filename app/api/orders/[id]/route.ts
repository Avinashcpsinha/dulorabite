import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const { status } = await req.json();
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, params.id);
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(params.id);
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
