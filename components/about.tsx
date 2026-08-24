import Reveal from "./ui/reveal";

const stats = [
  { value: "9", label: "Journey stages, one coordinator" },
  { value: "24/7", label: "Coordinator availability" },
  { value: "2", label: "Languages — Bangla & English" },
];

const pillars = [
  {
    tag: "Our Mission",
    text: "To connect Bangladeshi patients with suitable international healthcare options through responsible hospital coordination, transparent communication, and personalized medical travel assistance.",
  },
  {
    tag: "Our Vision",
    text: "To become Bangladesh's most trusted patient-facilitation platform — connecting families with reputable hospitals across leading medical destinations while upholding professionalism and transparency.",
  },
  {
    tag: "Our Commitment",
    text: "Honest guidance, transparent costs, and a dedicated coordinator standing with every patient — from first contact through full recovery.",
  },
];

export default function About() {
  return (
    <section id="about" className="border-t border-line/60 bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            About HealthBridge
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-medium leading-tight text-ink md:text-5xl">
            Your bridge to international healthcare
          </h2>
          <p className="mt-6 max-w-xl text-ink-muted">
            Healthbridge is a premium cross-border healthcare facilitation service. We don&apos;t replace doctors or make
            clinical decisions — we handle everything around the treatment,
            so your family can focus on the care itself.
          </p>
        </Reveal>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/60 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-surface p-8">
              <div className="font-display text-4xl text-ink md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-ink-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>

        {/* Mission / Vision / Commitment */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal
              key={p.tag}
              delay={i * 0.1}
              className="rounded-2xl border border-line/60 bg-surface p-8 transition-colors hover:border-accent/30"
            >
              <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                {p.tag}
              </span>
              <p className="text-[15px] leading-relaxed text-ink-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
