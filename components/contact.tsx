"use client";

import { useState } from "react";
import Reveal from "./ui/reveal";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "", phone: "", whatsapp: "", email: "", condition: "", message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

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
            {status === "success" ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-accent/30 bg-bg p-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B02A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-primary">Request received</h3>
                <p className="mt-2 max-w-xs text-sm text-ink-muted">
                  Your coordinator will reach out within 24–48 hours. For urgent needs, call us directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-line/60 bg-bg p-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Name" placeholder="Your full name" value={form.name} onChange={set("name")} required />
                  <Field label="Phone Number" placeholder="+880 ..." type="tel" value={form.phone} onChange={set("phone")} />
                  <Field label="WhatsApp Number" placeholder="+880 ..." type="tel" value={form.whatsapp} onChange={set("whatsapp")} />
                  <Field label="Email" placeholder="you@email.com" type="email" value={form.email} onChange={set("email")} />
                </div>
                <div className="mt-5">
                  <Field label="Medical Condition" placeholder="Briefly describe your condition" value={form.condition} onChange={set("condition")} />
                </div>
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Anything else we should know?"
                    value={form.message}
                    onChange={set("message")}
                    className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
                  />
                </div>
                {status === "error" && (
                  <p className="mt-3 text-xs text-alert-red">Something went wrong. Please try again or contact us directly.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-7 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Get Free Consultation"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, placeholder, type = "text", value, onChange, required,
}: {
  label: string; placeholder: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
      />
    </div>
  );
}
