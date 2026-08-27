import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/services/[id] — get single service (public, for service page)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Support lookup by slug (string) or id (number)
    const idOrSlug = params.id;
    const isNumeric = /^\d+$/.test(idOrSlug);
    const { rows } = isNumeric
      ? await sql`SELECT * FROM services WHERE id = ${parseInt(idOrSlug, 10)}`
      : await sql`SELECT * FROM services WHERE slug = ${idOrSlug} AND enabled = true`;
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Service fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// PUT /api/services/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { title, description, enabled, sort_order, page_content, slug } = await req.json();
    const id = parseInt(params.id, 10);
    const { rows } = await sql`
      UPDATE services
      SET title = ${title}, description = ${description ?? null},
          enabled = ${enabled}, sort_order = ${sort_order ?? 0},
          page_content = ${page_content ?? null},
          slug = ${slug ?? null}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Service update error:', err);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE /api/services/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = parseInt(params.id, 10);
    await sql`DELETE FROM services WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Service delete error:', err);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
