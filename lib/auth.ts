import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dulorabite_super_secret_2025';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAdminFromRequest(req: NextRequest): any {
  const auth = req.headers.get('authorization');
  const token = auth?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
