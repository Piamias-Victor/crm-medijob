'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'

export type SponsorshipKind = 'pharmacy' | 'candidate'

export function useSponsorship(kind: SponsorshipKind, entityId: string) {
  const utils = trpc.useUtils()
  const [query, setQuery] = useState('')
  const enabled = query.trim().length >= 1

  const pharmacyView = trpc.pharmacy.getSponsorship.useQuery(
    { id: entityId },
    { enabled: kind === 'pharmacy' },
  )
  const candidateView = trpc.candidate.getSponsorship.useQuery(
    { id: entityId },
    { enabled: kind === 'candidate' },
  )
  const pharmacySearch = trpc.pharmacy.searchSponsorship.useQuery(
    { query, excludeId: entityId },
    { enabled: kind === 'pharmacy' && enabled },
  )
  const candidateSearch = trpc.candidate.searchSponsorship.useQuery(
    { query, excludeId: entityId },
    { enabled: kind === 'candidate' && enabled },
  )

  const invalidate = async () => {
    if (kind === 'pharmacy') {
      await utils.pharmacy.getSponsorship.invalidate({ id: entityId })
    } else {
      await utils.candidate.getSponsorship.invalidate({ id: entityId })
    }
  }

  const pharmacyLink = trpc.pharmacy.linkSponsor.useMutation({ onSuccess: invalidate })
  const candidateLink = trpc.candidate.linkSponsor.useMutation({ onSuccess: invalidate })
  const pharmacyUnlink = trpc.pharmacy.unlinkSponsor.useMutation({ onSuccess: invalidate })
  const candidateUnlink = trpc.candidate.unlinkSponsor.useMutation({ onSuccess: invalidate })

  const searchRows = kind === 'pharmacy' ? pharmacySearch.data : candidateSearch.data
  const view = kind === 'pharmacy' ? pharmacyView.data : candidateView.data

  return {
    view,
    isLoading: kind === 'pharmacy' ? pharmacyView.isLoading : candidateView.isLoading,
    query,
    setQuery,
    options: (searchRows ?? []).map((r) => ({ value: r.id, label: r.label })),
    link: kind === 'pharmacy' ? pharmacyLink : candidateLink,
    unlink: kind === 'pharmacy' ? pharmacyUnlink : candidateUnlink,
  }
}
