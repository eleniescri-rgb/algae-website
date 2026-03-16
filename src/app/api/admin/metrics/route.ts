import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const ADMIN_KEY = 'algae-secret'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase service role credentials')
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getServiceClient()

    const [
      { count: totalVisits },
      visitorsData,
      { count: totalLeads },
      { count: pilotLeads },
      { count: qualifiedLeads },
      geographyData,
      leadsData,
    ] = await Promise.all([
      // Total page visits (rows)
      supabase.from('visitors').select('*', { count: 'exact', head: true }),

      // All visitor_ids for unique count
      supabase.from('visitors').select('visitor_id'),

      // Total leads
      supabase.from('leads').select('*', { count: 'exact', head: true }),

      // Pilot interest leads
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('interest_type', 'pilot'),

      // Qualified leads: role contains hotel, manager, operations, owner, or director
      supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .or(
          'role.ilike.%hotel%,role.ilike.%manager%,role.ilike.%operations%,role.ilike.%owner%,role.ilike.%director%'
        ),

      // Geography: group leads by location
      supabase.from('leads').select('location'),

      // All leads for table
      supabase
        .from('leads')
        .select('id,created_at,name,company,role,location,interest_type,email')
        .order('created_at', { ascending: false })
        .limit(200),
    ])

    // Compute unique visitors client-side from the raw data
    const uniqueVisitors = new Set(
      (visitorsData.data ?? []).map((r: { visitor_id: string }) => r.visitor_id)
    ).size

    // Aggregate geography
    const geoMap: Record<string, number> = {}
    for (const row of geographyData.data ?? []) {
      const loc = (row.location as string | null)?.trim() || 'Unknown'
      geoMap[loc] = (geoMap[loc] ?? 0) + 1
    }
    const geography = Object.entries(geoMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }))

    return NextResponse.json({
      totalVisits: totalVisits ?? 0,
      uniqueVisitors,
      totalLeads: totalLeads ?? 0,
      pilotLeads: pilotLeads ?? 0,
      qualifiedLeads: qualifiedLeads ?? 0,
      geography,
      leads: leadsData.data ?? [],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
