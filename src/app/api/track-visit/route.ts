import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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
      return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 200 })
    }

    const body = await request.json() as {
      visitor_id: string
      referrer?: string | null
      timezone?: string | null
    }

    if (!body.visitor_id) {
      return NextResponse.json({ ok: false, reason: 'missing_visitor_id' }, { status: 200 })
    }

    // Vercel injects these headers automatically in production.
    // In local dev they will be null — that's fine, we store null.
    const country = request.headers.get('x-vercel-ip-country') ?? null
    const region  = request.headers.get('x-vercel-ip-country-region') ?? null
    const rawCity = request.headers.get('x-vercel-ip-city') ?? null
    // Vercel URL-encodes the city name (e.g. "Canc%C3%BAn" → "Cancún")
    const city = rawCity ? decodeURIComponent(rawCity) : null

    await supabase.from('visitors').insert({
      visitor_id: body.visitor_id,
      referrer:   body.referrer   ?? null,
      timezone:   body.timezone   ?? null,
      country,
      region,
      city,
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Silently succeed — tracking must never break the page
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
