import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/tourism-packages/[id] — get single package by numeric id or slug
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const idOrSlug = params.id;
    const isNumeric = /^\d+$/.test(idOrSlug);
    const { rows } = isNumeric
      ? await sql`SELECT * FROM tourism_packages WHERE id = ${parseInt(idOrSlug, 10)}`
      : await sql`SELECT * FROM tourism_packages WHERE slug = ${idOrSlug} AND enabled = true`;

    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Tourism package fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch tourism package' }, { status: 500 });
  }
}

// PUT /api/tourism-packages/[id] — admin only
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const {
      title,
      slug,
      description,
      image_url,
      hero_banner_url,
      duration,
      destination,
      price,
      page_content,
      enabled,
      sort_order,
    } = await req.json();

    const id = parseInt(params.id, 10);
    const { rows } = await sql`
      UPDATE tourism_packages
      SET title = ${title},
          slug = ${slug ?? null},
          description = ${description ?? null},
          image_url = ${image_url ?? null},
          hero_banner_url = ${hero_banner_url ?? null},
          duration = ${duration ?? null},
          destination = ${destination ?? 'Thailand'},
          price = ${price ?? null},
          page_content = ${page_content ?? null},
          enabled = ${enabled},
          sort_order = ${sort_order ?? 0}
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Tourism package update error:', err);
    return NextResponse.json({ error: 'Failed to update tourism package' }, { status: 500 });
  }
}

// DELETE /api/tourism-packages/[id] — admin only
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = parseInt(params.id, 10);
    await sql`DELETE FROM tourism_packages WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Tourism package delete error:', err);
    return NextResponse.json({ error: 'Failed to delete tourism package' }, { status: 500 });
  }
}
