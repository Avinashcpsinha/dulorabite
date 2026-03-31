import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.prepare('SELECT * FROM products ORDER BY category, name').all();
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { name, category, price, original_price, weight, description, badge, image } = body;

    if (!name || !category || !price || !weight || !image) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO products (name, category, price, original_price, weight, description, badge, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `).run(name, category, price, original_price || null, weight, description || '', badge || '', image);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
