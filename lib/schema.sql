-- Run this once in the Supabase/Vercel Postgres query console after connecting your database.

CREATE TABLE IF NOT EXISTS consultations (
  id                 SERIAL PRIMARY KEY,
  name               TEXT NOT NULL,
  phone              TEXT NOT NULL,
  whatsapp           TEXT NOT NULL,
  email              TEXT NOT NULL,
  dob                TEXT NOT NULL,
  gender             TEXT NOT NULL,
  specialty          TEXT NOT NULL,
  condition          TEXT NOT NULL,
  destination        TEXT,
  hospital_pref      TEXT,
  medical_reports    TEXT, -- Base64
  passport_copy      TEXT, -- Base64
  assistance         JSONB DEFAULT '[]'::jsonb,
  message            TEXT,
  consent_accuracy   BOOLEAN DEFAULT false,
  consent_processing BOOLEAN DEFAULT false,
  consent_terms      BOOLEAN DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- Migration for existing table
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS hospital_pref TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS medical_reports TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS passport_copy TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS assistance JSONB DEFAULT '[]'::jsonb;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS consent_accuracy BOOLEAN DEFAULT false;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS consent_processing BOOLEAN DEFAULT false;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS consent_terms BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  content    TEXT NOT NULL,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Site-wide key/value settings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
-- Seed defaults (idempotent)
INSERT INTO site_settings (key, value)
  VALUES ('testimonials_visible', 'true')
  ON CONFLICT (key) DO NOTHING;

-- ─── Testimonials ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  quote      TEXT NOT NULL,
  name       TEXT NOT NULL,
  location   TEXT NOT NULL,
  enabled    BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Hospitals ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  location    TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  country_tag TEXT NOT NULL DEFAULT 'Thailand',
  tags        TEXT[] DEFAULT '{}',
  enabled     BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Services ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE,
  description  TEXT,
  page_content TEXT,           -- JSON block array for service detail page
  hero_banner_url TEXT,        -- Image URL for the service page hero banner
  enabled      BOOLEAN DEFAULT true,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Migration: add slug + page_content columns if upgrading from previous schema
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS page_content TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS hero_banner_url TEXT;

-- Seed default services (idempotent via title uniqueness assumption)
INSERT INTO services (title, description, sort_order) VALUES
  ('Doctor Appointments',          'We schedule the right specialist at the right hospital — no waiting rooms, no guesswork.', 0),
  ('Second Medical Opinion',       'An experienced specialist reviews your case before you decide on anything.',               1),
  ('Telemedicine',                 'Speak with a specialist remotely before you travel, so your plan is clear from day one.',  2),
  ('Medical Visa Assistance',      'Every document, handled — for a smooth, timely visa approval.',                            3),
  ('Hotel & Accommodation',        'Comfortable stays near your hospital, chosen for recovery needs and budget.',              4),
  ('Air Tickets & Airport Pickup', 'Flights coordinated around treatment, with a welcome when you land.',                     5),
  ('Air Ambulance',                'Emergency or scheduled air medical transport, coordinated end-to-end.',                    6),
  ('Tourism Package',              'Combine medical care with a curated travel experience in your destination country.',       7)
ON CONFLICT DO NOTHING;
