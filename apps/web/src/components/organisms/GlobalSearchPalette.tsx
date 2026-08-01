'use client'

import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { GlobalSearchResults } from '@/components/molecules/GlobalSearchResults'
import { GlobalSearchIdle } from '@/components/molecules/GlobalSearchIdle'
import { GlobalSearchFooter } from '@/components/molecules/GlobalSearchFooter'
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-primary/40 px-4 pt-[12vh] backdrop-blur-[2px] md:pl-20"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche globale"
      onClick={closePalette}
    >
      <div
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl ring-1 ring-primary/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-border">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary" />
          <Input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Rechercher dans le CRM…"
            aria-label="Recherche globale"
            className="h-14 rounded-none border-0 bg-transparent pl-12 pr-4 text-base focus:ring-0"
          />
        </div>
        <div className="min-h-48">
          {hasQuery ? (
            <GlobalSearchResults
              results={results}
              isLoading={isLoading}
              isEmpty={isEmpty}
              onNavigate={closePalette}
            />
          ) : (
            <GlobalSearchIdle />
          )}
        </div>
        <GlobalSearchFooter />
      </div>
    </div>
  )
}
