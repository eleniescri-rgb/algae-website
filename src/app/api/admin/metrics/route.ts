import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const ADMIN_KEY = 'algae-secret'

// ─── Target market definitions ────────────────────────────────────────────────

/** ISO 3166-1 alpha-2 codes for Caribbean territories */
const CARIBBEAN_CODES = new Set([
  'AG', 'AI', 'AW', 'BB', 'BL', 'BQ', 'BS', 'CU', 'CW', 'DM',
  'DO', 'GD', 'GP', 'HT', 'JM', 'KN', 'KY', 'LC', 'MF', 'MQ',
  'MS', 'PR', 'SX', 'TC', 'TT', 'VC', 'VG', 'VI',
])

const TARGET_REGIONS: { name: string; code: string; codes: string[] }[] = [
  { name: 'Mexico',    code: 'MX',    codes: ['MX'] },
  { name: 'USA',       code: 'US',    codes: ['US'] },
  { name: 'Caribbean', code: 'CARIB', codes: [...CARIBBEAN_CODES] },
]

// ─── Traffic source parsing ───────────────────────────────────────────────────

const LINKEDIN_DOMAINS = ['linkedin.com', 'lnkd.in']

function parseSource(referrer: string | null | undefined): 'linkedin' | 'direct' | 'other' {
  if (!referrer) return 'direct'
  const lower = referrer.toLowerCase()
  if (LINKEDIN_DOMAINS.some((d) => lower.includes(d))) return 'linkedin'
  return 'other'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing Supabase service role credentials')
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } })
}

const QUALIFIED_KEYWORDS = ['hotel', 'manager', 'operations', 'owner', 'director']

