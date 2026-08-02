'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { EntityMap } from '@/components/molecules/EntityMap'
import { CandidateQuickView } from '@/components/organisms/CandidateQuickView'
import { toCandidateMapPins } from '@/view-models/entity-map-pins'
import type { RawCandidate } from '@/view-models/candidate-kanban.types'

type Props = { candidates: RawCandidate[] }

export function CandidateMapView({ candidates }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const pins = useMemo(() => toCandidateMapPins(candidates), [candidates])
  const returnPath = useMemo(() => {
    const query = searchParams.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <>
      <EntityMap pins={pins} onPinClick={setQuickViewId} />
      <CandidateQuickView
        candidateId={quickViewId}
        returnPath={returnPath}
        onClose={() => setQuickViewId(null)}
      />
    </>
  )
}
