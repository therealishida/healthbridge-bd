"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Submission = {
  id: number; name: string; phone: string; whatsapp: string;
  email: string; condition: string; message: string; created_at: string;
};
type Post = {
  id: number; title: string; slug: string; content: string;
  published: boolean; created_at: string; updated_at: string;
};
type Testimonial = {
  id: number; quote: string; name: string; location: string;
  enabled: boolean; sort_order: number; created_at: string;
};
type Hospital = {
  id: number; name: string; location: string; description: string;
  image_url: string; country_tag: string; tags: string[];
  enabled: boolean; sort_order: number; created_at: string;
};
type Service = {
  id: number; title: string; slug: string | null; description: string;
  page_content: string | null; enabled: boolean; sort_order: number; created_at: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function fmt(d: string) {
  return new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("hb_admin_pw");
    if (saved) { setPassword(saved); setAuthed(true); }
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/consultations", { headers: { "x-admin-password": password } });
    if (res.ok) {
      sessionStorage.setItem("hb_admin_pw", password);
      setAuthed(true); setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (!authed) return <PasswordGate onSubmit={login} pw={password} setPw={setPassword} error={authError} />;
  return <Dashboard password={password} onLogout={() => { sessionStorage.removeItem("hb_admin_pw"); setAuthed(false); setPassword(""); }} />;
}

// ─── Password Gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onSubmit, pw, setPw, error }: {
  onSubmit: (e: React.FormEvent) => void; pw: string; setPw: (v: string) => void; error: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4]">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-[#E2E8F0] bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#003265]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 17c2-4 5-6 9-6s7 2 9 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 17V9M18 17V9" stroke="#00B02A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-semibold text-[#003265]">Healthbridge Admin</span>
        </div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Password</label>
        <input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter admin password" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#0A0A0F] focus:border-[#003265] focus:outline-none" />
        {error && <p className="mt-2 text-xs text-[#ED1C24]">Incorrect password.</p>}
        <button type="submit" className="mt-6 w-full rounded-full bg-[#003265] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">Sign In</button>
      </form>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
type Tab = "general" | "consultations" | "blog" | "hospitals" | "services";

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("general");
  const tabs: { id: Tab; label: string }[] = [
    { id: "general",       label: "General" },
    { id: "consultations", label: "Consultations" },
    { id: "blog",          label: "Blog Posts" },
    { id: "hospitals",     label: "Hospitals" },
    { id: "services",      label: "Services" },
  ];
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#003265]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 17c2-4 5-6 9-6s7 2 9 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 17V9M18 17V9" stroke="#00B02A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-lg font-semibold text-[#003265]">Admin Panel</span>
          </div>
          <button onClick={onLogout} className="rounded-full border border-[#E2E8F0] px-4 py-1.5 text-xs text-[#5A5A66] hover:border-[#003265] hover:text-[#003265]">Sign out</button>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === t.id ? "border-[#003265] text-[#003265]" : "border-transparent text-[#5A5A66] hover:text-[#003265]"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        {tab === "general"       && <GeneralTab password={password} />}
        {tab === "consultations" && <ConsultationsTab password={password} />}
        {tab === "blog"          && <BlogTab password={password} />}
        {tab === "hospitals"     && <HospitalsTab password={password} />}
        {tab === "services"      && <ServicesTab password={password} />}
      </main>
    </div>
  );
}

