import Reveal from "./ui/reveal";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-line/60 bg-surface/40 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
            Start your medical journey
          </h2>
          <p className="mt-4 max-w-md text-ink-muted">
            A dedicated coordinator will respond with clear next steps, in Bangla or English.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="space-y-4">
            <div className="rounded-xl border border-line/60 bg-bg p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Office</div>
              <p className="mt-2 text-sm text-ink">10 Soi Sukhumvit 13, Khlong Toei Nuea, Watthana District, Bangkok 10110, Thailand</p>
            </div>
            <div className="rounded-xl border border-line/60 bg-bg p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Phone</div>
              <p className="mt-2 text-sm text-ink">+66 65 162 7555</p>
            </div>
            <div className="rounded-xl border border-line/60 bg-bg p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Email</div>
              <p className="mt-2 text-sm text-ink">info@healthbridge-tgv.com</p>
            </div>
            <div className="rounded-xl border border-alert-orange/30 bg-alert-orange/10 p-6">
              <p className="text-sm font-medium text-alert-orange">Urgent medical need? Call or WhatsApp directly — skip the form.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="rounded-2xl border border-line/60 bg-bg p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Name" placeholder="Your full name" />
                <Field label="Phone Number" placeholder="+880 ..." type="tel" />
                <Field label="WhatsApp Number" placeholder="+880 ..." type="tel" />
                <Field label="Email" placeholder="you@email.com" type="email" />
              </div>
              <div className="mt-5">
                <Field label="Medical Condition" placeholder="Briefly describe your condition" />
              </div>
              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Message</label>
                <textarea rows={3} placeholder="Anything else we should know?" className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none" />
              </div>
              <button type="submit" className="mt-7 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5">
                Get Free Consultation
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none" />
    </div>
  );
}
