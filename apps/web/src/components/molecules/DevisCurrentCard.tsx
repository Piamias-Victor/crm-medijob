import type { DevisView } from '@/view-models/devis'
import { DEVIS_CURRENT_LABEL } from '@/view-models/devis-copy'
import { devisCurrentSummary } from '@/view-models/devis-current'

export function DevisCurrentCard({ current }: { current: DevisView | null }) {
  if (!current) return null
  return (
    <div className="rounded-md border border-accent bg-surface px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-accent-hover">{DEVIS_CURRENT_LABEL}</p>
      <p className="mt-1 text-sm text-fg">{devisCurrentSummary(current)}</p>
    </div>
  )
}
