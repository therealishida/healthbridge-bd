"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./ui/reveal";

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

export default function TourismPackages() {
  const [packages, setPackages] = useState<TourPackage[]>(DEFAULT_PACKAGES);

  useEffect(() => {
    fetch("/api/tourism-packages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        }
      })
      .catch(() => {
        // Keeps defaults on network/offline
      });
  }, []);

  return (
    <section id="tourism-packages" className="border-t border-line/60 bg-surface/30 py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
                Curated Tourism Packages
              </h2>
              <p className="mt-3 max-w-xl text-ink-muted">
                Combine your medical treatments with seamless travel, comfortable recovery stays, and curated experiences abroad.
              </p>
            </div>

            <Link
              href="/tourism-packages"
              aria-label="View all tourism packages"
              className="group inline-flex h-10 items-center justify-center rounded-full border border-primary/25 bg-surface px-4 py-1 text-sm font-medium text-primary shadow-sm transition-all duration-300 ease-out hover:border-primary hover:bg-primary hover:text-white"
            >
              <span>View all packages</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="ml-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.slice(0, 6).map((pkg, i) => (
            <Reveal key={pkg.id ?? pkg.slug} delay={(i % 3) * 0.1}>
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-line/60 bg-bg p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div>
                  {/* Country / Destination Tag Badge */}
                  <div className="mb-4">
                    <span className="inline-block rounded-full border border-primary/25 bg-surface px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {pkg.destination || "Thailand"}
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.image_url || "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80"}
                      alt={pkg.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 font-display text-xl font-medium text-primary group-hover:text-accent transition-colors">
                    <Link href={`/tourism-packages/${pkg.slug}`}>
                      {pkg.title}
                    </Link>
                  </h3>

                  {/* Duration & Price info */}
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

                {/* Bottom link */}
                <div className="mt-6 pt-2">
                  <Link
                    href={`/tourism-packages/${pkg.slug}`}
                    className="inline-block text-sm font-semibold text-primary border-b border-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    View package details
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
