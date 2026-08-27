import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/services — public gets enabled only; admin gets all
export async function GET(req: NextRequest) {
  try {
    const admin = isAdmin(req);
    const { rows } = admin
      ? await sql`SELECT * FROM services ORDER BY sort_order ASC, created_at ASC`
      : await sql`SELECT id, title, description FROM services WHERE enabled = true ORDER BY sort_order ASC, created_at ASC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Services fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/services — admin only
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { title, description, enabled, sort_order } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    const { rows } = await sql`
      INSERT INTO services (title, description, enabled, sort_order)
      VALUES (${title}, ${description ?? null}, ${enabled ?? true}, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Service create error:', err);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
