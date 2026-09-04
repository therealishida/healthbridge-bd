"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import TradeAxisBadge from "@/components/tradeaxis-badge";

type TourPackage = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  destination: string | null;
  duration: string | null;
  price: string | null;
};

const DEFAULT_PACKAGES: TourPackage[] = [
  {
    id: 1,
    title: "Bangkok Executive Health & Wellness",
    slug: "bangkok-executive-health-wellness",
    description: "Combine comprehensive executive health screenings with luxury stay in central Bangkok, private airport transfers, and guided recovery assistance.",
    image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
    destination: "Thailand",
    duration: "4 Days / 3 Nights",
    price: "From $650",
  },
  {
    id: 2,
    title: "Phuket Recuperation & Beach Retreat",
    slug: "phuket-recuperation-beach-retreat",
    description: "Serene post-treatment relaxation on the peaceful coast of Phuket, designed for quiet recuperation and gentle wellness activities.",
    image_url: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
    destination: "Thailand",
    duration: "6 Days / 5 Nights",
    price: "From $890",
  },
  {
    id: 3,
    title: "Chiang Mai Holistic Healing Journey",
    slug: "chiang-mai-holistic-healing-journey",
    description: "Rejuvenate in Northern Thailand with herbal treatments, mindful wellness sessions, and specialized therapeutic care in lush mountain surroundings.",
    image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
    destination: "Thailand",
    duration: "5 Days / 4 Nights",
    price: "From $720",
  },
];

export default function TourismPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [activeDestination, setActiveDestination] = useState<string>("All");

  useEffect(() => {
    fetch("/api/tourism-packages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const destinations = [
    "All",
    ...Array.from(new Set(packages.map((p) => p.destination || "Thailand"))).sort(),
  ];

  const filtered =
    activeDestination === "All"
      ? packages
      : packages.filter((p) => (p.destination || "Thailand") === activeDestination);

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
              Tourism Packages
            </h1>
            <p className="mt-4 max-w-xl text-ink-muted">
              Combine your medical care with seamless travel, dedicated hospital coordinators, comfortable recovery accommodations, and memorable destinations.
            </p>
          </div>

          {/* Destination filter chips */}
          {destinations.length > 2 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {destinations.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDestination(d)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeDestination === d
                      ? "bg-primary text-white"
                      : "border border-line/60 text-ink-muted hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* Cards grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-ink-muted">
              No tour packages found for &quot;{activeDestination}&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg) => (
                <article
                  key={pkg.id}
                  className="group flex flex-col justify-between rounded-2xl border border-line/60 bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    {/* Destination Pill */}
                    <div className="mb-4">
                      <span className="inline-block rounded-full border border-primary/25 bg-bg px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {pkg.destination || "Thailand"}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-line/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pkg.image_url || "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80"}
                        alt={pkg.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Title */}
                    <h2 className="mt-5 font-display text-xl font-medium text-primary group-hover:text-accent transition-colors">
                      <Link href={`/tourism-packages/${pkg.slug}`}>
                        {pkg.title}
                      </Link>
                    </h2>

                    {/* Details */}
                    {(pkg.duration || pkg.price) && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-ink-muted">
                        {pkg.duration && <span>{pkg.duration}</span>}
                        {pkg.duration && pkg.price && <span>•</span>}
                        {pkg.price && <span className="text-primary font-semibold">{pkg.price}</span>}
                      </div>
                    )}

                    {/* Description */}
                    {pkg.description && (
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted line-clamp-3">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-2">
                    <Link
                      href={`/tourism-packages/${pkg.slug}`}
                      className="inline-block text-sm font-semibold text-primary border-b border-primary hover:border-accent hover:text-accent transition-colors"
                    >
                      View package details
                    </Link>
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
