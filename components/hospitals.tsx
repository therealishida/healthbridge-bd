"use client";

import { useEffect, useState } from "react";
import Reveal from "./ui/reveal";

type Hospital = {
  id: number;
  name: string;
  location: string;
  description: string;
  image_url: string | null;
  country_tag: string;
  tags: string[];
  enabled: boolean;
};

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/hospitals")
      .then((r) => r.json())
      .then((data) => setHospitals(Array.isArray(data) ? data : []))
      .catch(() => setHospitals([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section id="hospitals" className="border-t border-line/60 bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          {/* Header with chevron link to /hospitals page */}
          <div className="flex items-center gap-4">
            <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
              Our Trusted Partners Abroad
            </h2>
            <a
              href="/hospitals"
              aria-label="View all hospitals"
              className="group mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-all hover:border-primary hover:bg-primary hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>

        {/* Hospital cards */}
        {!loaded ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary" />
          </div>
        ) : hospitals.length === 0 ? (
          <p className="mt-16 text-sm text-ink-muted">
            No hospitals listed yet. Add them via the admin dashboard.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {hospitals.map((h, i) => (
              <Reveal key={h.id} delay={i * 0.1} className="rounded-2xl border border-line/60 bg-surface p-7">
                {/* Country tag */}
                <span className="mb-4 inline-block rounded-full border border-primary/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {h.country_tag}
                </span>

                {/* Hospital image */}
                {h.image_url && (
                  <div className="mb-4 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={h.image_url}
                      alt={h.name}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                <h3 className="font-display text-xl text-primary">{h.name}</h3>
                <p className="mt-1 text-xs text-ink-muted">{h.location}</p>
                {h.description && (
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{h.description}</p>
                )}

                {/* Specialty tags */}
                {h.tags && h.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {h.tags.map((t) => (
                      <span key={t} className="rounded-md border border-line/60 px-2.5 py-1 text-[11px] text-ink-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <a href="#contact" className="mt-6 inline-block text-sm font-semibold text-ink underline decoration-accent underline-offset-4">
                  Book appointment
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
