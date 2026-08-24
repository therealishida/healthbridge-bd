import Reveal from "./ui/reveal";

const quotes = [
  { text: "The coordination from Dhaka to Bangkok was seamless. My father received excellent cardiac care, and the team handled every detail.", name: "Rahim Uddin", loc: "Bangladesh · Bumrungrad International Hospital" },
  { text: "Second opinion service saved us from an unnecessary surgery back home. The doctors were thorough and explained everything clearly.", name: "Fatema Begum", loc: "Bangladesh · Samitivej Hospital" },
  { text: "Professional service throughout my knee replacement journey. Recovery support after discharge was better than I expected.", name: "John Carter", loc: "United Kingdom · Bangkok Hospital" },
  { text: "We came for IVF treatment and the entire process, medical and non-medical, was handled with care.", name: "Nasrin Akter", loc: "Bangladesh · Bumrungrad International Hospital" },
];

export default function Testimonials() {
  return (
    <section id="stories" className="border-t border-line/60 bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Patient Stories
          </p>
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-ink md:text-5xl">
            What our patients say
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={(i % 2) * 0.1} className="rounded-2xl border border-line/60 bg-bg p-8">
              <p className="font-display text-lg italic leading-relaxed text-ink">&ldquo;{q.text}&rdquo;</p>
              <div className="mt-6 text-sm">
                <div className="font-semibold text-ink">{q.name}</div>
                <div className="text-ink-muted">{q.loc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
