import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/testimonials — public gets only enabled; admin gets all
export async function GET(req: NextRequest) {
  try {
    const admin = isAdmin(req);
    const { rows } = admin
      ? await sql`SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC`
      : await sql`SELECT * FROM testimonials WHERE enabled = true ORDER BY sort_order ASC, created_at DESC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Testimonials fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST /api/testimonials — admin only
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { quote, name, location, enabled, sort_order } = await req.json();
    if (!quote || !name || !location) {
      return NextResponse.json({ error: 'quote, name and location are required' }, { status: 400 });
    }
    const { rows } = await sql`
      INSERT INTO testimonials (quote, name, location, enabled, sort_order)
      VALUES (${quote}, ${name}, ${location}, ${enabled ?? true}, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Testimonial create error:', err);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
