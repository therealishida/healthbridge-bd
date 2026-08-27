"use client";

// Maps logo filenames in /public/logos/ to display names
const LOGOS = [
  { file: "/logos/bnh.png",        name: "BNH Hospital" },
  { file: "/logos/bpk9.png",       name: "BPK9 International Hospital" },
  { file: "/logos/medpark.png",    name: "MedPark Hospital" },
  { file: "/logos/nakornthon.png", name: "Nakornthon Hospital" },
  { file: "/logos/gleneagles.png", name: "Gleneagles Hospital" },
  { file: "/logos/jetanin.png",    name: "Jetanin Hospital" },
  { file: "/logos/chularat.png",   name: "Chularat 3 Hospital" },
  { file: "/logos/praram9.png",    name: "Praram 9 Hospital" },
  { file: "/logos/memorial.png",   name: "Memorial Hospital Group" },
  { file: "/logos/st-stamford.png",name: "St. Stamford Modern Cancer Hospital" },
];

// Duplicate for seamless infinite scroll
const DOUBLED = [...LOGOS, ...LOGOS];

export default function HospitalLogoRibbon() {
  return (
    <div className="mt-14 overflow-hidden">
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        Our partner network
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-bg to-transparent" />

        {/* Scrolling track */}
        <div
          className="flex gap-10 will-change-transform"
          style={{ animation: "ribbon-scroll 32s linear infinite" }}
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
                className="h-10 w-auto max-w-[120px] object-contain opacity-70 transition-opacity hover:opacity-100 grayscale hover:grayscale-0"
                onError={(e) => {
                  // Hide broken images (before logos are processed)
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}
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
