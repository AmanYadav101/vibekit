import { getPool } from "./db.js";

export const handler = async () => {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS pages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      theme TEXT NOT NULL DEFAULT 'minimal',
      content JSONB NOT NULL DEFAULT '{}',
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Migration successful" }),
  };
};
