'use client'

import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Input } from '@/components/atoms/Input'
import { MissionCandidateSearchResults } from '@/components/molecules/MissionCandidateSearchResults'

const SEARCH_HINTS = ['Nom', 'Métier', 'Ville', 'Code postal'] as const

type Props = {
  missionId: string
  positionedIds: string[]
  disabled?: boolean
  onPositioned: () => void
}

export function MissionCandidatePicker({
  missionId,
  positionedIds,
  disabled,
  onPositioned,
}: Props) {
  const [term, setTerm] = useState('')
  const toast = useEntityMutation({ onSuccess: onPositioned, successMessage: 'Candidat positionné' })
  const search = trpc.candidate.search.useQuery(
    { term: term.trim() },
    { enabled: term.trim().length >= 2 && !disabled },
  )
  const position = trpc.missionCandidate.position.useMutation({
    onSuccess: () => {
      setTerm('')
      toast.onSuccess()
    },
    onError: toast.onError,
  })

  const options = (search.data ?? []).filter((option) => !positionedIds.includes(option.id))

  return (
    <section className="overflow-hidden rounded-2xl border border-accent/15 bg-linear-to-br from-white/95 via-white/90 to-accent-muted/20 shadow-sm">
      <div className="border-b border-border/50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
            <UserPlus className="size-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-fg">Positionner candidat</h3>
            <p className="text-xs text-fg-muted">Recherche CVthèque par nom, métier, ville ou code postal</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {SEARCH_HINTS.map((hint) => (
            <span
              key={hint}
              className="rounded-full border border-border/60 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-fg-muted"
            >
              {hint}
            </span>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent/70" />
          <Input
            value={term}
            disabled={disabled || position.isPending}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Ex. Durand, Pharmacien, Lyon, 69003…"
            aria-label="Rechercher un candidat"
            className="h-11 rounded-xl border-accent/20 bg-white pl-10 shadow-inner shadow-white/40"
          />
        </div>
        <MissionCandidateSearchResults
          term={term}
          isLoading={search.isLoading}
          options={options}
          pending={position.isPending}
          onPick={(candidateId) => position.mutate({ missionId, candidateId })}
        />
      </div>
    </section>
  )
}
