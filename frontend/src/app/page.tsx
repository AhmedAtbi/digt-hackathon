'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

type Recipe = {
  id: number
  name: string
  emoji: string
  cookingTime: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
}

type Sort = 'none' | 'asc' | 'desc'

const difficultyStyles: Record<Recipe['difficulty'], string> = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
}

// Static demo data — keeps the page rendering even when the Symfony backend
// isn't running (e.g. a standalone demo build). Mirrors the API payload.
const STATIC_RECIPES: Recipe[] = [
  { id: 1, name: 'Avocado Toast', emoji: '🥑', cookingTime: 5, difficulty: 'Easy', description: 'Crushed avocado on sourdough with chilli flakes and lime.' },
  { id: 2, name: 'Margherita Pizza', emoji: '🍕', cookingTime: 25, difficulty: 'Medium', description: 'Blistered dough, San Marzano tomatoes, fresh mozzarella and basil.' },
  { id: 3, name: 'Miso Ramen', emoji: '🍜', cookingTime: 40, difficulty: 'Hard', description: 'Rich miso broth, springy noodles, soft egg and spring onion.' },
  { id: 4, name: 'Greek Salad', emoji: '🥗', cookingTime: 10, difficulty: 'Easy', description: 'Tomato, cucumber, red onion, olives and a slab of feta.' },
  { id: 5, name: 'Beef Tacos', emoji: '🌮', cookingTime: 20, difficulty: 'Medium', description: 'Spiced beef, warm tortillas, salsa, lime and coriander.' },
  { id: 6, name: 'Chocolate Mousse', emoji: '🍫', cookingTime: 15, difficulty: 'Medium', description: 'Airy dark-chocolate mousse finished with sea salt.' },
]

function sortRecipes(recipes: Recipe[], sort: Sort): Recipe[] {
  if (sort === 'none') return recipes
  return [...recipes].sort((a, b) =>
    sort === 'asc' ? a.cookingTime - b.cookingTime : b.cookingTime - a.cookingTime,
  )
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [sort, setSort] = useState<Sort>('none')
  const [status, setStatus] = useState<'loading' | 'ready' | 'demo'>('loading')

  useEffect(() => {
    const url = new URL(`${API_URL}/api/recipes`)
    if (sort !== 'none') url.searchParams.set('sort', sort)

    setStatus('loading')
    fetch(url)
      .then((res) => res.json())
      .then((data: { recipes: Recipe[] }) => {
        setRecipes(data.recipes)
        setStatus('ready')
      })
      .catch(() => {
        // Backend unreachable — fall back to bundled static data so the demo
        // still shows something meaningful.
        setRecipes(sortRecipes(STATIC_RECIPES, sort))
        setStatus('demo')
      })
  }, [sort])

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-[#ff0000]">
              Recipes
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              A tiny browser served by Symfony, rendered by Next.js.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sort by time
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 shadow-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
            >
              <option value="none">Default</option>
              <option value="asc">Quickest first</option>
              <option value="desc">Longest first</option>
            </select>
          </label>
        </header>

        {status === 'loading' && (
          <p className="text-zinc-500 dark:text-zinc-400">Loading recipes…</p>
        )}

        {status === 'demo' && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Showing bundled demo data — the backend at {API_URL} wasn’t reachable.
          </p>
        )}

        {(status === 'ready' || status === 'demo') && (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-4xl" aria-hidden>
                    {recipe.emoji}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${difficultyStyles[recipe.difficulty]}`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {recipe.name}
                </h2>
                <p className="mt-1 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {recipe.description}
                </p>
                <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  ⏱ {recipe.cookingTime} min
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
