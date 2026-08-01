'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useGlobalSearchStore } from '@/stores/global-search-store'

type Props = { expanded?: boolean }

export function GlobalSearchTrigger({ expanded = true }: Props) {
  const openPalette = useGlobalSearchStore((s) => s.openPalette)

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Recherche globale"
      title="Recherche globale (⌘K)"
      className={cn(
        'flex h-9 w-full items-center text-sm transition-colors',
        expanded
          ? 'gap-2 rounded-md border border-border bg-surface px-2.5 text-fg-muted hover:border-primary/30 hover:bg-white hover:text-fg'
          : 'justify-center rounded-md text-fg-muted hover:bg-surface hover:text-fg',
      )}
    >
      <Search className="size-4 shrink-0" />
      {expanded ? (
        <>
          <span className="min-w-0 flex-1 truncate text-left">Rechercher…</span>
          <kbd className="shrink-0 rounded border border-border bg-white px-1 py-0.5 text-[10px] text-fg-muted">
            ⌘K
          </kbd>
        </>
      ) : null}
    </button>
  )
}
