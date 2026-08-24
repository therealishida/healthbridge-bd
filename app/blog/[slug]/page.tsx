import { sql } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogPostContent from '@/components/blog-post-content';

export const revalidate = 60;

export default async function PostPage({ params }: { params: { slug: string } }) {
  let post: { title: string; content: string; slug: string; created_at: string } | null = null;
  try {
    const { rows } = await sql`
      SELECT title, content, slug, created_at
      FROM posts WHERE slug = ${params.slug} AND published = true
      LIMIT 1
    `;
    post = rows[0] ?? null;
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-6 py-28">
      <div className="mx-auto max-w-2xl">
        <Link href="/blog" className="text-xs font-semibold uppercase tracking-wide text-[#5A5A66] hover:text-[#003265]">
          ← All Posts
        </Link>
        <h1 className="mt-6 font-display text-3xl font-medium text-[#003265] md:text-5xl">{post.title}</h1>
        <p className="mt-3 text-xs text-[#5A5A66]">
          {new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        
        {/* Rich Block Renderer & Call to Action (CTA) */}
        <BlogPostContent postSlug={post.slug} rawContent={post.content} />
      </div>
    </main>
  );
}

