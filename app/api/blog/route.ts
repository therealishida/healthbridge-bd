import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET /api/blog — returns all posts (published only for public, all for admin)
export async function GET(req: NextRequest) {
  try {
    const admin = isAdmin(req);
    const { rows } = admin
      ? await sql`SELECT * FROM posts ORDER BY created_at DESC`
      : await sql`SELECT id, title, slug, created_at FROM posts WHERE published = true ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Blog fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/blog — create a new post (admin only)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, content, published } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug and content are required' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO posts (title, slug, content, published)
      VALUES (${title}, ${slug}, ${content}, ${published ?? false})
      RETURNING *
    `;

    return NextResponse.json(rows[0]);
  } catch (err: any) {
    if (err?.message?.includes('unique')) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.error('Blog create error:', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
