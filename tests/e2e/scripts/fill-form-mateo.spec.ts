import { test, expect } from '@playwright/test'

/**
 * Simulates a visit from Mateo Ramón Sastre (LinkedIn contact)
 * and fills the pilot request form with his profile data.
 *
 * Run with: npx playwright test tests/e2e/scripts/fill-form-mateo.spec.ts --project=desktop --headed
 *
 * Use --headed to watch the browser fill the form in real time.
 */

const BASE = 'https://algae-website.vercel.app'
const UTM = '?utm_source=linkedin&utm_medium=organic&utm_campaign=phase0'

test('Fill contact form as Mateo Ramón Sastre', async ({ page }) => {
  // Arrive from LinkedIn with UTM tracking
  await page.goto(BASE + UTM)
  await page.waitForTimeout(2000)

  // Scroll through content like a real visitor
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

  // Scroll to contact form
  const contactSection = page.locator('#contact, form').first()
  await contactSection.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)

  // Fill form fields
  await page.fill('input[name="name"]', 'Mateo Ramón Sastre')
  await page.fill('input[name="company"]', 'Grupo Piñero / Bahía Príncipe')
  await page.fill('input[name="role"]', 'Hotel Manager')
  await page.fill('input[name="email"]', 'mramon@grupo-pinero.com')
  await page.fill('input[name="location"]', 'Riviera Maya, Mexico')

  // Select property type: hotel_group
  await page.selectOption('select[name="propertyType"]', 'hotel_group')

  // Select sargassum burden: heavy
  await page.selectOption('select[name="sargassumBurden"]', 'heavy')

  // Select interest type: pilot
  await page.selectOption('select[name="interestType"]', 'pilot')

  // Fill challenge textarea
  await page.fill('textarea[name="challenge"]', 'High sargassum volumes during peak season affecting guest satisfaction and beach operations. Current contractor costs are unsustainable and not ZOFEMAT compliant.')

  await page.waitForTimeout(1000)

  // Take screenshot of filled form before submitting
  await page.screenshot({ path: 'tests/e2e/results/form-mateo-filled.png', fullPage: false })

  // Submit the form
  const submitButton = page.locator('button[type="submit"], button:has-text("Send")')
  await submitButton.click()

  // Wait for success state
  await page.waitForTimeout(3000)
  await page.screenshot({ path: 'tests/e2e/results/form-mateo-submitted.png', fullPage: false })
})
