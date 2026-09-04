"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./ui/reveal";

type ServiceItem = {
  id?: number;
  title: string;
  slug?: string | null;
  text: string;
  hero_banner_url?: string | null;
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Doctor Appointments",
    slug: "doctor-appointments",
    text: "We schedule the right specialist at the right hospital — no waiting rooms, no guesswork.",
    hero_banner_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Second Medical Opinion",
    slug: "second-medical-opinion",
    text: "An experienced Thai specialist reviews your case before you decide on anything.",
    hero_banner_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Telemedicine",
    slug: "telemedicine",
    text: "Speak with a specialist remotely before you travel, so your plan is clear from day one.",
    hero_banner_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Medical Visa Assistance",
    slug: "medical-visa-assistance",
    text: "Every document, handled — for a smooth, timely visa approval.",
    hero_banner_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Hotel & Accommodation",
    slug: "hotel-accommodation",
    text: "Comfortable stays near your hospital, chosen for recovery needs and budget.",
    hero_banner_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Air Tickets & Airport Pickup",
    slug: "air-tickets-airport-pickup",
    text: "Flights coordinated around treatment, with a welcome when you land.",
    hero_banner_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(
            data.map((s: any) => ({
              id: s.id,
              title: s.title,
              slug: s.slug || null,
              text: s.description || "",
              hero_banner_url: s.hero_banner_url || null,
            }))
          );
        }
      })
      .catch(() => {
        // Fallback to default services on error
      });
  }, []);

  return (
    <section id="services" className="border-t border-line/60 bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            End-to-end medical travel support
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const href = s.slug ? `/services/${s.slug}` : "/#contact";
            const banner = s.hero_banner_url;

            return (
              <Reveal
                key={s.id ?? s.title}
                delay={(i % 3) * 0.08}
                className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-line/60 bg-[#003265] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Background Image: service hero banner */}
                {banner ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner}
                    alt={s.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#003265] to-[#001833]" />
                )}

                {/* Blue Overlay: brand navy with gradient for high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002244]/95 via-[#003265]/80 to-[#003265]/65 transition-colors duration-300 group-hover:via-[#003265]/75" />

                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="font-display text-2xl font-medium text-white transition-colors group-hover:text-emerald-300">
                    <Link href={href} className="hover:underline">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
                    {s.text}
                  </p>
                </div>

                {/* Learn more Action */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00B02A] transition-all duration-200 group-hover:text-emerald-300 group-hover:translate-x-1"
                  >
                    <span>Learn more</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
