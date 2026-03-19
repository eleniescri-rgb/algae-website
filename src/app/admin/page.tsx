'use client'

export const dynamic = 'force-dynamic'

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
  // ── Existing ──
  totalVisits: number
  uniqueVisitors: number
  totalLeads: number
  pilotLeads: number
  qualifiedLeads: number
  geography: { location: string; count: number }[]
  propertyTypes: { type: string; count: number }[]
  conversionByCountry: { country: string; visitors: number; leads: number; rate: number }[]
  leads: Lead[]
  // ── New: demand signals ──
  ctaClicks: number
  ctaClickRate: number
  scrollDepthBenefits: number | null
  scrollDepthPilot: number | null
  avgTimeOnPageSec: number | null
  eventsAvailable: boolean
  // ── New: traffic sources ──
  trafficSources: { source: string; visitors: number; leads: number; pct: number }[]
  // ── New: qualified regions ──
  targetRegionVisitors: number
  targetRegionPct: number
  regionBreakdown: { name: string; code: string; visitors: number; leads: number }[]
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

function flag(code: string): string {
  if (!code || code.length !== 2) return ''
  return code.toUpperCase().replace(/[A-Z]/g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  )
}

function countryName(code: string): string {
  if (!code) return 'Unknown'
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

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

function fmtDuration(sec: number | null): string {
  if (sec === null) return '—'
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function sourceLabel(src: string): string {
  const map: Record<string, string> = {
    linkedin: 'LinkedIn',
    direct:   'Direct / Typed',
    other:    'Other referrals',
  }
  return map[src] ?? src
}

// ─── Reusable components ──────────────────────────────────────────────────────

function HorizontalBars({
  items, total, labelFn = (k) => k, colorFrom = '#0897B3', colorTo = '#47AECC', accentColor = '#0897B3',
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
              <span className="text-xs font-bold tabular-nums" style={{ color: accentColor, minWidth: '3.5ch' }}>
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

function StatCard({ label, value, sub, accent }: {
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
        <p className="font-display text-4xl font-black tracking-[-0.03em]" style={{ color: accent ?? '#FF751F' }}>
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

/** Compact stat card used inside the demand signals section */
function DemandCard({ label, value, sub, accent = '#FF751F', dim }: {
  label: string; value: string; sub?: string; accent?: string; dim?: boolean
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ background: '#ffffff', border: '1px solid #0897B314', opacity: dim ? 0.6 : 1 }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="font-display text-3xl font-black tracking-[-0.03em]" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground leading-snug">{sub}</p>}
    </div>
  )
}

/** Section header with a colored left accent bar */
function SectionHeader({ label, description, accent = '#0897B3', tag }: {
  label: string; description?: string; accent?: string; tag?: string
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-5 w-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            {label}
          </h2>
          {tag && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${accent}18`, color: accent }}>
              {tag}
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

/** MVP funnel step */
function FunnelStep({ label, value, pctLabel, accent, isLast }: {
  label: string; value: number; pctLabel?: string; accent: string; isLast?: boolean
}) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">{label}</p>
        <p className="font-display text-3xl font-black tracking-[-0.03em]" style={{ color: accent }}>
          {fmt(value)}
        </p>
        {pctLabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{pctLabel}</p>
        )}
      </div>
      {!isLast && (
        <div className="shrink-0 flex flex-col items-center gap-0.5 px-2">
          <div className="h-px w-8 bg-border" />
          <span className="text-[10px] text-muted-foreground">→</span>
        </div>
      )}
    </div>
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
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: '#47AECC', borderRightColor: '#47AECC40' }} />
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
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#47AECC', boxShadow: '0 0 6px #47AECC' }} />
            <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: '#47AECC' }}>
              Alga.e — Private Analytics
            </span>
          </div>
          <h1 className="font-display mt-2 text-2xl font-black tracking-[-0.03em]" style={{ color: '#CCE6EA' }}>
            MVP Validation Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#729DB9' }}>
            Demand signals for the Alga.e pilot program
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* ── Row 1: Core stat cards (existing) ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Unique Visitors" value={fmt(metrics.uniqueVisitors)} sub={`${fmt(metrics.totalVisits)} total page loads`} accent="#0897B3" />
          <StatCard label="Total Leads" value={fmt(metrics.totalLeads)} sub="form submissions" accent="#FF751F" />
          <StatCard label="Conversion Rate" value={convRate} sub="visitor → lead" accent={metrics.totalLeads / (metrics.uniqueVisitors || 1) >= 0.05 ? '#0897B3' : '#FF751F'} />
          <StatCard label="Pilot Interest" value={pilotRate} sub={`${fmt(metrics.pilotLeads)} of ${fmt(metrics.totalLeads)} leads`} accent="#FF751F" />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── NEW: Early Demand Signals ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #FF751F28' }}>
          {/* Section header bar */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, #FF751F08, #FF751F04)', borderBottom: '1px solid #FF751F18' }}>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#FF751F', boxShadow: '0 0 5px #FF751F80' }} />
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: '#FF751F' }}>
                  Early Demand Signals
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Intent indicators before lead conversion · key MVP validation metrics
                </p>
              </div>
            </div>
            {!metrics.eventsAvailable && (
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ background: '#FF751F14', color: '#FF751F80' }}>
                TODO: events table required
              </span>
            )}
          </div>

          <div className="p-5" style={{ background: '#fafcfd' }}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <DemandCard
                label="CTA Clicks"
                value={fmt(metrics.ctaClicks)}
                sub='"Request Pilot" button clicks'
                accent="#FF751F"
                dim={!metrics.eventsAvailable}
              />
              <DemandCard
                label="CTA Click Rate"
                value={metrics.eventsAvailable ? `${metrics.ctaClickRate}%` : '—'}
                sub="clicks / unique visitors"
                accent="#FF751F"
                dim={!metrics.eventsAvailable}
              />
              <DemandCard
                label="Scroll → Benefits"
                value={metrics.scrollDepthBenefits !== null ? `${metrics.scrollDepthBenefits}%` : '—'}
                sub="visitors reaching Benefits section"
                accent="#0897B3"
                dim={!metrics.eventsAvailable}
              />
              <DemandCard
                label="Scroll → Pilot"
                value={metrics.scrollDepthPilot !== null ? `${metrics.scrollDepthPilot}%` : '—'}
                sub="visitors reaching Pilot section"
                accent="#0897B3"
                dim={!metrics.eventsAvailable}
              />
              <DemandCard
                label="Avg Time on Page"
                value={fmtDuration(metrics.avgTimeOnPageSec)}
                sub="mean session duration"
                accent="#47AECC"
                dim={!metrics.eventsAvailable}
              />
            </div>

            {!metrics.eventsAvailable && (
              <div className="mt-4 rounded-lg px-4 py-3 text-xs" style={{ background: '#FF751F08', border: '1px solid #FF751F1a', color: '#FF751F99' }}>
                <strong style={{ color: '#FF751F' }}>Setup required:</strong> Create the <code className="mx-1 rounded px-1" style={{ background: '#FF751F12' }}>events</code> table in Supabase to unlock these metrics. See <code className="mx-1 rounded px-1" style={{ background: '#FF751F12' }}>src/app/api/track-event/route.ts</code> for the SQL schema. Tracking calls are already wired in Hero, Navbar, and the landing page.
              </div>
            )}
          </div>
        </div>

        {/* ── NEW: MVP Conversion Funnel ── */}
        <Card>
          <CardHeader>
            <SectionHeader
              label="MVP Conversion Funnel"
              description="Visitors → intent signals → leads. Shows all stages even with zero data."
              accent="#0897B3"
            />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-stretch gap-2">
              <FunnelStep
                label="Unique Visitors"
                value={metrics.uniqueVisitors}
                accent="#0897B3"
              />
              <FunnelStep
                label="CTA Clicks"
                value={metrics.ctaClicks}
                pctLabel={metrics.uniqueVisitors > 0
                  ? `${metrics.ctaClickRate}% of visitors`
                  : metrics.eventsAvailable ? '—' : 'No data yet'}
                accent="#FF751F"
              />
              <FunnelStep
                label="Leads (form)"
                value={metrics.totalLeads}
                pctLabel={metrics.ctaClicks > 0
                  ? `${((metrics.totalLeads / metrics.ctaClicks) * 100).toFixed(1)}% of CTA clicks`
                  : pct(metrics.totalLeads, metrics.uniqueVisitors) + ' of visitors'}
                accent="#47AECC"
                isLast
              />
            </div>

            {/* Visual bar */}
            <div className="mt-5 space-y-2">
              {[
                { label: 'Visitors',   value: metrics.uniqueVisitors, color: '#0897B3' },
                { label: 'CTA Clicks', value: metrics.ctaClicks,      color: '#FF751F' },
                { label: 'Leads',      value: metrics.totalLeads,      color: '#47AECC' },
              ].map(({ label, value, color }) => {
                const base = metrics.uniqueVisitors || 1
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: '#0897B30d' }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${Math.min((value / base) * 100, 100)}%`, backgroundColor: color, transition: 'width 0.5s ease' }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums w-8 shrink-0" style={{ color }}>{fmt(value)}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── Row 2: Geography + Hotel Type (existing, unchanged) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">Visitor Countries</CardTitle>
                  <CardDescription className="mt-0.5">Auto-detected from all visitor sessions · top {metrics.geography.length}</CardDescription>
                </div>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: '#0897B314', color: '#0897B3' }}>
                  {fmt(metrics.uniqueVisitors)} visitors
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <HorizontalBars
                items={metrics.geography.map((g) => ({ key: g.location, count: g.count }))}
                total={metrics.uniqueVisitors}
                labelFn={(code) => `${flag(code)}  ${countryName(code)}`}
                colorFrom="#0897B3" colorTo="#47AECC" accentColor="#0897B3"
              />
              {metrics.geography.length === 0 && (
                <p className="text-sm text-muted-foreground">Geo data appears after deployment on Vercel. Null in local dev.</p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">Leads by Hotel Type</CardTitle>
              <CardDescription className="mt-0.5">Property type from lead submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBars
                items={metrics.propertyTypes.map((p) => ({ key: p.type, count: p.count }))}
                total={metrics.totalLeads}
                labelFn={propTypeLabel}
                colorFrom="#FF751F" colorTo="#F4AE5B" accentColor="#FF751F"
              />
            </CardContent>
          </Card>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── Row 3: Qualified Leads + Conversion by Country (existing) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">Qualified Leads</CardTitle>
              <CardDescription>Role matches: hotel, manager, operations, owner, director</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-5xl font-black tracking-[-0.03em]" style={{ color: '#0897B3' }}>
                {fmt(metrics.qualifiedLeads)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pct(metrics.qualifiedLeads, metrics.totalLeads)} of all leads
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8 gap-0 overflow-hidden py-0">
            <CardHeader className="border-b py-5" style={{ borderColor: 'var(--color-border)' }}>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">Conversion by Country</CardTitle>
              <CardDescription>Visitors vs leads per geography — green bar = ≥5% target</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {metrics.conversionByCountry.length === 0 ? (
                <div className="px-6 py-8">
                  <p className="text-sm text-muted-foreground">No geo data yet — appears after Vercel deployment.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', background: '#0897B308' }}>
                        {['Country', 'Visitors', 'Leads', 'Conv. Rate'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{h}</th>
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
                            style={{ borderBottom: i < metrics.conversionByCountry.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                            className="transition-colors duration-100 hover:bg-muted/40"
                          >
                            <td className="px-4 py-3 font-medium whitespace-nowrap">{flag(row.country)}&nbsp; {countryName(row.country)}</td>
                            <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmt(row.visitors)}</td>
                            <td className="px-4 py-3 tabular-nums font-semibold" style={{ color: row.leads > 0 ? '#FF751F' : 'inherit' }}>{fmt(row.leads)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-20 rounded-full" style={{ background: '#0897B314' }}>
                                  <div className="h-1.5 rounded-full" style={{ width: `${(row.rate / maxConvRate) * 100}%`, background: barColor, transition: 'width 0.4s ease' }} />
                                </div>
                                <span className="text-xs font-bold tabular-nums" style={{ color: isGood ? '#0897B3' : '#729DB9', minWidth: '3.5ch' }}>
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── NEW: Qualified Traffic (Target Regions) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader>
            <SectionHeader
              label="Qualified Traffic — Target Regions"
              description="Mexico · USA · Caribbean — primary beachfront hotel markets"
              accent="#0897B3"
            />
            <div className="flex items-center gap-4 mt-1">
              <div>
                <p className="font-display text-4xl font-black tracking-[-0.03em]" style={{ color: '#0897B3' }}>
                  {fmt(metrics.targetRegionVisitors)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  target region visitors · {metrics.targetRegionPct}% of total
                </p>
              </div>
              <div className="flex-1 h-2 rounded-full ml-4" style={{ background: '#0897B30d' }}>
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${metrics.targetRegionPct}%`, background: 'linear-gradient(90deg, #0897B3, #47AECC)', transition: 'width 0.5s ease' }}
                />
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: '#0897B3' }}>{metrics.targetRegionPct}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.regionBreakdown.map((r) => (
                <div key={r.code} className="rounded-xl p-4" style={{ background: '#0897B308', border: '1px solid #0897B314' }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-2">{r.name}</p>
                  <p className="font-display text-2xl font-black tracking-[-0.03em]" style={{ color: '#0897B3' }}>{fmt(r.visitors)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    visitors ·{' '}
                    <span style={{ color: r.leads > 0 ? '#FF751F' : undefined }}>{fmt(r.leads)} leads</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {metrics.uniqueVisitors > 0
                      ? `${Math.round((r.visitors / metrics.uniqueVisitors) * 100)}% of total traffic`
                      : '—'}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Placeholder: hotel-specific visitor tagging not yet implemented. Future enrichment via UTM params or form data.
            </p>
          </CardContent>
        </Card>

        {/* ── NEW: Traffic Sources ── */}
        <Card>
          <CardHeader>
            <SectionHeader
              label="Traffic Sources"
              description="Inferred from HTTP referrer on first visit — connects outreach channels to landing page performance"
              accent="#47AECC"
            />
          </CardHeader>
          <CardContent>
            {metrics.trafficSources.every((s) => s.visitors === 0) ? (
              <p className="text-sm text-muted-foreground">No traffic data yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: '#47AECC08' }}>
                      {['Source', '% of Traffic', 'Visitors', 'Leads', 'Conv. Rate'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.trafficSources.map((row, i) => (
                      <tr
                        key={row.source}
                        style={{ borderBottom: i < metrics.trafficSources.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                        className="transition-colors duration-100 hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 font-semibold">{sourceLabel(row.source)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 rounded-full" style={{ background: '#47AECC14' }}>
                              <div
                                className="h-1.5 rounded-full"
                                style={{ width: `${row.pct}%`, background: 'linear-gradient(90deg, #47AECC, #0897B3)', transition: 'width 0.4s ease' }}
                              />
                            </div>
                            <span className="text-xs font-bold tabular-nums" style={{ color: '#47AECC' }}>{row.pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmt(row.visitors)}</td>
                        <td className="px-4 py-3 tabular-nums font-semibold" style={{ color: row.leads > 0 ? '#FF751F' : undefined }}>
                          {fmt(row.leads)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">
                          {pct(row.leads, row.visitors)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── NEW: User Engagement ── */}
        <Card>
          <CardHeader>
            <SectionHeader
              label="User Engagement"
              description="Session quality signals — some metrics require the events table"
              accent="#47AECC"
            />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl p-4" style={{ background: '#47AECC08', border: '1px solid #47AECC18' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">Avg Session Duration</p>
                <p className="font-display text-3xl font-black tracking-[-0.03em]" style={{ color: '#47AECC' }}>
                  {fmtDuration(metrics.avgTimeOnPageSec)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {metrics.eventsAvailable ? 'mean time on page' : 'Requires events table'}
                </p>
              </div>

              <div className="rounded-xl p-4" style={{ background: '#0897B308', border: '1px solid #0897B314' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">Bounce Rate</p>
                <p className="font-display text-3xl font-black tracking-[-0.03em]" style={{ color: '#729DB9' }}>—</p>
                {/* TODO: Implement bounce rate — a visitor that fires only one page load event and no scroll/CTA events */}
                <p className="text-[11px] text-muted-foreground mt-1">Not yet implemented</p>
              </div>

              <div className="rounded-xl p-4" style={{ background: '#0897B308', border: '1px solid #0897B314' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">Pages / Session</p>
                <p className="font-display text-3xl font-black tracking-[-0.03em]" style={{ color: '#729DB9' }}>—</p>
                {/* TODO: Pages/session — single-page app so always 1; implement if multi-page routes are added */}
                <p className="text-[11px] text-muted-foreground mt-1">Single-page app · N/A</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ── Row 4: All Leads table (existing, unchanged) ── */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="border-b py-5" style={{ borderColor: 'var(--color-border)' }}>
            <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">All Leads</CardTitle>
            <CardDescription>{metrics.leads.length} submissions, most recent first</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {metrics.leads.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No leads yet. Share your landing page to start collecting.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: '#0897B308' }}>
                      {['Date', 'Name', 'Company', 'Role', 'Location', 'Interest', 'Email'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.leads.map((lead, i) => (
                      <tr
                        key={lead.id}
                        style={{ borderBottom: i < metrics.leads.length - 1 ? '1px solid var(--color-border)' : 'none' }}
                        className="transition-colors duration-100 hover:bg-muted/40"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
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
                          <a href={`mailto:${lead.email}`} className="text-muted-foreground transition-colors duration-150 hover:text-primary">
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
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#063D57' }}>
        <div className="rounded-2xl p-10 text-center" style={{ background: '#093349', border: '1px solid #47AECC14' }}>
          <p className="font-display text-2xl font-black tracking-[-0.03em]" style={{ color: '#CCE6EA' }}>Unauthorized</p>
          <p className="mt-2 text-sm" style={{ color: '#729DB9' }}>Access requires a valid key parameter.</p>
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
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#063D57' }}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: '#47AECC', borderRightColor: '#47AECC40' }} />
        </div>
      }
    >
      <AdminGate />
    </Suspense>
  )
}
