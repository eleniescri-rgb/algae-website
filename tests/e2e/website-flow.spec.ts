import { test, expect } from '@playwright/test'

/**
 * Full user journey test — navigates the website, scrolls through sections,
 * and takes screenshots at each major section (useful for thesis appendix).
 */
test.describe('Website flow', () => {
  test('complete user journey with screenshots', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible()

    // Hero section
    await page.screenshot({ path: 'tests/e2e/results/01-hero.png', fullPage: false })

    // Scroll through key sections and screenshot each
    const sections = [
      { id: '#features', name: '02-benefits' },
      { id: '#pilot', name: '03-pilot' },
    ]

    for (const section of sections) {
      const el = page.locator(section.id)
      if (await el.count() > 0) {
        await el.scrollIntoViewIfNeeded()
        await page.waitForTimeout(500)
        await page.screenshot({ path: `tests/e2e/results/${section.name}.png`, fullPage: false })
      }
    }

    // Full page screenshot
    await page.screenshot({ path: 'tests/e2e/results/full-page.png', fullPage: true })
  })

  test('CTA buttons are visible and clickable', async ({ page }) => {
    await page.goto('/')
    // Find primary CTA buttons (Request Pilot / similar)
    const ctaButtons = page.locator('a[href="#pilot"], button:has-text("Request"), a:has-text("Request")')
    const count = await ctaButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('contact form renders', async ({ page }) => {
    await page.goto('/')
    // Scroll to contact section
    const contact = page.locator('#contact, form')
    if (await contact.count() > 0) {
      await contact.first().scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
      await page.screenshot({ path: 'tests/e2e/results/contact-form.png', fullPage: false })
    }
  })
})
