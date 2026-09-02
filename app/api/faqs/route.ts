import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

const DEFAULT_FAQS = [
  { id: 1, question: "How do I start the treatment process from Bangladesh?", answer: "Submit a free consultation request with your condition and reports. Your coordinator responds within 24–48 hours, and our support line is available 24/7 for urgent queries.", enabled: true, sort_order: 0 },
  { id: 2, question: "Do I need a visa to travel to Thailand for treatment?", answer: "Yes, most patients need a medical visa. We assist with the entire process, including the hospital's invitation letter.", enabled: true, sort_order: 1 },
  { id: 3, question: "Can I get a second medical opinion without traveling?", answer: "Yes — upload your reports and a partner doctor provides a written second opinion via telemedicine before you decide to travel.", enabled: true, sort_order: 2 },
  { id: 4, question: "What is included in the cost estimate?", answer: "Estimates typically cover treatment or surgery. Accommodation, transfers and visa assistance are quoted separately as optional add-ons.", enabled: true, sort_order: 3 },
  { id: 5, question: "Is an interpreter available at the hospital?", answer: "Yes — Bengali and English-speaking interpreters are arranged for every consultation and hospital visit.", enabled: true, sort_order: 4 },
];

// Helper to ensure table exists
async function ensureFaqsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS faqs (
      id         SERIAL PRIMARY KEY,
      question   TEXT NOT NULL,
      answer     TEXT NOT NULL,
      enabled    BOOLEAN DEFAULT true,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;
}

// GET /api/faqs — public gets enabled only; admin gets all
export async function GET(req: NextRequest) {
  try {
    await ensureFaqsTable();
    const admin = isAdmin(req);
    const { rows } = admin
      ? await sql`SELECT * FROM faqs ORDER BY sort_order ASC, created_at ASC`
      : await sql`SELECT id, question, answer FROM faqs WHERE enabled = true ORDER BY sort_order ASC, created_at ASC`;

    // If table is newly created and empty, seed defaults
    if (rows.length === 0) {
      for (const f of DEFAULT_FAQS) {
        await sql`
          INSERT INTO faqs (question, answer, enabled, sort_order)
          VALUES (${f.question}, ${f.answer}, ${f.enabled}, ${f.sort_order})
        `;
      }
      return NextResponse.json(admin ? DEFAULT_FAQS : DEFAULT_FAQS.filter(f => f.enabled));
    }

    return NextResponse.json(rows);
  } catch (err) {
    console.error('FAQs fetch error:', err);
    // Fallback to defaults so page is never broken
    return NextResponse.json(DEFAULT_FAQS);
  }
}

// POST /api/faqs — admin only
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await ensureFaqsTable();
    const { question, answer, enabled, sort_order } = await req.json();
    if (!question || !answer) {
      return NextResponse.json({ error: 'question and answer are required' }, { status: 400 });
    }
    const { rows } = await sql`
      INSERT INTO faqs (question, answer, enabled, sort_order)
      VALUES (${question}, ${answer}, ${enabled ?? true}, ${sort_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('FAQ create error:', err);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
