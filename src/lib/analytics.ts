import { createClient, isSupabaseConfigured } from './supabase'

const VISITOR_KEY = 'algae_visitor_id'

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
    // POST to a server-side route so Vercel geo headers are available
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
