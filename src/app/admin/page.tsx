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

// ─── Types ───────────────────────────────────────────────────────────────────

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
  leads: Lead[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString()
}

function pct(num: number, den: number) {
  if (!den) return '—'
  return (((num / den) * 100).toFixed(1)) + '%'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function interestLabel(v: string | null) {
  const map: Record<string, string> = {
    pilot: 'Pilot',
    research: 'Research',
    partnership: 'Partnership',
    informed: 'Stay informed',
  }
  return v ? (map[v] ?? v) : '—'
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
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

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ adminKey }: { adminKey: string }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)
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
            Make sure SUPABASE_SERVICE_ROLE_KEY is set in your .env.local
          </p>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  const convRate = pct(metrics.totalLeads, metrics.uniqueVisitors)
  const pilotRate = pct(metrics.pilotLeads, metrics.totalLeads)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f8fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#063D57', borderBottom: '1px solid #47AECC1a' }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: '#47AECC', boxShadow: '0 0 6px #47AECC' }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.16em]"
              style={{ color: '#47AECC' }}
            >
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

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        {/* Top stat cards */}
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

        {/* Middle row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Qualified leads */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
                Qualified Leads
              </CardTitle>
              <CardDescription>
                Roles matching: hotel, manager, operations, owner, director
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

          {/* Geography */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-black tracking-[-0.02em]">
                Top Locations
              </CardTitle>
              <CardDescription>Where leads are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.geography.length === 0 ? (
                <p className="text-sm text-muted-foreground">No location data yet</p>
              ) : (
                <div className="space-y-2">
                  {metrics.geography.map(({ location, count }) => (
                    <div key={location} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{location}</span>
                          <span className="text-xs text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full" style={{ background: '#0897B314' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${(count / metrics.geography[0].count) * 100}%`,
                              background: 'linear-gradient(90deg, #0897B3, #47AECC)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leads table */}
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
                <p className="text-sm text-muted-foreground">No leads yet. Share your landing page to start collecting.</p>
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

// ─── Gate ────────────────────────────────────────────────────────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

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
