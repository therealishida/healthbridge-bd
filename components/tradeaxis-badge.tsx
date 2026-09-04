"use client";

/**
 * TradeAxisBadge — Fixed floating widget positioned at bottom-right:
 * 1. WhatsApp Hotline button to start a conversation with +880 1757-595881
 * 2. Parent company badge linking to TradeAxis Global Ventures
 */
import Image from "next/image";
import tradeAxisLogo from "@/brandassets/TradeAxis Logo Transparent.png";

export default function TradeAxisBadge() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
      {/* WhatsApp Hotline Quick Action */}
      <a
        href="https://wa.me/8801757595881"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Start WhatsApp conversation with HealthBridge hotline (+880 1757-595881)"
        className="group flex items-center gap-2 rounded-full border border-emerald-400/40 bg-[#25D366] px-3.5 py-2 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-0.5"
      >
        {/* Official WhatsApp SVG icon */}
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0"
        >
          <path d="M20.52 3.48A11.93 11.93 0 0 0 12.07 0C5.45 0 .08 5.37.08 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.23-1.63a11.96 11.96 0 0 0 5.84 1.51h.01c6.62 0 11.99-5.37 11.99-11.99 0-3.21-1.25-6.22-3.55-8.41zm-8.45 18.38h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-3.76.99 1-3.66-.23-.38a9.92 9.92 0 0 1-1.52-5.22C2.13 6.53 6.59 2.07 12.07 2.07c2.65 0 5.15 1.03 7.02 2.91a9.88 9.88 0 0 1 2.92 7.02c0 5.48-4.46 9.86-9.94 9.86zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53-.18-.01-.38-.01-.58-.01-.2 0-.53.07-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.92 1.23 3.12c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
        </svg>
        <span className="text-xs font-semibold tracking-wide">
          +880 1757-595881
        </span>
      </a>

      {/* TradeAxis Parent Company Badge */}
      <a
        href="https://www.tradeaxis.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TradeAxis Global Ventures — parent company"
        className="group block"
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-line/60 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
          {/* Label */}
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-muted">A venture by</p>
          </div>
          {/* Logo */}
          <Image
            src={tradeAxisLogo}
            alt="TradeAxis Global Ventures"
            className="h-8 w-auto max-w-[100px] object-contain"
          />
        </div>
      </a>
    </div>
  );
}
