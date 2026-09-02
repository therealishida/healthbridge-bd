"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import TradeAxisBadge from "@/components/tradeaxis-badge";

type Hospital = {
  id: number;
  name: string;
  location: string;
  description: string | null;
  image_url: string | null;
  country_tag: string;
  tags: string[];
};

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState<string>("All");

  useEffect(() => {
    fetch("/api/hospitals")
      .then((r) => r.json())
      .then((data) => setHospitals(Array.isArray(data) ? data : []))
      .catch(() => setHospitals([]))
      .finally(() => setLoading(false));
  }, []);

  const countries = ["All", ...Array.from(new Set(hospitals.map((h) => h.country_tag))).sort()];
  const filtered = activeCountry === "All" ? hospitals : hospitals.filter((h) => h.country_tag === activeCountry);

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-bg pt-28 pb-28">
        <div className="mx-auto max-w-6xl px-6">

          {/* Page heading */}
          <div className="mb-12 border-b border-line/60 pb-10 pt-8">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
            <h1 className="font-display text-4xl font-medium leading-tight text-primary md:text-6xl">
              Our Hospital Network
            </h1>
            <p className="mt-4 max-w-xl text-ink-muted">
              World-class partner hospitals across Asia and beyond — each selected for their clinical excellence, multilingual care, and patient experience.
            </p>
          </div>

          {/* Country filter chips */}
          {countries.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCountry(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeCountry === c
                      ? "bg-primary text-white"
                      : "border border-line/60 text-ink-muted hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-ink-muted">
              {hospitals.length === 0
                ? "No hospitals have been added yet."
                : `No hospitals found for "${activeCountry}".`}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((h) => (
                <article
                  key={h.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line/60 bg-surface transition-shadow hover:shadow-md"
                >
                  {/* Image */}
                  {h.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={h.image_url}
                      alt={h.name}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-surface-2">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-line">
                        <rect x="4" y="10" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M20 4v12M14 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {/* Country tag */}
                    <span className="mb-3 inline-block self-start rounded-full border border-primary/30 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {h.country_tag}
                    </span>

                    <h2 className="font-display text-xl text-primary">{h.name}</h2>
                    <p className="mt-1 text-xs text-ink-muted">{h.location}</p>

                    {h.description && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                        {h.description}
                      </p>
                    )}

                    {/* Specialty tags */}
                    {h.tags && h.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {h.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-line/60 px-2.5 py-0.5 text-[11px] text-ink-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <a
                      href="/#contact"
                      className="mt-5 inline-block text-sm font-semibold text-ink underline decoration-accent underline-offset-4 transition-opacity hover:opacity-70"
                    >
                      Book appointment →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <TradeAxisBadge />
    </>
  );
}
