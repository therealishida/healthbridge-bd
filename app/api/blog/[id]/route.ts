import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// PUT /api/blog/[id] — update a post
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, content, published } = await req.json();

    const { rows } = await sql`
      UPDATE posts
      SET title = ${title}, slug = ${slug}, content = ${content},
          published = ${published}, updated_at = now()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Blog update error:', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/blog/[id] — delete a post
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sql`DELETE FROM posts WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Blog delete error:', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
