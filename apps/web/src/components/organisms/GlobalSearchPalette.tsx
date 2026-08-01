'use client'

import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { GlobalSearchResults } from '@/components/molecules/GlobalSearchResults'
import { useGlobalSearchQuery } from '@/lib/hooks/use-global-search-query'
import { useGlobalSearchStore } from '@/stores/global-search-store'

export function GlobalSearchPalette() {
  const open = useGlobalSearchStore((s) => s.open)
  const closePalette = useGlobalSearchStore((s) => s.closePalette)
  const { term, setTerm, resetTerm, results, isLoading, hasQuery, isEmpty } =
    useGlobalSearchQuery()

  useEffect(() => {
    if (!open) resetTerm()
  }, [open, resetTerm])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePalette()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closePalette])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start bg-black/40 p-4 pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche globale"
      onClick={closePalette}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-border">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
          <Input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Rechercher une pharmacie, contact, candidat, mission…"
            aria-label="Recherche globale"
            className="h-12 rounded-none border-0 pl-9 focus:ring-0"
          />
        </div>
        {hasQuery ? (
          <GlobalSearchResults
            results={results}
            isLoading={isLoading}
            isEmpty={isEmpty}
            onNavigate={closePalette}
          />
        ) : null}
      </div>
    </div>
  )
}
