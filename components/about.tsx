import Image from "next/image";
import logoImg from "@/brandassets/logo-cropped.png";
import Reveal from "./ui/reveal";
import HospitalLogoRibbon from "./hospital-logo-ribbon";

export default function About() {
  return (
    <section id="about" className="border-t border-line/60 bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
            {/* Text block */}
            <div className="flex-1">
              <h2 className="max-w-2xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
                Your bridge to international healthcare
              </h2>
              <p className="mt-6 max-w-xl text-ink-muted">
                Healthbridge is a premium cross-border healthcare facilitation
                service. We don&apos;t replace doctors or make clinical decisions —
                we handle everything around the treatment, so your family can focus
                on the care itself.
              </p>
            </div>

            {/* Logo block */}
            <div className="flex shrink-0 items-center justify-center">
              <Image
                src={logoImg}
                alt="HealthBridge logo"
                height={240}
                className="h-48 w-auto md:h-64"
              />
            </div>
          </div>
        </Reveal>

        {/* Hospital logo ribbon — shown below the intro text */}
        <Reveal delay={0.2}>
          <HospitalLogoRibbon />
        </Reveal>
      </div>
    </section>
  );
}
