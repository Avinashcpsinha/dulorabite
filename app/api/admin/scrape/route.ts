import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // 1. Extract Shop Name & Meta Info
    let shopName = '';
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const h1Match = html.match(/<h1>(.*?)<\/h1>/i);
    const ogNameMatch = html.match(/<meta property="og:site_name" content="(.*?)"/i);
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/i);
    
    shopName = ogNameMatch?.[1] || ogTitleMatch?.[1] || h1Match?.[1] || titleMatch?.[1] || 'Unknown Shop';
    shopName = shopName.split(/[|:-]/)[0].trim(); // Clean up titles like "My Shop | Welcome"
    shopName = shopName.replace(/<\/?[^>]+(>|$)/g, "").trim();

    // 2. Extract Emails - more precise
    const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
    const emails = Array.from(new Set(html.match(emailRegex) || []))
      .filter(e => !e.toLowerCase().includes('example') && !e.toLowerCase().includes('yourdomain'));

    // 3. Extract Phone/Mobile Numbers - stricter format
    // Matches: +91 9876543210, (123) 456-7890, 0123-456-789, 9876543210
    const phoneRegex = /(?:\+?[\d]{1,4}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
    const allPhones = Array.from(new Set(html.match(phoneRegex) || []));
    
    const phones = allPhones
      .map(p => p.trim())
      .filter(p => {
        const digits = p.replace(/\D/g, '');
        // Usually phones are 10-13 digits. Avoid coordinate-like long chains or very short ones.
        return digits.length >= 10 && digits.length <= 13 && !p.includes('/') && !p.includes('..');
      });

    return NextResponse.json({
      success: true,
      data: {
        shopName,
        emails: emails.slice(0, 10), // Limit results
        phones: phones.slice(0, 10),
        url
      }
    });

  } catch (error: any) {
    console.error('Scrape error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
