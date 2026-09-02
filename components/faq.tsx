"use client";

import { useEffect, useState } from "react";
import Reveal from "./ui/reveal";

type FAQ = {
  id?: number;
  question: string;
  answer: string;
};

const DEFAULT_FAQS: FAQ[] = [
  { question: "How do I start the treatment process from Bangladesh?", answer: "Submit a free consultation request with your condition and reports. Your coordinator responds within 24–48 hours, and our support line is available 24/7 for urgent queries." },
  { question: "Do I need a visa to travel to Thailand for treatment?", answer: "Yes, most patients need a medical visa. We assist with the entire process, including the hospital's invitation letter." },
  { question: "Can I get a second medical opinion without traveling?", answer: "Yes — upload your reports and a partner doctor provides a written second opinion via telemedicine before you decide to travel." },
  { question: "What is included in the cost estimate?", answer: "Estimates typically cover treatment or surgery. Accommodation, transfers and visa assistance are quoted separately as optional add-ons." },
  { question: "Is an interpreter available at the hospital?", answer: "Yes — Bengali and English-speaking interpreters are arranged for every consultation and hospital visit." },
];

export default function Faq() {
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch(() => {
        // Keeps default FAQs on error
      });
  }, []);

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
            <Reveal key={f.id ?? f.question} delay={i * 0.05}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ink">
                  {f.question}
                  <span className="ml-6 text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{f.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

