-- Run this once in the Vercel Postgres query console after connecting your database.

CREATE TABLE IF NOT EXISTS consultations (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT,
  whatsapp   TEXT,
  email      TEXT,
  condition  TEXT,
  message    TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  content    TEXT NOT NULL,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
