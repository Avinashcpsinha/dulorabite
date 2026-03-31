import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const totalOrders = (db.prepare('SELECT COUNT(*) as c FROM orders').get() as any).c;
    const totalRevenue = (db.prepare("SELECT COALESCE(SUM(total),0) as r FROM orders WHERE status != 'cancelled'").get() as any).r;
    const activeProducts = (db.prepare('SELECT COUNT(*) as c FROM products WHERE active = 1').get() as any).c;
    const resellerLeads = (db.prepare('SELECT COUNT(*) as c FROM reseller_leads').get() as any).c;
    const newLeads = (db.prepare("SELECT COUNT(*) as c FROM reseller_leads WHERE status = 'new'").get() as any).c;
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all();

    return NextResponse.json({
      success: true,
      data: { totalOrders, totalRevenue, activeProducts, resellerLeads, newLeads, recentOrders }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
