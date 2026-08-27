import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/hospitals — public gets enabled only; admin gets all
export async function GET(req: NextRequest) {
  try {
    const admin = isAdmin(req);
    const { rows } = admin
      ? await sql`SELECT * FROM hospitals ORDER BY sort_order ASC, created_at DESC`
      : await sql`SELECT * FROM hospitals WHERE enabled = true ORDER BY sort_order ASC, created_at DESC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Hospitals fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

// POST /api/hospitals — admin only
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { name, location, description, image_url, country_tag, tags, enabled, sort_order } = await req.json();
    if (!name || !location || !country_tag) {
      return NextResponse.json({ error: 'name, location and country_tag are required' }, { status: 400 });
    }
    const tagsArray = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()).filter(Boolean) : []);
    const { rows } = await sql`
      INSERT INTO hospitals (name, location, description, image_url, country_tag, tags, enabled, sort_order)
      VALUES (
        ${name}, ${location}, ${description ?? null}, ${image_url ?? null},
        ${country_tag}, ${tagsArray}, ${enabled ?? true}, ${sort_order ?? 0}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Hospital create error:', err);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}
