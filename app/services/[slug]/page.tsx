"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import logoImg from "@/brandassets/logo-cropped.png";
import Link from "next/link";

type Block =
  | { type: "paragraph"; value: string }
  | { type: "heading"; value: string; level: number }
  | { type: "image"; url: string; caption?: string }
  | { type: "video"; url: string }
  | { type: "list"; items: string[] }
  | { type: "poll"; question: string; options: string[]; votes: number[] };

type Service = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  page_content: string | null;
  hero_banner_url: string | null;
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
        {(isYoutube || isVimeo) ? (
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
                className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm transition-colors ${voted === i ? "border-accent bg-accent/5" : "border-line/60 hover:border-primary/40"}`}
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

export default function ServicePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/services/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setService(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const blocks: Block[] = (() => {
    if (!service?.page_content) return [];
    try { return JSON.parse(service.page_content); } catch { return []; }
  })();

  return (
    <>
      {/* Minimal nav header */}
      <header className="border-b border-line/60 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Image src={logoImg} alt="HealthBridge" height={36} className="h-9 w-auto" />
          </Link>
          <Link href="/#contact" className="rounded-full border border-accent/40 px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg">
            Book Consultation
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-bg pb-28 pt-12">
        <article className="mx-auto max-w-3xl px-6">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
            </div>
          ) : notFound || !service ? (
            <div className="py-20 text-center">
              <p className="text-xl font-display text-primary">Service not found</p>
              <p className="mt-2 text-sm text-ink-muted">This service page may not exist or hasn&apos;t been published yet.</p>
              <Link href="/" className="mt-6 inline-block text-sm font-semibold text-primary underline">Go home</Link>
            </div>
          ) : (
            <>
              {/* Page header */}
              <div className="mb-10 border-b border-line/60 pb-8">
                {service.hero_banner_url && (
                  <div className="mb-8 overflow-hidden rounded-3xl border border-line/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.hero_banner_url} alt={service.title} className="max-h-[400px] w-full object-cover" />
                  </div>
                )}
                <h1 className="font-display text-4xl font-medium leading-tight text-primary md:text-5xl">
                  {service.title}
                </h1>
                {service.description && (
                  <p className="mt-4 text-lg text-ink-muted">{service.description}</p>
                )}
              </div>

              {/* Content blocks */}
              {blocks.length > 0 ? (
                <div className="space-y-5">
                  {blocks.map((block, i) => <BlockRenderer key={i} block={block} />)}
                </div>
              ) : (
                <p className="rounded-2xl border border-line/60 bg-surface p-8 text-center text-sm text-ink-muted">
                  This service page is being prepared. Check back soon.
                </p>
              )}

              {/* CTA */}
              <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center">
                <h2 className="font-display text-2xl font-medium text-primary">Interested in this service?</h2>
                <p className="mt-2 text-sm text-ink-muted">Speak with our coordinators and get a personalised care plan.</p>
                <Link href="/#contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5">
                  Book a Free Consultation
                </Link>
              </div>
            </>
          )}
        </article>
      </main>
    </>
  );
}
