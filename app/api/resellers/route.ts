import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const body = await req.json();
    const { full_name, business_name, phone, email, city, state, partnership_type, message } = body;

    if (!full_name || !business_name || !phone || !city || !state || !partnership_type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await db.prepare(`
      INSERT INTO reseller_leads (full_name, business_name, phone, email, city, state, partnership_type, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `).run(full_name, business_name, phone, email || '', city, state, partnership_type, message || '');

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const leads = await db.prepare('SELECT * FROM reseller_leads ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