// ─── Route ────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getServiceClient()

    // ── Core queries (existing) ────────────────────────────────────────────────
    const [visitorsResult, leadsResult] = await Promise.all([
      supabase.from('visitors').select('visitor_id, country, referrer'),
      supabase
        .from('leads')
        .select('id, created_at, name, company, role, location, property_type, interest_type, email, visitor_id')
        .order('created_at', { ascending: false })
        .limit(500),
    ])

    const visitors = visitorsResult.data ?? []
    const leads    = leadsResult.data    ?? []

    // ── Basic metrics (unchanged) ──────────────────────────────────────────────
    const totalVisits    = visitors.length
    const uniqueVisitors = new Set(visitors.map((r) => r.visitor_id)).size
    const totalLeads     = leads.length
    const pilotLeads     = leads.filter((l) => l.interest_type === 'pilot').length
    const qualifiedLeads = leads.filter((l) =>
      l.role && QUALIFIED_KEYWORDS.some((kw) => (l.role as string).toLowerCase().includes(kw))
    ).length

    // ── visitor_id → country lookup (unchanged) ────────────────────────────────
    const visitorIdToCountry: Record<string, string> = {}
    const visitorCountByCountry: Record<string, number> = {}
    for (const v of visitors) {
      const c   = (v.country as string | null)?.trim()
      const vid = v.visitor_id as string | null
      if (c) {
        if (vid) visitorIdToCountry[vid] = c
        visitorCountByCountry[c] = (visitorCountByCountry[c] ?? 0) + 1
      }
    }

    // ── Geography (unchanged) ──────────────────────────────────────────────────
    const geography = Object.entries(visitorCountByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([location, count]) => ({ location, count }))

    // ── Leads by property type (unchanged) ────────────────────────────────────
    const propTypeMap: Record<string, number> = {}
    for (const l of leads) {
      const t = (l.property_type as string | null)?.trim() || 'unknown'
      propTypeMap[t] = (propTypeMap[t] ?? 0) + 1
    }
    const propertyTypes = Object.entries(propTypeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }))

    // ── Conversion by country (unchanged) ─────────────────────────────────────
    const leadCountByCountry: Record<string, number> = {}
    for (const l of leads) {
      const country =
        (l.visitor_id ? visitorIdToCountry[l.visitor_id as string] : null) ?? 'Unknown'
      leadCountByCountry[country] = (leadCountByCountry[country] ?? 0) + 1
    }

    const conversionByCountry = Object.entries(visitorCountByCountry)
      .map(([country, visitorCount]) => ({
        country,
        visitors: visitorCount,
        leads:    leadCountByCountry[country] ?? 0,
        rate:     visitorCount > 0 ? ((leadCountByCountry[country] ?? 0) / visitorCount) * 100 : 0,
      }))
      .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors)
      .slice(0, 15)

    // ── NEW: Traffic sources (from referrer in visitors table) ─────────────────
    // Build visitor_id → first-seen referrer map (one referrer per unique visitor)
    const visitorFirstReferrer: Record<string, string | null> = {}
    for (const v of visitors) {
      const vid = v.visitor_id as string | null
      if (vid && !(vid in visitorFirstReferrer)) {
        visitorFirstReferrer[vid] = (v.referrer as string | null) ?? null
      }
    }

    const sourceVisitorCount: Record<string, number> = { linkedin: 0, direct: 0, other: 0 }
    for (const referrer of Object.values(visitorFirstReferrer)) {
      const src = parseSource(referrer)
      sourceVisitorCount[src]++
    }

    // Leads per source — map via visitor's first referrer
    const sourceLeadCount: Record<string, number> = { linkedin: 0, direct: 0, other: 0 }
    for (const l of leads) {
      const vid = l.visitor_id as string | null
      const referrer = vid ? (visitorFirstReferrer[vid] ?? null) : null
      const src = parseSource(referrer)
      sourceLeadCount[src]++
    }

    const trafficSources = (['linkedin', 'direct', 'other'] as const).map((src) => ({
      source:   src,
      visitors: sourceVisitorCount[src],
      leads:    sourceLeadCount[src],
      pct:      uniqueVisitors > 0
        ? Math.round((sourceVisitorCount[src] / uniqueVisitors) * 100)
        : 0,
    }))

    // ── NEW: Target region traffic (MX, US, Caribbean) ─────────────────────────
    const regionBreakdown = TARGET_REGIONS.map(({ name, code, codes }) => {
      const codeSet = new Set(codes)
      const regionVisitors = Object.entries(visitorCountByCountry)
        .filter(([c]) => codeSet.has(c))
        .reduce((sum, [, n]) => sum + n, 0)
      const regionLeads = Object.entries(leadCountByCountry)
        .filter(([c]) => codeSet.has(c))
        .reduce((sum, [, n]) => sum + n, 0)
      return { name, code, visitors: regionVisitors, leads: regionLeads }
    })

    const targetRegionVisitors = regionBreakdown.reduce((s, r) => s + r.visitors, 0)
    const targetRegionPct =
      uniqueVisitors > 0 ? Math.round((targetRegionVisitors / uniqueVisitors) * 100) : 0

    // ── NEW: Events-based metrics (CTA clicks, scroll depth, session duration) ──
    // Graceful fallback: if the `events` table doesn't exist yet, all are null/0.
    let ctaClicks                              = 0
    let ctaClickRate                           = 0
    let scrollDepthBenefits: number | null     = null
    let scrollDepthPilot: number | null        = null
    let avgTimeOnPageSec: number | null        = null
    let eventsAvailable                        = false

    const [ctaResult, scrollResult, sessionResult] = await Promise.all([
      supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'cta_click'),
      supabase
        .from('events')
        .select('visitor_id, properties')
        .eq('event_type', 'scroll_depth'),
      supabase
        .from('events')
        .select('properties')
        .eq('event_type', 'session_end'),
    ])

    if (!ctaResult.error) {
      eventsAvailable = true
      ctaClicks       = ctaResult.count ?? 0
      ctaClickRate    = uniqueVisitors > 0
        ? parseFloat(((ctaClicks / uniqueVisitors) * 100).toFixed(1))
        : 0

      if (!scrollResult.error && scrollResult.data && uniqueVisitors > 0) {
        const benefitsSet = new Set(
          scrollResult.data
            .filter((e) => (e.properties as { section?: string })?.section === 'features')
            .map((e) => e.visitor_id),
        )
        const pilotSet = new Set(
          scrollResult.data
            .filter((e) => (e.properties as { section?: string })?.section === 'pilot')
            .map((e) => e.visitor_id),
        )
        scrollDepthBenefits = Math.round((benefitsSet.size / uniqueVisitors) * 100)
        scrollDepthPilot    = Math.round((pilotSet.size / uniqueVisitors) * 100)
      }

      if (!sessionResult.error && sessionResult.data && sessionResult.data.length > 0) {
        const durations = sessionResult.data
          .map((e) => (e.properties as { duration_sec?: number })?.duration_sec)
          // filter: must be a positive number under 1 hour (filter outliers/bots)
          .filter((d): d is number => typeof d === 'number' && d > 0 && d < 3600)
        if (durations.length > 0) {
          avgTimeOnPageSec = Math.round(
            durations.reduce((a, b) => a + b, 0) / durations.length,
          )
        }
      }
    }

    return NextResponse.json({
      // ── Existing metrics ────────────────────────────────────────────────────
      totalVisits,
      uniqueVisitors,
      totalLeads,
      pilotLeads,
      qualifiedLeads,
      geography,
      propertyTypes,
      conversionByCountry,
      leads,
      // ── New: demand signals (events table) ─────────────────────────────────
      ctaClicks,
      ctaClickRate,
      scrollDepthBenefits,
      scrollDepthPilot,
      avgTimeOnPageSec,
      eventsAvailable,
      // ── New: traffic sources (from referrer) ────────────────────────────────
      trafficSources,
      // ── New: qualified regions ──────────────────────────────────────────────
      targetRegionVisitors,
      targetRegionPct,
      regionBreakdown,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
