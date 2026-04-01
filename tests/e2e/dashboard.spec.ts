import { test, expect } from '@playwright/test'

/**
 * Dashboard rendering test — verifies the private admin dashboard
 * loads correctly and takes a full-page screenshot for thesis.
 */
test.describe('Admin dashboard', () => {
  test('renders with valid key', async ({ page }) => {
    await page.goto('/admin?key=algae-secret')
    await page.waitForTimeout(3000) // Wait for metrics API to load

    // Check that the dashboard loaded (not the "Unauthorized" screen)
    const unauthorized = page.locator('text=Unauthorized')
    expect(await unauthorized.count()).toBe(0)

    // Check key sections exist
    await expect(page.locator('text=Unique Visitors')).toBeVisible()
    await expect(page.locator('text=Total Leads')).toBeVisible()

    // Full page screenshot for thesis appendix
    await page.screenshot({ path: 'tests/e2e/results/dashboard-full.png', fullPage: true })
  })

  test('shows thesis validation card', async ({ page }) => {
    await page.goto('/admin?key=algae-secret')
    await page.waitForTimeout(3000)

    await expect(page.locator('text=Non-Functional MVP Validation')).toBeVisible()
    await expect(page.locator('text=Bounce Rate')).toBeVisible()
    await expect(page.locator('text=Engagement Rate')).toBeVisible()
  })

  test('shows traffic sources table', async ({ page }) => {
    await page.goto('/admin?key=algae-secret')
    await page.waitForTimeout(3000)

    await expect(page.locator('text=Traffic Sources')).toBeVisible()
    await expect(page.locator('text=LinkedIn')).toBeVisible()
  })

  test('blocks access without key', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('text=Unauthorized')).toBeVisible()
  })
})
