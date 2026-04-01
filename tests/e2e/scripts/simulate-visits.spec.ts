import { test } from '@playwright/test'

/**
 * Simulates realistic website visits to populate the dashboard with tracking data.
 *
 * Run with: npx playwright test tests/e2e/scripts/simulate-visits.spec.ts --project=desktop
 *
 * Each "test" simulates a different visitor profile:
 * - LinkedIn visitors (with UTM params)
 * - Direct visitors (no referrer, no UTM)
 * - Engaged visitors (scroll + CTA click)
 * - Bounce visitors (leave quickly)
 */

const BASE = 'https://algae-website.vercel.app'
const UTM_LINKEDIN = '?utm_source=linkedin&utm_medium=organic&utm_campaign=phase0'

// Helper: clear visitor ID so each test creates a new unique visitor
async function clearVisitorId(page: import('@playwright/test').Page) {
  await page.evaluate(() => localStorage.removeItem('algae_visitor_id'))
}

test.describe('Simulate visits — LinkedIn engaged', () => {
  for (let i = 0; i < 5; i++) {
    test(`LinkedIn engaged visitor ${i + 1}`, async ({ page }) => {
      await page.goto(BASE + UTM_LINKEDIN)
      await clearVisitorId(page)
      await page.goto(BASE + UTM_LINKEDIN)
      await page.waitForTimeout(2000)

      // Scroll to benefits section
      const features = page.locator('#features')
      if (await features.count() > 0) {
        await features.scrollIntoViewIfNeeded()
        await page.waitForTimeout(1500)
      }

      // Scroll to pilot section
      const pilot = page.locator('#pilot')
      if (await pilot.count() > 0) {
        await pilot.scrollIntoViewIfNeeded()
        await page.waitForTimeout(1500)
      }

      // Click CTA
      const cta = page.locator('a[href="#pilot"], button:has-text("Request"), a:has-text("Request")').first()
      if (await cta.count() > 0) {
        await cta.click()
        await page.waitForTimeout(500)
      }

      // Stay for realistic session duration
      await page.waitForTimeout(3000)
    })
  }
})

test.describe('Simulate visits — LinkedIn bounce', () => {
  for (let i = 0; i < 3; i++) {
    test(`LinkedIn bounce visitor ${i + 1}`, async ({ page }) => {
      await page.goto(BASE + UTM_LINKEDIN)
      await clearVisitorId(page)
      await page.goto(BASE + UTM_LINKEDIN)
      // Leave quickly (bounce)
      await page.waitForTimeout(2000)
    })
  }
})

test.describe('Simulate visits — Direct engaged', () => {
  for (let i = 0; i < 3; i++) {
    test(`Direct engaged visitor ${i + 1}`, async ({ page }) => {
      await page.goto(BASE)
      await clearVisitorId(page)
      await page.goto(BASE)
      await page.waitForTimeout(2000)

      // Scroll through content
      const features = page.locator('#features')
      if (await features.count() > 0) {
        await features.scrollIntoViewIfNeeded()
        await page.waitForTimeout(1500)
      }

      const pilot = page.locator('#pilot')
      if (await pilot.count() > 0) {
        await pilot.scrollIntoViewIfNeeded()
        await page.waitForTimeout(1500)
      }

      await page.waitForTimeout(3000)
    })
  }
})

test.describe('Simulate visits — Direct bounce', () => {
  for (let i = 0; i < 2; i++) {
    test(`Direct bounce visitor ${i + 1}`, async ({ page }) => {
      await page.goto(BASE)
      await clearVisitorId(page)
      await page.goto(BASE)
      await page.waitForTimeout(2000)
    })
  }
})
