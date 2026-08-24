"use client";

import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#hospitals", label: "Hospitals" },
  { href: "#stories", label: "Stories" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-line/60 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue to-blue-deep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 17c2-4 5-6 9-6s7 2 9 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 17V9M18 17V9" stroke="#22E06B" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display text-lg tracking-tight text-ink">HealthBridge</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
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

        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="h-px w-6 bg-ink" />
          <span className="h-px w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-line/60 px-6 py-6 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-ink-muted" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
