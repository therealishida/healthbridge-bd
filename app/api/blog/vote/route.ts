import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { postSlug, blockIndex, optionIndex } = await req.json();

    if (!postSlug || blockIndex === undefined || optionIndex === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the post
    const { rows } = await sql`
      SELECT id, content FROM posts WHERE slug = ${postSlug} LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = rows[0];
    let blocks = [];
    try {
      blocks = JSON.parse(post.content);
    } catch (e) {
      return NextResponse.json({ error: 'Post content is not in rich format' }, { status: 400 });
    }

    const block = blocks[blockIndex];
    if (!block || block.type !== 'poll') {
      return NextResponse.json({ error: 'Invalid block index or not a poll block' }, { status: 400 });
    }

    // Initialize votes array if not exists or wrong size
    if (!block.votes) {
      block.votes = new Array(block.options.length).fill(0);
    }

    // Increment vote count
    block.votes[optionIndex] = (block.votes[optionIndex] ?? 0) + 1;

    // 2. Update the post content
    const updatedContent = JSON.stringify(blocks);
    await sql`
      UPDATE posts SET content = ${updatedContent}, updated_at = now() WHERE id = ${post.id}
    `;

    return NextResponse.json({ success: true, votes: block.votes });
  } catch (err) {
    console.error('Vote increment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
