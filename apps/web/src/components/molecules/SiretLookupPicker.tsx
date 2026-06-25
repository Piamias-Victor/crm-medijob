'use client'

import type { PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'
import { formatSiretLookupLabel } from '@/lib/pharmacy-siret-lookup'

type Props = {
  matches: PharmacySiretLookup[]
  onPick: (match: PharmacySiretLookup) => void
}

export function SiretLookupPicker({ matches, onPick }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-fg-muted">Plusieurs officines trouvées — choisissez la bonne fiche.</p>
      <ul className="max-h-56 divide-y divide-border/60 overflow-y-auto rounded-lg border border-border/60 bg-white/95 shadow-sm">
        {matches.map((match) => (
          <li key={match.siret}>
            <button
              type="button"
              onClick={() => onPick(match)}
              className="flex w-full flex-col items-start px-3 py-2 text-left transition-colors hover:bg-accent-muted/40"
            >
              <span className="text-sm font-medium text-fg">{match.name}</span>
              <span className="text-xs text-fg-muted">{formatSiretLookupLabel(match)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
