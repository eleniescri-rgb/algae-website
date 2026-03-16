'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string
  created_at: string
  name: string
  company: string | null
  role: string | null
  location: string | null
  interest_type: string | null
  email: string
}

interface Metrics {
  totalVisits: number
  uniqueVisitors: number
  totalLeads: number
  pilotLeads: number
  qualifiedLeads: number
  geography: { location: string; count: number }[]
  propertyTypes: { type: string; count: number }[]
  conversionByCountry: { country: string; visitors: number; leads: number; rate: number }[]
  leads: Lead[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString()
}

function pct(num: number, den: number) {
  if (!den) return '—'
  return ((num / den) * 100).toFixed(1) + '%'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function interestLabel(v: string | null) {
  const map: Record<string, string> = {
    pilot: 'Pilot', research: 'Research', partnership: 'Partnership', informed: 'Stay informed',
  }
  return v ? (map[v] ?? v) : '—'
}

/** ISO 3166-1 alpha-2 → flag emoji */
function flag(code: string): string {
  if (!code || code.length !== 2) return ''
  return code.toUpperCase().replace(/[A-Z]/g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  )
}

/** ISO 3166-1 alpha-2 → human-readable country name */
function countryName(code: string): string {
  if (!code) return 'Unknown'
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

/** Supabase property_type value → display label */
function propTypeLabel(type: string): string {
  const map: Record<string, string> = {
    boutique_hotel: 'Boutique Hotel',
    mid_hotel:      'Mid-size Hotel',
    large_resort:   'Large Resort',
    hotel_group:    'Hotel Group',
    other:          'Other',
    unknown:        'Not specified',
  }
  return map[type] ?? type
}

// ─── Reusable: Horizontal bar chart ──────────────────────────────────────────

function HorizontalBars({
  items,
  total,
  labelFn = (k) => k,
  colorFrom = '#0897B3',
  colorTo = '#47AECC',
  accentColor = '#0897B3',
}: {
  items: { key: string; count: number }[]
  total: number
  labelFn?: (key: string) => string
  colorFrom?: string
  colorTo?: string
  accentColor?: string
}) {
  const max = items[0]?.count ?? 1
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No data yet</p>
  }
  return (
    <div className="space-y-3">
      {items.map(({ key, count }) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-sm font-medium leading-none truncate">{labelFn(key)}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">{fmt(count)}</span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: accentColor, minWidth: '3.5ch' }}
              >
                {total > 0 ? Math.round((count / total) * 100) + '%' : '—'}
              </span>
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full" style={{ background: '#0897B314' }}>
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${(count / max) * 100}%`,
                background: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Reusable: Stat card ──────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub?: string; accent?: string
}) {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="pb-0">
        <CardDescription className="text-xs font-semibold uppercase tracking-[0.12em]">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="font-display text-4xl font-black tracking-[-0.03em]"
          style={{ color: accent ?? '#FF751F' }}
        >
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ adminKey }: { adminKey: string }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/metrics?key=${encodeURIComponent(adminKey)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setMetrics(data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [adminKey])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#063D57' }}>
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-transparent"
            style={{ borderTopColor: '#47AECC', borderRightColor: '#47AECC40' }}
          />
          <p className="text-sm" style={{ color: '#729DB9' }}>Loading metrics…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#063D57' }}>
        <div className="rounded-xl p-8 text-center" style={{ background: '#FF751F0d', border: '1px solid #FF751F40' }}>
          <p className="font-display text-lg font-bold" style={{ color: '#CCE6EA' }}>Error loading metrics</p>
          <p className="mt-2 text-sm" style={{ color: '#729DB9' }}>{error}</p>
          <p className="mt-1 text-xs" style={{ color: '#47AECC80' }}>
            Make sure SUPABASE_SERVICE_ROLE_KEY is set in your environment
          </p>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  const convRate  = pct(metrics.totalLeads, metrics.uniqueVisitors)
  const pilotRate = pct(metrics.pilotLeads, metrics.totalLeads)
  const maxConvRate = Math.max(...metrics.conversionByCountry.map((d) => d.rate), 1)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f8fa' }}>

      {/* ── Header ── */}
      <div style={{ backgroundColor: '#063D57', borderBottom: '1px solid #47AECC1a' }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: '#47AECC', boxShadow: '0 0 6px #47AECC' }}
            />
            <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: '#47AECC' }}>
              Alga.e — Private Analytics
            </span>
          </div>
          <h1
            className="font-display mt-2 text-2xl font-black tracking-[-0.03em]"
            style={{ color: '#CCE6EA' }}
          >
            MVP Validation Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#729DB9' }}>
            Demand signals for the Alga.e pilot program
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* ── Row 1: Stat cards ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Unique Visitors"
            value={fmt(metrics.uniqueVisitors)}
            sub={`${fmt(metrics.totalVisits)} total page loads`}
            accent="#0897B3"
          />
          <StatCard
            label="Total Leads"
            value={fmt(metrics.totalLeads)}
            sub="form submissions"
            accent="#FF751F"
          />
          <StatCard
            label="Conversion Rate"
            value={convRate}
            sub="visitor → lead"
            accent={metrics.totalLeads / (metrics.uniqueVisitors || 1) >= 0.05 ? '#0897B3' : '#FF751F'}
          />
          <StatCard
            label="Pilot Interest"
            value={pilotRate}
            sub={`${fmt(metrics.pilotLeads)} of ${fmt(metrics.totalLeads)} leads`}
            accent="#FF751F"
          />
        </div>

        {/* ── Row 2: Geography + Hotel Type ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          {/* Geography */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
                    Visitor Countries
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Auto-detected from all visitor sessions · top {metrics.geography.length}
                  </CardDescription>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ background: '#0897B314', color: '#0897B3' }}
                >
                  {fmt(metrics.uniqueVisitors)} visitors
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <HorizontalBars
                items={metrics.geography.map((g) => ({ key: g.location, count: g.count }))}
                total={metrics.uniqueVisitors}
                labelFn={(code) => `${flag(code)}  ${countryName(code)}`}
                colorFrom="#0897B3"
                colorTo="#47AECC"
                accentColor="#0897B3"
              />
              {metrics.geography.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Geo data appears after deployment on Vercel. Null in local dev.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Hotel Type */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
                Leads by Hotel Type
              </CardTitle>
              <CardDescription className="mt-0.5">
                Property type from lead submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBars
                items={metrics.propertyTypes.map((p) => ({ key: p.type, count: p.count }))}
                total={metrics.totalLeads}
                labelFn={propTypeLabel}
                colorFrom="#FF751F"
                colorTo="#F4AE5B"
                accentColor="#FF751F"
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Row 3: Qualified Leads + Conversion by Country ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

          {/* Qualified leads */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
                Qualified Leads
              </CardTitle>
              <CardDescription>
                Role matches: hotel, manager, operations, owner, director
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p
                className="font-display text-5xl font-black tracking-[-0.03em]"
                style={{ color: '#0897B3' }}
              >
                {fmt(metrics.qualifiedLeads)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pct(metrics.qualifiedLeads, metrics.totalLeads)} of all leads
              </p>
            </CardContent>
          </Card>

          {/* Conversion by country */}
          <Card className="lg:col-span-8 gap-0 overflow-hidden py-0">
            <CardHeader className="border-b py-5" style={{ borderColor: 'var(--color-border)' }}>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
                Conversion by Country
              </CardTitle>
              <CardDescription>
                Visitors vs leads per geography — green bar = ≥5% target
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.conversionByCountry.length === 0 ? (
                <div className="px-6 py-8">
                  <p className="text-sm text-muted-foreground">
                    No geo data yet — appears after Vercel deployment.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', background: '#0897B308' }}>
                        {['Country', 'Visitors', 'Leads', 'Conv. Rate'].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.conversionByCountry.map((row, i) => {
                        const isGood = row.rate >= 5
                        const barColor = isGood ? '#0897B3' : row.rate >= 2 ? '#F4AE5B' : '#FF751F40'
                        return (
                          <tr
                            key={row.country}
                            style={{
                              borderBottom:
                                i < metrics.conversionByCountry.length - 1
                                  ? '1px solid var(--color-border)'
                                  : 'none',
                            }}
                            className="transition-colors duration-100 hover:bg-muted/40"
                          >
                            <td className="px-4 py-3 font-medium whitespace-nowrap">
                              {flag(row.country)}&nbsp; {countryName(row.country)}
                            </td>
                            <td className="px-4 py-3 tabular-nums text-muted-foreground">
                              {fmt(row.visitors)}
                            </td>
                            <td
                              className="px-4 py-3 tabular-nums font-semibold"
                              style={{ color: row.leads > 0 ? '#FF751F' : 'inherit' }}
                            >
                              {fmt(row.leads)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-1.5 w-20 rounded-full"
                                  style={{ background: '#0897B314' }}
                                >
                                  <div
                                    className="h-1.5 rounded-full"
                                    style={{
                                      width: `${(row.rate / maxConvRate) * 100}%`,
                                      background: barColor,
                                      transition: 'width 0.4s ease',
                                    }}
                                  />
                                </div>
                                <span
                                  className="text-xs font-bold tabular-nums"
                                  style={{
                                    color: isGood ? '#0897B3' : '#729DB9',
                                    minWidth: '3.5ch',
                                  }}
                                >
                                  {row.rate.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Row 4: Leads table ── */}
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-5" style={{ borderColor: 'var(--color-border)' }}>
            <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
              All Leads
            </CardTitle>
            <CardDescription>{metrics.leads.length} submissions, most recent first</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {metrics.leads.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No leads yet. Share your landing page to start collecting.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: '#0897B308' }}>
                      {['Date', 'Name', 'Company', 'Role', 'Location', 'Interest', 'Email'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.leads.map((lead, i) => (
                      <tr
                        key={lead.id}
                        style={{
                          borderBottom: i < metrics.leads.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}
                        className="transition-colors duration-100 hover:bg-muted/40"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-4 py-3 font-medium">{lead.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{lead.company ?? '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{lead.role ?? '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{lead.location ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={
                              lead.interest_type === 'pilot'
                                ? { background: '#FF751F1a', color: '#FF751F' }
                                : lead.interest_type === 'partnership'
                                ? { background: '#0897B31a', color: '#0897B3' }
                                : { background: '#47AECC1a', color: '#47AECC' }
                            }
                          >
                            {interestLabel(lead.interest_type)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-muted-foreground transition-colors duration-150 hover:text-primary"
                          >
                            {lead.email}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs" style={{ color: '#47AECC40' }}>
          Alga.e Private Dashboard · {new Date().getFullYear()} · Access via ?key= URL param
        </p>
      </div>
    </div>
  )
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AdminGate() {
  const params = useSearchParams()
  const key = params.get('key') ?? ''

  if (key !== 'algae-secret') {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#063D57' }}
      >
        <div
          className="rounded-2xl p-10 text-center"
          style={{ background: '#093349', border: '1px solid #47AECC14' }}
        >
          <p
            className="font-display text-2xl font-black tracking-[-0.03em]"
            style={{ color: '#CCE6EA' }}
          >
            Unauthorized
          </p>
          <p className="mt-2 text-sm" style={{ color: '#729DB9' }}>
            Access requires a valid key parameter.
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard adminKey={key} />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: '#063D57' }}
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
            style={{ borderTopColor: '#47AECC', borderRightColor: '#47AECC40' }}
          />
        </div>
      }
    >
      <AdminGate />
    </Suspense>
  )
}
