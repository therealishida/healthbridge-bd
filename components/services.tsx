"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./ui/reveal";

type ServiceItem = {
  id?: number;
  title: string;
  slug?: string | null;
  text: string;
};

const DEFAULT_SERVICES: ServiceItem[] = [
  { title: "Doctor Appointments", slug: "doctor-appointments", text: "We schedule the right specialist at the right hospital — no waiting rooms, no guesswork." },
  { title: "Second Medical Opinion", slug: "second-medical-opinion", text: "An experienced Thai specialist reviews your case before you decide on anything." },
  { title: "Telemedicine", slug: "telemedicine", text: "Speak with a specialist remotely before you travel, so your plan is clear from day one." },
  { title: "Medical Visa Assistance", slug: "medical-visa-assistance", text: "Every document, handled — for a smooth, timely visa approval." },
  { title: "Hotel & Accommodation", slug: "hotel-accommodation", text: "Comfortable stays near your hospital, chosen for recovery needs and budget." },
  { title: "Air Tickets & Airport Pickup", slug: "air-tickets-airport-pickup", text: "Flights coordinated around treatment, with a welcome when you land." },
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

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/60 md:grid-cols-3">
          {services.map((s, i) => {
            const href = s.slug ? `/services/${s.slug}` : "/#contact";
            return (
              <Reveal key={s.id ?? s.title} delay={(i % 3) * 0.08} className="group flex flex-col justify-between bg-bg p-8 transition-colors hover:bg-surface">
                <div>
                  <h3 className="font-display text-xl text-ink group-hover:text-primary transition-colors">
                    <Link href={href} className="hover:underline">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{s.text}</p>
                </div>
                <div className="mt-6">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-200 group-hover:translate-x-1"
                  >
                    Learn more <span>→</span>
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
