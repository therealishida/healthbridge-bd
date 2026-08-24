import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/consultations — save a new form submission
export async function POST(req: NextRequest) {
  try {
    const { name, phone, whatsapp, email, condition, message } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await sql`
      INSERT INTO consultations (name, phone, whatsapp, email, condition, message)
      VALUES (${name}, ${phone ?? ''}, ${whatsapp ?? ''}, ${email ?? ''}, ${condition ?? ''}, ${message ?? ''})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Consultation insert error:', err);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}

// GET /api/consultations — list all submissions (admin only)
export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await sql`
      SELECT * FROM consultations ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Consultation fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
