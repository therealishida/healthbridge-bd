"use client";

import { useState } from "react";
import Reveal from "./ui/reveal";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "", phone: "", whatsapp: "", email: "", dob: "", gender: "",
    specialty: "", condition: "", destination: "", hospital_pref: "", message: "",
    consent_accuracy: false, consent_processing: false, consent_terms: false
  });

  const [assistance, setAssistance] = useState<string[]>([]);
  const assistanceOptions = ["Medical Visa", "Airport Transfer", "Accommodation", "Translation Services", "Air Ambulance"];

  const [medicalReports, setMedicalReports] = useState("");
  const [passportCopy, setPassportCopy] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const toggleAssistance = (option: string) => {
    setAssistance(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setter(reader.result as string);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicalReports || !passportCopy) {
      alert("Please upload both your Medical Reports and Passport Copy.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, assistance, medical_reports: medicalReports, passport_copy: passportCopy }),
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="max-w-xl font-display text-3xl font-medium leading-tight text-primary md:text-5xl">
                Book a Consultation
              </h2>
              <p className="mt-4 max-w-2xl text-ink-muted">
                Provide your details below and a dedicated coordinator will respond with clear next steps.
              </p>
            </div>
            <div className="rounded-xl border border-alert-orange/30 bg-alert-orange/10 p-5 max-w-sm">
              <p className="text-sm font-medium text-alert-orange leading-snug">
                Urgent medical need? <br className="hidden md:block" />
                <span className="font-bold">Call or WhatsApp +66 65 162 7555</span> directly — skip the form entirely.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 mx-auto max-w-4xl">
          <Reveal delay={0.1}>
            {status === "success" ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-accent/30 bg-bg p-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B02A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-xl text-primary">Booking received</h3>
                <p className="mt-2 max-w-xs text-sm text-ink-muted">
                  Your coordinator will reach out within 24–48 hours to confirm your consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-line/60 bg-bg p-8 space-y-10">
                
                {/* 1. Patient Details */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b border-line pb-2">1. Patient Details</h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full Name *" placeholder="Your full name" value={form.name} onChange={set("name")} required />
                    <Field label="Mobile / WhatsApp Number *" placeholder="+880 ..." type="tel" value={form.phone} onChange={set("phone")} required />
                    <Field label="Email Address *" placeholder="you@email.com" type="email" value={form.email} onChange={set("email")} required />
                    <Field label="Date of Birth *" placeholder="YYYY-MM-DD" type="date" value={form.dob} onChange={set("dob")} required />
                    <SelectField label="Gender *" value={form.gender} onChange={set("gender")} required options={["", "Male", "Female", "Other"]} />
                  </div>
                </div>

                {/* 2. Medical Information */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b border-line pb-2">2. Medical Information</h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Medical Specialty / Department *" placeholder="e.g. Cardiology" value={form.specialty} onChange={set("specialty")} required />
                    <Field label="Medical Condition / Diagnosis *" placeholder="Briefly describe" value={form.condition} onChange={set("condition")} required />
                    <Field label="Preferred Destination" placeholder="e.g. Thailand, India" value={form.destination} onChange={set("destination")} />
                    <Field label="Preferred Hospital" placeholder="e.g. Bumrungrad" value={form.hospital_pref} onChange={set("hospital_pref")} />
                  </div>
                </div>

                {/* 3. Required Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b border-line pb-2">3. Required Documents</h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FileField label="Upload Medical Reports *" onChange={(e) => handleFileUpload(e, setMedicalReports)} uploaded={!!medicalReports} />
                    <FileField label="Upload Passport Copy / NID *" onChange={(e) => handleFileUpload(e, setPassportCopy)} uploaded={!!passportCopy} />
                  </div>
                </div>

                {/* 4. Assistance Required */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b border-line pb-2">4. Assistance Required *</h3>
                  <div className="flex flex-wrap gap-4">
                    {assistanceOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                        <input type="checkbox" checked={assistance.includes(opt)} onChange={() => toggleAssistance(opt)} className="rounded border-line/60 text-primary focus:ring-primary h-4 w-4" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b border-line pb-2">5. Additional Information</h3>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Message / Extra Info</label>
                  <textarea
                    rows={3}
                    placeholder="Anything else we should know?"
                    value={form.message}
                    onChange={set("message")}
                    className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
                  />
                </div>

                {/* 6. Consent */}
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-4 border-b border-line pb-2">6. Consent *</h3>
                  <div className="space-y-3">
                    <CheckboxField label="I confirm that the information provided is accurate." checked={form.consent_accuracy} onChange={set("consent_accuracy")} required />
                    <CheckboxField label="I consent to my data being processed and shared with medical facilities." checked={form.consent_processing} onChange={set("consent_processing")} required />
                    <CheckboxField label="I agree to the Privacy Policy and Terms of Service." checked={form.consent_terms} onChange={set("consent_terms")} required />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-3 text-xs text-alert-red">Something went wrong. Please try again or contact us directly.</p>
                )}
                
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-full bg-accent py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 mt-4"
                >
                  {status === "loading" ? "Submitting..." : "Submit Consultation Request"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text", value, onChange, required }: { label: string; placeholder: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none" />
    </div>
  );
}

function SelectField({ label, value, onChange, required, options }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; required?: boolean; options: string[] }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</label>
      <select value={value} onChange={onChange} required={required} className="w-full rounded-lg border border-line/60 bg-surface px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none">
        {options.map((opt: string) => <option key={opt} value={opt} disabled={opt === ""}>{opt === "" ? "Select Option" : opt}</option>)}
      </select>
    </div>
  );
}

function FileField({ label, onChange, uploaded }: { label: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; uploaded: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</label>
      <div className="relative">
        <input type="file" accept="image/*,application/pdf" onChange={onChange} className="w-full pr-24 cursor-pointer rounded-lg border border-line/60 bg-surface px-4 py-2.5 text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20" />
        {uploaded && <span className="absolute right-4 top-3 text-xs font-bold text-[#00B02A] bg-surface pl-2">✓ Uploaded</span>}
      </div>
    </div>
  );
}

function CheckboxField({ label, checked, onChange, required }: { label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <label className="flex items-start gap-3 text-sm text-ink cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} required={required} className="mt-1 rounded border-line/60 text-primary focus:ring-primary h-4 w-4 shrink-0" />
      <span className="leading-snug">{label}</span>
    </label>
  );
}
