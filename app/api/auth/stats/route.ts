import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = await getDb();
    
    // Summary Stats
    const totalOrders = (await db.prepare('SELECT COUNT(*) as c FROM orders').get()).c;
    const totalRevenue = (await db.prepare('SELECT SUM(total) as r FROM orders').get()).r || 0;
    const totalProducts = (await db.prepare('SELECT COUNT(*) as c FROM products').get()).c;
    const totalResellers = (await db.prepare('SELECT COUNT(*) as c FROM reseller_leads').get()).c;

    // Monthly orders trend (last 6 months)
    const trends = await db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM orders
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `).all();

    return NextResponse.json({
      success: true,
      data: { totalOrders, totalRevenue, totalProducts, totalResellers, trends }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
