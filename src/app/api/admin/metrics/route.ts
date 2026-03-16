import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const ADMIN_KEY = 'algae-secret'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing Supabase service role credentials')
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } })
}

const QUALIFIED_KEYWORDS = ['hotel', 'manager', 'operations', 'owner', 'director']

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getServiceClient()

    // ── Two queries only — all aggregation done in JS ─────────────────────
    const [visitorsResult, leadsResult] = await Promise.all([
      supabase.from('visitors').select('visitor_id, country'),
      supabase
        .from('leads')
        .select('id, created_at, name, company, role, location, property_type, interest_type, email, visitor_id')
        .order('created_at', { ascending: false })
        .limit(500),
    ])

    const visitors = visitorsResult.data ?? []
    const leads    = leadsResult.data    ?? []

    // ── Basic metrics ─────────────────────────────────────────────────────
    const totalVisits    = visitors.length
    const uniqueVisitors = new Set(visitors.map((r) => r.visitor_id)).size
    const totalLeads     = leads.length
    const pilotLeads     = leads.filter((l) => l.interest_type === 'pilot').length
    const qualifiedLeads = leads.filter((l) =>
      l.role && QUALIFIED_KEYWORDS.some((kw) => (l.role as string).toLowerCase().includes(kw))
    ).length

    // ── Build visitor_id → country lookup ────────────────────────────────
    const visitorIdToCountry: Record<string, string> = {}
    const visitorCountByCountry: Record<string, number> = {}
    for (const v of visitors) {
      const c = (v.country as string | null)?.trim()
      if (c) {
        if (v.visitor_id) visitorIdToCountry[v.visitor_id] = c
        visitorCountByCountry[c] = (visitorCountByCountry[c] ?? 0) + 1
      }
    }

    // ── Geography: top visitor countries ─────────────────────────────────
    const geography = Object.entries(visitorCountByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([location, count]) => ({ location, count }))

    // ── Leads by property type ────────────────────────────────────────────
    const propTypeMap: Record<string, number> = {}
    for (const l of leads) {
      const t = (l.property_type as string | null)?.trim() || 'unknown'
      propTypeMap[t] = (propTypeMap[t] ?? 0) + 1
    }
    const propertyTypes = Object.entries(propTypeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }))

    // ── Conversion by country ─────────────────────────────────────────────
    // For each lead, look up its visitor's country via visitor_id
    const leadCountByCountry: Record<string, number> = {}
    for (const l of leads) {
      const country =
        (l.visitor_id ? visitorIdToCountry[l.visitor_id as string] : null) ?? 'Unknown'
      leadCountByCountry[country] = (leadCountByCountry[country] ?? 0) + 1
    }

    // Include all countries that have at least one visitor
    const conversionByCountry = Object.entries(visitorCountByCountry)
      .map(([country, visitorCount]) => ({
        country,
        visitors: visitorCount,
        leads:    leadCountByCountry[country] ?? 0,
        rate:     visitorCount > 0 ? ((leadCountByCountry[country] ?? 0) / visitorCount) * 100 : 0,
      }))
      .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors)
      .slice(0, 15)

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      totalLeads,
      pilotLeads,
      qualifiedLeads,
      geography,
      propertyTypes,
      conversionByCountry,
      leads,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
