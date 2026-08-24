import Reveal from "./ui/reveal";

export default function About() {
  return (
    <section id="about" className="border-t border-line/60 bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            Your bridge to international healthcare
          </h2>
          <p className="mt-6 max-w-xl text-ink-muted">
            Healthbridge is a premium cross-border healthcare facilitation
            service. We don&apos;t replace doctors or make clinical decisions —
            we handle everything around the treatment, so your family can focus
            on the care itself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
