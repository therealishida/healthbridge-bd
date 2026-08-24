import Reveal from "./ui/reveal";

const services = [
  { title: "Doctor Appointments", text: "We schedule the right specialist at the right hospital — no waiting rooms, no guesswork." },
  { title: "Second Medical Opinion", text: "An experienced Thai specialist reviews your case before you decide on anything." },
  { title: "Telemedicine", text: "Speak with a specialist remotely before you travel, so your plan is clear from day one." },
  { title: "Medical Visa Assistance", text: "Every document, handled — for a smooth, timely visa approval." },
  { title: "Hotel & Accommodation", text: "Comfortable stays near your hospital, chosen for recovery needs and budget." },
  { title: "Air Tickets & Airport Pickup", text: "Flights coordinated around treatment, with a welcome when you land." },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-line/60 bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            End-to-end medical travel support
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/60 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08} className="group bg-bg p-8 transition-colors hover:bg-surface">
              <h3 className="font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{s.text}</p>
              <a href="#contact" className="mt-5 inline-block text-sm font-medium text-primary">
                Learn more →
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
