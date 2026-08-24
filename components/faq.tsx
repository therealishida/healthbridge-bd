import Reveal from "./ui/reveal";

const faqs = [
  { q: "How do I start the treatment process from Bangladesh?", a: "Submit a free consultation request with your condition and reports. Your coordinator responds within 24–48 hours, and our support line is available 24/7 for urgent queries." },
  { q: "Do I need a visa to travel to Thailand for treatment?", a: "Yes, most patients need a medical visa. We assist with the entire process, including the hospital's invitation letter." },
  { q: "Can I get a second medical opinion without traveling?", a: "Yes — upload your reports and a partner doctor provides a written second opinion via telemedicine before you decide to travel." },
  { q: "What is included in the cost estimate?", a: "Estimates typically cover treatment or surgery. Accommodation, transfers and visa assistance are quoted separately as optional add-ons." },
  { q: "Is an interpreter available at the hospital?", a: "Yes — Bengali and English-speaking interpreters are arranged for every consultation and hospital visit." },
];

export default function Faq() {
  return (
    <section id="faq" className="border-t border-line/60 bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-line/60">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ink">
                  {f.q}
                  <span className="ml-6 text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
