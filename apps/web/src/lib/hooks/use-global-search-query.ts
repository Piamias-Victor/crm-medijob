'use client'

import { useCallback, useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import {
  GLOBAL_SEARCH_DEBOUNCE_MS,
  GLOBAL_SEARCH_MIN_TERM,
} from '@/lib/constants/global-search'
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value'

export function useGlobalSearchQuery() {
  const [term, setTerm] = useState('')
  const debounced = useDebouncedValue(term, GLOBAL_SEARCH_DEBOUNCE_MS)
  const enabled = debounced.trim().length >= GLOBAL_SEARCH_MIN_TERM
  const resetTerm = useCallback(() => setTerm(''), [])

  const query = trpc.search.global.useQuery(
    { term: debounced },
    { enabled, staleTime: 30_000 },
  )

  const data = query.data
  const totalHits = data
    ? data.pharmacies.length +
      data.contacts.length +
      data.candidates.length +
      data.missions.length
    : 0

  return {
    term,
    setTerm,
    resetTerm,
    results: data,
    isLoading: enabled && query.isFetching,
    hasQuery: enabled,
    isEmpty: enabled && !query.isFetching && totalHits === 0,
  }
}
