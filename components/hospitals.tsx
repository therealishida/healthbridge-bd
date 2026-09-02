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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/hospitals")
      .then((r) => r.json())
      .then((data) => setHospitals(Array.isArray(data) ? data : []))
      .catch(() => setHospitals([]))
      .finally(() => setLoaded(true));
  }, []);

  // For infinite marquee scrolling, duplicate items
  const marqueeItems = hospitals.length >= 3 ? [...hospitals, ...hospitals] : hospitals;

  return (
    <section id="hospitals" className="border-t border-line/60 bg-bg py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          {/* Header without line breaks and with expanding 'View more' button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
              Our Trusted Partners Abroad
            </h2>

            <a
              href="/hospitals"
              aria-label="View all hospitals"
              className="group inline-flex h-10 items-center justify-center rounded-full border border-primary/25 bg-surface px-3 py-1 text-primary shadow-sm transition-all duration-300 ease-out hover:border-primary hover:bg-primary hover:text-white"
            >
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium opacity-0 transition-all duration-300 ease-out group-hover:mr-2 group-hover:max-w-[80px] group-hover:opacity-100">
                View more
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
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
          <div className="relative mt-16">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-20 bg-gradient-to-r from-bg to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-20 bg-gradient-to-l from-bg to-transparent" />

            {/* Marquee viewport container */}
            <div
              className="overflow-hidden py-4 -my-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <div
                className="flex items-stretch gap-6 will-change-transform"
                style={{
                  animation: hospitals.length >= 3 ? "hospital-scroll 28s linear infinite" : "none",
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              >
                {marqueeItems.map((h, i) => (
                  <article
                    key={`${h.id}-${i}`}
                    className="flex w-[290px] sm:w-[320px] md:w-[calc((100%-48px)/3)] shrink-0 flex-col rounded-2xl border border-line/60 bg-surface p-6 sm:p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Country tag */}
                    <span className="mb-4 inline-block self-start rounded-full border border-primary/30 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {h.country_tag}
                    </span>

                    {/* Hospital image */}
                    {h.image_url ? (
                      <div className="mb-4 overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={h.image_url}
                          alt={h.name}
                          className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-surface-2">
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="text-line">
                          <rect x="4" y="10" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M20 4v12M14 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}

                    <h3 className="font-display text-xl text-primary">{h.name}</h3>
                    <p className="mt-1 text-xs text-ink-muted">{h.location}</p>
                    {h.description && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-3">
                        {h.description}
                      </p>
                    )}

                    {/* Specialty tags */}
                    {h.tags && h.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {h.tags.map((t) => (
                          <span key={t} className="rounded-md border border-line/60 px-2 py-0.5 text-[11px] text-ink-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <a
                      href="/#contact"
                      className="mt-5 inline-block text-sm font-semibold text-ink underline decoration-accent underline-offset-4 transition-opacity hover:opacity-75"
                    >
                      Book appointment
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes hospital-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
