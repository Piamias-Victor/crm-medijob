'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { EntityMapWithLayers } from '@/components/organisms/EntityMapWithLayers'
import { toCandidateMapPins } from '@/view-models/entity-map-pins'
import type { RawCandidate } from '@/view-models/candidate-kanban.types'

type Props = { candidates: RawCandidate[] }

export function CandidateMapView({ candidates }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pins = useMemo(() => toCandidateMapPins(candidates), [candidates])
  const returnPath = useMemo(() => {
    const query = searchParams.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <EntityMapWithLayers
      primaryType="candidate"
      primaryPins={pins}
      returnPath={returnPath}
    />
  )
}
