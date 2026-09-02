import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/settings?key=testimonials_visible — public read
export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    if (key) {
      const { rows } = await sql`SELECT value FROM site_settings WHERE key = ${key}`;
      if (rows.length === 0) return NextResponse.json({ value: null });
      return NextResponse.json({ value: rows[0].value });
    }
    // Return all settings for admin
    const { rows } = await sql`SELECT * FROM site_settings ORDER BY key`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Settings fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/settings — admin only, body: { key, value }
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
    }
    await sql`
      INSERT INTO site_settings (key, value) VALUES (${key}, ${String(value)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Settings update error:', err);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
