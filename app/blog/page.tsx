import { sql } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 60; // refresh every minute

export default async function BlogPage() {
  let posts: { id: number; title: string; slug: string; created_at: string }[] = [];
  try {
    const { rows } = await sql`
      SELECT id, title, slug, created_at
      FROM posts WHERE published = true
      ORDER BY created_at DESC
    `;
    posts = rows;
  } catch {
    // DB not set up yet — show empty state
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-medium text-[#003265] md:text-5xl">Insights & Updates</h1>
        <p className="mt-4 text-[#5A5A66]">Expert perspectives on medical travel, healthcare, and patient advocacy.</p>

        {posts.length === 0 ? (
          <p className="mt-16 text-[#5A5A66]">No posts published yet. Check back soon.</p>
        ) : (
          <div className="mt-14 divide-y divide-[#E2E8F0]">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block py-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">
                  {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h2 className="mt-2 font-display text-2xl text-[#003265] transition-opacity group-hover:opacity-70">
                  {p.title}
                </h2>
                <span className="mt-3 inline-block text-sm font-medium text-[#00B02A]">Read →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
