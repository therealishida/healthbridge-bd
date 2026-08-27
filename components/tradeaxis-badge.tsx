"use client";

/**
 * TradeAxisBadge — Fixed floating badge showing the parent company logo.
 * Positioned bottom-right: stays visible regardless of scroll depth,
 * mirrors the natural "powered by" placement used across web products,
 * and keeps the left side clear for future chat/support widgets.
 */
import Image from "next/image";
import tradeAxisLogo from "@/brandassets/TradeAxis Logo Transparent.png";

export default function TradeAxisBadge() {
  return (
    <a
      href="https://www.tradeaxis.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="TradeAxis Global Ventures — parent company"
      className="group fixed bottom-6 right-6 z-50"
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
  );
}
