"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Submission = {
  id: number; name: string; phone: string; whatsapp: string;
  email: string; condition: string; message: string; created_at: string;
};
type Post = {
  id: number; title: string; slug: string; content: string;
  published: boolean; created_at: string; updated_at: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
    // Quick check — hit the API
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
  onSubmit: (e: React.FormEvent) => void;
  pw: string; setPw: (v: string) => void; error: boolean;
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
        <input
          type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="Enter admin password"
          className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#0A0A0F] focus:border-[#003265] focus:outline-none"
        />
        {error && <p className="mt-2 text-xs text-[#ED1C24]">Incorrect password.</p>}
        <button type="submit" className="mt-6 w-full rounded-full bg-[#003265] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Sign In
        </button>
      </form>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"consultations" | "blog">("consultations");

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
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
          <button onClick={onLogout} className="rounded-full border border-[#E2E8F0] px-4 py-1.5 text-xs text-[#5A5A66] hover:border-[#003265] hover:text-[#003265]">
            Sign out
          </button>
        </div>
        <div className="mx-auto flex max-w-6xl gap-6 px-6">
          {(["consultations", "blog"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 py-3 text-sm font-medium capitalize transition-colors ${tab === t ? "border-[#003265] text-[#003265]" : "border-transparent text-[#5A5A66] hover:text-[#003265]"}`}
            >
              {t === "consultations" ? "Consultation Requests" : "Blog Posts"}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {tab === "consultations" ? <ConsultationsTab password={password} /> : <BlogTab password={password} />}
      </main>
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
          <button
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
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
              {r.message && (
                <div className="sm:col-span-2">
                  <Info label="Message" value={r.message} />
                </div>
              )}
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
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    load();
  };

  if (creating || editing) {
    return (
      <PostEditor
        password={password}
        initial={editing}
        onSave={() => { setCreating(false); setEditing(null); load(); }}
        onCancel={() => { setCreating(false); setEditing(null); }}
      />
    );
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#5A5A66]">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setCreating(true)}
          className="rounded-full bg-[#003265] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New Post
        </button>
      </div>

      {posts.length === 0 ? <Empty text="No posts yet. Create your first one." /> : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-6 py-4">
              <div>
                <span className="font-medium text-[#003265]">{p.title}</span>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-[#5A5A66]">
                  <span>/{p.slug}</span>
                  <span>·</span>
                  <span>{fmt(p.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePublish(p)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${p.published ? "bg-[#00B02A]/10 text-[#00B02A]" : "bg-[#E2E8F0] text-[#5A5A66] hover:bg-[#003265]/10 hover:text-[#003265]"}`}
                >
                  {p.published ? "Published" : "Draft"}
                </button>
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
function PostEditor({
  password, initial, onSave, onCancel,
}: {
  password: string;
  initial: Post | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from title when creating new
  useEffect(() => {
    if (!initial) setSlug(slugify(title));
  }, [title, initial]);

  const save = async () => {
    setSaving(true); setError("");
    const url = initial ? `/api/blog/${initial.id}` : "/api/blog";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ title, slug, content, published }),
    });
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

      <div className="space-y-5 rounded-2xl border border-[#E2E8F0] bg-white p-8">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">Title</label>
          <input
            value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your post title"
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#0A0A0F] focus:border-[#003265] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">
            Slug <span className="normal-case font-normal">(URL: /blog/{slug || "…"})</span>
          </label>
          <input
            value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="post-url-slug"
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm font-mono text-[#0A0A0F] focus:border-[#003265] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#5A5A66]">
            Content <span className="normal-case font-normal">(supports basic HTML)</span>
          </label>
          <textarea
            value={content} onChange={(e) => setContent(e.target.value)}
            rows={18} placeholder="Write your post content here…"
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#0A0A0F] focus:border-[#003265] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPublished((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${published ? "bg-[#00B02A]" : "bg-[#E2E8F0]"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${published ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <span className="text-sm text-[#5A5A66]">{published ? "Published" : "Draft"}</span>
        </div>

        {error && <p className="text-sm text-[#ED1C24]">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={save} disabled={saving}
            className="rounded-full bg-[#003265] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Post"}
          </button>
          <button onClick={onCancel} className="rounded-full border border-[#E2E8F0] px-6 py-2.5 text-sm text-[#5A5A66] hover:border-[#003265]">
            Cancel
          </button>
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
