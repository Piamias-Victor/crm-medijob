'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import type { ShortcutEntityType } from '@/server/ai/shortcuts'

const MIN_TERM_LENGTH = 2

export function useEntitySearch(entityType: ShortcutEntityType) {
  const [term, setTerm] = useState('')
  const enabled = term.trim().length >= MIN_TERM_LENGTH

  const query = trpc.assistant.searchEntities.useQuery(
    { entityType, term },
    { enabled, staleTime: 30_000 },
  )

  return {
    term,
    setTerm,
    results: query.data ?? [],
    isLoading: enabled && query.isFetching,
    hasQuery: enabled,
  }
}
