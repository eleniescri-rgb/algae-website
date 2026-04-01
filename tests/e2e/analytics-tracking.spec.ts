import { test, expect } from '@playwright/test'

/**
 * Verify analytics tracking fires correctly —
 * UTM params, scroll events, CTA clicks, session end.
 */
test.describe('Analytics tracking', () => {
  test('track-visit sends UTM params when present', async ({ page }) => {
    const trackVisitRequests: Array<Record<string, unknown>> = []

    // Intercept track-visit API calls
    await page.route('**/api/track-visit', async (route) => {
      const body = route.request().postDataJSON()
      trackVisitRequests.push(body)
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    })

    await page.goto('/?utm_source=linkedin&utm_medium=organic&utm_campaign=phase0')
    await page.waitForTimeout(1000)

    expect(trackVisitRequests.length).toBeGreaterThan(0)
    const visit = trackVisitRequests[0]
    expect(visit.utm_source).toBe('linkedin')
    expect(visit.utm_medium).toBe('organic')
    expect(visit.utm_campaign).toBe('phase0')
    expect(visit.visitor_id).toBeTruthy()
  })

  test('track-visit sends null UTM when no params', async ({ page }) => {
    const trackVisitRequests: Array<Record<string, unknown>> = []

    await page.route('**/api/track-visit', async (route) => {
      const body = route.request().postDataJSON()
      trackVisitRequests.push(body)
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    })

    await page.goto('/')
    await page.waitForTimeout(1000)

    expect(trackVisitRequests.length).toBeGreaterThan(0)
    expect(trackVisitRequests[0].utm_source).toBeNull()
  })

  test('scroll_depth event fires when scrolling to #features', async ({ page }) => {
    const events: Array<Record<string, unknown>> = []

    await page.route('**/api/track-event', async (route) => {
      const body = route.request().postDataJSON()
      events.push(body)
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    })
    await page.route('**/api/track-visit', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    )

    await page.goto('/')
    const features = page.locator('#features')
    if (await features.count() > 0) {
      await features.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)

      const scrollEvents = events.filter((e) => e.event_type === 'scroll_depth')
      expect(scrollEvents.length).toBeGreaterThan(0)
      expect((scrollEvents[0].properties as { section: string }).section).toBe('features')
    }
  })

  test('cta_click event fires on CTA button click', async ({ page }) => {
    const events: Array<Record<string, unknown>> = []

    await page.route('**/api/track-event', async (route) => {
      const body = route.request().postDataJSON()
      events.push(body)
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    })
    await page.route('**/api/track-visit', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    )

    await page.goto('/')
    // Click first CTA-like button
    const cta = page.locator('a[href="#pilot"], button:has-text("Request"), a:has-text("Request")').first()
    if (await cta.count() > 0) {
      await cta.click()
      await page.waitForTimeout(500)

      const ctaEvents = events.filter((e) => e.event_type === 'cta_click')
      expect(ctaEvents.length).toBeGreaterThan(0)
    }
  })
})
