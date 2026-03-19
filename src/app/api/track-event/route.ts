import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Lightweight event tracking endpoint.
 *
 * Supports: cta_click | scroll_depth | session_end
 *
 * ── Supabase setup required ────────────────────────────────────────────────
 *
 *   CREATE TABLE events (
 *     id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     visitor_id text        NOT NULL,
 *     event_type text        NOT NULL,    -- 'cta_click' | 'scroll_depth' | 'session_end'
 *     properties jsonb,                   -- { section: 'features' } | { duration_sec: 45 }
 *     created_at timestamptz DEFAULT now()
 *   );
 *
 *   CREATE INDEX ON events (event_type);
 *   CREATE INDEX ON events (visitor_id);
 *
 *   ALTER TABLE events ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "anon insert" ON events FOR INSERT TO anon WITH CHECK (true);
 *
 * ──────────────────────────────────────────────────────────────────────────
 */

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getClient()
    if (!supabase) {
      return NextResponse.json({ ok: false, reason: 'not_configured' })
    }

    let body: {
      visitor_id?: string
      event_type?: string
      properties?: Record<string, unknown>
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, reason: 'invalid_json' })
    }

    const { visitor_id, event_type, properties } = body

    if (!visitor_id || !event_type) {
      return NextResponse.json({ ok: false, reason: 'missing_fields' })
    }

    // Fire-and-forget — ignore errors so tracking never breaks the page
    await supabase.from('events').insert({
      visitor_id,
      event_type,
      properties: properties ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
