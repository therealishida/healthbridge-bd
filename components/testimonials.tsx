"use client";

import { useEffect, useState } from "react";
import Reveal from "./ui/reveal";

type Testimonial = {
  id: number;
  quote: string;
  name: string;
  location: string;
};

export default function Testimonials() {
  const [visible, setVisible] = useState(true);
  const [quotes, setQuotes] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Check section visibility setting
        const settRes = await fetch("/api/settings?key=testimonials_visible");
        const settData = await settRes.json();
        if (settData.value === "false") {
          setVisible(false);
          setLoaded(true);
          return;
        }
        // Fetch testimonial entries
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setQuotes(Array.isArray(data) ? data : []);
      } catch {
        // Silently fall back to hidden on error
        setQuotes([]);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  // Don't render until loaded (avoid flash)
  if (!loaded) return null;
  // Section toggled off by admin
  if (!visible) return null;
  // No entries yet
  if (quotes.length === 0) return null;

  return (
    <section id="stories" className="border-t border-line/60 bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            What our patients say
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <Reveal key={q.id} delay={(i % 2) * 0.1} className="rounded-2xl border border-line/60 bg-bg p-8">
              <p className="font-display text-lg italic leading-relaxed text-ink">&ldquo;{q.quote}&rdquo;</p>
              <div className="mt-6 text-sm">
                <div className="font-semibold text-primary">{q.name}</div>
                <div className="text-ink-muted">{q.location}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
