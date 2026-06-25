'use client'

import { useState } from 'react'
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import type { PharmacyInput, PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'
import { applyPharmacySiretLookup } from '@/lib/apply-pharmacy-siret-lookup'
import { resolveSiretSearchResults } from '@/lib/pharmacy-siret-lookup'

export type AnnuaireSearchSource = 'name' | 'siret'
export type SiretSearchFeedback = { variant: 'error' | 'info'; message: string }

const EMPTY_QUERY_MSG = 'Saisissez un SIRET ou un nom pour lancer la recherche.'
const NO_MATCH_MSG = 'Aucune officine trouvée dans l’annuaire pour cette recherche.'
const API_ERROR_MSG = 'Recherche annuaire indisponible. Réessayez dans un instant.'

function searchQuery(
  getValues: UseFormGetValues<PharmacyInput>,
  source: AnnuaireSearchSource,
): string | undefined {
  const name = getValues('name')?.trim()
  const siret = getValues('siret')?.trim()
  return source === 'name' ? name || siret : siret || name
}

export function usePharmacySiretSearch(
  getValues: UseFormGetValues<PharmacyInput>,
  setValue: UseFormSetValue<PharmacyInput>,
  onSearchSiret: (query: string) => Promise<PharmacySiretLookup[]>,
) {
  const [searching, setSearching] = useState(false)
  const [activeSource, setActiveSource] = useState<AnnuaireSearchSource | null>(null)
  const [feedback, setFeedback] = useState<SiretSearchFeedback | null>(null)
  const [candidates, setCandidates] = useState<PharmacySiretLookup[]>([])

  const dismissFeedback = () => setFeedback(null)

  const pickMatch = (match: PharmacySiretLookup) => {
    applyPharmacySiretLookup(setValue, match)
    setCandidates([])
    setFeedback(null)
  }

  const runSearch = async (source: AnnuaireSearchSource) => {
    const query = searchQuery(getValues, source)
    if (!query) {
      setCandidates([])
      setFeedback({ variant: 'info', message: EMPTY_QUERY_MSG })
      return
    }
    setSearching(true)
    setActiveSource(source)
    setFeedback(null)
    setCandidates([])
    try {
      const resolution = resolveSiretSearchResults(await onSearchSiret(query))
      if (resolution.kind === 'empty') {
        setFeedback({ variant: 'info', message: NO_MATCH_MSG })
        return
      }
      if (resolution.kind === 'single') {
        pickMatch(resolution.match)
        return
      }
      setCandidates(resolution.matches)
    } catch {
      setFeedback({ variant: 'error', message: API_ERROR_MSG })
    } finally {
      setSearching(false)
      setActiveSource(null)
    }
  }

  return { searching, activeSource, runSearch, feedback, candidates, pickMatch, dismissFeedback }
}
