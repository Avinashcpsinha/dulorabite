import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(params.id);
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const body = await req.json();
    const { name, category, price, original_price, weight, description, badge, image, active, stock } = body;

    db.prepare(`
      UPDATE products
      SET name=?, category=?, price=?, original_price=?, weight=?, description=?, badge=?, image=?, active=?, stock=?
      WHERE id=?
    `).run(name, category, price, original_price ?? null, weight, description ?? '', badge ?? '', image, active ?? 1, stock ?? 100, params.id);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(params.id);
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    db.prepare('DELETE FROM products WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
