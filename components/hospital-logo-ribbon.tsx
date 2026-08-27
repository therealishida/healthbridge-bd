"use client";

// Hospital logos — all transparent PNGs served from /public/logos/
const LOGOS = [
  { file: "/logos/bpk9.png",       name: "BPK9 International Hospital" },
  { file: "/logos/gleneagles.png",  name: "Gleneagles Hospital" },
  { file: "/logos/jetanin.png",     name: "Jetanin Hospital" },
  { file: "/logos/chularat.png",    name: "Chularat 3 Hospital" },
  { file: "/logos/praram9.png",     name: "Praram 9 Hospital" },
  { file: "/logos/memorial.png",    name: "Memorial Hospital Group" },
  { file: "/logos/st-stamford.png", name: "St. Stamford Modern Cancer Hospital" },
  { file: "/logos/sukumvit.png",    name: "Sukhumvit Hospital" },
];

// Duplicate for seamless infinite scroll
const DOUBLED = [...LOGOS, ...LOGOS];

export default function HospitalLogoRibbon() {
  return (
    <div className="mt-14">
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        Our partner network
      </p>

      {/* Ribbon container — thicker to fit enlarged logos */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          backgroundImage: "url('/logos/hb-transparent.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(248, 247, 244, 0.92)",
          backgroundBlendMode: "lighten",
        }}
      >
        {/* Subtle tint overlay so logos stand out */}
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-[1px]" />

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-bg/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-bg/90 to-transparent" />

        {/* Scrolling track — py-6 makes ribbon taller */}
        <div className="relative z-10 py-6">
          <div
            className="flex items-center gap-16 will-change-transform"
            style={{ animation: "ribbon-scroll 36s linear infinite" }}
          >
            {DOUBLED.map((logo, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center justify-center"
                title={logo.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.file}
                  alt={logo.name}
                  className="h-16 w-auto max-w-[160px] object-contain opacity-75 transition-all duration-300 hover:opacity-100 grayscale hover:grayscale-0 hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ribbon-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
