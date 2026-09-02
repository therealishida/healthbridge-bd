"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/brandassets/logo-cropped.png";

type Service = {
  title: string;
  slug: string;
};

const DEFAULT_SERVICES: Service[] = [
  { title: "Doctor Appointments", slug: "doctor-appointments" },
  { title: "Second Medical Opinion", slug: "second-medical-opinion" },
  { title: "Telemedicine", slug: "telemedicine" },
  { title: "Medical Visa Assistance", slug: "medical-visa-assistance" },
  { title: "Hotel & Accommodation", slug: "hotel-accommodation" },
  { title: "Air Ambulance", slug: "air-ambulance" },
];

export default function Footer() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data.map((s: any) => ({ title: s.title, slug: s.slug ?? "" })));
        }
      })
      .catch(() => {
        // Keeps defaults
      });
  }, []);

  return (
    <footer className="border-t border-line/60 bg-bg pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">

        {/* Logo & Company Info */}
        <div className="md:col-span-4 lg:col-span-3">
          <Link href="/">
            <Image
              src={logoImg}
              alt="HealthBridge logo"
              height={80}
              className="h-20 w-auto mb-6"
            />
          </Link>
          <p className="text-sm text-ink-muted leading-relaxed">
            HealthBridge connects patients from Bangladesh with world-class medical facilities.
          </p>
          <p className="mt-4 text-xs font-semibold text-primary uppercase tracking-wider">
            A subsidiary of TradeAxis Global Ventures
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col sm:flex-row gap-10">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              <li><Link href="/#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#hospitals" className="hover:text-primary transition-colors">Hospitals</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">Services</h4>
            <ul className="space-y-3 text-sm text-ink-muted">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-primary transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Office Location & Map */}
        <div className="md:col-span-4 lg:col-span-5">
          <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-widest">Office Location</h4>
          <p className="text-sm text-ink-muted mb-2">
            1/1 Pioneer Road, Kakrail (Ramna), Dhaka-1000, Bangladesh
          </p>
          <div className="mb-4 flex items-center gap-2 text-sm text-ink">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="text-xs text-ink-muted">Hotline:</span>
            <a
              href="tel:+8801757595881"
              className="font-medium text-primary hover:underline hover:text-accent transition-colors"
            >
              +880 1757-595881
            </a>
          </div>
          <div className="h-48 w-full rounded-xl overflow-hidden border border-line/60">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.310321293947!2d90.40369347592728!3d23.73631088931592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8f309a7036d%3A0x58e11e602541020a!2sYMCA!5e0!3m2!1sen!2sbd!4v1788363132766!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-16 pt-8 border-t border-line/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} HealthBridge by TradeAxis Global Ventures. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
