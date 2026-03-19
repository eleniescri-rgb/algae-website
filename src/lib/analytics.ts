import { createClient, isSupabaseConfigured } from './supabase'

const VISITOR_KEY = 'algae_visitor_id'

// Sections already tracked this session — prevents duplicate scroll events
const _trackedSections = new Set<string>()

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export async function trackVisit(): Promise<void> {
  try {
    const visitorId = getOrCreateVisitorId()
    if (!visitorId) return
    await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_id: visitorId,
        referrer: document.referrer || null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    })
  } catch {
    // Silently fail — tracking should never break the page
  }
}

// ─── Generic event tracker ────────────────────────────────────────────────────

export async function trackEvent(
  eventType: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  try {
    const visitorId = getOrCreateVisitorId()
    if (!visitorId) return
    await fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitorId, event_type: eventType, properties }),
    })
  } catch {
    // Silent — never break the page
  }
}

// ─── Specific trackers ────────────────────────────────────────────────────────

/** Track a click on any "Request Pilot" / primary CTA button. */
export async function trackCTAClick(): Promise<void> {
  await trackEvent('cta_click')
}

/**
 * Track when a user scrolls into a key section.
 * Fires at most once per section per session.
 *
 * @param section  Use the element's id attribute, e.g. 'features', 'pilot'
 */
export async function trackScrollDepth(section: string): Promise<void> {
  if (_trackedSections.has(section)) return
  _trackedSections.add(section)
  await trackEvent('scroll_depth', { section })
}

/**
 * Call once in a root useEffect. Measures how long the user stays on the page
 * and sends a session_end event on tab-hide or beforeunload.
 *
 * Returns a cleanup function for the effect.
 *
 * Requires the `events` table in Supabase:
 *
 *   CREATE TABLE events (
 *     id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *     visitor_id text        NOT NULL,
 *     event_type text        NOT NULL,
 *     properties jsonb,
 *     created_at timestamptz DEFAULT now()
 *   );
 *   CREATE INDEX ON events (event_type);
 *   CREATE INDEX ON events (visitor_id);
 *   ALTER TABLE events ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "anon insert" ON events FOR INSERT TO anon WITH CHECK (true);
 */
export function initSessionTracking(): () => void {
  if (typeof window === 'undefined') return () => {}
  const startTime = Date.now()
  let sent = false

  const sendSessionEnd = () => {
    if (sent) return
    sent = true
    const durationSec = Math.round((Date.now() - startTime) / 1000)
    const visitorId = localStorage.getItem(VISITOR_KEY)
    if (!visitorId) return
    const body = JSON.stringify({
      visitor_id: visitorId,
      event_type: 'session_end',
      properties: { duration_sec: durationSec },
    })
    // sendBeacon is more reliable than fetch on page unload
    navigator.sendBeacon(
      '/api/track-event',
      new Blob([body], { type: 'application/json' }),
    )
  }

  const handleVisibility = () => {
    if (document.visibilityState === 'hidden') sendSessionEnd()
  }

  window.addEventListener('beforeunload', sendSessionEnd)
  document.addEventListener('visibilitychange', handleVisibility)

  return () => {
    window.removeEventListener('beforeunload', sendSessionEnd)
    document.removeEventListener('visibilitychange', handleVisibility)
  }
}

// ─── Lead submission ──────────────────────────────────────────────────────────

export async function submitLead(formData: Record<string, string>): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }
  const visitorId = getOrCreateVisitorId()
  const supabase = createClient()
  const { error } = await supabase.from('leads').insert({
    visitor_id: visitorId || null,
    name: formData.name,
    email: formData.email,
    company: formData.company || null,
    role: formData.role || null,
    location: formData.location || null,
    property_type: formData.propertyType || null,
    sargassum_burden: formData.sargassumBurden || null,
    interest_type: formData.interestType || null,
    challenge: formData.challenge || null,
  })
  if (error) throw error
}
