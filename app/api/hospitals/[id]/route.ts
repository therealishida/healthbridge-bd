import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// PUT /api/hospitals/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { name, location, description, image_url, country_tag, tags, enabled, sort_order } = await req.json();
    const id = parseInt(params.id, 10);
    const tagsArray = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()).filter(Boolean) : []);
    const { rows } = await sql`
      UPDATE hospitals
      SET name = ${name}, location = ${location}, description = ${description ?? null},
          image_url = ${image_url ?? null}, country_tag = ${country_tag},
          tags = ${tagsArray}, enabled = ${enabled}, sort_order = ${sort_order ?? 0}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Hospital update error:', err);
    return NextResponse.json({ error: 'Failed to update hospital' }, { status: 500 });
  }
}

// DELETE /api/hospitals/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = parseInt(params.id, 10);
    await sql`DELETE FROM hospitals WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Hospital delete error:', err);
    return NextResponse.json({ error: 'Failed to delete hospital' }, { status: 500 });
  }
}
