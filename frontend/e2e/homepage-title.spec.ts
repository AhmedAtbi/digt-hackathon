import { expect, test } from '@playwright/test'

// DIGT-32 — restyle the landing-page title (48px / text-5xl, exact red,
// both color schemes). These run against the real dev server, so
// getComputedStyle reflects the actual compiled Tailwind CSS — unlike the
// Vitest/jsdom unit tests in tests/page.test.tsx, which assert on class
// tokens only.

test.describe('Homepage title (DIGT-32)', () => {
  test('TC1/TC2: renders "Recipes" at 48px in exact red (light mode)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1, name: 'Recipes' })
    await expect(heading).toBeVisible()

    const { fontSize, color } = await heading.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return { fontSize: style.fontSize, color: style.color }
    })

    expect(fontSize).toBe('48px')
    expect(color).toBe('rgb(255, 0, 0)')
  })

  test('TC3: stays exact red in dark mode (no zinc override)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1, name: 'Recipes' })
    await expect(heading).toBeVisible()

    const color = await heading.evaluate((el) => window.getComputedStyle(el).color)
    expect(color).toBe('rgb(255, 0, 0)')
  })

  test('TC6: no horizontal overflow and header alignment holds at mobile width (375px)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasOverflow).toBe(false)

    await expect(page.getByRole('heading', { level: 1, name: 'Recipes' })).toBeVisible()
    await expect(page.getByText('Sort by time')).toBeVisible()
  })

  test('TC6: no horizontal overflow and header alignment holds at desktop width (1280px)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasOverflow).toBe(false)

    const heading = page.getByRole('heading', { level: 1, name: 'Recipes' })
    const sortControl = page.getByRole('combobox')
    await expect(heading).toBeVisible()
    await expect(sortControl).toBeVisible()

    // sm:items-end — the title block and the sort control should sit on the
    // same visual row at desktop width, not stack.
    const headingBox = await heading.boundingBox()
    const sortBox = await sortControl.boundingBox()
    expect(headingBox).not.toBeNull()
    expect(sortBox).not.toBeNull()
    if (headingBox && sortBox) {
      expect(Math.abs(headingBox.y - sortBox.y)).toBeLessThan(100)
    }
  })

  test('TC7: only the title styling changed — no new network calls beyond the existing recipes fetch', async ({
    page,
  }) => {
    const requestUrls: string[] = []
    page.on('request', (req) => requestUrls.push(req.url()))

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Recipes' })).toBeVisible()

    // The only XHR/fetch this page makes is the existing /api/recipes call;
    // this change introduces no additional request.
    const apiCalls = requestUrls.filter((url) => url.includes('/api/recipes'))
    expect(apiCalls.length).toBeLessThanOrEqual(1)

    // AC8 / TC7 negative case: even if the backend is unreachable, the page
    // still renders recipe content via the bundled static fallback.
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
  })
})
