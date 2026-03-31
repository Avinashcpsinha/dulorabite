import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { 
      customer_name, customer_phone, customer_email, 
      address, city, state, pincode, payment_method, 
      items, notes 
    } = body;

    if (!customer_name || !customer_phone || !address || !city || !pincode || !items?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const subtotal = items.reduce((s: number, i: any) => s + i.unit_price * i.quantity, 0);
    const delivery_charge = subtotal >= 499 ? 0 : 49;
    const total = subtotal + delivery_charge;
    const order_code = 'DB' + Date.now();

    await db.prepare(`
      INSERT INTO orders (order_code, customer_name, customer_phone, customer_email, address, city, state, pincode, payment_method, subtotal, delivery_charge, total, notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'confirmed')
    `).run(order_code, customer_name, customer_phone, customer_email || '', address, city, state || '', pincode, payment_method, subtotal, delivery_charge, total, notes || '');

    return NextResponse.json({ success: true, order_code }, { status: 201 });
  } catch (error: any) {
    console.error('Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const orders = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
