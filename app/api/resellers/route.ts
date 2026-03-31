import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getDb();
    const leads = db.prepare('SELECT * FROM reseller_leads ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();
    const { full_name, business_name, phone, email, city, state, partnership_type, message } = body;

    if (!full_name || !phone || !city || !partnership_type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO reseller_leads (full_name, business_name, phone, email, city, state, partnership_type, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(full_name, business_name || '', phone, email || '', city, state || '', partnership_type, message || '');

    return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