// ─── General Tab ──────────────────────────────────────────────────────────────
function GeneralTab({ password }: { password: string }) {
  const [testimonialsVisible, setTestimonialsVisible] = useState(true);
  const [settingLoading, setSettingLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tLoading, setTLoading] = useState(true);
  const [editingT, setEditingT] = useState<Testimonial | null>(null);
  const [creatingT, setCreatingT] = useState(false);
  const [savingT, setSavingT] = useState(false);
  const [tQuote, setTQuote] = useState("");
  const [tName, setTName] = useState("");
  const [tLocation, setTLocation] = useState("");

  const loadSetting = useCallback(async () => {
    setSettingLoading(true);
    const res = await fetch("/api/settings?key=testimonials_visible", { headers: { "x-admin-password": password } });
    const data = await res.json();
    setTestimonialsVisible(data.value !== "false");
    setSettingLoading(false);
  }, [password]);

  const loadTestimonials = useCallback(async () => {
    setTLoading(true);
    const res = await fetch("/api/testimonials", { headers: { "x-admin-password": password } });
    const data = await res.json();
    setTestimonials(Array.isArray(data) ? data : []);
    setTLoading(false);
  }, [password]);

  useEffect(() => { loadSetting(); loadTestimonials(); }, [loadSetting, loadTestimonials]);

  const toggleSection = async () => {
    const next = !testimonialsVisible;
    setTestimonialsVisible(next);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ key: "testimonials_visible", value: String(next) }),
    });
  };

  const openCreate = () => { setTQuote(""); setTName(""); setTLocation(""); setEditingT(null); setCreatingT(true); };
  const openEdit = (t: Testimonial) => { setTQuote(t.quote); setTName(t.name); setTLocation(t.location); setEditingT(t); setCreatingT(false); };
  const cancelForm = () => { setCreatingT(false); setEditingT(null); };

  const saveTestimonial = async () => {
    if (!tQuote.trim() || !tName.trim() || !tLocation.trim()) return;
    setSavingT(true);
    const body = { quote: tQuote, name: tName, location: tLocation, enabled: true, sort_order: testimonials.length };
    if (editingT) {
      await fetch(`/api/testimonials/${editingT.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...body, enabled: editingT.enabled }) });
    } else {
      await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(body) });
    }
    setSavingT(false); cancelForm(); loadTestimonials();
  };

  const toggleTestimonial = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...t, enabled: !t.enabled }) });
    loadTestimonials();
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    loadTestimonials();
  };

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7">
        <h3 className="mb-1 font-semibold text-[#003265]">Testimonials Section</h3>
        <p className="mb-6 text-sm text-[#5A5A66]">Toggle the entire "What Our Patients Say" section and the "Stories" nav tab on/off.</p>
        {settingLoading ? <Spinner /> : (
          <div className="flex items-center gap-4">
            <button onClick={toggleSection} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${testimonialsVisible ? "bg-[#00B02A]" : "bg-[#E2E8F0]"}`} role="switch" aria-checked={testimonialsVisible}>
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${testimonialsVisible ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className="text-sm font-medium text-[#0A0A0F]">{testimonialsVisible ? "Section + Stories nav tab visible" : "Section + Stories nav tab hidden"}</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#003265]">Patient Testimonials</h3>
            <p className="mt-0.5 text-sm text-[#5A5A66]">{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</p>
          </div>
          {!creatingT && !editingT && <button onClick={openCreate} className="rounded-full bg-[#003265] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">+ Add Testimonial</button>}
        </div>

        {(creatingT || editingT) && (
          <div className="mb-6 rounded-xl border border-[#E2E8F0] bg-[#F8F7F4] p-6 space-y-4">
            <h4 className="text-sm font-semibold text-[#003265]">{editingT ? "Edit Testimonial" : "New Testimonial"}</h4>
            <textarea value={tQuote} onChange={(e) => setTQuote(e.target.value)} placeholder="Patient quote…" rows={3} className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:border-[#003265] focus:outline-none" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input value={tName} onChange={(e) => setTName(e.target.value)} placeholder="Patient name" className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:border-[#003265] focus:outline-none" />
              <input value={tLocation} onChange={(e) => setTLocation(e.target.value)} placeholder="Location & Hospital (e.g. Bangladesh · Bumrungrad)" className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:border-[#003265] focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={saveTestimonial} disabled={savingT} className="rounded-full bg-[#003265] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{savingT ? "Saving…" : "Save"}</button>
              <button onClick={cancelForm} className="rounded-full border border-[#E2E8F0] px-5 py-2 text-sm text-[#5A5A66] hover:border-[#003265]">Cancel</button>
            </div>
          </div>
        )}

        {tLoading ? <Spinner /> : testimonials.length === 0 ? <Empty text="No testimonials yet. Add the first one." /> : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8F7F4] p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm italic text-[#0A0A0F] line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-1 text-xs text-[#5A5A66]">{t.name} · {t.location}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button onClick={() => toggleTestimonial(t)} className={`rounded-full px-3 py-1 text-xs font-semibold ${t.enabled ? "bg-[#00B02A]/10 text-[#00B02A]" : "bg-[#E2E8F0] text-[#5A5A66]"}`}>{t.enabled ? "Visible" : "Hidden"}</button>
                  <button onClick={() => openEdit(t)} className="text-xs text-[#5A5A66] underline hover:text-[#003265]">Edit</button>
                  <button onClick={() => deleteTestimonial(t.id)} className="text-xs text-[#ED1C24] hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Hospitals Tab ─────────────────────────────────────────────────────────────
function HospitalsTab({ password }: { password: string }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [hName, setHName] = useState("");
  const [hLocation, setHLocation] = useState("");
  const [hCountry, setHCountry] = useState("");
  const [hDesc, setHDesc] = useState("");
  const [hImage, setHImage] = useState("");
  const [hTags, setHTags] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/hospitals", { headers: { "x-admin-password": password } });
    const data = await res.json();
    setHospitals(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setHName(""); setHLocation(""); setHCountry(""); setHDesc(""); setHImage(""); setHTags(""); };
  const openCreate = () => { resetForm(); setEditing(null); setCreating(true); };
  const openEdit = (h: Hospital) => {
    setHName(h.name); setHLocation(h.location); setHCountry(h.country_tag);
    setHDesc(h.description ?? ""); setHImage(h.image_url ?? "");
    setHTags(Array.isArray(h.tags) ? h.tags.join(", ") : "");
    setEditing(h); setCreating(false);
  };
  const cancelForm = () => { setCreating(false); setEditing(null); };

  // Upload image via API
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setHImage(data.url);
      } else {
        alert(data.error ?? "Upload failed");
      }
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!hName.trim() || !hLocation.trim() || !hCountry.trim()) return;
    setSaving(true);
    const body = { name: hName, location: hLocation, country_tag: hCountry, description: hDesc, image_url: hImage, tags: hTags, enabled: true, sort_order: hospitals.length };
    if (editing) {
      await fetch(`/api/hospitals/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...body, enabled: editing.enabled }) });
    } else {
      await fetch("/api/hospitals", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(body) });
    }
    setSaving(false); cancelForm(); load();
  };

  const toggleHospital = async (h: Hospital) => {
    await fetch(`/api/hospitals/${h.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...h, tags: Array.isArray(h.tags) ? h.tags.join(", ") : "", enabled: !h.enabled }) });
    load();
  };

  const deleteHospital = async (id: number) => {
    if (!confirm("Delete this hospital?")) return;
    await fetch(`/api/hospitals/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#003265]">Hospital Network</h3>
          <p className="mt-0.5 text-sm text-[#5A5A66]">{hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""}</p>
        </div>
        {!creating && !editing && <button onClick={openCreate} className="rounded-full bg-[#003265] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">+ Add Hospital</button>}
      </div>

      {(creating || editing) && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 space-y-4">
          <h4 className="font-semibold text-[#003265]">{editing ? "Edit Hospital" : "New Hospital"}</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Hospital Name *</label>
              <input value={hName} onChange={(e) => setHName(e.target.value)} placeholder="e.g. Bumrungrad International Hospital" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Location *</label>
              <input value={hLocation} onChange={(e) => setHLocation(e.target.value)} placeholder="e.g. Sukhumvit, Bangkok" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Country Tag *</label>
              <input value={hCountry} onChange={(e) => setHCountry(e.target.value)} placeholder="e.g. Thailand, Singapore, Turkey" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Specialty Tags</label>
              <input value={hTags} onChange={(e) => setHTags(e.target.value)} placeholder="Cardiology, Cancer, Orthopedics (comma-separated)" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Description</label>
            <textarea value={hDesc} onChange={(e) => setHDesc(e.target.value)} placeholder="Short description of the hospital…" rows={3} className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
          </div>

          {/* Image upload */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Hospital Image</label>
            <div className="flex items-start gap-4">
              {/* Drop zone / file picker */}
              <label className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-5 text-center transition-colors ${uploading ? "border-[#003265]/50 bg-[#003265]/5" : "border-[#E2E8F0] hover:border-[#003265]/40 hover:bg-[#F8F7F4]"}`}>
                {uploading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#003265]" />
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-2 text-[#5A5A66]">
                      <path d="M4 16l4-4 4 4 4-6 4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="text-xs font-medium text-[#5A5A66] group-hover:text-[#003265]">
                      {hImage ? "Replace image" : "Upload image"}
                    </span>
                    <span className="mt-0.5 text-[10px] text-[#5A5A66]">JPEG, PNG, WebP up to 8MB</span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>

              {/* Preview */}
              {hImage && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hImage} alt="preview" className="h-28 w-40 rounded-xl border border-[#E2E8F0] object-cover" />
                  <button
                    type="button"
                    onClick={() => setHImage("")}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ED1C24] text-[10px] text-white hover:opacity-80"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving || uploading} className="rounded-full bg-[#003265] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? "Saving…" : "Save Hospital"}</button>
            <button onClick={cancelForm} className="rounded-full border border-[#E2E8F0] px-6 py-2.5 text-sm text-[#5A5A66] hover:border-[#003265]">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : hospitals.length === 0 ? <Empty text="No hospitals yet. Add your first one." /> : (
        <div className="space-y-3">
          {hospitals.map((h) => (
            <div key={h.id} className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white px-6 py-4">
              {h.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.image_url} alt={h.name} className="h-12 w-16 rounded-lg object-cover border border-[#E2E8F0] shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#003265]">{h.name}</span>
                  <span className="rounded-full border border-[#003265]/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#003265]">{h.country_tag}</span>
                </div>
                <div className="mt-0.5 text-xs text-[#5A5A66]">{h.location}</div>
                {h.tags && h.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {h.tags.map((t) => <span key={t} className="rounded border border-[#E2E8F0] px-1.5 py-0.5 text-[10px] text-[#5A5A66]">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button onClick={() => toggleHospital(h)} className={`rounded-full px-3 py-1 text-xs font-semibold ${h.enabled ? "bg-[#00B02A]/10 text-[#00B02A]" : "bg-[#E2E8F0] text-[#5A5A66]"}`}>{h.enabled ? "Visible" : "Hidden"}</button>
                <button onClick={() => openEdit(h)} className="text-xs text-[#5A5A66] underline hover:text-[#003265]">Edit</button>
                <button onClick={() => deleteHospital(h.id)} className="text-xs text-[#ED1C24] hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Services Tab ──────────────────────────────────────────────────────────────
function ServicesTab({ password }: { password: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Service | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sTitle, setSTitle] = useState("");
  const [sDesc, setSDesc] = useState("");
  const [sSlug, setSSlug] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services", { headers: { "x-admin-password": password } });
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setSTitle(""); setSDesc(""); setSSlug(""); setEditing(null); setCreating(true); };
  const openEdit = (s: Service) => { setSTitle(s.title); setSDesc(s.description ?? ""); setSSlug(s.slug ?? slugify(s.title)); setEditing(s); setCreating(false); };
  const cancelForm = () => { setCreating(false); setEditing(null); };

  // Auto-generate slug from title when creating
  const handleTitleChange = (val: string) => {
    setSTitle(val);
    if (!editing) setSSlug(slugify(val));
  };

  const save = async () => {
    if (!sTitle.trim()) return;
    setSaving(true);
    const body = { title: sTitle, description: sDesc, enabled: true, sort_order: services.length, slug: sSlug || slugify(sTitle) };
    if (editing) {
      await fetch(`/api/services/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...body, enabled: editing.enabled, page_content: editing.page_content }) });
    } else {
      await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(body) });
    }
    setSaving(false); cancelForm(); load();
  };

  const toggle = async (s: Service) => {
    await fetch(`/api/services/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...s, enabled: !s.enabled }) });
    load();
  };

  const move = async (s: Service, dir: "up" | "down") => {
    const idx = services.findIndex((x) => x.id === s.id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === services.length - 1) return;
    const other = services[dir === "up" ? idx - 1 : idx + 1];
    await Promise.all([
      fetch(`/api/services/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...s, sort_order: other.sort_order }) }),
      fetch(`/api/services/${other.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...other, sort_order: s.sort_order }) }),
    ]);
    load();
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    load();
  };

  // If editing a service page, show the page editor
  if (editingPage) {
    return (
      <ServicePageEditor
        password={password}
        service={editingPage}
        onSave={() => { setEditingPage(null); load(); }}
        onCancel={() => setEditingPage(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#003265]">Services</h3>
          <p className="mt-0.5 text-sm text-[#5A5A66]">Manage services shown in the nav dropdown. Each service has an editable detail page.</p>
        </div>
        {!creating && !editing && <button onClick={openCreate} className="rounded-full bg-[#003265] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">+ Add Service</button>}
      </div>

      {(creating || editing) && (
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 space-y-4">
          <h4 className="font-semibold text-[#003265]">{editing ? "Edit Service" : "New Service"}</h4>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Title *</label>
            <input value={sTitle} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Air Ambulance" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">
              Slug <span className="normal-case font-normal text-[#5A5A66]">(URL: /services/{sSlug || "…"})</span>
            </label>
            <input value={sSlug} onChange={(e) => setSSlug(slugify(e.target.value))} placeholder="air-ambulance" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-mono focus:border-[#003265] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Short Description</label>
            <textarea value={sDesc} onChange={(e) => setSDesc(e.target.value)} placeholder="Shown in nav dropdown and services section…" rows={2} className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm focus:border-[#003265] focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="rounded-full bg-[#003265] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? "Saving…" : "Save Service"}</button>
            <button onClick={cancelForm} className="rounded-full border border-[#E2E8F0] px-6 py-2.5 text-sm text-[#5A5A66] hover:border-[#003265]">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : services.length === 0 ? <Empty text="No services yet." /> : (
        <div className="space-y-2">
          {services.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(s, "up")} disabled={i === 0} className="text-[10px] text-[#5A5A66] hover:text-[#003265] disabled:opacity-30">▲</button>
                <button onClick={() => move(s, "down")} disabled={i === services.length - 1} className="text-[10px] text-[#5A5A66] hover:text-[#003265] disabled:opacity-30">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#003265]">{s.title}</span>
                  {s.slug && <span className="text-[10px] font-mono text-[#5A5A66]">/services/{s.slug}</span>}
                </div>
                {s.description && <p className="mt-0.5 text-xs text-[#5A5A66] line-clamp-1">{s.description}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setEditingPage(s)}
                  className="rounded-full border border-[#003265]/30 px-3 py-1 text-xs font-medium text-[#003265] hover:bg-[#003265] hover:text-white transition-colors"
                >
                  ✏️ Edit Page
                </button>
                {s.slug && (
                  <a href={`/services/${s.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#003265] underline hover:opacity-70">View ↗</a>
                )}
                <button onClick={() => toggle(s)} className={`rounded-full px-3 py-1 text-xs font-semibold ${s.enabled ? "bg-[#00B02A]/10 text-[#00B02A]" : "bg-[#E2E8F0] text-[#5A5A66]"}`}>{s.enabled ? "In Nav" : "Hidden"}</button>
                <button onClick={() => openEdit(s)} className="text-xs text-[#5A5A66] underline hover:text-[#003265]">Edit</button>
                <button onClick={() => deleteService(s.id)} className="text-xs text-[#ED1C24] hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Service Page Editor (block editor, same as blog) ─────────────────────────
function ServicePageEditor({
  password, service, onSave, onCancel,
}: {
  password: string; service: Service; onSave: () => void; onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [blocks, setBlocks] = useState<any[]>(() => {
    if (service.page_content) {
      try { const p = JSON.parse(service.page_content); if (Array.isArray(p)) return p; } catch {}
    }
    return [{ type: "paragraph", value: "" }];
  });

  const addBlock = (type: string) => {
    let b: any = { type };
    if (type === "paragraph") b.value = "";
    else if (type === "heading") { b.value = ""; b.level = 2; }
    else if (type === "image") { b.url = ""; b.caption = ""; }
    else if (type === "video") { b.url = ""; }
    else if (type === "list") { b.items = [""]; }
    else if (type === "poll") { b.question = ""; b.options = ["", ""]; b.votes = [0, 0]; }
    setBlocks([...blocks, b]);
  };

  const updateBlock = (i: number, fields: any) => {
    const next = [...blocks]; next[i] = { ...next[i], ...fields }; setBlocks(next);
  };

  const deleteBlock = (i: number) => {
    if (blocks.length <= 1) { alert("Must have at least one block."); return; }
    setBlocks(blocks.filter((_, idx) => idx !== i));
  };

  const moveBlock = (i: number, dir: "up" | "down") => {
    if (dir === "up" && i === 0) return;
    if (dir === "down" && i === blocks.length - 1) return;
    const ti = dir === "up" ? i - 1 : i + 1;
    const next = [...blocks]; const tmp = next[i]; next[i] = next[ti]; next[ti] = tmp; setBlocks(next);
  };

  const save = async () => {
    setSaving(true); setError("");
    const res = await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ ...service, page_content: JSON.stringify(blocks), slug: service.slug ?? slugify(service.title) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    onSave();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#003265]">Edit Service Page: {service.title}</h2>
          {service.slug && <p className="text-xs text-[#5A5A66] mt-0.5">URL: /services/{service.slug}</p>}
        </div>
        <div className="flex items-center gap-3">
          {service.slug && (
            <a href={`/services/${service.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#003265] underline hover:opacity-70">View Live ↗</a>
          )}
          <button onClick={onCancel} className="text-sm text-[#5A5A66] hover:text-[#003265]">← Back</button>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-white p-8">
        <label className="block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Page Content Blocks</label>

        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div key={index} className="relative rounded-xl border border-[#E2E8F0] bg-[#F8F7F4] p-4 pt-10">
              <div className="absolute top-2 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#003265]">Block {index + 1}: {block.type}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveBlock(index, "up")} disabled={index === 0} className="text-xs text-[#5A5A66] hover:text-[#003265] disabled:opacity-30">▲ Up</button>
                  <button type="button" onClick={() => moveBlock(index, "down")} disabled={index === blocks.length - 1} className="text-xs text-[#5A5A66] hover:text-[#003265] disabled:opacity-30">▼ Down</button>
                  <button type="button" onClick={() => deleteBlock(index)} className="text-xs text-[#ED1C24] hover:underline">Delete</button>
                </div>
              </div>

              {block.type === "paragraph" && (
                <textarea value={block.value} onChange={(e) => updateBlock(index, { value: e.target.value })} placeholder="Write paragraph text..." rows={4} className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
              )}
              {block.type === "heading" && (
                <div className="flex gap-2">
                  <select value={block.level ?? 2} onChange={(e) => updateBlock(index, { level: parseInt(e.target.value) })} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none">
                    <option value={2}>H2</option><option value={3}>H3</option><option value={4}>H4</option>
                  </select>
                  <input type="text" value={block.value} onChange={(e) => updateBlock(index, { value: e.target.value })} placeholder="Heading text" className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
                </div>
              )}
              {block.type === "image" && (
                <div className="space-y-2">
                  <input type="text" value={block.url ?? ""} onChange={(e) => updateBlock(index, { url: e.target.value })} placeholder="Image URL" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5A5A66]">— or upload —</span>
                    <label className="cursor-pointer rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#5A5A66] hover:border-[#003265] hover:text-[#003265]">
                      📁 Choose File
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; updateBlock(index, { url: URL.createObjectURL(f) }); }} />
                    </label>
                    {block.url && <img src={block.url} alt="preview" className="h-10 w-14 rounded object-cover border border-[#E2E8F0]" />}
                  </div>
                  <input type="text" value={block.caption ?? ""} onChange={(e) => updateBlock(index, { caption: e.target.value })} placeholder="Caption (optional)" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
                </div>
              )}
              {block.type === "video" && (
                <div className="space-y-2">
                  <input type="text" value={block.url ?? ""} onChange={(e) => updateBlock(index, { url: e.target.value })} placeholder="Video Embed URL or path" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none" />
                </div>
              )}
              {block.type === "list" && (
                <div className="space-y-2">
                  {block.items.map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={item} onChange={(e) => { const n = [...block.items]; n[idx] = e.target.value; updateBlock(index, { items: n }); }} placeholder={`Item ${idx + 1}`} className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none" />
                      <button type="button" onClick={() => updateBlock(index, { items: block.items.filter((_: any, i: number) => i !== idx) })} className="text-xs text-[#ED1C24] hover:underline">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateBlock(index, { items: [...block.items, ""] })} className="text-xs font-semibold text-[#003265] hover:underline">+ Add Point</button>
                </div>
              )}
              {block.type === "poll" && (
                <div className="space-y-2">
                  <input type="text" value={block.question ?? ""} onChange={(e) => updateBlock(index, { question: e.target.value })} placeholder="Poll Question" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold focus:outline-none" />
                  {block.options.map((opt: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={opt} onChange={(e) => { const n = [...block.options]; n[idx] = e.target.value; updateBlock(index, { options: n }); }} placeholder={`Option ${idx + 1}`} className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none" />
                      <button type="button" onClick={() => { const no = block.options.filter((_: any, i: number) => i !== idx); const nv = block.votes.filter((_: any, i: number) => i !== idx); updateBlock(index, { options: no, votes: nv }); }} className="text-xs text-[#ED1C24] hover:underline">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateBlock(index, { options: [...block.options, ""], votes: [...block.votes, 0] })} className="text-xs font-semibold text-[#003265] hover:underline">+ Add Option</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Block toolbar */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8F7F4] p-3">
          <span className="w-full text-[10px] font-bold uppercase tracking-widest text-[#5A5A66] mb-1">Add Block:</span>
          {["paragraph", "heading", "list", "image", "video", "poll"].map((type) => (
            <button key={type} type="button" onClick={() => addBlock(type)} className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#5A5A66] hover:border-[#003265] hover:text-[#003265]">
              + {type === "paragraph" ? "Text Paragraph" : type === "poll" ? "Interactive Poll" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-[#ED1C24]">{error}</p>}

        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="rounded-full bg-[#003265] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? "Saving…" : "Save Page"}</button>
          <button onClick={onCancel} className="rounded-full border border-[#E2E8F0] px-6 py-2.5 text-sm text-[#5A5A66] hover:border-[#003265]">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Consultations Tab ─────────────────────────────────────────────────────────
function ConsultationsTab({ password }: { password: string }) {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/consultations", { headers: { "x-admin-password": password } });
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (rows.length === 0) return <Empty text="No consultation requests yet." />;

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#5A5A66]">{rows.length} request{rows.length !== 1 ? "s" : ""}</p>
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-[#E2E8F0] bg-white">
          <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="flex w-full items-center justify-between px-6 py-4 text-left">
            <div>
              <span className="font-medium text-[#003265]">{r.name}</span>
              {r.condition && <span className="ml-3 text-sm text-[#5A5A66]">· {r.condition}</span>}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#5A5A66]">{fmt(r.created_at)}</span>
              <span className="text-[#003265]">{expanded === r.id ? "▲" : "▼"}</span>
            </div>
          </button>
          {expanded === r.id && (
            <div className="grid grid-cols-1 gap-4 border-t border-[#E2E8F0] px-6 py-5 text-sm sm:grid-cols-2">
              <Info label="Phone" value={r.phone} />
              <Info label="WhatsApp" value={r.whatsapp} />
              <Info label="Email" value={r.email} />
              <Info label="Condition" value={r.condition} />
              {r.message && <div className="sm:col-span-2"><Info label="Message" value={r.message} /></div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">{label}</div>
      <div className="mt-1 text-[#0A0A0F]">{value || "—"}</div>
    </div>
  );
}

// ─── Blog Tab ──────────────────────────────────────────────────────────────────
function BlogTab({ password }: { password: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/blog", { headers: { "x-admin-password": password } });
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const deletePost = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    load();
  };

  const togglePublish = async (post: Post) => {
    await fetch(`/api/blog/${post.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ ...post, published: !post.published }) });
    load();
  };

  if (creating || editing) {
    return <PostEditor password={password} initial={editing} onSave={() => { setCreating(false); setEditing(null); load(); }} onCancel={() => { setCreating(false); setEditing(null); }} />;
  }
  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#5A5A66]">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setCreating(true)} className="rounded-full bg-[#003265] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">+ New Post</button>
      </div>
      {posts.length === 0 ? <Empty text="No posts yet. Create your first one." /> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-6 py-4">
              <div>
                <span className="font-medium text-[#003265]">{p.title}</span>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-[#5A5A66]">
                  <span>/{p.slug}</span><span>·</span><span>{fmt(p.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublish(p)} className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${p.published ? "bg-[#00B02A]/10 text-[#00B02A]" : "bg-[#E2E8F0] text-[#5A5A66] hover:bg-[#003265]/10 hover:text-[#003265]"}`}>{p.published ? "Published" : "Draft"}</button>
                {p.published && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#003265] underline hover:opacity-70">View Live ↗</a>}
                <button onClick={() => setEditing(p)} className="text-xs text-[#5A5A66] underline hover:text-[#003265]">Edit</button>
                <button onClick={() => deletePost(p.id)} className="text-xs text-[#ED1C24] hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Post Editor ──────────────────────────────────────────────────────────────
function PostEditor({ password, initial, onSave, onCancel }: { password: string; initial: Post | null; onSave: () => void; onCancel: () => void; }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [blocks, setBlocks] = useState<any[]>(() => {
    if (initial?.content) { try { const p = JSON.parse(initial.content); if (Array.isArray(p)) return p; } catch {} return [{ type: "paragraph", value: initial.content }]; }
    return [{ type: "paragraph", value: "" }];
  });

  useEffect(() => { if (!initial) setSlug(slugify(title)); }, [title, initial]);

  const addBlock = (type: string) => {
    let b: any = { type };
    if (type === "paragraph") b.value = "";
    else if (type === "heading") { b.value = ""; b.level = 2; }
    else if (type === "image") { b.url = ""; b.caption = ""; }
    else if (type === "video") { b.url = ""; }
    else if (type === "list") { b.items = [""]; }
    else if (type === "poll") { b.question = ""; b.options = ["", ""]; b.votes = [0, 0]; }
    setBlocks([...blocks, b]);
  };
  const updateBlock = (i: number, f: any) => { const n = [...blocks]; n[i] = { ...n[i], ...f }; setBlocks(n); };
  const deleteBlock = (i: number) => { if (blocks.length <= 1) { alert("Must have at least one block."); return; } setBlocks(blocks.filter((_, idx) => idx !== i)); };
  const moveBlock = (i: number, dir: "up" | "down") => {
    if (dir === "up" && i === 0) return; if (dir === "down" && i === blocks.length - 1) return;
    const ti = dir === "up" ? i - 1 : i + 1; const n = [...blocks]; const t = n[i]; n[i] = n[ti]; n[ti] = t; setBlocks(n);
  };

  const save = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!slug.trim()) { setError("Slug is required"); return; }
    setSaving(true); setError("");
    const url = initial ? `/api/blog/${initial.id}` : "/api/blog";
    const res = await fetch(url, { method: initial ? "PUT" : "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ title, slug, content: JSON.stringify(blocks), published }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    onSave();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#003265]">{initial ? "Edit Post" : "New Post"}</h2>
        <button onClick={onCancel} className="text-sm text-[#5A5A66] hover:text-[#003265]">← Back</button>
      </div>
      <div className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-white p-8">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your post title" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm focus:border-[#003265] focus:outline-none" />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Slug <span className="normal-case font-normal">(URL: /blog/{slug || "…"})</span></label>
          <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="post-url-slug" className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-mono focus:border-[#003265] focus:outline-none" />
        </div>
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Content Blocks</label>
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={index} className="relative rounded-xl border border-[#E2E8F0] bg-[#F8F7F4] p-4 pt-10">
                <div className="absolute top-2 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#003265]">Block {index + 1}: {block.type}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveBlock(index, "up")} disabled={index === 0} className="text-xs text-[#5A5A66] hover:text-[#003265] disabled:opacity-30">▲ Up</button>
                    <button type="button" onClick={() => moveBlock(index, "down")} disabled={index === blocks.length - 1} className="text-xs text-[#5A5A66] hover:text-[#003265] disabled:opacity-30">▼ Down</button>
                    <button type="button" onClick={() => deleteBlock(index)} className="text-xs text-[#ED1C24] hover:underline">Delete</button>
                  </div>
                </div>
                {block.type === "paragraph" && <textarea value={block.value} onChange={(e) => updateBlock(index, { value: e.target.value })} placeholder="Write paragraph text..." rows={4} className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />}
                {block.type === "heading" && (
                  <div className="flex gap-2">
                    <select value={block.level ?? 2} onChange={(e) => updateBlock(index, { level: parseInt(e.target.value) })} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm focus:outline-none">
                      <option value={2}>H2</option><option value={3}>H3</option><option value={4}>H4</option>
                    </select>
                    <input type="text" value={block.value} onChange={(e) => updateBlock(index, { value: e.target.value })} placeholder="Heading text" className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
                  </div>
                )}
                {block.type === "image" && (
                  <div className="space-y-2">
                    <input type="text" value={block.url ?? ""} onChange={(e) => updateBlock(index, { url: e.target.value })} placeholder="Image URL" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#5A5A66]">— or upload —</span>
                      <label className="cursor-pointer rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#5A5A66] hover:border-[#003265]">
                        📁 Choose File
                        <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; updateBlock(index, { url: URL.createObjectURL(f), _file: f }); }} />
                      </label>
                      {block.url && <img src={block.url} alt="preview" className="h-10 w-14 rounded object-cover border border-[#E2E8F0]" />}
                    </div>
                    <input type="text" value={block.caption ?? ""} onChange={(e) => updateBlock(index, { caption: e.target.value })} placeholder="Caption (optional)" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none focus:border-[#003265]" />
                  </div>
                )}
                {block.type === "video" && (
                  <div className="space-y-2">
                    <input type="text" value={block.url ?? ""} onChange={(e) => updateBlock(index, { url: e.target.value })} placeholder="Video Embed URL" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#5A5A66]">— or upload —</span>
                      <label className="cursor-pointer rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#5A5A66] hover:border-[#003265]">
                        🎬 Choose Video
                        <input type="file" accept="video/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; updateBlock(index, { url: URL.createObjectURL(f), _file: f }); }} />
                      </label>
                    </div>
                  </div>
                )}
                {block.type === "list" && (
                  <div className="space-y-2">
                    {block.items.map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={item} onChange={(e) => { const n = [...block.items]; n[idx] = e.target.value; updateBlock(index, { items: n }); }} placeholder={`Item ${idx + 1}`} className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none" />
                        <button type="button" onClick={() => updateBlock(index, { items: block.items.filter((_: any, i: number) => i !== idx) })} className="text-xs text-[#ED1C24] hover:underline">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => updateBlock(index, { items: [...block.items, ""] })} className="text-xs font-semibold text-[#003265] hover:underline">+ Add Point</button>
                  </div>
                )}
                {block.type === "poll" && (
                  <div className="space-y-2">
                    <input type="text" value={block.question ?? ""} onChange={(e) => updateBlock(index, { question: e.target.value })} placeholder="Poll Question" className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold focus:outline-none" />
                    {block.options.map((opt: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={opt} onChange={(e) => { const n = [...block.options]; n[idx] = e.target.value; updateBlock(index, { options: n }); }} placeholder={`Option ${idx + 1}`} className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm focus:outline-none" />
                        <button type="button" onClick={() => { const no = block.options.filter((_: any, i: number) => i !== idx); const nv = block.votes.filter((_: any, i: number) => i !== idx); updateBlock(index, { options: no, votes: nv }); }} className="text-xs text-[#ED1C24] hover:underline">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => updateBlock(index, { options: [...block.options, ""], votes: [...block.votes, 0] })} className="text-xs font-semibold text-[#003265] hover:underline">+ Add Option</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8F7F4] p-3">
            <span className="w-full text-[10px] font-bold uppercase tracking-widest text-[#5A5A66] mb-1">Add Block:</span>
            {["paragraph", "heading", "list", "image", "video", "poll"].map((type) => (
              <button key={type} type="button" onClick={() => addBlock(type)} className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#5A5A66] hover:border-[#003265] hover:text-[#003265]">
                + {type === "paragraph" ? "Text Paragraph" : type === "poll" ? "Interactive Poll" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#5A5A66]">Status:</span>
          <button type="button" onClick={() => setPublished((v) => !v)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${published ? "bg-[#00B02A]/10 text-[#00B02A] border border-[#00B02A]/30" : "bg-[#E2E8F0] text-[#5A5A66] border border-[#E2E8F0] hover:border-[#003265]"}`}>
            {published ? "✓ Published" : "Draft"}
          </button>
        </div>
        {error && <p className="text-sm text-[#ED1C24]">{error}</p>}
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="rounded-full bg-[#003265] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving ? "Saving…" : "Save Post"}</button>
          <button onClick={onCancel} className="rounded-full border border-[#E2E8F0] px-6 py-2.5 text-sm text-[#5A5A66] hover:border-[#003265]">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared micro-components ──────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#003265]" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="py-20 text-center text-sm text-[#5A5A66]">{text}</p>;
}
