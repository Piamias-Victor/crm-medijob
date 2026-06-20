'use client'

import { Search } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { CandidateSearchHit } from '@/components/molecules/CandidateSearchHit'

type Option = {
  id: string
  label: string
  jobTitle: string | null
  city: string | null
  postalCode: string | null
}

type Props = {
  term: string
  isLoading: boolean
  options: Option[]
  pending: boolean
  onPick: (candidateId: string) => void
}

export function MissionCandidateSearchResults({
  term,
  isLoading,
  options,
  pending,
  onPick,
}: Props) {
  if (term.trim().length < 2) {
    return <p className="text-xs text-fg-muted">Saisissez au moins 2 caractères pour lancer la recherche.</p>
  }

  return (
    <ul className="max-h-60 divide-y divide-border/50 overflow-y-auto rounded-xl border border-border/60 bg-white shadow-md">
      {isLoading ? <li className="px-4 py-3 text-xs text-fg-muted">Recherche…</li> : null}
      {!isLoading && options.length === 0 ? (
        <li className="px-4 py-3">
          <EmptyState icon={Search} title="Aucun candidat trouvé" variant="compact" />
        </li>
      ) : null}
      {options.map((option) => (
        <li key={option.id}>
          <button
            type="button"
            disabled={pending}
            onClick={() => onPick(option.id)}
            className="w-full px-4 py-3 text-left transition-colors hover:bg-accent-muted/35"
          >
            <CandidateSearchHit
              label={option.label}
              jobTitle={option.jobTitle}
              city={option.city}
              postalCode={option.postalCode}
            />
          </button>
        </li>
      ))}
    </ul>
  )
}
