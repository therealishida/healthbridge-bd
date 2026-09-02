import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// PUT /api/faqs/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { question, answer, enabled, sort_order } = await req.json();
    const id = parseInt(params.id, 10);
    const { rows } = await sql`
      UPDATE faqs
      SET question = ${question}, answer = ${answer},
          enabled = ${enabled}, sort_order = ${sort_order ?? 0}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('FAQ update error:', err);
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

// DELETE /api/faqs/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = parseInt(params.id, 10);
    await sql`DELETE FROM faqs WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('FAQ delete error:', err);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
