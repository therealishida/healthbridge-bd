"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import TradeAxisBadge from "@/components/tradeaxis-badge";

type Block =
  | { type: "paragraph"; value: string }
  | { type: "heading"; value: string; level: number }
  | { type: "image"; url: string; caption?: string }
  | { type: "video"; url: string }
  | { type: "list"; items: string[] }
  | { type: "poll"; question: string; options: string[]; votes: number[] };

type TourPackage = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  hero_banner_url: string | null;
  duration: string | null;
  destination: string | null;
  price: string | null;
  page_content: string | null;
};

function BlockRenderer({ block }: { block: Block }) {
  const [voted, setVoted] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>(block.type === "poll" ? block.votes : []);

  if (block.type === "paragraph") {
    return <p className="text-base leading-relaxed text-ink-muted whitespace-pre-wrap">{block.value}</p>;
  }
  if (block.type === "heading") {
    const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
    const sizes: Record<number, string> = { 2: "text-3xl mt-10 mb-4", 3: "text-2xl mt-8 mb-3", 4: "text-xl mt-6 mb-2" };
    return <Tag className={`font-display font-medium text-primary ${sizes[block.level] ?? ""}`}>{block.value}</Tag>;
  }
  if (block.type === "image") {
    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.url} alt={block.caption ?? ""} className="w-full rounded-2xl object-cover" />
        {block.caption && <figcaption className="mt-2 text-center text-xs text-ink-muted">{block.caption}</figcaption>}
      </figure>
    );
  }
  if (block.type === "video") {
    const isYoutube = block.url.includes("youtube.com") || block.url.includes("youtu.be");
    const isVimeo = block.url.includes("vimeo.com");
    return (
      <div className="my-6 overflow-hidden rounded-2xl">
        {isYoutube || isVimeo ? (
          <iframe src={block.url} className="aspect-video w-full" allowFullScreen />
        ) : (
          <video src={block.url} controls className="w-full rounded-2xl" />
        )}
      </div>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="my-4 space-y-2 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-ink-muted">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "poll") {
    const total = votes.reduce((a, b) => a + b, 0);
    return (
      <div className="my-6 rounded-2xl border border-line/60 bg-surface p-6">
        <p className="mb-4 font-semibold text-ink">{block.question}</p>
        <div className="space-y-3">
          {block.options.map((opt, i) => {
            const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
            return (
              <button
                key={i}
                onClick={() => {
                  if (voted !== null) return;
                  setVoted(i);
                  const next = [...votes];
                  next[i]++;
                  setVotes(next);
                }}
                disabled={voted !== null}
                className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  voted === i ? "border-accent bg-accent/5" : "border-line/60 hover:border-primary/40"
                }`}
              >
                {voted !== null && (
                  <span
                    className="absolute inset-y-0 left-0 bg-accent/10 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative flex items-center justify-between">
                  <span>{opt}</span>
                  {voted !== null && <span className="text-xs font-semibold text-primary">{pct}%</span>}
                </span>
              </button>
            );
          })}
        </div>
        {voted !== null && <p className="mt-3 text-xs text-ink-muted">{total} vote{total !== 1 ? "s" : ""} total</p>}
      </div>
    );
  }
  return null;
}

export default function TourPackageDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/tourism-packages/${slug}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setPkg(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const blocks: Block[] = (() => {
    if (!pkg?.page_content) return [];
    try {
      return JSON.parse(pkg.page_content);
    } catch {
      return [];
    }
  })();

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-bg pt-28 md:pt-36 pb-28">
        <article className="mx-auto max-w-3xl px-6">
          <Link
            href="/tourism-packages"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to All Packages
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
            </div>
          ) : notFound || !pkg ? (
            <div className="py-20 text-center">
              <p className="text-xl font-display text-primary">Package not found</p>
              <p className="mt-2 text-sm text-ink-muted">
                This tour package may have been removed or hasn&apos;t been published yet.
              </p>
              <Link href="/tourism-packages" className="mt-6 inline-block text-sm font-semibold text-primary underline">
                Browse all packages
              </Link>
            </div>
          ) : (
            <>
              {/* Page header */}
              <div className="mb-10 border-b border-line/60 pb-8">
                {pkg.hero_banner_url && (
                  <div className="mb-8 overflow-hidden rounded-3xl border border-line/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pkg.hero_banner_url} alt={pkg.title} className="max-h-[420px] w-full object-cover" />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {pkg.destination && (
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      {pkg.destination}
                    </span>
                  )}
                  {pkg.duration && (
                    <span className="rounded-full border border-line/60 bg-surface px-3 py-1 text-xs font-medium text-ink-muted">
                      {pkg.duration}
                    </span>
                  )}
                  {pkg.price && (
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {pkg.price}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-4xl font-medium leading-tight text-primary md:text-5xl">
                  {pkg.title}
                </h1>
                {pkg.description && (
                  <p className="mt-4 text-lg text-ink-muted">{pkg.description}</p>
                )}
              </div>

              {/* Content blocks */}
              {blocks.length > 0 ? (
                <div className="space-y-5">
                  {blocks.map((block, i) => (
                    <BlockRenderer key={i} block={block} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-line/60 bg-surface p-8 text-center text-sm text-ink-muted">
                  Package itinerary and details are being prepared. Contact us below for instant information.
                </p>
              )}

              {/* CTA */}
              <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center sm:p-10">
                <h2 className="font-display text-2xl font-medium text-primary">
                  Interested in this package?
                </h2>
                <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
                  Speak with our coordinators to customize your itinerary, flights, hotel accommodations, and medical appointments.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
                  >
                    Book a Free Consultation
                  </Link>
                  <a
                    href="https://wa.me/8801757595881"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white px-6 py-3 text-sm font-semibold text-[#003265] shadow-sm hover:border-[#003265] transition-colors"
                  >
                    <span>💬</span>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </article>
      </main>

      <Footer />
      <TradeAxisBadge />
    </>
  );
}
