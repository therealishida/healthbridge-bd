import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function ensureTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tourism_packages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        image_url TEXT,
        hero_banner_url TEXT,
        duration TEXT,
        destination TEXT DEFAULT 'Thailand',
        price TEXT,
        page_content TEXT,
        enabled BOOLEAN DEFAULT true,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `;
    await sql`ALTER TABLE tourism_packages ADD COLUMN IF NOT EXISTS duration TEXT`;
    await sql`ALTER TABLE tourism_packages ADD COLUMN IF NOT EXISTS destination TEXT DEFAULT 'Thailand'`;
    await sql`ALTER TABLE tourism_packages ADD COLUMN IF NOT EXISTS price TEXT`;
    await sql`ALTER TABLE tourism_packages ADD COLUMN IF NOT EXISTS hero_banner_url TEXT`;
  } catch (e) {
    // If DB is offline or already initialized, ignore
  }
}

// GET /api/tourism-packages — public gets enabled only; admin gets all
export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const admin = isAdmin(req);
    const { rows } = admin
      ? await sql`SELECT * FROM tourism_packages ORDER BY sort_order ASC, created_at DESC`
      : await sql`SELECT id, title, slug, description, image_url, hero_banner_url, duration, destination, price FROM tourism_packages WHERE enabled = true ORDER BY sort_order ASC, created_at DESC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Tourism packages fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch tourism packages' }, { status: 500 });
  }
}

// POST /api/tourism-packages — admin only
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await ensureTable();
    const {
      title,
      slug: customSlug,
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

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(title);

    const { rows } = await sql`
      INSERT INTO tourism_packages (
        title, slug, description, image_url, hero_banner_url, duration, destination, price, page_content, enabled, sort_order
      )
      VALUES (
        ${title},
        ${slug},
        ${description ?? null},
        ${image_url ?? null},
        ${hero_banner_url ?? null},
        ${duration ?? null},
        ${destination ?? 'Thailand'},
        ${price ?? null},
        ${page_content ?? null},
        ${enabled ?? true},
        ${sort_order ?? 0}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (err: any) {
    if (err?.message?.includes('unique') || err?.code === '23505') {
      return NextResponse.json({ error: 'A tour package with this slug or title already exists' }, { status: 409 });
    }
    console.error('Tourism package create error:', err);
    return NextResponse.json({ error: 'Failed to create tourism package' }, { status: 500 });
  }
}
