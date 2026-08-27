"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logoImg from "@/brandassets/logo-cropped.png";

type Service = { id: number; title: string; description: string | null };

const staticLinks = [
  { href: "#about",   label: "About" },
  { href: "#hospitals", label: "Hospitals" },
  { href: "#stories", label: "Stories" },
  { href: "/blog",    label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch services for dropdown
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleServicesMouseEnter() {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setServicesOpen(true);
  }

  function handleServicesMouseLeave() {
    hoverTimerRef.current = setTimeout(() => setServicesOpen(false), 150);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-line/60 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center">
          <Image
            src={logoImg}
            alt="HealthBridge logo"
            height={40}
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* About */}
          <a href="#about" className="text-sm text-ink-muted transition-colors hover:text-ink">
            About
          </a>

          {/* Services — hover dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleServicesMouseEnter}
            onMouseLeave={handleServicesMouseLeave}
          >
            <a
              href="#services"
              className="flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
              onClick={(e) => { e.preventDefault(); setServicesOpen((v) => !v); }}
            >
              Services
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Dropdown panel */}
            {servicesOpen && services.length > 0 && (
              <div
                className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-xl border border-line/60 bg-surface shadow-lg"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                {/* Arrow */}
                <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-line/60 bg-surface" />
                <div className="p-2">
                  {services.map((s) => (
                    <a
                      key={s.id}
                      href="#services"
                      className="block rounded-lg px-4 py-2.5 transition-colors hover:bg-bg"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="block text-sm font-medium text-ink">{s.title}</span>
                      {s.description && (
                        <span className="mt-0.5 block text-xs text-ink-muted line-clamp-1">
                          {s.description}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Other links */}
          {staticLinks.slice(1).map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden rounded-full border border-accent/40 px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bg md:block"
        >
          Book Consultation
        </a>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="h-px w-6 bg-ink" />
          <span className="h-px w-6 bg-ink" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-line/60 px-6 py-4 md:hidden">
          <a href="#about" className="py-2 text-sm text-ink-muted" onClick={() => setOpen(false)}>About</a>

          {/* Services expandable */}
          <div>
            <button
              className="flex w-full items-center justify-between py-2 text-sm text-ink-muted"
              onClick={() => setMobileServicesOpen((v) => !v)}
            >
              Services
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileServicesOpen && services.length > 0 && (
              <div className="ml-4 mt-1 space-y-1 border-l border-line/60 pl-4">
                {services.map((s) => (
                  <a
                    key={s.id}
                    href="#services"
                    className="block py-1.5 text-sm text-ink-muted"
                    onClick={() => setOpen(false)}
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          {staticLinks.slice(1).map((l) => (
            <a key={l.href} href={l.href} className="py-2 text-sm text-ink-muted" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
