import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const product = await db.prepare('SELECT * FROM products WHERE id = $1').get(params.id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { name, category, price, original_price, weight, description, badge, active, stock } = body;

    await db.prepare(`
      UPDATE products 
      SET name = $1, category = $2, price = $3, original_price = $4, 
          weight = $5, description = $6, badge = $7, active = $8, stock = $9
      WHERE id = $10
    `).run(name, category, price, original_price, weight, description, badge, active, stock, params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    await db.prepare('DELETE FROM products WHERE id = $1').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
