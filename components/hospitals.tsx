import Reveal from "./ui/reveal";

const hospitals = [
  { tier: "Luxury", name: "Bumrungrad International Hospital", loc: "Sukhumvit, Bangkok", desc: "One of Asia's most recognized hospitals — advanced specialty care, multilingual staff.", tags: ["Cardiology", "Cancer", "Orthopedics"] },
  { tier: "Premium", name: "Samitivej Hospital", loc: "Multiple locations, Bangkok", desc: "A trusted private network known for family care, fertility treatment and personalized service.", tags: ["IVF & Fertility", "Pediatrics", "Cardiology"] },
  { tier: "Premium", name: "Bangkok Hospital", loc: "Bangkok", desc: "Part of Thailand's largest private hospital network — comprehensive specialty and emergency care.", tags: ["Cancer", "Neurology", "Orthopedics"] },
];

export default function Hospitals() {
  return (
    <section id="hospitals" className="border-t border-line/60 bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            Bangkok&apos;s leading private hospitals
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {hospitals.map((h, i) => (
            <Reveal key={h.name} delay={i * 0.1} className="rounded-2xl border border-line/60 bg-surface p-7">
              <span className="mb-4 inline-block rounded-full border border-primary/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                {h.tier}
              </span>
              <h3 className="font-display text-xl text-primary">{h.name}</h3>
              <p className="mt-1 text-xs text-ink-muted">{h.loc}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{h.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {h.tags.map((t) => (
                  <span key={t} className="rounded-md border border-line/60 px-2.5 py-1 text-[11px] text-ink-muted">
                    {t}
                  </span>
                ))}
              </div>
              <a href="#contact" className="mt-6 inline-block text-sm font-semibold text-ink underline decoration-accent underline-offset-4">
                Book appointment
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
