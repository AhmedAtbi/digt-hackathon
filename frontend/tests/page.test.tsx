import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from '@/app/page'

// DIGT-32 — restyle the landing-page title (48px / text-5xl, exact red).
// jsdom does not run the Tailwind PostCSS pipeline, so `getComputedStyle`
// here would only reflect jsdom's built-in defaults, not the compiled
// utility CSS. We assert on the Tailwind class tokens instead, since the
// mapping from token -> computed style (text-5xl -> 48px, text-[#ff0000]
// -> exact red) is deterministic Tailwind behaviour, not something this
// test needs to re-derive. The true computed-style / visual assertions
// (AC2, AC3, AC4) live in the Playwright suite (e2e/homepage-title.spec.ts),
// where the real dev server serves the generated CSS.

describe('Home page — title (DIGT-32)', () => {
  it('TC1/TC4: renders the "Recipes" heading at the enlarged text-5xl size', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1, name: 'Recipes' })
    expect(heading).toBeInTheDocument()
    expect(heading.className).toContain('text-5xl')
    expect(heading.className).not.toContain('text-4xl')
  })

  it('TC2: applies the exact/true red arbitrary-value token, with no dark-mode override', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1, name: 'Recipes' })
    expect(heading.className).toContain('text-[#ff0000]')
    // AC4: the previous zinc/dark override must be gone so red applies in
    // both themes — no separate dark: color class should remain.
    expect(heading.className).not.toMatch(/dark:text-zinc-\d+/)
    expect(heading.className).not.toContain('text-zinc-900')
  })

  it('TC1: keeps the weight/tracking utilities unchanged alongside the resize', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', { level: 1, name: 'Recipes' })
    expect(heading.className).toContain('font-semibold')
    expect(heading.className).toContain('tracking-tight')
  })

  it('TC4: leaves the subtitle and sort control classes/text untouched', () => {
    render(<Home />)

    const subtitle = screen.getByText('A tiny browser served by Symfony, rendered by Next.js.')
    expect(subtitle.className).toBe('mt-2 text-zinc-500 dark:text-zinc-400')

    const sortLabel = screen.getByText('Sort by time')
    expect(sortLabel.tagName).toBe('LABEL')

    const sortSelect = screen.getByRole('combobox')
    expect(sortSelect.className).toContain('border-zinc-300')
  })

  it('TC4: recipe cards render with their original heading styles once data loads', async () => {
    render(<Home />)

    // No backend running in the unit-test environment, so the component
    // falls back to STATIC_RECIPES (demo mode) — this also incidentally
    // covers AC8 (page still works without a live API call succeeding).
    const cardHeading = await screen.findByRole('heading', { level: 2, name: 'Avocado Toast' })
    expect(cardHeading.className).toBe('text-lg font-semibold text-zinc-900 dark:text-zinc-50')
  })
})
