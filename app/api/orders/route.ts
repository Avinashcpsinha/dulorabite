import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id),
    }));
    return NextResponse.json({ success: true, data: ordersWithItems });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
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

    const orderResult = db.prepare(`
      INSERT INTO orders (order_code, customer_name, customer_phone, customer_email, address, city, state, pincode, payment_method, subtotal, delivery_charge, total, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `).run(order_code, customer_name, customer_phone, customer_email || '', address, city, state || '', pincode, payment_method, subtotal, delivery_charge, total, notes || '');

    const orderId = orderResult.lastInsertRowid;
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.product_name, item.quantity, item.unit_price, item.unit_price * item.quantity);
      // Decrement stock
      db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?').run(item.quantity, item.product_id);
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
