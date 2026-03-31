import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('active') !== 'false';

    let query = 'SELECT * FROM products';
    const params: any[] = [];
    const conditions: string[] = [];

    if (activeOnly) conditions.push('active = 1');
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const products = db.prepare(query).all(...params);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const body = await req.json();
    const { name, category, price, original_price, weight, description, badge, image, stock } = body;

    if (!name || !category || !price || !weight || !image) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO products (name, category, price, original_price, weight, description, badge, image, stock, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(name, category, price, original_price || null, weight, description || '', badge || '', image, stock || 100);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
