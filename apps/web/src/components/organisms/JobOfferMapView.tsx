'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { EntityMapWithLayers } from '@/components/organisms/EntityMapWithLayers'
import { toJobOfferMapPins } from '@/view-models/job-offer-map'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

type Props = { rows: JobOfferListRow[] }

export function JobOfferMapView({ rows }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pins = useMemo(() => toJobOfferMapPins(rows), [rows])
  const returnPath = useMemo(() => {
    const query = searchParams.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <EntityMapWithLayers
      primaryType="jobOffer"
      primaryPins={pins}
      returnPath={returnPath}
    />
  )
}
